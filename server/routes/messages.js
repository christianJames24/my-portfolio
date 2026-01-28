// server/routes/messages.js
const express = require("express");
const router = express.Router();
const { db, isProduction } = require("../config/database");
const { checkJwt } = require("../config/auth");
const { requirePermission } = require("../middleware/permissions");
const { validateMessage, validateId } = require("../utils/validators");

// POST - Submit a message (public, no auth required)
router.post("/", validateMessage, async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const query = isProduction
            ? `INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *`
            : `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`;

        await db.query(query, [name, email, message]);

        // Send email via SMTP
        if (process.env.GOOGLE_USER && process.env.GOOGLE_PASS) {
            try {
                const transporter = require("nodemailer").createTransport({
                    host: "smtp.gmail.com",
                    port: parseInt(process.env.SMTP_PORT) || 465,
                    secure: true, // use SSL
                    auth: {
                        user: process.env.GOOGLE_USER,
                        pass: process.env.GOOGLE_PASS,
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                });

                const mailOptions = {
                    from: process.env.GOOGLE_USER,
                    to: process.env.CONTACT_RECEIVER || process.env.GOOGLE_USER, // Send to configured receiver or self
                    subject: `New Contact Form Message from ${name}`,
                    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                    replyTo: email, // Reply goes to the person who submitted the form
                };

                await transporter.sendMail(mailOptions);
            } catch (emailErr) {
                console.error("Failed to send email via SMTP:", emailErr);
                // Don't fail the request if email fails, but log it
            }
        } else {
            console.warn("Google SMTP credentials not found in environment variables");
        }

        res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (err) {
        console.error("Error saving message:", err);
        res.status(500).json({ error: "Failed to send message. Please try again later." });
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
router.delete("/:id", checkJwt, requirePermission("admin:dashboard"), validateId, async (req, res) => {
    try {
        const { id } = req.params;
        const query = isProduction
            ? "DELETE FROM messages WHERE id = $1"
            : "DELETE FROM messages WHERE id = ?";

        await db.query(query, [id]);
        res.json({ message: "Message deleted" });
    } catch (err) {
        console.error("Error deleting message:", err);
        res.status(500).json({ error: "Failed to delete message" });
    }
});

// PATCH - Mark message as read (admin only)
router.patch("/:id/read", checkJwt, requirePermission("admin:dashboard"), validateId, async (req, res) => {
    try {
        const { id } = req.params;
        const query = isProduction
            ? "UPDATE messages SET read = TRUE WHERE id = $1 RETURNING *"
            : "UPDATE messages SET read = 1 WHERE id = ?";

        await db.query(query, [id]);
        res.json({ message: "Message marked as read" });
    } catch (err) {
        console.error("Error marking message as read:", err);
        res.status(500).json({ error: "Failed to update message" });
    }
});

// PATCH - Mark message as unread (admin only)
router.patch("/:id/unread", checkJwt, requirePermission("admin:dashboard"), validateId, async (req, res) => {
    try {
        const { id } = req.params;
        const query = isProduction
            ? "UPDATE messages SET read = FALSE WHERE id = $1 RETURNING *"
            : "UPDATE messages SET read = 0 WHERE id = ?";

        await db.query(query, [id]);
        res.json({ message: "Message marked as unread" });
    } catch (err) {
        console.error("Error marking message as unread:", err);
        res.status(500).json({ error: "Failed to update message" });
    }
});

module.exports = router;
