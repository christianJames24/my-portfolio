// server/routes/projects.js
const express = require("express");
const router = express.Router();
const { db } = require("../config/database");

// Get projects for public (with language support)
router.get("/", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const result = await db.query(
      "SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC"
    );

    // If no projects in DB, return empty (client will use fallback JSON)
    if (result.rows.length === 0) {
      return res.json({ useClientFallback: true, projects: [] });
    }

    const projects = result.rows.map((p) => ({
      name: lang === "fr" ? p.name_fr : p.name_en,
      description: lang === "fr" ? p.description_fr : p.description_en,
      tech: p.tech,
      year: p.year,
      image: p.image,
    }));

    res.json({
      title: lang === "fr" ? "Projets" : "Projects",
      projects,
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.json({ useClientFallback: true, projects: [] });
  }
});

module.exports = router;