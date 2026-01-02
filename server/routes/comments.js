const express = require("express");
const router = express.Router();
const { db, isProduction } = require("../config/database");
const { checkJwt } = require("../config/auth");
const { requirePermission } = require("../middleware/permissions");

// Get all comments (public)
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM comments ORDER BY created_at DESC"
    );
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

// Post a comment (protected)
router.post("/", checkJwt, requirePermission("write:comments"), async (req, res) => {
  try {
    const { text, user_name, user_picture } = req.body;
    const user_id = req.auth.sub || req.auth.payload.sub;

    const query = isProduction
      ? "INSERT INTO comments (user_id, user_name, user_picture, text) VALUES ($1, $2, $3, $4) RETURNING *"
      : "INSERT INTO comments (user_id, user_name, user_picture, text) VALUES (?, ?, ?, ?) RETURNING *";

    const result = await db.query(query, [
      user_id,
      user_name,
      user_picture,
      text,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a comment (admin only)
router.delete("/:id", checkJwt, requirePermission("delete:comments"), async (req, res) => {
  try {
    const { id } = req.params;

    const query = isProduction
      ? "DELETE FROM comments WHERE id = $1"
      : "DELETE FROM comments WHERE id = ?";

    await db.query(query, [id]);

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;