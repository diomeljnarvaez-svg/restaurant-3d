import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import SchemaScript from "@/components/SchemaScript";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ChatBot from "@/components/ChatBot";
import { getSettings } from "@/lib/db";
import type { SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  let raw;
  try { raw = getSettings("settings"); } catch { raw = null; }
  const s: SiteSettings = raw ? { ...defaultSettings, ...raw } : defaultSettings;
  return {
    title: s.siteName,
    description: s.siteDescription,
    openGraph: {
      title: s.siteName,
      description: s.siteDescription,
      type: "website",
      locale: "es_ES",
      siteName: s.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: s.siteName,
      description: s.siteDescription,
    },
    robots: "index, follow",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  let raw;
  try { raw = getSettings("settings"); } catch { raw = null; }
  const s: SiteSettings = raw ? { ...defaultSettings, ...raw } : defaultSettings;

  return (
    <html>
      <head>
        <meta name="theme-color" content={s.primaryColor} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icon-192.svg" />
      </head>
      <body className="antialiased">
        <SchemaScript settings={s} />
        <ServiceWorkerRegister />
        <Providers>
          {children}
          <PWAInstallPrompt />
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
