// server/routes/comments.js
const express = require("express");
const router = express.Router();
const { db, isProduction } = require("../config/database");
const { checkJwt } = require("../config/auth");
const { requirePermission } = require("../middleware/permissions");
const { validateComment, validateId } = require("../utils/validators");

// Get approved comments only (public)
router.get("/", async (req, res) => {
  try {
    const query = isProduction
      ? "SELECT * FROM comments WHERE status = $1 ORDER BY created_at DESC"
      : "SELECT * FROM comments WHERE status = ? ORDER BY created_at DESC";
    const result = await db.query(query, ["approved"]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get user permissions (protected)
router.get("/me", checkJwt, (req, res) => {
  res.json({
    permissions: req.auth.payload.permissions || [],
  });
});

// Post a comment (protected) - now goes to pending
router.post("/", checkJwt, requirePermission("write:comments"), validateComment, async (req, res) => {
  try {
    const { text, user_name, user_picture } = req.body;
    const user_id = req.auth.sub || req.auth.payload.sub;

    const query = isProduction
      ? "INSERT INTO comments (user_id, user_name, user_picture, text, status) VALUES ($1, $2, $3, $4, $5) RETURNING *"
      : "INSERT INTO comments (user_id, user_name, user_picture, text, status) VALUES (?, ?, ?, ?, ?) RETURNING *";

    const result = await db.query(query, [
      user_id,
      user_name,
      user_picture,
      text,
      "pending",
    ]);

    res.json({ ...result.rows[0], message: "Comment submitted for approval" });
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ error: "Failed to submit comment" });
  }
});

// Delete a comment (admin only)
router.delete("/:id", checkJwt, requirePermission("delete:comments"), validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const query = isProduction
      ? "DELETE FROM comments WHERE id = $1"
      : "DELETE FROM comments WHERE id = ?";

    await db.query(query, [id]);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;