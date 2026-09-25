// Local SQLite database: opens data/app.db, runs the drizzle migrations on
// boot, and seeds one empty default profile on a fresh database.
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq } from "drizzle-orm";
import { mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import * as schema from "./schema.js";

export const DEFAULT_VIDEO_CHANNEL_URL = "https://www.youtube.com/@NeetCode/videos";

export function openDatabase(dataDir: string): BetterSQLite3Database<typeof schema> {
  mkdirSync(dataDir, { recursive: true });
  const dbPath = join(dataDir, "app.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  const migrationsFolder = join(dirname(new URL(import.meta.url).pathname), "..", "..", "drizzle");
  migrate(db, { migrationsFolder: existsSync(migrationsFolder) ? migrationsFolder : join(process.cwd(), "drizzle") });
  seedDefaultProfile(db);
  return db;
}

function seedDefaultProfile(db: BetterSQLite3Database<typeof schema>) {
  const existing = db.select({ id: schema.profiles.id }).from(schema.profiles).limit(1).all();
  if (existing.length) return;
  db.insert(schema.profiles).values({ name: "Profile 1", videoChannelUrl: DEFAULT_VIDEO_CHANNEL_URL }).run();
}
