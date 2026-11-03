"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Hero3D from "@/components/Hero3D";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InstagramFeed from "@/components/InstagramFeed";
import PushSubscribe from "@/components/PushSubscribe";
import ProductImage from "@/components/ProductImage";
import { useTranslations, dicts } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/use-mounted";
import type { Product, SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/types";

export default function HomePage() {
  const { t, lang } = useTranslations();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const mounted = useMounted();

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {});
    fetch("/api/products").then(r => r.json()).then((p: Product[]) => setProducts(p.filter(x => x.featured))).catch(() => {});
  }, []);

  if (!mounted) return null;

  const { primaryColor, secondaryColor, heroBg, pageBg, cardBg, textPrimary, textSecondary } = settings;

  return (
    <div style={{ backgroundColor: pageBg, color: textPrimary }}>
      <Header siteName={settings.siteName} primaryColor={primaryColor} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: heroBg }}>
        <Hero3D primaryColor={primaryColor} secondaryColor={secondaryColor} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{ backgroundColor: primaryColor + "20", color: primaryColor, border: `1px solid ${primaryColor}44` }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
              {t("hero.badge")}
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight mb-6 tracking-tight" style={{ color: textPrimary }}>
              {settings.heroTitle || t("hero.heroTitle")}
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: textSecondary }}>
              {settings.heroSubtitle || t("hero.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: primaryColor, color: "#fff" }}
              >
                {t("hero.viewMenu")}
              </Link>
              <Link
                href="/reservar"
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
                style={{ border: `2px solid ${primaryColor}44`, color: textPrimary }}
              >
                {t("hero.bookTable")}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6" style={{ color: textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* FEATURED MENU */}
      <section className="py-24" style={{ backgroundColor: pageBg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: primaryColor }}>{t("featuredMenu.label")}</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: textPrimary }}>{t("featuredMenu.title")}</h2>
            <p className="max-w-xl mx-auto" style={{ color: textSecondary }}>{t("featuredMenu.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <Link
                key={product.id}
                href={`/menu/${product.slug}`}
                className="group relative rounded-2xl overflow-hidden border transition-all duration-500 hover:border-white/20"
                style={{ backgroundColor: cardBg, borderColor: "rgba(255,255,255,0.1)", animation: mounted ? `fadeInUp 0.6s ease-out ${i * 0.1}s both` : "none" }}
              >
                <ProductImage product={product} primaryColor={primaryColor} className="transition-transform duration-700 group-hover:scale-110" />
                <div className="p-5">
                  <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: primaryColor }}>{product.category}</p>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: textPrimary }}>{product.name}</h3>
                  <p className="text-2xl font-bold" style={{ color: primaryColor }}>{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
              style={{ backgroundColor: primaryColor, color: "#fff" }}
            >
              {t("featuredMenu.viewFull")}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: cardBg }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primaryColor}08, ${secondaryColor}08)` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: primaryColor }}>{t("aboutPreview.label")}</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: textPrimary }}>{settings.aboutTitle || t("aboutPreview.title")}</h2>
              <p className="leading-relaxed text-lg mb-8" style={{ color: textSecondary }}>{settings.aboutContent}</p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-semibold transition-colors"
                style={{ color: primaryColor }}
              >
                {t("aboutPreview.cta")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                  alt="Restaurante"
                  width={800}
                  height={800}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="text-center text-white">
                  <p className="text-3xl font-bold">10+</p>
                  <p className="text-xs">{t("aboutPreview.years")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24" style={{ backgroundColor: pageBg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: primaryColor }}>{t("testimonials.label")}</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: textPrimary }}>{t("testimonials.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => {
              const item = dicts[lang].testimonials.items[i] ?? { name: "", text: "", role: "" };
              return (
              <div
                key={i}
                className="p-8 rounded-2xl border"
                style={{ backgroundColor: cardBg, borderColor: "rgba(255,255,255,0.1)", animation: mounted ? `fadeInUp 0.6s ease-out ${i * 0.15}s both` : "none" }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="w-5 h-5" fill={primaryColor} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 leading-relaxed" style={{ color: textSecondary }}>&quot;{item.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: primaryColor + "33", color: textPrimary }}>
                    {item.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: textPrimary }}>{item.name}</p>
                    <p className="text-xs" style={{ color: textSecondary }}>{item.role}</p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <InstagramFeed primaryColor={primaryColor} pageBg={pageBg} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} />

      {/* CTA */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: cardBg }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15)` }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: textPrimary }}>{t("cta.title")}</h2>
          <p className="text-lg mb-10" style={{ color: textSecondary }}>{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link
              href="/reservar"
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
              style={{ backgroundColor: primaryColor, color: "#fff" }}
            >
              {t("cta.bookNow")}
            </Link>
            <Link
              href="/menu"
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
              style={{ border: `2px solid ${primaryColor}44`, color: textPrimary }}
            >
              {t("cta.exploreMenu")}
            </Link>
          </div>
          <PushSubscribe />
        </div>
      </section>

      <Footer
        siteName={settings.siteName}
        primaryColor={primaryColor}
        footerBg={settings.footerBg}
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
