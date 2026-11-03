"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Reservation } from "@/lib/types";

interface Props {
  siteName: string;
  primaryColor: string;
  userRole: string;
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ siteName, primaryColor, userRole, open, onClose }: Props) {
  const path = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetch("/api/reservations")
      .then(r => r.json())
      .then((res: Reservation[]) => setPendingCount(res.filter((r) => r.status === "pending").length))
      .catch(() => {});
  }, []);

  const isSuper = userRole === "superadmin";
  const isAdmin = isSuper || userRole === "admin";

  type SidebarLink = { href: string; label: string; icon: string; badge?: number };

  const links: SidebarLink[] = [
    { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/admin/analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { href: "/admin/products", label: "Productos", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { href: "/admin/reservations", label: "Reservaciones", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", badge: pendingCount },
  ];

  if (isAdmin) {
    links.push(
      { href: "/admin/loyalty", label: "Fidelidad", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
      { href: "/admin/settings", label: "Configuración", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }
    );
  }

  if (isSuper) {
    links.push({ href: "/admin/users", label: "Usuarios", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-10">
        <Link href="/" className="text-xl font-bold" style={{ color: primaryColor }}>{siteName}</Link>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white p-1" aria-label="Cerrar menú">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const active = path === link.href || path.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
              </svg>
              <span className="flex-1">{link.label}</span>
              {(link.badge ?? 0) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">{link.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 pt-4 mt-4">
        <p className="text-xs text-gray-500 mb-3 px-4 capitalize">
          {userRole === "superadmin" ? "Super Admin" : userRole === "editor" ? "Editor" : "Admin"}
        </p>
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al sitio
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-black/95 border-r border-white/10 p-6 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-black/90 border-r border-white/10 min-h-screen p-6 flex-col flex-shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}
