// server/config/database.js
const isProduction = process.env.NODE_ENV === "production";

let db;

if (isProduction) {
  const { Pool } = require("pg");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  db = pool;

  const runMigrations = async () => {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS comments (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          user_name VARCHAR(255) NOT NULL,
          user_picture TEXT,
          text TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        ALTER TABLE comments ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved'
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          sort_order INTEGER DEFAULT 0,
          name_en VARCHAR(255) NOT NULL,
          name_fr VARCHAR(255) NOT NULL,
          description_en TEXT,
          description_fr TEXT,
          tech VARCHAR(255),
          year VARCHAR(10),
          image TEXT,
          image_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add image_id column if it doesn't exist
      await db.query(`
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_id INTEGER
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS project_images (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255),
          original_name VARCHAR(255),
          size_bytes INTEGER DEFAULT 0,
          image_data TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add image_data column if it doesn't exist (migration for existing databases)
      await db.query(`
        ALTER TABLE project_images ADD COLUMN IF NOT EXISTS image_data TEXT
      `);

      console.log("Database migrations completed successfully");
    } catch (err) {
      console.error("Error running migrations:", err);
    }
  };

  runMigrations();
} else {
  const Database = require("better-sqlite3");
  const sqliteDb = new Database(":memory:");

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_picture TEXT,
      text TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER DEFAULT 0,
      name_en TEXT NOT NULL,
      name_fr TEXT NOT NULL,
      description_en TEXT,
      description_fr TEXT,
      tech TEXT,
      year TEXT,
      image TEXT,
      image_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS project_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      original_name TEXT,
      size_bytes INTEGER DEFAULT 0,
      image_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db = {
    query: (text, params = []) => {
      return new Promise((resolve, reject) => {
        try {
          const normalizedText = text.replace(/\$\d+/g, "?");

          if (text.trim().toUpperCase().startsWith("DELETE")) {
            const stmt = sqliteDb.prepare(normalizedText);
            const info = stmt.run(...params);
            resolve({ rowCount: info.changes });
          } else if (text.trim().toUpperCase().startsWith("INSERT")) {
            const cleanText = normalizedText.replace(" RETURNING *", "");
            const stmt = sqliteDb.prepare(cleanText);
            const info = stmt.run(...params);
            const tableName = text.match(/INTO\s+(\w+)/i)?.[1] || "comments";
            const row = sqliteDb
              .prepare(`SELECT * FROM ${tableName} WHERE id = ?`)
              .get(info.lastInsertRowid);
            resolve({ rows: [row] });
          } else if (text.trim().toUpperCase().startsWith("UPDATE")) {
            const cleanText = normalizedText.replace(" RETURNING *", "");
            const stmt = sqliteDb.prepare(cleanText);
            const info = stmt.run(...params);
            const idParam = params[params.length - 1];
            const tableName = text.match(/UPDATE\s+(\w+)/i)?.[1] || "comments";
            const row = sqliteDb
              .prepare(`SELECT * FROM ${tableName} WHERE id = ?`)
              .get(idParam);
            resolve({ rows: [row], rowCount: info.changes });
          } else if (text.trim().toUpperCase().startsWith("SELECT")) {
            const stmt = sqliteDb.prepare(normalizedText);
            const rows = params.length > 0 ? stmt.all(...params) : stmt.all();
            resolve({ rows });
          } else {
            resolve({ rows: [] });
          }
        } catch (err) {
          reject(err);
        }
      });
    },
  };

  // No more auto-sync from filesystem - images are stored in database as base64
  console.log("SQLite in-memory database initialized (base64 image storage)");
}

module.exports = { db, isProduction };