import { NextResponse } from "next/server";
import { getById, update, remove } from "@/lib/db";
import { guard, STAFF_ROLES } from "@/lib/api-auth";
import type { Reservation } from "@/lib/types";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guard(STAFF_ROLES);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json();
  const updated = await update<Reservation>("reservations", id, { status: body.status });
  if (!updated) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guard(STAFF_ROLES);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const ok = await remove<Reservation>("reservations", id);
  if (!ok) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json({ success: true });
}
