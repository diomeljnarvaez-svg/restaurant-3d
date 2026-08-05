import { getSettings } from "@/lib/db";
import { defaultSettings } from "@/lib/types";

export async function GET() {
  let settings;
  try { settings = getSettings("settings"); } catch { settings = null; }
  const s = settings || defaultSettings;

  const staticRoutes = [
    "", "/menu", "/about", "/contact", "/reservar", "/login",
  ];

  const urls = staticRoutes.map(
    (route) => `  <url>
    <loc>${process.env.NEXT_PUBLIC_URL || "https://localhost:3000"}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === "" ? "1.0" : "0.8"}</priority>
  </url>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
