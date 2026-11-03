import { NextResponse } from "next/server";
import { getById, update, remove } from "@/lib/db";
import { guard, STAFF_ROLES } from "@/lib/api-auth";
import type { Product } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getById<Product>("products", id);
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guard(STAFF_ROLES);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json();
  const updated = await update<Product>("products", id, body);
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guard(STAFF_ROLES);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const ok = await remove<Product>("products", id);
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ success: true });
}
