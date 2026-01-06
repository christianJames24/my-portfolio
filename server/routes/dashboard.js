// server/routes/dashboard.js
const express = require("express");
const router = express.Router();
const { db, isProduction } = require("../config/database");
const { checkJwt } = require("../config/auth");
const { requirePermission } = require("../middleware/permissions");

// Middleware: All dashboard routes require admin
router.use(checkJwt);
router.use(requirePermission("admin:dashboard"));

// ============ PROJECTS ============

// Get all projects (for dashboard)
router.get("/projects", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: err.message });
  }
});

// Reorder projects (swap sort_order between two projects)
router.put("/projects/reorder", async (req, res) => {
  try {
    const { projectId, direction } = req.body;

    // Get all projects sorted by sort_order
    const allProjects = await db.query(
      "SELECT id, sort_order FROM projects ORDER BY sort_order ASC, created_at DESC"
    );

    const projects = allProjects.rows;
    const currentIndex = projects.findIndex(p => p.id === projectId);

    if (currentIndex === -1) {
      return res.status(404).json({ error: "Project not found" });
    }

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= projects.length) {
      return res.status(400).json({ error: "Cannot move in that direction" });
    }

    const currentProject = projects[currentIndex];
    const targetProject = projects[targetIndex];

    // Swap sort_order values
    const currentOrder = currentProject.sort_order ?? currentIndex;
    const targetOrder = targetProject.sort_order ?? targetIndex;

    // Update both in database
    const updateQuery = isProduction
      ? "UPDATE projects SET sort_order = $1 WHERE id = $2"
      : "UPDATE projects SET sort_order = ? WHERE id = ?";

    await db.query(updateQuery, [targetOrder, currentProject.id]);
    await db.query(updateQuery, [currentOrder, targetProject.id]);

    res.json({ message: "Projects reordered" });
  } catch (err) {
    console.error("Error reordering projects:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create project
router.post("/projects", async (req, res) => {
  try {
    const { name_en, name_fr, description_en, description_fr, tech, year, image, image_id, sort_order } = req.body;

    const query = isProduction
      ? `INSERT INTO projects (name_en, name_fr, description_en, description_fr, tech, year, image, image_id, sort_order) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`
      : `INSERT INTO projects (name_en, name_fr, description_en, description_fr, tech, year, image, image_id, sort_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`;

    const result = await db.query(query, [
      name_en, name_fr, description_en, description_fr, tech, year, image || null, image_id || null, sort_order || 0
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update project
router.put("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name_en, name_fr, description_en, description_fr, tech, year, image, image_id, sort_order } = req.body;

    // If changing image_id, cleanup old uploaded image
    const selectQuery = isProduction
      ? "SELECT * FROM projects WHERE id = $1"
      : "SELECT * FROM projects WHERE id = ?";
    const existingProject = await db.query(selectQuery, [id]);

    if (existingProject.rows.length > 0) {
      const oldProject = existingProject.rows[0];
      // If old project had an image_id and it's different from new one
      if (oldProject.image_id && oldProject.image_id !== image_id) {
        const imageSelectQuery = isProduction
          ? "SELECT * FROM project_images WHERE id = $1"
          : "SELECT * FROM project_images WHERE id = ?";
        const imageResult = await db.query(imageSelectQuery, [oldProject.image_id]);

        if (imageResult.rows.length > 0) {
          const oldImage = imageResult.rows[0];
          const fs = require("fs");
          const path = require("path");
          const filePath = path.join(__dirname, "..", "uploads", oldImage.filename);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          const imageDeleteQuery = isProduction
            ? "DELETE FROM project_images WHERE id = $1"
            : "DELETE FROM project_images WHERE id = ?";
          await db.query(imageDeleteQuery, [oldProject.image_id]);
        }
      }
    }

    const query = isProduction
      ? `UPDATE projects SET 
           name_en = $1, name_fr = $2, description_en = $3, description_fr = $4, 
           tech = $5, year = $6, image = $7, image_id = $8, sort_order = $9, updated_at = CURRENT_TIMESTAMP
         WHERE id = $10 RETURNING *`
      : `UPDATE projects SET 
           name_en = ?, name_fr = ?, description_en = ?, description_fr = ?, 
           tech = ?, year = ?, image = ?, image_id = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? RETURNING *`;

    const result = await db.query(query, [
      name_en, name_fr, description_en, description_fr, tech, year, image || null, image_id || null, sort_order || 0, id
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: err.message });
  }
});


// Delete project (and cleanup associated image)
router.delete("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // First get the project to check if it has an uploaded image
    const selectQuery = isProduction
      ? "SELECT * FROM projects WHERE id = $1"
      : "SELECT * FROM projects WHERE id = ?";
    const projectResult = await db.query(selectQuery, [id]);

    if (projectResult.rows.length > 0) {
      const project = projectResult.rows[0];

      // If project has an uploaded image, delete it
      if (project.image_id) {
        const imageSelectQuery = isProduction
          ? "SELECT * FROM project_images WHERE id = $1"
          : "SELECT * FROM project_images WHERE id = ?";
        const imageResult = await db.query(imageSelectQuery, [project.image_id]);

        if (imageResult.rows.length > 0) {
          const image = imageResult.rows[0];
          const fs = require("fs");
          const path = require("path");
          const filePath = path.join(__dirname, "..", "uploads", image.filename);

          // Delete the file from disk
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          // Delete from project_images table
          const imageDeleteQuery = isProduction
            ? "DELETE FROM project_images WHERE id = $1"
            : "DELETE FROM project_images WHERE id = ?";
          await db.query(imageDeleteQuery, [project.image_id]);
        }
      }
    }

    // Delete the project
    const query = isProduction
      ? "DELETE FROM projects WHERE id = $1"
      : "DELETE FROM projects WHERE id = ?";

    await db.query(query, [id]);
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: err.message });
  }
});

// Export projects as JSON
router.get("/projects/export", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM projects ORDER BY sort_order ASC");

    const exportEn = {
      title: "Projects",
      projects: result.rows.map(p => ({
        name: p.name_en,
        description: p.description_en,
        tech: p.tech,
        year: p.year,
        image: p.image
      }))
    };

    const exportFr = {
      title: "Projets",
      projects: result.rows.map(p => ({
        name: p.name_fr,
        description: p.description_fr,
        tech: p.tech,
        year: p.year,
        image: p.image
      }))
    };

    res.json({ en: exportEn, fr: exportFr });
  } catch (err) {
    console.error("Error exporting projects:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============ COMMENTS ============

// Get all comments (including pending)
router.get("/comments", async (req, res) => {
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

// Get pending comments count
router.get("/comments/pending/count", async (req, res) => {
  try {
    const query = isProduction
      ? "SELECT COUNT(*) as count FROM comments WHERE status = $1"
      : "SELECT COUNT(*) as count FROM comments WHERE status = ?";
    const result = await db.query(query, ["pending"]);
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("Error fetching pending count:", err);
    res.status(500).json({ error: err.message });
  }
});

// Approve comment
router.put("/comments/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const query = isProduction
      ? "UPDATE comments SET status = $1 WHERE id = $2 RETURNING *"
      : "UPDATE comments SET status = ? WHERE id = ? RETURNING *";

    const result = await db.query(query, ["approved", id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error approving comment:", err);
    res.status(500).json({ error: err.message });
  }
});

// Reject comment
router.put("/comments/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const query = isProduction
      ? "UPDATE comments SET status = $1 WHERE id = $2 RETURNING *"
      : "UPDATE comments SET status = ? WHERE id = ? RETURNING *";

    const result = await db.query(query, ["rejected", id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error rejecting comment:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;