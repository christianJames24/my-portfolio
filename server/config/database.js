const isProduction = process.env.NODE_ENV === "production";

let db;

if (isProduction) {
  // PostgreSQL for production
  const { Pool } = require("pg");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
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
  // SQLite IN-MEMORY for local development
  const Database = require("better-sqlite3");
  const sqliteDb = new Database(":memory:");

  // Create table
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

module.exports = { db, isProduction };