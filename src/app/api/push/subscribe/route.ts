import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const subs = readData<any>("push-subscriptions") || [];
    const exists = subs.find((s: any) => s.endpoint === subscription.endpoint);
    if (!exists) {
      subs.push({ ...subscription, createdAt: new Date().toISOString() });
      writeData("push-subscriptions", subs);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json();
    let subs = readData<any>("push-subscriptions") || [];
    subs = subs.filter((s: any) => s.endpoint !== endpoint);
    writeData("push-subscriptions", subs);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function GET() {
  const subs = readData<any>("push-subscriptions") || [];
  return NextResponse.json({ count: subs.length });
}
