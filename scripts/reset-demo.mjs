/**
 * Respalda los datos actuales (Neon + JSON locales) y restaura los datos
 * de demostración por defecto del proyecto (menú Donde Papá, 8 platos, usuarios
 * y reservas de ejemplo).
 *
 * Uso:  npm run db:reset-demo
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const DATABASE_URL =
  process.env.DATABASE_URL || loadEnv(path.join(ROOT, ".env.local")).DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL no está definida (env var o .env.local). Abortando.");
  process.exit(1);
}

const now = new Date().toISOString();
const inDays = (n) => new Date(Date.now() + n * 86400000).toISOString().split("T")[0];

/* ---------- Datos por defecto (equivalentes a src/lib/seed.ts) ---------- */

const products = [
  {
    id: "1",
    name: "Risotto de Hongos",
    slug: "risotto-de-hongos",
    description: "Cremoso risotto con hongos portobello, parmesano y trufa negra.",
    price: 18.5,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
    category: "Platos Fuertes",
    featured: true,
    available: true,
    createdAt: now,
  },
  {
    id: "2",
    name: "Tartar de Atún",
    slug: "tartar-de-atun",
    description: "Atún fresco marinado con jengibre, salsa de soja y aguacate.",
    price: 22.0,
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80",
    category: "Entradas",
    featured: true,
    available: true,
    createdAt: now,
  },
  {
    id: "3",
    name: "Pasta al Pesto",
    slug: "pasta-al-pesto",
    description: "Pasta artesanal con pesto de albahaca fresca, piñones y parmesano.",
    price: 16.0,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
    category: "Platos Fuertes",
    featured: true,
    available: true,
    createdAt: now,
  },
  {
    id: "4",
    name: "Tiramisú Clásico",
    slug: "tiramisu-clasico",
    description: "Auténtico tiramisú italiano con mascarpone, café espresso y cacao.",
    price: 10.5,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
    category: "Postres",
    featured: true,
    available: true,
    createdAt: now,
  },
  {
    id: "5",
    name: "Ceviche Peruano",
    slug: "ceviche-peruano",
    description: "Pescado fresco marinado en limón, con cebolla morada y camote.",
    price: 19.0,
    image: "https://images.unsplash.com/photo-1535392432937-a27c36ec07b5?w=600&q=80",
    category: "Entradas",
    featured: false,
    available: true,
    createdAt: now,
  },
  {
    id: "6",
    name: "Salmón Glaseado",
    slug: "salmon-glaseado",
    description: "Salmón noruego glaseado con miel y mostaza, con espárragos.",
    price: 24.0,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    category: "Platos Fuertes",
    featured: false,
    available: true,
    createdAt: now,
  },
  {
    id: "7",
    name: "Margarita Clásica",
    slug: "margarita-clasica",
    description: "Pizza margarita con mozzarella fresca, albahaca y tomates San Marzano.",
    price: 14.5,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    category: "Platos Fuertes",
    featured: false,
    available: true,
    createdAt: now,
  },
  {
    id: "8",
    name: "Cheesecake de Frutos Rojos",
    slug: "cheesecake-frutos-rojos",
    description: "Cheesecake cremoso con coulis de frutos rojos y menta fresca.",
    price: 11.0,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
    category: "Postres",
    featured: false,
    available: true,
    createdAt: now,
  },
];

const users = [
  {
    id: "admin-1",
    name: "Super Admin",
    email: "admin@restaurant.com",
    password: "admin123",
    role: "superadmin",
    createdAt: now,
  },
  {
    id: "admin-2",
    name: "Admin Editor",
    email: "editor@restaurant.com",
    password: "editor123",
    role: "editor",
    createdAt: now,
  },
];

