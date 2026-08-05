"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n";

export default function PWAInstallPrompt() {
  const { t } = useTranslations();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const res = await deferredPrompt.userChoice;
    if (res.outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 max-w-xs bg-gray-900 border border-white/10 rounded-2xl p-4 shadow-xl">
      <p className="text-sm text-white font-medium mb-2">{t("pwa.title")}</p>
      <p className="text-xs text-gray-400 mb-3">{t("pwa.desc")}</p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
          style={{ backgroundColor: "#8B5CF6" }}
        >
          {t("pwa.install")}
        </button>
        <button
          onClick={() => setShow(false)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:bg-white/5"
        >
          {t("pwa.later")}
        </button>
      </div>
    </div>
  );
}
