import { NextResponse } from "next/server";
import { getAll, create } from "@/lib/db";
import { guard, STAFF_ROLES } from "@/lib/api-auth";
import type { Reservation } from "@/lib/types";

export async function GET() {
  const auth = await guard(STAFF_ROLES);
  if (!auth.ok) return auth.response;

  const reservations = await getAll<Reservation>("reservations");
  return NextResponse.json(reservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, guests, notes } = body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    const reservation: Reservation = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      date,
      time,
      guests: Number(guests),
      notes: notes || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const created = await create("reservations", reservation);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear reservación" }, { status: 500 });
  }
}
