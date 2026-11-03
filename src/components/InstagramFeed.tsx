"use client";

import { useTranslations } from "@/lib/i18n";
import Image from "next/image";

const mockPosts = [
  { id: "1", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80", likes: 245 },
  { id: "2", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", likes: 189 },
  { id: "3", image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&q=80", likes: 312 },
  { id: "4", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80", likes: 156 },
  { id: "5", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80", likes: 278 },
  { id: "6", image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&q=80", likes: 203 },
];

interface Props {
  primaryColor: string;
  pageBg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
}

export default function InstagramFeed({ primaryColor, pageBg, textPrimary, textSecondary }: Props) {
  const { t } = useTranslations();

  return (
    <section className="py-24" style={{ backgroundColor: pageBg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: primaryColor }}>Instagram</p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: textPrimary }}>@savory</h2>
          <p className="max-w-xl mx-auto" style={{ color: textSecondary }}>{t("instagram.follow")}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mockPosts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden border"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <Image src={post.image} alt={t(`instagram.caption${post.id}`)} width={400} height={400} unoptimized className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-xs font-semibold">{post.likes}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{ backgroundColor: primaryColor, color: "#fff" }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            {t("instagram.button")}
          </a>
        </div>
      </div>
    </section>
  );
}
