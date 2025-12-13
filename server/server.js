const express = require("express");
const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ status: "API is running" });
});

app.get("/api/projects", (req, res) => {
  res.json([
    {
      id: 1,
      title: "backend api test bro",
      description: "A personal portfolio built with React and Express",
      tech: ["React", "Node", "Express"]
    },
    {
      id: 2,
      title: "Login System",
      description: "Session-based authentication with PostgreSQL",
      tech: ["Node", "Postgres", "bcrypt"]
    }
  ]);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
