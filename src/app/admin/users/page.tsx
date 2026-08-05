"use client";

import { useEffect, useState } from "react";
import type { User, UserRole } from "@/lib/types";

const roleLabels: Record<UserRole, string> = {
  superadmin: "Super Admin",
  admin: "Administrador",
  editor: "Editor",
  user: "Usuario",
};

const roleColors: Record<UserRole, string> = {
  superadmin: "text-purple-400 bg-purple-500/10",
  admin: "text-indigo-400 bg-indigo-500/10",
  editor: "text-blue-400 bg-blue-500/10",
  user: "text-gray-400 bg-gray-500/10",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "editor" as UserRole });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchUsers = () => {
    fetch("/api/users").then(r => r.json()).then(setUsers).catch(() => {});
  };

  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updates: any = { name: form.name, email: form.email, role: form.role };
      if (form.password) updates.password = form.password;
      await fetch(`/api/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } else {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    fetchUsers();
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", email: "", password: "", role: "editor" });
  };

  const handleEdit = async (id: string) => {
    const res = await fetch(`/api/users/${id}`);
    const user = await res.json();
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  if (!mounted) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Usuarios</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", email: "", password: "", role: "editor" }); }}
          className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "#8B5CF6" }}
        >
          + Nuevo Usuario
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">{editingId ? "Editar Usuario" : "Nuevo Usuario"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{editingId ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña"}</label>
                <input type="password" required={!editingId} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Rol</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as UserRole })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                  <option value="user">Usuario</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white text-sm bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer">
                  {editingId ? "Guardar" : "Crear"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2.5 rounded-xl font-semibold text-gray-400 text-sm bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {users.map(u => (
          <div key={u.id} className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                {u.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium">{u.name}</p>
                <p className="text-gray-400 text-sm">{u.email}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role]}`}>
                {roleLabels[u.role]}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(u.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                Editar
              </button>
              <button onClick={() => handleDelete(u.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
