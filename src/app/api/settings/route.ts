import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { defaultSettings } from "@/lib/types";

export async function GET() {
  const settings = getSettings("settings");
  return NextResponse.json(settings || defaultSettings);
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    saveSettings("settings", body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 });
  }
}
