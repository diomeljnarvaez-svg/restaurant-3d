"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MapLinks from "@/components/MapLinks";
import { useTranslations } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/types";

export default function ContactPage() {
  const { t } = useTranslations();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  if (!mounted) return null;
  const { primaryColor, pageBg, cardBg, textPrimary, textSecondary, footerBg } = settings;

  return (
    <div style={{ backgroundColor: pageBg, color: textPrimary, minHeight: "100vh" }}>
      <Header siteName={settings.siteName} primaryColor={primaryColor} />
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: primaryColor }}>{t("contact.label")}</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: textPrimary }}>{t("contact.title")}</h1>
            <p className="max-w-xl mx-auto" style={{ color: textSecondary }}>{t("contact.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[
                { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", label: t("contact.address"), value: settings.address },
                { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: t("contact.phone"), value: settings.phone },
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: t("contact.email"), value: settings.email },
                { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: t("contact.hours"), value: settings.businessHours },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor + "20" }}>
                    <svg className="w-5 h-5" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: textSecondary }}>{item.label}</p>
                    <p className="font-medium" style={{ color: textPrimary }}>{item.value}</p>
                  </div>
                </div>
              ))}
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(settings.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                {t("contact.whatsapp")}
              </a>
              <div className="pt-4">
                <MapLinks address={settings.address} />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border h-[450px]" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095919367!2d-73.98569768459377!3d40.748569979327764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b30e4c9f%3A0x5c0f3b1b7b0b0b0!2sEmpire%20State%20Building!5e0!3m2!1ses!2s!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación"
              />
            </div>
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
