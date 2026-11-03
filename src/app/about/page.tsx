"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useTranslations } from "@/lib/i18n";
import { useMounted } from "@/lib/use-mounted";
import CostaRicaFlag from "@/components/CostaRicaFlag";
import type { SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/types";

export default function AboutPage() {
  const { t } = useTranslations();
  const [settings, setSettings] = useState<SiteSettings>({ ...defaultSettings, aboutTitle: "", aboutContent: "", address: "", phone: "", email: "", businessHours: "", whatsappNumber: "", whatsappMessage: "" });
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => { setSettings(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (!mounted) return null;
  const { primaryColor, pageBg, cardBg, textPrimary, textSecondary, footerBg } = settings;

  if (loading) {
    return (
      <div style={{ backgroundColor: pageBg, color: textPrimary, minHeight: "100vh" }}>
        <Header siteName={settings.siteName || "Donde Papá Restaurant"} primaryColor={primaryColor} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="app-splash-inner">
            <div className="app-splash-flag-wrap">
              <svg className="app-splash-flag" viewBox="0 0 300 180" role="img" aria-label="Bandera de Costa Rica">
                <rect width="300" height="180" fill="#002B7F" />
                <rect y="30" width="300" height="120" fill="#FFFFFF" />
                <rect y="60" width="300" height="60" fill="#CE1126" />
                <rect className="app-splash-shine" x="-120" y="0" width="80" height="180" fill="rgba(255,255,255,0.45)" transform="skewX(-20)" />
              </svg>
            </div>
            <p className="app-splash-name">{settings.siteName || "Donde Papá Restaurant"}</p>
            <p className="app-splash-sub">Cargando experiencia...</p>
            <div className="app-splash-bar">
              <span />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: pageBg, color: textPrimary, minHeight: "100vh" }}>
      <Header siteName={settings.siteName} primaryColor={primaryColor} />
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: primaryColor }}>{t("about.label")}</p>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: textPrimary }}>{settings.aboutTitle}</h1>
              <p className="leading-relaxed text-lg" style={{ color: textSecondary }}>{settings.aboutContent}</p>
            </div>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" alt="Restaurante" width={800} height={400} unoptimized className="w-full h-[400px] object-cover" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              { title: t("about.mission"), desc: t("about.missionDesc") },
              { title: t("about.vision"), desc: t("about.visionDesc") },
              { title: t("about.values"), desc: t("about.valuesDesc") },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl border" style={{ backgroundColor: cardBg, borderColor: "rgba(255,255,255,0.1)" }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: textPrimary }}>{item.title}</h3>
                <p className="leading-relaxed" style={{ color: textSecondary }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer
        siteName={settings.siteName}
        primaryColor={primaryColor}
        footerBg={footerBg}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        address={settings.address}
        phone={settings.phone}
        email={settings.email}
        businessHours={settings.businessHours}
        facebook={settings.facebook}
        instagram={settings.instagram}
        twitter={settings.twitter}
      />
      <WhatsAppButton number={settings.whatsappNumber} message={settings.whatsappMessage} primaryColor={primaryColor} />
    </div>
  );
}
