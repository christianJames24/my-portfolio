const Database = require('better-sqlite3');

function initializeDatabase() {
  const db = new Database('comments.db');
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_picture TEXT,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ SQLite database initialized');
  db.close();
}

// Export for server.js to call
module.exports = initializeDatabase;

// Allow running directly with `node init-db.js`
if (require.main === module) {
  initializeDatabase();
}