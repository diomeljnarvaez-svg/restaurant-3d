"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", description: "", price: "", image: "", category: "", slug: "",
    featured: false, available: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-") }),
    });
    if (res.ok) router.push("/admin/products");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">← Volver</Link>
      <h1 className="text-3xl font-bold text-white mb-8">Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {(["name", "slug", "description", "price", "image", "category"] as const).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 capitalize">{field === "slug" ? "URL (slug)" : field}</label>
            {field === "description" ? (
              <textarea required value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            ) : (
              <input type={field === "price" ? "number" : "text"} required={field !== "image"} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder={field === "image" ? "https://... (opcional)" : ""} />
            )}
          </div>
        ))}

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded" />
            Destacado
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} className="rounded" />
            Disponible
          </label>
        </div>

        <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#8B5CF6" }}>
          {loading ? "Guardando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}
