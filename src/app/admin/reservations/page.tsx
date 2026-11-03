"use client";

import { useEffect, useState } from "react";
import type { Reservation } from "@/lib/types";
import { useMounted } from "@/lib/use-mounted";

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const mounted = useMounted();

  useEffect(() => {
    fetch("/api/reservations").then(r => r.json()).then(setReservations).catch(() => {});
  }, []);

  const updateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    await fetch(`/api/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta reservación?")) return;
    await fetch(`/api/reservations/${id}`, { method: "DELETE" });
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  if (!mounted) return null;

  const pending = reservations.filter(r => r.status === "pending");
  const confirmed = reservations.filter(r => r.status === "confirmed");
  const cancelled = reservations.filter(r => r.status === "cancelled");

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Reservaciones</h1>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-3xl font-bold text-yellow-400">{pending.length}</p>
          <p className="text-sm text-gray-400 mt-1">Pendientes</p>
        </div>
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-3xl font-bold text-green-400">{confirmed.length}</p>
          <p className="text-sm text-gray-400 mt-1">Confirmadas</p>
        </div>
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-3xl font-bold text-gray-400">{cancelled.length}</p>
          <p className="text-sm text-gray-400 mt-1">Canceladas</p>
        </div>
      </div>

      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-yellow-400 mb-4">⏳ Pendientes</h2>
          <div className="space-y-4">
            {pending.map(r => <ReservationCard key={r.id} reservation={r} onStatus={updateStatus} onDelete={handleDelete} />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          {confirmed.length > 0 ? "✓ Confirmadas" : "Historial"}
        </h2>
        <div className="space-y-4">
          {[...confirmed, ...cancelled].map(r => <ReservationCard key={r.id} reservation={r} onStatus={updateStatus} onDelete={handleDelete} />)}
          {confirmed.length === 0 && cancelled.length === 0 && (
            <p className="text-gray-500 text-center py-10">No hay reservaciones.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function ReservationCard({
  reservation: r,
  onStatus,
  onDelete,
}: {
  reservation: Reservation;
  onStatus: (id: string, status: "confirmed" | "cancelled") => void;
  onDelete: (id: string) => void;
}) {
  const statusColors: Record<string, string> = {
    pending: "border-yellow-500/30 bg-yellow-500/5",
    confirmed: "border-green-500/30 bg-green-500/5",
    cancelled: "border-red-500/30 bg-red-500/5",
  };

  return (
    <div className={`p-6 rounded-2xl border ${statusColors[r.status]}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-semibold text-lg">{r.name}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              r.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
              r.status === "confirmed" ? "bg-green-500/10 text-green-400" :
              "bg-red-500/10 text-red-400"
            }`}>
              {r.status === "pending" ? "Pendiente" : r.status === "confirmed" ? "Confirmada" : "Cancelada"}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Fecha</span>
              <p className="text-white">{new Date(r.date).toLocaleDateString("es-ES")}</p>
            </div>
            <div>
              <span className="text-gray-500">Hora</span>
              <p className="text-white">{r.time}</p>
            </div>
            <div>
              <span className="text-gray-500">Personas</span>
              <p className="text-white">{r.guests}</p>
            </div>
            <div>
              <span className="text-gray-500">Contacto</span>
              <p className="text-white">{r.phone}</p>
              <p className="text-gray-400 text-xs">{r.email}</p>
            </div>
          </div>
          {r.notes && <p className="text-gray-400 text-sm mt-2 italic">&quot;{r.notes}&quot;</p>}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {r.status === "pending" && (
            <>
              <button onClick={() => onStatus(r.id, "confirmed")} className="px-4 py-2 rounded-xl text-sm font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all cursor-pointer">
                Confirmar
              </button>
              <button onClick={() => onStatus(r.id, "cancelled")} className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer">
                Cancelar
              </button>
            </>
          )}
          {r.status !== "pending" && (
            <button onClick={() => onDelete(r.id)} className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer">
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
