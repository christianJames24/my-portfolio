// server/routes/uploads.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { db, isProduction } = require("../config/database");
const { checkJwt } = require("../config/auth");
const { requirePermission } = require("../middleware/permissions");

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_TOTAL_STORAGE = 500 * 1024 * 1024; // 500MB total

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer config - store in memory for processing
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed (jpeg, png, gif, webp)"));
        }
    },
});

// Helper: Get total storage used
const getTotalStorageUsed = async () => {
    const result = await db.query("SELECT COALESCE(SUM(size_bytes), 0) as total FROM project_images");
    return parseInt(result.rows[0].total) || 0;
};

// Helper: Get project count
const getProjectCount = async () => {
    const result = await db.query("SELECT COUNT(*) as count FROM projects");
    return parseInt(result.rows[0].count) || 0;
};

// ============ PUBLIC: Serve images ============

// Get image by ID (public - no auth required)
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = isProduction
            ? "SELECT * FROM project_images WHERE id = $1"
            : "SELECT * FROM project_images WHERE id = ?";

        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Image not found" });
        }

        const image = result.rows[0];
        const filePath = path.join(UPLOADS_DIR, image.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Image file not found" });
        }

        res.setHeader("Content-Type", "image/webp");
        res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
        res.sendFile(filePath);
    } catch (err) {
        console.error("Error serving image:", err);
        res.status(500).json({ error: err.message });
    }
});

// ============ ADMIN: Upload and manage ============

// Get storage stats (admin only)
router.get("/stats/usage", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const [storageUsed, projectCount] = await Promise.all([
            getTotalStorageUsed(),
            getProjectCount(),
        ]);

        res.json({
            storageUsed,
            storageLimit: MAX_TOTAL_STORAGE,
            storagePercent: Math.round((storageUsed / MAX_TOTAL_STORAGE) * 100),
            projectCount,
        });
    } catch (err) {
        console.error("Error getting stats:", err);
        res.status(500).json({ error: err.message });
    }
});

// List all images (admin only)
router.get("/list/all", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        // Get all images
        const imagesResult = await db.query(
            "SELECT * FROM project_images ORDER BY created_at DESC"
        );

        // Get all projects to find which images are in use
        const projectsResult = await db.query(
            "SELECT id, name_en, image_id FROM projects WHERE image_id IS NOT NULL"
        );

        // Create a map of image_id -> project info
        const imageUsage = {};
        projectsResult.rows.forEach(p => {
            imageUsage[p.image_id] = { projectId: p.id, projectName: p.name_en };
        });

        // Build response with usage info
        const images = imagesResult.rows.map(img => ({
            id: img.id,
            filename: img.filename,
            originalName: img.original_name,
            sizeBytes: img.size_bytes,
            createdAt: img.created_at,
            url: `/api/uploads/${img.id}`,
            usedBy: imageUsage[img.id] || null,
        }));

        res.json(images);
    } catch (err) {
        console.error("Error listing images:", err);
        res.status(500).json({ error: err.message });
    }
});

// Sync images: scan directory and reconcile with database (admin only)
router.post("/sync", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        console.log("Starting image sync...");
        console.log("Uploads dir:", UPLOADS_DIR);

        // Ensure uploads directory exists
        if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
            console.log("Created uploads directory");
        }

        // Get all image files in uploads directory
        const allFiles = fs.readdirSync(UPLOADS_DIR);
        const files = allFiles.filter(f =>
            f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg') ||
            f.endsWith('.png') || f.endsWith('.gif')
        );
        console.log("Files on disk:", files.length, files);

        // Get all images from database
        const dbResult = await db.query("SELECT * FROM project_images");
        console.log("Files in database:", dbResult.rows.length);
        const dbFiles = new Set(dbResult.rows.map(r => r.filename));

        let added = 0;
        let removed = 0;

        // Add files that exist on disk but not in database
        for (const filename of files) {
            if (!dbFiles.has(filename)) {
                const filePath = path.join(UPLOADS_DIR, filename);
                const stats = fs.statSync(filePath);
                console.log("Adding to DB:", filename, stats.size);

                const query = isProduction
                    ? `INSERT INTO project_images (filename, original_name, size_bytes) VALUES ($1, $2, $3)`
                    : `INSERT INTO project_images (filename, original_name, size_bytes) VALUES (?, ?, ?)`;

                await db.query(query, [filename, filename, stats.size]);
                added++;
            }
        }

        // Remove database entries for files that don't exist on disk
        const diskFiles = new Set(files);
        for (const row of dbResult.rows) {
            if (!diskFiles.has(row.filename)) {
                console.log("Removing from DB (file missing):", row.filename);
                const deleteQuery = isProduction
                    ? "DELETE FROM project_images WHERE id = $1"
                    : "DELETE FROM project_images WHERE id = ?";
                await db.query(deleteQuery, [row.id]);
                removed++;
            }
        }

        console.log(`Sync complete: ${added} added, ${removed} removed`);
        res.json({ message: `Synced: ${added} added, ${removed} removed`, filesOnDisk: files.length, filesInDb: dbResult.rows.length });
    } catch (err) {
        console.error("Error syncing images:", err);
        res.status(500).json({ error: err.message });
    }
});

// Upload image (admin only)
router.post("/", checkJwt, requirePermission("admin:dashboard"), upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        // Check storage limit
        const storageUsed = await getTotalStorageUsed();
        if (storageUsed >= MAX_TOTAL_STORAGE) {
            return res.status(400).json({ error: "Storage limit reached (500MB)" });
        }

        // Generate unique filename
        const filename = `${crypto.randomUUID()}.webp`;
        const filePath = path.join(UPLOADS_DIR, filename);

        // Optimize and convert to WebP
        const optimizedBuffer = await sharp(req.file.buffer)
            .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        // Save file
        fs.writeFileSync(filePath, optimizedBuffer);

        // Save to database
        const query = isProduction
            ? `INSERT INTO project_images (filename, original_name, size_bytes) 
         VALUES ($1, $2, $3) RETURNING *`
            : `INSERT INTO project_images (filename, original_name, size_bytes) 
         VALUES (?, ?, ?)`;

        const result = await db.query(query, [
            filename,
            req.file.originalname,
            optimizedBuffer.length,
        ]);

        // For SQLite, we need to get the inserted row
        let insertedImage;
        if (isProduction) {
            insertedImage = result.rows[0];
        } else {
            const selectResult = await db.query(
                "SELECT * FROM project_images ORDER BY id DESC LIMIT 1"
            );
            insertedImage = selectResult.rows[0];
        }

        res.json({
            id: insertedImage.id,
            url: `/api/uploads/${insertedImage.id}`,
            filename: insertedImage.filename,
            originalName: insertedImage.original_name,
            sizeBytes: insertedImage.size_bytes,
        });
    } catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete image (admin only)
router.delete("/:id", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const { id } = req.params;

        // Get image info first
        const selectQuery = isProduction
            ? "SELECT * FROM project_images WHERE id = $1"
            : "SELECT * FROM project_images WHERE id = ?";

        const selectResult = await db.query(selectQuery, [id]);

        if (selectResult.rows.length === 0) {
            return res.status(404).json({ error: "Image not found" });
        }

        const image = selectResult.rows[0];

        // Delete file from disk
        const filePath = path.join(UPLOADS_DIR, image.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        const deleteQuery = isProduction
            ? "DELETE FROM project_images WHERE id = $1"
            : "DELETE FROM project_images WHERE id = ?";

        await db.query(deleteQuery, [id]);

        res.json({ message: "Image deleted" });
    } catch (err) {
        console.error("Error deleting image:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
