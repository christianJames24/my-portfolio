// server/routes/content.js
const express = require("express");
const router = express.Router();
const { db, isProduction } = require("../config/database");
const { checkJwt } = require("../config/auth");
const { requirePermission } = require("../middleware/permissions");

// GET content for a page (public)
router.get("/:page", async (req, res) => {
    try {
        const { page } = req.params;
        const lang = req.query.lang || "en";

        const validPages = ["about", "resume", "home"];
        if (!validPages.includes(page)) {
            return res.status(400).json({ error: "Invalid page name" });
        }

        const query = isProduction
            ? "SELECT content FROM page_content WHERE page_name = $1 AND language = $2"
            : "SELECT content FROM page_content WHERE page_name = ? AND language = ?";

        const result = await db.query(query, [page, lang]);

        if (result.rows.length === 0) {
            // No content in DB, tell frontend to use fallback
            return res.json({ useClientFallback: true });
        }

        // For SQLite, content is stored as TEXT (JSON string)
        const content = isProduction
            ? result.rows[0].content
            : JSON.parse(result.rows[0].content);

        res.json(content);
    } catch (err) {
        console.error("Error fetching content:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT - Update full page content (admin only)
router.put("/:page", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const { page } = req.params;
        const { content, language } = req.body;
        const lang = language || "en";

        const validPages = ["about", "resume", "home"];
        if (!validPages.includes(page)) {
            return res.status(400).json({ error: "Invalid page name" });
        }

        // Upsert: insert or update
        const query = isProduction
            ? `INSERT INTO page_content (page_name, language, content, updated_at) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
         ON CONFLICT (page_name, language) 
         DO UPDATE SET content = $3, updated_at = CURRENT_TIMESTAMP
         RETURNING *`
            : `INSERT INTO page_content (page_name, language, content, updated_at) 
         VALUES (?, ?, ?, CURRENT_TIMESTAMP) 
         ON CONFLICT (page_name, language) 
         DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP`;

        const contentStr = isProduction ? content : JSON.stringify(content);
        const result = await db.query(query, [page, lang, contentStr]);

        res.json({ success: true, page, language: lang });
    } catch (err) {
        console.error("Error updating content:", err);
        res.status(500).json({ error: err.message });
    }
});

// PATCH - Update single field (admin only)
router.patch("/:page/field", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const { page } = req.params;
        const { field, value, language } = req.body;
        const lang = language || "en";

        const validPages = ["about", "resume", "home"];
        if (!validPages.includes(page)) {
            return res.status(400).json({ error: "Invalid page name" });
        }

        // First, get current content
        const selectQuery = isProduction
            ? "SELECT content FROM page_content WHERE page_name = $1 AND language = $2"
            : "SELECT content FROM page_content WHERE page_name = ? AND language = ?";

        const selectResult = await db.query(selectQuery, [page, lang]);

        let currentContent = {};
        if (selectResult.rows.length > 0) {
            currentContent = isProduction
                ? selectResult.rows[0].content
                : JSON.parse(selectResult.rows[0].content);
        }

        // Update the specific field (supports nested paths like "jobs[0].title")
        const fieldParts = field.match(/([^[\].]+)/g);
        let obj = currentContent;
        for (let i = 0; i < fieldParts.length - 1; i++) {
            const key = fieldParts[i];
            if (obj[key] === undefined) {
                obj[key] = isNaN(fieldParts[i + 1]) ? {} : [];
            }
            obj = obj[key];
        }
        obj[fieldParts[fieldParts.length - 1]] = value;

        // Save updated content
        const upsertQuery = isProduction
            ? `INSERT INTO page_content (page_name, language, content, updated_at) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
         ON CONFLICT (page_name, language) 
         DO UPDATE SET content = $3, updated_at = CURRENT_TIMESTAMP`
            : `INSERT INTO page_content (page_name, language, content, updated_at) 
         VALUES (?, ?, ?, CURRENT_TIMESTAMP) 
         ON CONFLICT (page_name, language) 
         DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP`;

        const contentStr = isProduction ? currentContent : JSON.stringify(currentContent);
        await db.query(upsertQuery, [page, lang, contentStr]);

        res.json({ success: true, field, value });
    } catch (err) {
        console.error("Error updating field:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET - Export content as downloadable JSON (admin only)
router.get("/:page/export", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const { page } = req.params;
        const lang = req.query.lang || "en";

        const validPages = ["about", "resume", "home"];
        if (!validPages.includes(page)) {
            return res.status(400).json({ error: "Invalid page name" });
        }

        const query = isProduction
            ? "SELECT content FROM page_content WHERE page_name = $1 AND language = $2"
            : "SELECT content FROM page_content WHERE page_name = ? AND language = ?";

        const result = await db.query(query, [page, lang]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No content found for this page" });
        }

        const content = isProduction
            ? result.rows[0].content
            : JSON.parse(result.rows[0].content);

        // Set headers for file download
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="${page}-${lang}.json"`);
        res.send(JSON.stringify(content, null, 2));
    } catch (err) {
        console.error("Error exporting content:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST - Import content from JSON (admin only)
router.post("/:page/import", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const { page } = req.params;
        const { content, language } = req.body;
        const lang = language || "en";

        const validPages = ["about", "resume", "home"];
        if (!validPages.includes(page)) {
            return res.status(400).json({ error: "Invalid page name" });
        }

        if (!content || typeof content !== "object") {
            return res.status(400).json({ error: "Invalid content format" });
        }

        // Upsert: insert or update
        const query = isProduction
            ? `INSERT INTO page_content (page_name, language, content, updated_at) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
         ON CONFLICT (page_name, language) 
         DO UPDATE SET content = $3, updated_at = CURRENT_TIMESTAMP`
            : `INSERT INTO page_content (page_name, language, content, updated_at) 
         VALUES (?, ?, ?, CURRENT_TIMESTAMP) 
         ON CONFLICT (page_name, language) 
         DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP`;

        const contentStr = isProduction ? content : JSON.stringify(content);
        await db.query(query, [page, lang, contentStr]);

        res.json({ success: true, message: "Content imported successfully" });
    } catch (err) {
        console.error("Error importing content:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
