// server/server.js
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
const dashboardRoutes = require("./routes/dashboard");
const uploadsRoutes = require("./routes/uploads");

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT} (${process.env.NODE_ENV === "production" ? "production" : "development"
    } mode)`
  );
});