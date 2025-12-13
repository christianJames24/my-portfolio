const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Enable CORS for development
app.use(cors());
app.use(express.json());

// API routes
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

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;  // Changed to 5000 to match your proxy
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});