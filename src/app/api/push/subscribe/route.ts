import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { guard, ADMIN_ROLES } from "@/lib/api-auth";

interface PushSubscriptionRecord {
  endpoint: string;
  keys?: Record<string, string>;
  createdAt?: string;
}

export async function POST(req: Request) {
  try {
    const subscription = (await req.json()) as PushSubscriptionRecord;
    // Una suscripción push siempre trae un endpoint; rechazamos payloads vacíos
    // para no guardar registros basura.
    if (!subscription || typeof subscription.endpoint !== "string" || !subscription.endpoint) {
      return NextResponse.json({ error: "Suscripción inválida" }, { status: 400 });
    }

    const subs = (await readData<PushSubscriptionRecord>("push-subscriptions")) || [];
    const exists = subs.find((s) => s.endpoint === subscription.endpoint);
    if (!exists) {
      subs.push({ ...subscription, createdAt: new Date().toISOString() });
      await writeData("push-subscriptions", subs);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json();
    if (typeof endpoint !== "string" || !endpoint) {
      return NextResponse.json({ error: "Endpoint inválido" }, { status: 400 });
    }

    let subs = (await readData<PushSubscriptionRecord>("push-subscriptions")) || [];
    subs = subs.filter((s) => s.endpoint !== endpoint);
    await writeData("push-subscriptions", subs);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function GET() {
  const auth = await guard(ADMIN_ROLES);
  if (!auth.ok) return auth.response;

  const subs = (await readData<PushSubscriptionRecord>("push-subscriptions")) || [];
  return NextResponse.json({ count: subs.length });
}
