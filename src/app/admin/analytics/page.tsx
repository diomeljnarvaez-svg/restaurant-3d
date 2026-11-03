"use client";

import { useEffect, useState } from "react";
import type { Product, Reservation } from "@/lib/types";
import { useMounted } from "@/lib/use-mounted";

function SimpleBar({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t transition-all duration-500"
            style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, minHeight: d.value > 0 ? 4 : 0 }}
          />
          <span className="text-[10px] text-gray-500 text-center truncate w-full">{d.label}</span>
          <span className="text-xs font-semibold text-white">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalytics() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const mounted = useMounted();

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/reservations").then(r => r.json()),
    ]).then(([p, r]) => {
      setProducts(p);
      setReservations(r);
    }).catch(() => {});
  }, []);

  if (!mounted) return null;

  // Category distribution
  const catMap = new Map<string, number>();
  products.forEach(p => catMap.set(p.category, (catMap.get(p.category) || 0) + 1));
  const categoryData = Array.from(catMap.entries()).map(([label, value]) => ({ label, value }));

  // Reservation status
  const pending = reservations.filter(r => r.status === "pending").length;
  const confirmed = reservations.filter(r => r.status === "confirmed").length;
  const cancelled = reservations.filter(r => r.status === "cancelled").length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-3xl font-bold text-white">{products.length}</p>
          <p className="text-sm text-gray-400 mt-1">Total Productos</p>
        </div>
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-3xl font-bold text-green-400">{products.filter(p => p.available).length}</p>
          <p className="text-sm text-gray-400 mt-1">Disponibles</p>
        </div>
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-3xl font-bold text-yellow-400">{pending}</p>
          <p className="text-sm text-gray-400 mt-1">Reservas Pendientes</p>
        </div>
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-3xl font-bold text-blue-400">{confirmed}</p>
          <p className="text-sm text-gray-400 mt-1">Reservas Confirmadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories bar chart */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-6">Productos por Categoría</h2>
          {categoryData.length > 0 ? (
            <SimpleBar data={categoryData} color="#8B5CF6" />
          ) : (
            <p className="text-gray-500 text-center py-10">Sin datos</p>
          )}
        </div>

        {/* Reservation status */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-6">Estado de Reservas</h2>
          <div className="space-y-4">
            {[
              { label: "Confirmadas", value: confirmed, color: "#10B981" },
              { label: "Pendientes", value: pending, color: "#F59E0B" },
              { label: "Canceladas", value: cancelled, color: "#EF4444" },
            ].map(item => {
              const total = confirmed + pending + cancelled || 1;
              const pct = Math.round((item.value / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-white font-medium">{item.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured vs Regular */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-6">Productos Destacados</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-3xl font-bold text-yellow-400">{products.filter(p => p.featured).length}</p>
              <p className="text-sm text-gray-400 mt-1">Destacados</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-3xl font-bold text-white">{products.filter(p => !p.featured).length}</p>
              <p className="text-sm text-gray-400 mt-1">Regulares</p>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-lg font-semibold text-white mb-6">Disponibilidad</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-3xl font-bold text-green-400">{products.filter(p => p.available).length}</p>
              <p className="text-sm text-gray-400 mt-1">Disponibles</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-3xl font-bold text-red-400">{products.filter(p => !p.available).length}</p>
              <p className="text-sm text-gray-400 mt-1">No disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
