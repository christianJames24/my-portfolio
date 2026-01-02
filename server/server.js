const express = require("express");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Initialize database on startup (local only)
if (process.env.NODE_ENV !== "production") {
  const initializeDatabase = require("./init-db");
  initializeDatabase();
}

const app = express();

app.use(cors());
app.use(express.json());

// Database setup - SQLite for local, PostgreSQL for production
let db;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const { Pool } = require("pg");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  db = pool;

  // Initialize table
  db.query(
    `
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      user_picture TEXT,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).catch((err) => console.error("Error creating table:", err));
} else {
  // SQLite IN-MEMORY for local development (non-persistent)
  const Database = require("better-sqlite3");
  const sqliteDb = new Database(":memory:"); // <-- In-memory only!

  // Create table (fresh every restart)
  sqliteDb.exec(`
    CREATE TABLE comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_picture TEXT,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Wrapper to make SQLite work like PostgreSQL
  db = {
    query: (text, params = []) => {
      return new Promise((resolve, reject) => {
        try {
          if (text.includes("DELETE")) {
            const stmt = sqliteDb.prepare(text);
            const info = stmt.run(...params);
            resolve({ rowCount: info.changes });
          } else if (text.includes("INSERT")) {
            const stmt = sqliteDb.prepare(text.replace(" RETURNING *", ""));
            const info = stmt.run(...params);
            const row = sqliteDb
              .prepare("SELECT * FROM comments WHERE id = ?")
              .get(info.lastInsertRowid);
            resolve({ rows: [row] });
          } else if (text.includes("SELECT")) {
            const stmt = sqliteDb.prepare(text);
            const rows = params.length > 0 ? stmt.all(...params) : stmt.all();
            resolve({ rows });
          }
        } catch (err) {
          reject(err);
        }
      });
    },
  };
}

// Auth0 middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

// Public routes
app.get("/api", (req, res) => {
  res.json({ status: "API is running" });
});

app.get("/api/projects", (req, res) => {
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

// Get all comments (public)
app.get("/api/comments", async (req, res) => {
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

// Get user permissions (protected)
app.get("/api/me", checkJwt, (req, res) => {
  res.json({
    permissions: req.auth.payload.permissions || [],
  });
});

// Post a comment - manual permission check
app.post("/api/comments", checkJwt, async (req, res) => {
  try {
    // Check permissions manually (they're in payload!)
    const userPermissions = req.auth.payload.permissions || [];
    if (!userPermissions.includes("write:comments")) {
      return res
        .status(403)
        .json({ error: "Missing write:comments permission" });
    }

    const { text, user_name, user_picture } = req.body;
    const user_id = req.auth.sub || req.auth.payload.sub;

    const query = isProduction
      ? "INSERT INTO comments (user_id, user_name, user_picture, text) VALUES ($1, $2, $3, $4) RETURNING *"
      : "INSERT INTO comments (user_id, user_name, user_picture, text) VALUES (?, ?, ?, ?) RETURNING *";

    const result = await db.query(query, [
      user_id,
      user_name,
      user_picture,
      text,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a comment - manual permission check for admin
app.delete("/api/comments/:id", checkJwt, async (req, res) => {
  try {
    // Check permissions manually
    const userPermissions = req.auth.payload.permissions || [];
    if (!userPermissions.includes("delete:comments")) {
      return res
        .status(403)
        .json({ error: "Missing delete:comments permission" });
    }

    const { id } = req.params;

    const query = isProduction
      ? "DELETE FROM comments WHERE id = $1"
      : "DELETE FROM comments WHERE id = ?";

    await db.query(query, [id]);

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT} (${
      isProduction ? "production" : "development"
    } mode)`
  );
});
