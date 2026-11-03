"use client";

import { useEffect, useRef } from "react";

export default function SplashScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Permite previsualizar la pantalla de carga con ?splash=1
    if (new URLSearchParams(window.location.search).get("splash") === "1") return;

    let hidden = false;
    const hide = () => {
      if (hidden) return;
      hidden = true;
      el.classList.add("is-hidden");
    };

    const minTimer = window.setTimeout(hide, 1400);
    const onLoad = () => window.setTimeout(hide, 250);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      window.clearTimeout(minTimer);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div id="app-splash" ref={ref} className="app-splash" aria-hidden="true">
      <div className="app-splash-inner">
        <div className="app-splash-flag-wrap">
          <svg
            className="app-splash-flag"
            viewBox="0 0 300 180"
            role="img"
            aria-label="Bandera de Costa Rica"
          >
            <rect width="300" height="180" fill="#002B7F" />
            <rect y="30" width="300" height="120" fill="#FFFFFF" />
            <rect y="60" width="300" height="60" fill="#CE1126" />
            <rect
              className="app-splash-shine"
              x="-120"
              y="0"
              width="80"
              height="180"
              fill="rgba(255,255,255,0.45)"
              transform="skewX(-20)"
            />
          </svg>
        </div>
        <p className="app-splash-name">Donde Papá Restaurant</p>
        <p className="app-splash-sub">Cargando experiencia...</p>
        <div className="app-splash-bar">
          <span />
        </div>
      </div>
    </div>
  );
}
