const express = require("express");
const cors = require("cors");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const commentsRoutes = require("./routes/comments");
const projectsRoutes = require("./routes/projects");

app.get("/api", (req, res) => {
  res.json({ status: "API is running" });
});

app.use("/api/comments", commentsRoutes);
app.use("/api/projects", projectsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT} (${
      process.env.NODE_ENV === "production" ? "production" : "development"
    } mode)`
  );
});