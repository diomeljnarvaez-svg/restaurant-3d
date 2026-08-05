"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

export default function OfflinePage() {
  const { t } = useTranslations();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{t("offline.title")}</h1>
        <p className="text-gray-400 mb-8">{t("offline.msg")}</p>
        <Link href="/" className="inline-flex px-6 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: "#8B5CF6" }}>
          {t("offline.retry")}
        </Link>
      </div>
    </div>
  );
}
