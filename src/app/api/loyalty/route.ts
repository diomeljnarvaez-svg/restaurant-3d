import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { LoyaltyEntry } from "@/lib/types";

const FILE = "loyalty";

export async function GET() {
  const data = (await readData<LoyaltyEntry>(FILE)) || [];
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const data = (await readData<LoyaltyEntry>(FILE)) || [];
    const idx = data.findIndex((e) => e.email === body.email);
    if (idx >= 0) {
      data[idx] = { ...data[idx], ...body };
    } else {
      data.push({ ...body, createdAt: new Date().toISOString() });
    }
    await writeData(FILE, data);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();
    let data = (await readData<LoyaltyEntry>(FILE)) || [];
    data = data.filter((e) => e.email !== email);
    await writeData(FILE, data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
