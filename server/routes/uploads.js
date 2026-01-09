// server/routes/uploads.js
// Base64 image storage - no filesystem dependencies
const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const { db, isProduction } = require("../config/database");
const { checkJwt } = require("../config/auth");
const { requirePermission } = require("../middleware/permissions");

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_TOTAL_STORAGE = 500 * 1024 * 1024; // 500MB total

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

// Debug endpoint to check database contents (public for debugging)
router.get("/debug/db", async (req, res) => {
    try {
        // Don't return image_data in debug (too large)
        const imagesResult = await db.query("SELECT id, original_name, size_bytes, created_at FROM project_images");
        const projectsResult = await db.query("SELECT id, name_en, image_id FROM projects");
        res.json({
            imagesCount: imagesResult.rows.length,
            images: imagesResult.rows,
            projects: projectsResult.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ PUBLIC: Serve images ============

// Get image by ID (public - no auth required) - serves base64 as image
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Skip non-numeric IDs (like "stats", "list", "debug")
        if (isNaN(parseInt(id))) {
            return res.status(404).json({ error: "Invalid image ID" });
        }

        const query = isProduction
            ? "SELECT image_data, original_name FROM project_images WHERE id = $1"
            : "SELECT image_data, original_name FROM project_images WHERE id = ?";

        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Image not found" });
        }

        const image = result.rows[0];

        if (!image.image_data) {
            return res.status(404).json({ error: "Image data not found" });
        }

        // image_data is stored as base64 string, convert to buffer
        const imageBuffer = Buffer.from(image.image_data, "base64");

        res.setHeader("Content-Type", "image/webp");
        res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
        res.send(imageBuffer);
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

// List all images (admin only) - queries database
router.get("/list/all", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        // Get all images from database (exclude image_data for list view)
        const imagesResult = await db.query(
            "SELECT id, original_name, size_bytes, created_at FROM project_images ORDER BY created_at DESC"
        );
        console.log("Images from database:", imagesResult.rows.length);

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

// Upload image (admin only) - stores as base64 in database
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

        // Optimize and convert to WebP
        const optimizedBuffer = await sharp(req.file.buffer)
            .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        // Convert to base64 for storage
        const base64Data = optimizedBuffer.toString("base64");

        // Save to database
        const query = isProduction
            ? `INSERT INTO project_images (original_name, size_bytes, image_data) 
         VALUES ($1, $2, $3) RETURNING *`
            : `INSERT INTO project_images (original_name, size_bytes, image_data) 
         VALUES (?, ?, ?)`;

        const result = await db.query(query, [
            req.file.originalname,
            optimizedBuffer.length,
            base64Data,
        ]);

        // For SQLite, we need to get the inserted row
        let insertedImage;
        if (isProduction) {
            insertedImage = result.rows[0];
        } else {
            const selectResult = await db.query(
                "SELECT id, original_name, size_bytes, created_at FROM project_images ORDER BY id DESC LIMIT 1"
            );
            insertedImage = selectResult.rows[0];
        }

        res.json({
            id: insertedImage.id,
            url: `/api/uploads/${insertedImage.id}`,
            originalName: insertedImage.original_name,
            sizeBytes: insertedImage.size_bytes,
        });
    } catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).json({ error: err.message });
    }
});

// NOTE: Image deletion intentionally disabled - images are permanent

module.exports = router;
