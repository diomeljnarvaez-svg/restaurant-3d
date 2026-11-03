import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

/** Roles con acceso de escritura al panel, de menor a mayor privilegio. */
export const STAFF_ROLES: UserRole[] = ["editor", "admin", "superadmin"];
export const ADMIN_ROLES: UserRole[] = ["admin", "superadmin"];
export const SUPERADMIN_ROLES: UserRole[] = ["superadmin"];

type GuardResult =
  | { ok: true; session: Session; role: UserRole }
  | { ok: false; response: NextResponse };

/**
 * Verifica que la petición tenga una sesión válida y que el rol del usuario
 * esté entre los permitidos. Devuelve 401 si no hay sesión y 403 si el rol
 * no alcanza.
 */
export async function guard(roles: UserRole[]): Promise<GuardResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "No autenticado" }, { status: 401 }),
    };
  }

  const role = (session.user as { role?: UserRole }).role;
  if (!role || !roles.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Sin permisos" }, { status: 403 }),
    };
  }

  return { ok: true, session, role };
}

/** Indica si el rol recibido es uno de los roles válidos del sistema. */
export function isValidRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    ["superadmin", "admin", "editor", "user"].includes(value)
  );
}
