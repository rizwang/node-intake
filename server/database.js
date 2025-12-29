import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'intakes.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS intakes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    description TEXT NOT NULL,
    urgency INTEGER NOT NULL CHECK(urgency >= 1 AND urgency <= 5),
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'in_review', 'resolved')),
    internal_notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_status ON intakes(status);
  CREATE INDEX IF NOT EXISTS idx_category ON intakes(category);
  CREATE INDEX IF NOT EXISTS idx_created_at ON intakes(created_at);
`);

export default db;

