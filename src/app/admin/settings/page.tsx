"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/types";
import QRCodeDisplay from "@/components/QRCodeDisplay";

const colorOptions = [
  { label: "Púrpura", value: "#8B5CF6" },
  { label: "Rojo", value: "#EF4444" },
  { label: "Naranja", value: "#F97316" },
  { label: "Verde", value: "#10B981" },
  { label: "Azul", value: "#3B82F6" },
  { label: "Rosa", value: "#EC4899" },
  { label: "Amarillo", value: "#EAB308" },
  { label: "Turquesa", value: "#14B8A6" },
  { label: "Negro", value: "#000000" },
  { label: "Blanco", value: "#FFFFFF" },
  { label: "Gris Oscuro", value: "#0a0a0a" },
  { label: "Gris", value: "#1a1a2e" },
  { label: "Azul Noche", value: "#0f0f23" },
  { label: "Gris Claro", value: "#f3f4f6" },
];

const colorAreas = [
  { key: "primaryColor", label: "Color Principal", desc: "Botones, acentos, enlaces" },
  { key: "secondaryColor", label: "Color Secundario", desc: "Acentos secundarios, detalles decorativos" },
  { key: "heroBg", label: "Fondo del Hero", desc: "Sección principal de bienvenida" },
  { key: "pageBg", label: "Fondo de Página", desc: "Color de fondo general" },
  { key: "cardBg", label: "Fondo de Tarjetas", desc: "Cards, contenedores, secciones" },
  { key: "footerBg", label: "Fondo del Footer", desc: "Pie de página" },
  { key: "textPrimary", label: "Texto Principal", desc: "Títulos y texto principal" },
  { key: "textSecondary", label: "Texto Secundario", desc: "Subtítulos, descripciones" },
] as const;

