const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      title: "backend api test bro",
      description: "A personal portfolio built with React and Express",
      tech: ["React", "Node", "Express"],
    },
    {
      id: 2,
      title: "Login System",
      description: "Session-based authentication with PostgreSQL",
      tech: ["Node", "Postgres", "bcrypt"],
    },
  ]);
});

module.exports = router;