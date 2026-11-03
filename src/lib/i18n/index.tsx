"use client";

import { createContext, useContext, useCallback, useSyncExternalStore, type ReactNode } from "react";
import es from "./es.json";
import en from "./en.json";

type Lang = "es" | "en";
type Dict = typeof es;

const dicts: Record<Lang, Dict> = { es, en };

export { dicts };
export type { Lang, Dict };

function getNested(obj: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : path;
}

const listeners = new Set<() => void>();

function emitLang() {
  listeners.forEach((listener) => listener());
}

function subscribeLang(callback: () => void) {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === "lang") callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getLangSnapshot(): Lang {
  return localStorage.getItem("lang") === "en" ? "en" : "es";
}

function getServerLangSnapshot(): Lang {
  return "es";
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
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getServerLangSnapshot);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem("lang", l);
    emitLang();
  }, []);

  const t = useCallback((path: string) => getNested(dicts[lang], path), [lang]);

  const tc = useCallback(
    (category: string) => (dicts[lang]?.categories as Record<string, string> | undefined)?.[category] ?? category,
    [lang]
  );

  return (
    <Ctx.Provider value={{ lang, setLang, t, tc }}>
      <div lang={lang}>{children}</div>
    </Ctx.Provider>
  );
}

export function useTranslations() {
  return useContext(Ctx);
}
