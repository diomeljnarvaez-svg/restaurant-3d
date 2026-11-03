import { NextResponse } from "next/server";
import { getAll } from "@/lib/db";
import { guard, SUPERADMIN_ROLES } from "@/lib/api-auth";
import type { User } from "@/lib/types";

export async function GET() {
  const auth = await guard(SUPERADMIN_ROLES);
  if (!auth.ok) return auth.response;

  const users = await getAll<User>("users");
  const safe = users.map(({ password: _password, ...u }) => u);
  return NextResponse.json(safe);
}
