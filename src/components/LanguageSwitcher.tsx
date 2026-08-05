"use client";

import { useTranslations } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslations();

  return (
    <button
      onClick={() => setLang(lang === "es" ? "en" : "es")}
      className="text-xs font-medium px-2 py-1 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
      title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      {lang === "es" ? "EN" : "ES"}
    </button>
  );
}