const reservations = [
  {
    id: "res-1",
    name: "María García",
    email: "maria@email.com",
    phone: "555-0101",
    date: inDays(1),
    time: "20:00",
    guests: 4,
    notes: "Mesa cerca de la ventana, por favor.",
    status: "confirmed",
    createdAt: now,
  },
  {
    id: "res-2",
    name: "Carlos López",
    email: "carlos@email.com",
    phone: "555-0102",
    date: inDays(2),
    time: "21:30",
    guests: 2,
    notes: "Celebración de aniversario.",
    status: "pending",
    createdAt: now,
  },
  {
    id: "res-3",
    name: "Ana Martínez",
    email: "ana@email.com",
    phone: "555-0103",
    date: inDays(3),
    time: "19:00",
    guests: 6,
    notes: "",
    status: "pending",
    createdAt: now,
  },
];

const settings = {
  siteName: "Donde Papá",
  siteDescription: "Experiencia gastronómica única",
  logo: "",
  primaryColor: "#8B5CF6",
  secondaryColor: "#EC4899",
  heroBg: "#000000",
  pageBg: "#000000",
  cardBg: "#0a0a0a",
  footerBg: "#000000",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  whatsappNumber: "1234567890",
  whatsappMessage: "¡Hola! Quiero hacer una reservación.",
  heroTitle: "Una Experiencia Gastronómica Inolvidable",
  heroSubtitle: "Sabores que cuentan historias, ingredientes que inspiran",
  aboutTitle: "Nuestra Historia",
  aboutContent:
    "Desde 2015, nos dedicamos a crear experiencias culinarias únicas combinando tradición e innovación. Cada plato es una obra de arte preparada con los ingredientes más frescos.",
  address: "Av. Principal 123, Ciudad",
  phone: "+1 234 567 890",
  email: "info@dondepapa.com",
  businessHours: "Lun-Dom: 12:00 - 23:00",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  twitter: "https://twitter.com",
  reservationsEnabled: true,
  maxGuestsPerReservation: 10,
  reservationNotice: "Solicita tu reservación con al menos 2 horas de anticipación.",
};

/* ---------------------------- Respaldo ---------------------------- */

async function backup(pool) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dir = path.join(ROOT, "backups", stamp);
  fs.mkdirSync(dir, { recursive: true });

  // Neon
  const res = await pool.query("SELECT key, value FROM kv_store ORDER BY key");
  const neon = {};
  for (const row of res.rows) neon[row.key] = row.value;
  fs.writeFileSync(path.join(dir, "neon-kv_store.json"), JSON.stringify(neon, null, 2));

  // JSON locales
  const localDir = path.join(dir, "local-data");
  fs.mkdirSync(localDir, { recursive: true });
  for (const file of fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"))) {
    fs.copyFileSync(path.join(DATA_DIR, file), path.join(localDir, file));
  }

  console.log(`Respaldo guardado en: ${dir}`);
  for (const row of res.rows) {
    console.log(`  - ${row.key}: ${Array.isArray(row.value) ? row.value.length + " filas" : "objeto"}`);
  }
  return dir;
}

/* ------------------------------ Reset ------------------------------ */

async function reset() {
  const pool = new Pool({ connectionString: DATABASE_URL, max: 1 });
  await pool.query(
    "CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value JSONB NOT NULL)"
  );

  await backup(pool);

  const usersHashed = await Promise.all(
    users.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 10) }))
  );

  const data = {
    products,
    settings,
    users: usersHashed,
    reservations,
    loyalty: [],
    "push-subscriptions": [],
  };

  for (const [key, value] of Object.entries(data)) {
    await pool.query(
      "INSERT INTO kv_store (key, value) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [key, JSON.stringify(value)]
    );
  }

  // JSON locales (contraseñas en claro, igual que el seed original)
  fs.mkdirSync(DATA_DIR, { recursive: true });
  for (const [key, value] of Object.entries({ ...data, users })) {
    fs.writeFileSync(
      path.join(DATA_DIR, `${key}.json`),
      JSON.stringify(value, null, 2) + "\n"
    );
  }

  console.log("--- Estado final ---");
  const res = await pool.query("SELECT key, value FROM kv_store ORDER BY key");
  for (const row of res.rows) {
    console.log(
      `${row.key}: ${Array.isArray(row.value) ? row.value.length + " filas" : "objeto"}`
    );
  }

  await pool.end();
  console.log("Datos restaurados a los valores por defecto.");
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
