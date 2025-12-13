const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Use environment variable to determine base path
const basePath = process.env.API_BASE_PATH || '/api';

app.get(`${basePath}`, (req, res) => {
  res.json({ status: "API is running" });
});

app.get(`${basePath}/projects`, (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} with base path ${basePath}`);
});