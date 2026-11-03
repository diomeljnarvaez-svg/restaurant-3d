import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "src", "data");

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const DATABASE_URL = process.env.DATABASE_URL || loadEnv(path.join(__dirname, "..", ".env.local")).DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL no está definida (env var o .env.local). Abortando.");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL, max: 1 });

async function seed() {
  await pool.query("CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value JSONB NOT NULL)");

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const key = file.replace(/\.json$/, "");
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"));

    let value = data;
    if (key === "users" && Array.isArray(data)) {
      value = await Promise.all(
        data.map(async (u) => {
          if (u.password && !u.password.startsWith("$2")) {
            return { ...u, password: await bcrypt.hash(u.password, 10) };
          }
          return u;
        })
      );
    }

    await pool.query(
      "INSERT INTO kv_store (key, value) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [key, JSON.stringify(value)]
    );
    console.log(`Seeded ${key} (${Array.isArray(value) ? value.length + " filas" : "objeto"})`);
  }

  for (const key of ["loyalty", "push-subscriptions"]) {
    if (!files.includes(`${key}.json`)) {
      await pool.query(
        "INSERT INTO kv_store (key, value) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        [key, JSON.stringify([])]
      );
      console.log(`Initialized ${key} (vacío)`);
    }
  }

  const res = await pool.query("SELECT key, value FROM kv_store ORDER BY key");
  console.log("--- Estado final ---");
  for (const row of res.rows) {
    console.log(`${row.key}: ${Array.isArray(row.value) ? row.value.length + " filas" : "objeto"}`);
  }
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
