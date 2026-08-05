"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import ImageLightbox from "@/components/ImageLightbox";
import ProductImage from "@/components/ProductImage";
import { detectDietaryBadges } from "@/lib/dietary";
import { formatPrice } from "@/lib/format";
import { useTranslations } from "@/lib/i18n";
import type { Product, SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/types";

export default function MenuDetailPage() {
  const { t, tc } = useTranslations();
  const params = useParams();
  const slug = params.slug as string;
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {});
    fetch("/api/products").then(r => r.json()).then((products: Product[]) => {
      const found = products.find(p => p.slug === slug);
      setProduct(found || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (!mounted || loading) return null;
  const { primaryColor, pageBg, cardBg, textPrimary, textSecondary, footerBg } = settings;

  if (!product) {
    return (
      <div style={{ backgroundColor: pageBg, color: textPrimary, minHeight: "100vh" }}>
        <Header siteName={settings.siteName} primaryColor={primaryColor} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl mb-4" style={{ color: textPrimary }}>{t("menu.productNotFound")}</h1>
            <Link href="/menu" className="font-medium" style={{ color: primaryColor }}>{t("menu.backToMenu")}</Link>
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
          <Link href="/menu" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: textSecondary }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("menu.backToMenu")}
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              {product.image ? (
                <ImageLightbox src={product.image} alt={product.name} primaryColor={primaryColor} />
              ) : (
                <ProductImage product={product} primaryColor={primaryColor} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <p className="text-sm font-medium tracking-widest uppercase" style={{ color: primaryColor }}>{tc(product.category)}</p>
                {detectDietaryBadges(product.name, product.description).map(badge => (
                  <span key={badge.label} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: badge.color + "22", color: badge.color }}>
                    {t(`dietary.${badge.label}`)}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: textPrimary }}>{product.name}</h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color: textSecondary }}>{product.description}</p>
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-bold" style={{ color: primaryColor }}>{formatPrice(product.price)}</span>
              </div>

              {/* QR Code */}
              <div className="mt-8 text-center">
                <p className="text-sm mb-2" style={{ color: textSecondary }}>{t("menu.share")}</p>
                <div className="flex justify-center">
                  {mounted && <QRCodeDisplay url={typeof window !== "undefined" ? window.location.href : ""} size={80} />}
                </div>
              </div>

              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(t("menu.orderMsg").replace("{name}", product.name))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-xl font-semibold text-lg text-center transition-all hover:scale-105"
                style={{ backgroundColor: primaryColor, color: "#fff" }}
              >
                {t("menu.orderBy")}
              </a>
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
