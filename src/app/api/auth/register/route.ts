import { NextResponse } from "next/server";
import { getAll, create } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { User } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    const users = await getAll<User>("users");
    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }

    const validRoles = ["superadmin", "admin", "editor", "user"];
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: validRoles.includes(role) ? role : "user",
      createdAt: new Date().toISOString(),
    };

    await create("users", newUser);
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