export default function AdminSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>({ ...defaultSettings, address: "", phone: "", email: "", businessHours: "", whatsappNumber: "", whatsappMessage: "", facebook: "", instagram: "", twitter: "", googleMapsUrl: "", wazeUrl: "", mapEmbedUrl: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch {
      setError("No se pudo guardar la configuración. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Configuración</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: settings.primaryColor }}
        >
          {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar Cambios"}
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-400" role="alert">{error}</p>
      )}

      <div className="space-y-8">
        {/* Site Identity */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-4">Identidad del Sitio</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre del sitio</label>
                <input value={settings.siteName} onChange={e => update("siteName", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                <input value={settings.siteDescription} onChange={e => update("siteDescription", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Logo del sitio</label>
              <div className="flex items-center gap-4">
                {settings.logo ? (
                  <div className="relative w-20 h-20 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex-shrink-0">
                    <Image src={settings.logo} alt="Logo" width={80} height={80} unoptimized className="w-full h-full object-contain" />
                    <button
                      onClick={() => update("logo", "")}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                      title="Eliminar logo"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <label className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                  {settings.logo ? "Cambiar logo" : "Subir logo"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const dataUrl = ev.target?.result as string;
                        update("logo", dataUrl);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">PNG, JPG, WebP o SVG. Máximo 500 KB.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Paleta de Colores</h2>
            <button
              onClick={() => {
                const colorKeys: (keyof SiteSettings)[] = ["primaryColor","secondaryColor","heroBg","pageBg","cardBg","footerBg","textPrimary","textSecondary"];
                setSettings(prev => {
                  const next = { ...prev };
                  colorKeys.forEach(k => Object.assign(next, { [k]: defaultSettings[k] }));
                  return next;
                });
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Restablecer todos
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-6">Personaliza cada área del sitio con el color que prefieras.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {colorAreas.map((area) => (
              <div key={area.key}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{area.label}</label>
                <p className="text-xs text-gray-500 mb-2">{area.desc}</p>
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {colorOptions.map(c => (
                    <button
                      key={c.value}
                      onClick={() => update(area.key, c.value)}
                      className={`w-7 h-7 rounded-full transition-all ${settings[area.key] === c.value ? "ring-2 ring-white ring-offset-1 ring-offset-black scale-110" : "hover:scale-110"}`}
                      style={{ backgroundColor: c.value, border: c.value === "#FFFFFF" || c.value === "#f3f4f6" ? "1px solid rgba(255,255,255,0.2)" : "none" }}
                      title={c.label}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings[area.key] || ""}
                    onChange={e => update(area.key, e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded text-white outline-none"
                    placeholder="#000000"
                  />
                  <div
                    className="w-6 h-6 rounded flex-shrink-0 border border-white/10"
                    style={{ backgroundColor: settings[area.key] || "#000" }}
                  />
                  <button
                    onClick={() => update(area.key, defaultSettings[area.key])}
                    className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:text-white hover:bg-white/10 transition-all text-sm"
                    title="Restablecer color predeterminado"
                  >
                    ↺
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl border border-white/10" style={{ backgroundColor: settings.cardBg }}>
            <p className="text-sm font-medium" style={{ color: settings.textPrimary }}>Vista previa</p>
            <p className="text-xs mt-1" style={{ color: settings.textSecondary }}>Así se verán los textos y fondos combinados.</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: settings.primaryColor }}>Botón Primario</span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: settings.secondaryColor + "22", color: settings.secondaryColor }}>Acento</span>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-4">Sección Hero</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Título</label>
              <input value={settings.heroTitle} onChange={e => update("heroTitle", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Subtítulo</label>
              <input value={settings.heroSubtitle} onChange={e => update("heroSubtitle", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </section>

        {/* About */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-4">Sección Nosotros</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Título</label>
              <input value={settings.aboutTitle} onChange={e => update("aboutTitle", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contenido</label>
              <textarea value={settings.aboutContent} onChange={e => update("aboutContent", e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Imagen de la sección</label>
              <div className="flex items-center gap-4">
                {settings.aboutImage ? (
                  <div className="relative w-32 h-20 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex-shrink-0">
                    <Image src={settings.aboutImage} alt="Nosotros" width={128} height={80} unoptimized className="w-full h-full object-cover" />
                    <button onClick={() => update("aboutImage", "")} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600" title="Eliminar imagen">×</button>
                  </div>
                ) : (
                  <div className="w-32 h-20 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <label className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                  {settings.aboutImage ? "Cambiar imagen" : "Subir imagen"}
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => update("aboutImage", ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }} className="hidden" />
                </label>
                <p className="text-xs text-gray-500">PNG, JPG, WebP o SVG.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Misión</label>
              <textarea value={settings.aboutMission} onChange={e => update("aboutMission", e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Texto de la misión" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Visión</label>
              <textarea value={settings.aboutVision} onChange={e => update("aboutVision", e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Texto de la visión" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Valores</label>
              <textarea value={settings.aboutValues} onChange={e => update("aboutValues", e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Texto de los valores" />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-4">Información de Contacto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Dirección</label>
              <input value={settings.address} onChange={e => update("address", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
              <input value={settings.phone} onChange={e => update("phone", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input value={settings.email} onChange={e => update("email", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Horario</label>
              <input value={settings.businessHours} onChange={e => update("businessHours", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </section>

        {/* Maps */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-4">Mapas y Navegación</h2>
          <p className="text-sm text-gray-400 mb-4">Configura los enlaces de Google Maps y Waze para la página de contacto. Si los dejas vacíos, se generan automáticamente a partir de la dirección.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL de Google Maps (direcciones o embed)</label>
              <input value={settings.googleMapsUrl} onChange={e => update("googleMapsUrl", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://www.google.com/maps/..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL de Waze</label>
              <input value={settings.wazeUrl} onChange={e => update("wazeUrl", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://www.waze.com/ul?..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL de embed del mapa (iframe)</label>
              <input value={settings.mapEmbedUrl} onChange={e => update("mapEmbedUrl", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
          </div>
        </section>

        {/* WhatsApp */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-4">WhatsApp</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Número (código de país + número, ej: 1234567890)</label>
              <input value={settings.whatsappNumber} onChange={e => update("whatsappNumber", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Mensaje predeterminado</label>
              <input value={settings.whatsappMessage} onChange={e => update("whatsappMessage", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-4">Redes Sociales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Facebook</label>
              <input value={settings.facebook} onChange={e => update("facebook", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Instagram</label>
              <input value={settings.instagram} onChange={e => update("instagram", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Twitter / X</label>
              <input value={settings.twitter} onChange={e => update("twitter", e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </section>

        {/* Reservations */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-4">Reservaciones</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.reservationsEnabled}
                onChange={e => update("reservationsEnabled", e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm text-gray-300">Habilitar reservaciones en línea</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Máximo de personas por reserva</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={settings.maxGuestsPerReservation}
                  onChange={e => update("maxGuestsPerReservation", parseInt(e.target.value) || 10)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Aviso para reservaciones</label>
              <input
                value={settings.reservationNotice}
                onChange={e => update("reservationNotice", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* QR Menu */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-4">Código QR para Mesas</h2>
          <p className="text-sm text-gray-400 mb-4">Imprime este código y colócalo en las mesas para que los clientes accedan al menú digital.</p>
          <div className="flex flex-col items-center gap-4">
            <QRCodeDisplay url={typeof window !== "undefined" ? window.location.origin + "/menu" : ""} size={160} label="Menú Digital" downloadable />
          </div>
        </section>
      </div>
    </div>
  );
}
