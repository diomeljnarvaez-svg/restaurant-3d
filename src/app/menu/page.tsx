"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import ProductImage from "@/components/ProductImage";
import CostaRicaFlag from "@/components/CostaRicaFlag";
import { detectDietaryBadges } from "@/lib/dietary";
import { formatPrice } from "@/lib/format";
import { useTranslations } from "@/lib/i18n";
import { useMounted } from "@/lib/use-mounted";
import type { Product, SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/types";

export default function MenuPage() {
  const { t, tc } = useTranslations();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("Todas");
  const mounted = useMounted();

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {});
    fetch("/api/products").then(r => r.json()).then(setProducts).catch(() => {});
  }, []);

  if (!mounted) return null;
  const { primaryColor, pageBg, cardBg, textPrimary, textSecondary, footerBg } = settings;

  const categories = ["Todas", ...new Set(products.map(p => p.category))];
  const filtered = category === "Todas" ? products : products.filter(p => p.category === category);

  return (
    <div style={{ backgroundColor: pageBg, color: textPrimary, minHeight: "100vh" }}>
      <Header siteName={settings.siteName} primaryColor={primaryColor} />
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: primaryColor }}>{t("menu.label")}</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: textPrimary }}>{t("menu.title")}</h1>
            <p className="max-w-xl mx-auto" style={{ color: textSecondary }}>{t("menu.subtitle")}</p>
            <p className="max-w-xl mx-auto text-xs mt-3" style={{ color: textSecondary }}>{t("menu.taxNote")}</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all`}
                style={category === cat ? { backgroundColor: primaryColor, color: "#fff" } : { color: textSecondary, backgroundColor: "transparent", border: `1px solid rgba(255,255,255,0.1)` }}
              >
                {cat === "Platos Típicos" && <CostaRicaFlag width={18} height={11} className="mr-1.5" />}
                {tc(cat)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="group rounded-2xl overflow-hidden border transition-all duration-500 hover:border-white/20"
                style={{ backgroundColor: cardBg, borderColor: "rgba(255,255,255,0.1)", animation: `fadeInUp 0.5s ease-out ${i * 0.05}s both` }}
              >
                <Link href={`/menu/${product.slug}`}>
                  <ProductImage product={product} primaryColor={primaryColor} className="transition-transform duration-700 group-hover:scale-110" />
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <p className="text-xs font-medium tracking-widest uppercase flex items-center gap-1.5" style={{ color: primaryColor }}>
                      {product.category === "Platos Típicos" && <CostaRicaFlag width={16} height={10} />}
                      {tc(product.category)}
                    </p>
                    {detectDietaryBadges(product.name, product.description).map(badge => (
                      <span key={badge.label} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: badge.color + "22", color: badge.color }}>
                        {t(`dietary.${badge.label}`)}
                      </span>
                    ))}
                  </div>
                  <Link href={`/menu/${product.slug}`}>
                    <h3 className="text-xl font-semibold mb-2 hover:underline" style={{ color: textPrimary }}>{product.name}</h3>
                  </Link>
                  <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: textSecondary }}>{product.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold" style={{ color: primaryColor }}>{formatPrice(product.price)}</p>
                    <button
                      onClick={() => window.open(`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(t("menu.orderMsg").replace("{name}", product.name))}`, "_blank")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{ backgroundColor: primaryColor, color: "#fff" }}
                    >
                      {t("menu.order")}
                    </button>                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p style={{ color: textSecondary }}>{t("menu.noProducts")}</p>
            </div>
          )}

          {/* QR Code for tables */}
          <div className="mt-16 pt-12 border-t border-white/5 text-center">
            <p className="text-sm font-medium mb-4" style={{ color: textSecondary }}>{t("menu.scan")}</p>
            <div className="flex justify-center">
              {mounted && <QRCodeDisplay url={typeof window !== "undefined" ? window.location.origin + "/menu" : ""} size={120} label={t("menu.qrLabel")} downloadable />}
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
