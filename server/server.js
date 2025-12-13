const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

app.get("/api/projects", (req, res) => {
  res.json([
    {
      id: 1,
      title: "backend api test",
      description: "A personal portfolio built with React and Express",
      tech: ["React", "Node", "Express"]
    }
  ]);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
