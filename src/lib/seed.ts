import fs from "fs";
import path from "path";
import type { Product, User, Reservation, SiteSettings } from "./types";
import { defaultSettings } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function writeJSON(name: string, data: any) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

const products: Product[] = [
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
];

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
