export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  available: boolean;
  createdAt: string;
}

export type UserRole = "superadmin" | "admin" | "editor" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface LoyaltyEntry {
  email: string;
  name: string;
  points: number;
  totalVisits: number;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  heroBg: string;
  pageBg: string;
  cardBg: string;
  footerBg: string;
  textPrimary: string;
  textSecondary: string;
  whatsappNumber: string;
  whatsappMessage: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutContent: string;
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  facebook: string;
  instagram: string;
  twitter: string;
  reservationsEnabled: boolean;
  maxGuestsPerReservation: number;
  reservationNotice: string;
}

export const defaultSettings: SiteSettings = {
  siteName: "Donde Papá Restaurant",
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

export type SafeUser = Omit<User, "password">;
