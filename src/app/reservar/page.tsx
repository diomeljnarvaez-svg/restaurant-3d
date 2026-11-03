"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useTranslations } from "@/lib/i18n";
import { useMounted } from "@/lib/use-mounted";
import type { SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/types";

export default function ReservarPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const mounted = useMounted();
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setDone(true);
    else { const data = await res.json(); setError(data.error || t("reservations.error")); }
    setSending(false);
  };

  if (!mounted) return null;
  const { primaryColor, pageBg, cardBg, textPrimary, textSecondary, footerBg } = settings;

  if (!settings.reservationsEnabled) {
    return (
      <div style={{ backgroundColor: pageBg, color: textPrimary, minHeight: "100vh" }}>
        <Header siteName={settings.siteName} primaryColor={primaryColor} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl mb-4" style={{ color: textPrimary }}>{t("reservations.disabledTitle")}</h1>
            <p style={{ color: textSecondary }}>{t("reservations.disabledMsg")}</p>
          </div>
        </div>
        <Footer siteName={settings.siteName} primaryColor={primaryColor} footerBg={footerBg} textPrimary={textPrimary} textSecondary={textSecondary} address={settings.address} phone={settings.phone} email={settings.email} businessHours={settings.businessHours} facebook={settings.facebook} instagram={settings.instagram} twitter={settings.twitter} />
        <WhatsAppButton number={settings.whatsappNumber} message={settings.whatsappMessage} primaryColor={primaryColor} />
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ backgroundColor: pageBg, color: textPrimary, minHeight: "100vh" }}>
        <Header siteName={settings.siteName} primaryColor={primaryColor} />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#10B98122" }}>
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4" style={{ color: textPrimary }}>{t("reservations.successTitle")}</h1>
            <p className="mb-2" style={{ color: textSecondary }}>{t("reservations.successMsg")}</p>
            <p className="text-sm mb-8" style={{ color: textSecondary }}>{t("reservations.successSub")}</p>
            <button onClick={() => router.push("/")} className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
              {t("reservations.backHome")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: pageBg, color: textPrimary, minHeight: "100vh" }}>
      <Header siteName={settings.siteName} primaryColor={primaryColor} />
      <div className="pt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: primaryColor }}>{t("reservations.label")}</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: textPrimary }}>{t("reservations.title")}</h1>
            <p style={{ color: textSecondary }}>{settings.reservationNotice}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 rounded-2xl border space-y-5" style={{ backgroundColor: cardBg, borderColor: "rgba(255,255,255,0.1)" }}>
            {error && <div className="text-sm px-4 py-3 rounded-lg border" style={{ backgroundColor: "#EF444422", color: "#EF4444", borderColor: "#EF444444" }}>{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>{t("reservations.name")}</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2" style={{ backgroundColor: pageBg, borderColor: "rgba(255,255,255,0.1)", color: textPrimary }} placeholder={t("reservations.namePlaceholder")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>{t("reservations.email")}</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2" style={{ backgroundColor: pageBg, borderColor: "rgba(255,255,255,0.1)", color: textPrimary }} placeholder="tu@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>{t("reservations.phone")}</label>
              <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2" style={{ backgroundColor: pageBg, borderColor: "rgba(255,255,255,0.1)", color: textPrimary }} placeholder="+1 234 567 890" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>{t("reservations.date")}</label>
                <input type="date" required min={today} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2" style={{ backgroundColor: pageBg, borderColor: "rgba(255,255,255,0.1)", color: textPrimary }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>{t("reservations.time")}</label>
                <input type="time" required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2" style={{ backgroundColor: pageBg, borderColor: "rgba(255,255,255,0.1)", color: textPrimary }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>{t("reservations.guests")}</label>
                <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2" style={{ backgroundColor: pageBg, borderColor: "rgba(255,255,255,0.1)", color: textPrimary }}>
                  {Array.from({ length: settings.maxGuestsPerReservation }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? t("reservations.person") : t("reservations.persons")}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>{t("reservations.notes")}</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2" style={{ backgroundColor: pageBg, borderColor: "rgba(255,255,255,0.1)", color: textPrimary }} placeholder={t("reservations.notesPlaceholder")} />
            </div>

            <button type="submit" disabled={sending} className="w-full py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer" style={{ backgroundColor: primaryColor, color: "#fff" }}>
              {sending ? t("reservations.sending") : t("reservations.submit")}
            </button>

            <p className="text-center text-xs" style={{ color: textSecondary }}>{t("reservations.confirmMsg")}</p>
          </form>

          <div className="mt-8 text-center">
            <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(settings.whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm transition-colors" style={{ color: textSecondary }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              {t("contact.whatsappDirect")}
            </a>
          </div>
        </div>
      </div>
      <Footer siteName={settings.siteName} primaryColor={primaryColor} footerBg={footerBg} textPrimary={textPrimary} textSecondary={textSecondary} address={settings.address} phone={settings.phone} email={settings.email} businessHours={settings.businessHours} facebook={settings.facebook} instagram={settings.instagram} twitter={settings.twitter} />
      <WhatsAppButton number={settings.whatsappNumber} message={settings.whatsappMessage} primaryColor={primaryColor} />
    </div>
  );
}
