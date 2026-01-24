// server/routes/resumes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { db, isProduction } = require("../config/database");
const { checkJwt } = require("../config/auth");
const { requirePermission } = require("../middleware/permissions");

// Multer config - store in memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});

// GET - Download resume by language (public)
router.get("/:lang", async (req, res) => {
    try {
        const { lang } = req.params;
        const validLangs = ["en", "fr"];

        if (!validLangs.includes(lang)) {
            return res.status(400).json({ error: "Invalid language. Use 'en' or 'fr'." });
        }

        const query = isProduction
            ? "SELECT file_data, mime_type, file_name FROM resumes WHERE language = $1"
            : "SELECT file_data, mime_type, file_name FROM resumes WHERE language = ?";

        const result = await db.query(query, [lang]);

        if (result.rows.length === 0) {
            return res.status(404).send("Resume not found for this language");
        }

        const resume = result.rows[0];
        const fileBuffer = Buffer.from(resume.file_data, "base64");

        res.setHeader("Content-Type", resume.mime_type);
        res.setHeader("Content-Disposition", `inline; filename="${resume.file_name}"`);
        res.send(fileBuffer);

    } catch (err) {
        console.error("Error serving resume:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST - Upload resume (admin only)
router.post("/:lang", checkJwt, requirePermission("admin:dashboard"), upload.single("resume"), async (req, res) => {
    try {
        const { lang } = req.params;
        const validLangs = ["en", "fr"];

        if (!validLangs.includes(lang)) {
            return res.status(400).json({ error: "Invalid language. Use 'en' or 'fr'." });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No PDF file provided" });
        }

        const base64Data = req.file.buffer.toString("base64");

        // Upsert: Insert or Update
        const query = isProduction
            ? `INSERT INTO resumes (language, file_name, file_data, mime_type, updated_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         ON CONFLICT (language)
         DO UPDATE SET file_name = $2, file_data = $3, mime_type = $4, updated_at = CURRENT_TIMESTAMP
         RETURNING language, file_name`
            : `INSERT INTO resumes (language, file_name, file_data, mime_type, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT (language)
         DO UPDATE SET file_name = excluded.file_name, file_data = excluded.file_data, mime_type = excluded.mime_type, updated_at = CURRENT_TIMESTAMP`;

        await db.query(query, [
            lang,
            req.file.originalname,
            base64Data,
            req.file.mimetype
        ]);

        res.json({ success: true, message: `Resume for ${lang} uploaded successfully`, fileName: req.file.originalname });

    } catch (err) {
        console.error("Error uploading resume:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET - Get info about uploaded resumes (admin only)
router.get("/info/all", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const query = "SELECT language, file_name, updated_at FROM resumes";
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching resume info:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
