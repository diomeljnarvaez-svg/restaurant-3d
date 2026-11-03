import fs from "fs";
import path from "path";
import { Pool } from "@neondatabase/serverless";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const DATABASE_URL = process.env.DATABASE_URL;

// Postgres backend (Neon) when DATABASE_URL is set; otherwise file-based storage (local dev).
const pool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL, max: 1 }) : null;

let tableReady: Promise<void> | null = null;
function ensureTable(): Promise<void> {
  if (!pool) return Promise.resolve();
  if (!tableReady) {
    tableReady = pool
      .query("CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value JSONB NOT NULL)")
      .then(() => undefined)
      .catch((err) => {
        tableReady = null;
        throw err;
      });
  }
  return tableReady;
}

async function readKV<T>(key: string): Promise<T | null> {
  const res = await pool!.query("SELECT value FROM kv_store WHERE key = $1", [key]);
  return res.rows[0] ? (res.rows[0].value as T) : null;
}

async function writeKV(key: string, value: unknown) {
  await pool!.query(
    "INSERT INTO kv_store (key, value) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [key, JSON.stringify(value)]
  );
}

async function mutateArray<T>(key: string, fn: (data: T[]) => T[]): Promise<T[]> {
  const client = await pool!.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [key]);
    const res = await client.query("SELECT value FROM kv_store WHERE key = $1", [key]);
    const data = (res.rows[0]?.value as T[]) ?? [];
    const next = fn(Array.isArray(data) ? data : []);
    await client.query(
      "INSERT INTO kv_store (key, value) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [key, JSON.stringify(next)]
    );
    await client.query("COMMIT");
    return next;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

function fileRead<T>(name: string): T[] {
  const fp = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(fp)) return [];
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

function fileWrite(name: string, data: unknown) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

function fileGetSettings(name: string): Record<string, any> | null {
  const fp = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

function fileSaveSettings(name: string, data: Record<string, any>) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

export async function getAll<T>(name: string): Promise<T[]> {
  if (!pool) return fileRead<T>(name);
  await ensureTable();
  const v = await readKV<T[]>(name);
  return Array.isArray(v) ? v : [];
}

export async function getById<T extends { id: string }>(name: string, id: string): Promise<T | null> {
  const items = await getAll<T>(name);
  return items.find((i) => i.id === id) || null;
}

export async function create<T extends { id: string }>(name: string, item: T): Promise<T> {
  if (!pool) {
    const items = fileRead<T>(name);
    items.push(item);
    fileWrite(name, items);
    return item;
  }
  await ensureTable();
  await mutateArray<T>(name, (data) => [...data, item]);
  return item;
}

export async function update<T extends { id: string }>(name: string, id: string, updates: Partial<T>): Promise<T | null> {
  let updated: T | null = null;
  const apply = (data: T[]) =>
    data.map((i) => {
      if (i.id === id) {
        updated = { ...i, ...updates };
        return updated;
      }
      return i;
    });
  if (!pool) {
    fileWrite(name, apply(fileRead<T>(name)));
    return updated;
  }
  await ensureTable();
  await mutateArray<T>(name, apply);
  return updated;
}

export async function remove<T extends { id: string }>(name: string, id: string): Promise<boolean> {
  let removed = false;
  const apply = (data: T[]) =>
    data.filter((i) => {
      if (i.id === id) removed = true;
      return i.id !== id;
    });
  if (!pool) {
    fileWrite(name, apply(fileRead<T>(name)));
    return removed;
  }
  await ensureTable();
  await mutateArray<T>(name, apply);
  return removed;
}

export async function getSettings(name: string): Promise<Record<string, any> | null> {
  if (!pool) return fileGetSettings(name);
  await ensureTable();
  const v = await readKV<Record<string, any>>(name);
  return v && typeof v === "object" && !Array.isArray(v) ? v : null;
}

export async function saveSettings(name: string, data: Record<string, any>): Promise<void> {
  if (!pool) {
    fileSaveSettings(name, data);
    return;
  }
  await ensureTable();
  await writeKV(name, data);
}

export async function readData<T>(name: string): Promise<T[]> {
  return getAll<T>(name);
}

export async function writeData<T>(name: string, data: T[]): Promise<void> {
  if (!pool) {
    fileWrite(name, data);
    return;
  }
  await ensureTable();
  await writeKV(name, data);
}
