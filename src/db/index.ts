import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";
import { DDL } from "./schema";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "agcyberlab.db");

const globalForDb = globalThis as typeof globalThis & {
  __agCyberLabSqlite?: Database.Database;
  __agCyberLabDb?: ReturnType<typeof drizzle<typeof schema>>;
};

function createClient(): Database.Database {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const sqlite = new Database(DB_FILE);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  // Şema ilk çalıştırmada otomatik ve güvenli biçimde oluşturulur.
  sqlite.exec(DDL);
  return sqlite;
}

export const sqlite = globalForDb.__agCyberLabSqlite ?? createClient();
export const db = globalForDb.__agCyberLabDb ?? drizzle(sqlite, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__agCyberLabSqlite = sqlite;
  globalForDb.__agCyberLabDb = db;
}

export { schema };
