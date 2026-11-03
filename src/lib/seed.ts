import fs from "fs";
import path from "path";
import type { Product, User, Reservation } from "./types";
import { defaultSettings } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function writeJSON(name: string, data: unknown) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

const products: Product[] = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, "products.json"), "utf-8")
);

const users: User[] = [
  {
    id: "admin-1",
    name: "Super Admin",
    email: "admin@restaurant.com",
    password: "admin123",
    role: "superadmin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "admin-2",
    name: "Admin Editor",
    email: "editor@restaurant.com",
    password: "editor123",
    role: "editor",
    createdAt: new Date().toISOString(),
  },
];

const reservations: Reservation[] = [
  {
    id: "res-1",
    name: "María García",
    email: "maria@email.com",
    phone: "555-0101",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "20:00",
    guests: 4,
    notes: "Mesa cerca de la ventana, por favor.",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-2",
    name: "Carlos López",
    email: "carlos@email.com",
    phone: "555-0102",
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    time: "21:30",
    guests: 2,
    notes: "Celebración de aniversario.",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-3",
    name: "Ana Martínez",
    email: "ana@email.com",
    phone: "555-0103",
    date: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    time: "19:00",
    guests: 6,
    notes: "",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

export function seed() {
  writeJSON("products", products);
  writeJSON("users", users);
  writeJSON("reservations", reservations);
  writeJSON("settings", defaultSettings);
  console.log("Datos seed creados correctamente.");
}

if (require.main === module) {
  seed();
}
