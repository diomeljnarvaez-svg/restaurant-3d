import { NextResponse } from "next/server";
import { getById, update, remove } from "@/lib/db";
import { guard, isValidRole, SUPERADMIN_ROLES } from "@/lib/api-auth";
import bcrypt from "bcryptjs";
import type { User } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guard(SUPERADMIN_ROLES);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const user = await getById<User>("users", id);
  if (!user) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const { password: _, ...safe } = user;
  return NextResponse.json(safe);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guard(SUPERADMIN_ROLES);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json();
  const updates: Partial<User> = {};
  if (body.name) updates.name = body.name;
  if (body.email) updates.email = body.email;
  if (isValidRole(body.role)) updates.role = body.role;
  if (body.password) updates.password = await bcrypt.hash(body.password, 10);
  const updated = await update<User>("users", id, updates);
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const { password: _, ...safe } = updated;
  return NextResponse.json(safe);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guard(SUPERADMIN_ROLES);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const ok = await remove<User>("users", id);
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ success: true });
}
