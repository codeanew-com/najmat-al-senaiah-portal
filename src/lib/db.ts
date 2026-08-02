import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(path.join(dataDir, "admin.sqlite"));

db.exec(`
  PRAGMA busy_timeout = 5000;
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS account (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    bank_name_official_en TEXT NOT NULL,
    bank_name_official_ar TEXT NOT NULL,
    account_type_en TEXT NOT NULL,
    account_type_ar TEXT NOT NULL,
    account_name TEXT NOT NULL,
    iban TEXT NOT NULL,
    account_number TEXT NOT NULL,
    swift_code TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS otp_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    code_salt TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    consumed_at INTEGER,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes (email);

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

/** Opportunistically clears expired rows; cheap enough to call on every auth request. */
export function cleanupExpired() {
  const nowMs = Date.now();
  db.prepare("DELETE FROM otp_codes WHERE expires_at < ?").run(nowMs);
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(nowMs);
}
