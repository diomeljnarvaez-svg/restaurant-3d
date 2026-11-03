import { NextResponse } from "next/server";
import { getAll } from "@/lib/db";
import type { User } from "@/lib/types";

export async function GET() {
  const users = await getAll<User>("users");
  const safe = users.map(({ password, ...u }) => u);
  return NextResponse.json(safe);
}
