import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSettings, saveSettings } from "@/lib/db";
import { defaultSettings } from "@/lib/types";

export async function GET() {
  const settings = await getSettings("settings");
  return NextResponse.json(settings || defaultSettings);
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await saveSettings("settings", body);
    // El layout y las páginas públicas usan la configuración en el servidor:
    // invalidamos la caché para que el nuevo nombre/colores se vean al instante.
    revalidatePath("/", "layout");
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 });
  }
}
