"use client";

import { useEffect, useState } from "react";
import type { LoyaltyEntry } from "@/lib/types";
import { useMounted } from "@/lib/use-mounted";

export default function AdminLoyalty() {
  const [entries, setEntries] = useState<LoyaltyEntry[]>([]);
  const mounted = useMounted();
  const [editing, setEditing] = useState<LoyaltyEntry | null>(null);

  const fetchLoyalty = () => {
    fetch("/api/loyalty").then(r => r.json()).then(setEntries).catch(() => {});
  };

  useEffect(() => {
    fetchLoyalty();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await fetch("/api/loyalty", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    fetchLoyalty();
    setEditing(null);
  };

  const handleDelete = async (email: string) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    await fetch("/api/loyalty", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    fetchLoyalty();
  };

  if (!mounted) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Programa de Fidelidad</h1>
        <button
          onClick={() => setEditing({ email: "", name: "", points: 0, totalVisits: 0, createdAt: "" })}
          className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "#8B5CF6" }}
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-3xl font-bold text-white">{entries.length}</p>
          <p className="text-sm text-gray-400 mt-1">Clientes Registrados</p>
        </div>
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-3xl font-bold text-yellow-400">{entries.reduce((a, e) => a + e.points, 0)}</p>
          <p className="text-sm text-gray-400 mt-1">Puntos Totales</p>
        </div>
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-3xl font-bold text-green-400">{entries.reduce((a, e) => a + e.totalVisits, 0)}</p>
          <p className="text-sm text-gray-400 mt-1">Visitas Totales</p>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">{editing.email ? "Editar Cliente" : "Nuevo Cliente"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input required type="email" value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                <input required value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Puntos</label>
                  <input type="number" min={0} value={editing.points} onChange={e => setEditing({ ...editing, points: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Visitas</label>
                  <input type="number" min={0} value={editing.totalVisits} onChange={e => setEditing({ ...editing, totalVisits: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white text-sm bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer">Guardar</button>
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl font-semibold text-gray-400 text-sm bg-white/5 hover:bg-white/10 transition-all cursor-pointer">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Cliente</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Puntos</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Visitas</th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.email} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-white font-medium">{e.name}</p>
                      <p className="text-gray-400 text-xs">{e.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-yellow-400 font-semibold">{e.points} pts</span>
                  </td>
                  <td className="py-4 px-6 text-white">{e.totalVisits}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(e)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">Editar</button>
                      <button onClick={() => handleDelete(e.email)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-500 py-10">Sin clientes registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
