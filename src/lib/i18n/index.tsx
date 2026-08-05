"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import es from "./es.json";
import en from "./en.json";

type Lang = "es" | "en";
type Dict = typeof es;

const dicts: Record<Lang, Dict> = { es, en };

export { dicts };
export type { Lang, Dict };

function getNested(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? path;
}

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
  tc: (category: string) => string;
}

const Ctx = createContext<I18nCtx>({
  lang: "es",
  setLang: () => {},
  t: (p: string) => p,
  tc: (c: string) => c,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "en" || stored === "es") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  }, []);

  const t = useCallback(
    (path: string) => getNested(dicts[lang], path),
    [lang]
  );

  const tc = useCallback(
    (category: string) => (dicts[lang]?.categories as Record<string, string> | undefined)?.[category] ?? category,
    [lang]
  );

  if (!mounted) {
    return (
      <Ctx.Provider value={{ lang: "es", setLang, t, tc }}>
        {children}
      </Ctx.Provider>
    );
  }

  return (
    <Ctx.Provider value={{ lang, setLang, t, tc }}>
      <div lang={lang}>{children}</div>
    </Ctx.Provider>
  );
}

export function useTranslations() {
  return useContext(Ctx);
}
