import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://localhost:3000";
  const text = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;
  return new NextResponse(text, {
    headers: { "Content-Type": "text/plain" },
  });
}
