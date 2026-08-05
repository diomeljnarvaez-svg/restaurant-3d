"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface Props {
  url: string;
  size?: number;
  label?: string;
  downloadable?: boolean;
  downloadLabel?: string;
}

export default function QRCodeDisplay({ url, size = 96, label, downloadable = false, downloadLabel = "Descargar QR" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 1,
        color: { dark: "#ffffff", light: "#00000000" },
      });
    }
  }, [url, size]);

  const handleDownload = () => {
    const offscreen = document.createElement("canvas");
    QRCode.toCanvas(offscreen, url, {
      width: 1024,
      margin: 4,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(() => {
      const link = document.createElement("a");
      link.href = offscreen.toDataURL("image/png");
      link.download = "menu-qr.png";
      link.click();
    });
  };

  if (!mounted) return null;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <canvas ref={canvasRef} className="rounded-lg" />
      {label && <span className="text-[10px] text-gray-500">{label}</span>}
      {downloadable && (
        <button
          onClick={handleDownload}
          className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          {downloadLabel}
        </button>
      )}
    </div>
  );
}
