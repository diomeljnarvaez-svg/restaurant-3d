"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { defaultSettings } from "@/lib/types";

interface Props {
  siteName: string;
  primaryColor: string;
}

export default function Header({ siteName, primaryColor }: Props) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const { t } = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logo, setLogo] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => setLogo(s.logo || "")).catch(() => {});
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-xl shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt={siteName} className="h-10 w-auto max-w-[180px] object-contain" />
            ) : (
              <span className="text-2xl font-bold tracking-tight" style={{ color: primaryColor }}>
                {siteName}
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">{t("nav.home")}</Link>
            <Link href="/menu" className="text-sm text-gray-300 hover:text-white transition-colors">{t("nav.menu")}</Link>
            <Link href="/reservar" className="text-sm text-gray-300 hover:text-white transition-colors">{t("nav.reservar")}</Link>
            <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">{t("nav.about")}</Link>
            <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">{t("nav.contact")}</Link>
            {["superadmin", "admin", "editor"].includes(user?.role) && (
              <Link href="/admin" className="text-sm text-gray-300 hover:text-white transition-colors">{t("nav.admin")}</Link>
            )}
            <LanguageSwitcher />
            {session ? (
              <button onClick={() => signOut()} className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.logout")}</button>
            ) : (
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.login")}</Link>
            )}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-2" aria-label={t("nav.menu")}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-6 space-y-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">{t("nav.home")}</Link>
            <Link href="/menu" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">{t("nav.menu")}</Link>
            <Link href="/reservar" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">{t("nav.reservar")}</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">{t("nav.about")}</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">{t("nav.contact")}</Link>
            {["superadmin", "admin", "editor"].includes(user?.role) && (
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">{t("nav.admin")}</Link>
            )}
            {session ? (
              <button onClick={() => { setMenuOpen(false); signOut(); }} className="block text-gray-400 py-2">{t("nav.logout")}</button>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-gray-400 py-2">{t("nav.login")}</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
