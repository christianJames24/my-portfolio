// server/routes/messages.js
const express = require("express");
const router = express.Router();
const { db, isProduction } = require("../config/database");
const { checkJwt } = require("../config/auth");
const { requirePermission } = require("../middleware/permissions");

// POST - Submit a message (public, no auth required)
router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Name, email, and message are required" });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const query = isProduction
            ? `INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *`
            : `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`;

        const result = await db.query(query, [name.trim(), email.trim(), message.trim()]);

        res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (err) {
        console.error("Error saving message:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET - Get all messages (admin only)
router.get("/", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM messages ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Delete a message (admin only)
router.delete("/:id", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const { id } = req.params;
        const query = isProduction
            ? "DELETE FROM messages WHERE id = $1"
            : "DELETE FROM messages WHERE id = ?";

        await db.query(query, [id]);
        res.json({ message: "Message deleted" });
    } catch (err) {
        console.error("Error deleting message:", err);
        res.status(500).json({ error: err.message });
    }
});

// PATCH - Mark message as read (admin only)
router.patch("/:id/read", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const { id } = req.params;
        const query = isProduction
            ? "UPDATE messages SET read = TRUE WHERE id = $1 RETURNING *"
            : "UPDATE messages SET read = 1 WHERE id = ?";

        await db.query(query, [id]);
        res.json({ message: "Message marked as read" });
    } catch (err) {
        console.error("Error marking message as read:", err);
        res.status(500).json({ error: err.message });
    }
});

// PATCH - Mark message as unread (admin only)
router.patch("/:id/unread", checkJwt, requirePermission("admin:dashboard"), async (req, res) => {
    try {
        const { id } = req.params;
        const query = isProduction
            ? "UPDATE messages SET read = FALSE WHERE id = $1 RETURNING *"
            : "UPDATE messages SET read = 0 WHERE id = ?";

        await db.query(query, [id]);
        res.json({ message: "Message marked as unread" });
    } catch (err) {
        console.error("Error marking message as unread:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
