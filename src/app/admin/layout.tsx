"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import type { SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/types";

const allowedRoles = ["superadmin", "admin", "editor"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
    }
  }, [mounted, status, router]);

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 mx-auto" />
          <div className="h-4 w-32 bg-white/10 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const user = session?.user as any;
  if (!allowedRoles.includes(user?.role)) {
    router.push("/");
    return null;
  }

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  if (!isAdmin && (pathname.startsWith("/admin/settings") || pathname.startsWith("/admin/loyalty"))) {
    router.push("/admin");
    return null;
  }
  if (pathname.startsWith("/admin/users") && user?.role !== "superadmin") {
    router.push("/admin");
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar
        siteName={settings.siteName}
        primaryColor={settings.primaryColor}
        userRole={user?.role || ""}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/90 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-white truncate">
            {user?.role === "superadmin" ? "Super Admin" : user?.role === "editor" ? "Editor" : "Admin"}
          </span>
        </div>
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
