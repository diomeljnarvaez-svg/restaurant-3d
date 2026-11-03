"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [form, setForm] = useState({
    name: "", description: "", price: "", image: "", category: "", slug: "",
    featured: false, available: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then((p: Product) => {
        setForm({
          name: p.name, description: p.description, price: p.price.toString(),
          image: p.image, category: p.category, slug: p.slug,
          featured: p.featured, available: p.available,
        });
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    });
    router.push("/admin/products");
  };

  if (fetching) return <div className="text-gray-400">Cargando...</div>;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">← Volver</Link>
      <h1 className="text-3xl font-bold text-white mb-8">Editar Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {(["name", "slug", "description", "price", "category"] as const).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 capitalize">{field === "slug" ? "URL (slug)" : field}</label>
            {field === "description" ? (
              <textarea required value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            ) : (
              <input type={field === "price" ? "number" : "text"} required value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Imagen del producto</label>
          <div className="flex items-center gap-4">
            {form.image ? (
              <div className="relative w-24 h-24 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex-shrink-0">
                <Image src={form.image} alt="Producto" width={96} height={96} unoptimized className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm({ ...form, image: "" })} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600" title="Eliminar imagen">×</button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="flex-1 space-y-2">
              <label className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all inline-block">
                Subir imagen
                <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => setForm({ ...form, image: ev.target?.result as string });
                  reader.readAsDataURL(file);
                }} className="hidden" />
              </label>
              <p className="text-xs text-gray-500">o ingresa una URL:</p>
              <input type="text" value={form.image.startsWith("data:") ? "" : form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="https://... (opcional)" />
            </div>
          </div>
        </div>

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
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
