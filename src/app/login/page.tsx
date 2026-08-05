"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

function LoginForm() {
  const { t } = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    if (result?.error) { setError(t("login.invalid")); return; }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t("login.title")}</h1>
          <p className="text-gray-400">{t("login.subtitle")}</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
          {error && <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-lg border border-red-500/20">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="admin@restaurant.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("login.password")}</label>
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: "#8B5CF6" }}>{t("login.button")}</button>
          <p className="text-center text-xs text-gray-500">{t("login.demo")}</p>
        </form>
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">← {t("login.back")}</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-pulse h-8 w-32 bg-white/10 rounded" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
