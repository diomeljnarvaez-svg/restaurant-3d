import type { SiteSettings } from "@/lib/types";

export default function SchemaScript({ settings }: { settings: SiteSettings }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.siteName,
    description: settings.siteDescription,
    url: process.env.NEXT_PUBLIC_URL || "https://localhost:3000",
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Ciudad",
      addressCountry: "CR",
    },
    openingHours: settings.businessHours,
    servesCuisine: "Internacional",
    priceRange: "₡1.400 - ₡15.000",
    image: settings.logo || undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
