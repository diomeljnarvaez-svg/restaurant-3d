"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/use-mounted";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const mounted = useMounted();

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts).catch(() => {});
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleAvailable = async (id: string, available: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !available }),
    });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  if (!mounted) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Productos</h1>
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: "#8B5CF6" }}
        >
          + Nuevo Producto
        </Link>
      </div>
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Producto</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Categoría</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Precio</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Destacado</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Disponible</th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/10 flex items-center justify-center">
                        {p.image ? (
                          <Image src={p.image} alt={p.name} width={40} height={40} unoptimized className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-semibold text-purple-300">{p.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{p.category}</td>
                  <td className="py-4 px-6 text-white">{formatPrice(p.price)}</td>
                  <td className="py-4 px-6">
                    {p.featured ? <span className="text-yellow-400">★</span> : <span className="text-gray-600">☆</span>}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleAvailable(p.id, p.available)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${
                        p.available ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {p.available ? "Disponible" : "No disponible"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
