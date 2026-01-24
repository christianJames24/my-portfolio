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

      await db.query(`
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_id INTEGER
      `);

      // Drop old project_images table and create new images table
      await db.query(`DROP TABLE IF EXISTS project_images`);

      await db.query(`
        CREATE TABLE IF NOT EXISTS images (
          id SERIAL PRIMARY KEY,
          original_name VARCHAR(255),
          size_bytes INTEGER DEFAULT 0,
          image_data TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS page_content (
          id SERIAL PRIMARY KEY,
          page_name VARCHAR(50) NOT NULL,
          language VARCHAR(5) NOT NULL,
          content JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(page_name, language)
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS resumes (
          language VARCHAR(5) PRIMARY KEY,
          file_name VARCHAR(255) NOT NULL,
          file_data TEXT NOT NULL,
          mime_type VARCHAR(50) NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
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

    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_name TEXT,
      size_bytes INTEGER DEFAULT 0,
      image_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS page_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_name TEXT NOT NULL,
      language TEXT NOT NULL,
      content TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(page_name, language)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resumes (
      language TEXT PRIMARY KEY,
      file_name TEXT NOT NULL,
      file_data TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
            const cleanText = normalizedText.replace(/ RETURNING .*/i, "");
            const stmt = sqliteDb.prepare(cleanText);
            const info = stmt.run(...params);
            const tableName = text.match(/INTO\s+(\w+)/i)?.[1] || "comments";

            // Skip row retrieval for tables without id column (like resumes)
            if (tableName === "resumes") {
              resolve({ rows: [{ language: params[0], file_name: params[1] }] });
            } else {
              const row = sqliteDb
                .prepare(`SELECT * FROM ${tableName} WHERE id = ?`)
                .get(info.lastInsertRowid);
              resolve({ rows: [row] });
            }
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

  console.log("SQLite in-memory database initialized (base64 image storage)");
}

module.exports = { db, isProduction };