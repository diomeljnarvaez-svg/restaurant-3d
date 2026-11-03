"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n";
import { useMounted } from "@/lib/use-mounted";

export default function PushSubscribe() {
  const { t } = useTranslations();
  const mounted = useMounted();
  const [subscribed, setSubscribed] = useState(false);
  const supported = mounted && "serviceWorker" in navigator && "PushManager" in window;

  const subscribe = async () => {
    if (!supported) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BEl62iUYgUvd8XqBUJmS4GpQfGQwYQYFTPJlYQoYQYFTPJlYQoYQYFTPJlYQoYQYFTPJlYQoYQYFTPJlYQoYQY"),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setSubscribed(true);
    } catch {
      // permission denied or error
    }
  };

  const unsubscribe = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
      }
      setSubscribed(false);
    } catch {}
  };

  useEffect(() => {
    (async () => {
      if (!supported) return;
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setSubscribed(!!sub);
      } catch {}
    })();
  }, [supported]);

  if (!mounted || !supported) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={subscribed ? unsubscribe : subscribe}
        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
          subscribed
            ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
        }`}
      >
        {subscribed ? t("push.on") : t("push.off")}
      </button>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
