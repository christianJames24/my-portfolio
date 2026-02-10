// server/server.js
const express = require("express");
const cors = require("cors");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Set payload size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Routes
const commentsRoutes = require("./routes/comments");
const projectsRoutes = require("./routes/projects");
const dashboardRoutes = require("./routes/dashboard");
const uploadsRoutes = require("./routes/uploads");
const contentRoutes = require("./routes/content");
const messagesRoutes = require("./routes/messages");
const resumesRoutes = require("./routes/resumes");

app.get("/api", (req, res) => {
  res.json({ status: "API is running" });
});

// User permissions endpoint
const { checkJwt } = require("./config/auth");
app.get("/api/me", checkJwt, (req, res) => {
  res.json({
    permissions: req.auth.payload.permissions || [],
  });
});

app.use("/api/comments", commentsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/resumes", resumesRoutes);
// Temporarily allow auth route even if env vars missing (it handles errors gracefully)
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT} (${process.env.NODE_ENV === "production" ? "production" : "development"
    } mode)`
  );
});