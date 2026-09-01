import { auth } from "@/lib/auth";
import { adminEmails, env, isAuthConfigured } from "@/lib/config";
import { NextResponse } from "next/server";

export type AdminActor = { email: string };

export async function requireAdminActor(): Promise<
  { ok: true; actor: AdminActor } | { ok: false; response: NextResponse }
> {
  const allowlist = adminEmails();

  if (isAuthConfigured) {
    const session = await auth();
    const email = session?.user?.email?.toLowerCase();
    if (!email) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Sign in required" }, { status: 401 }),
      };
    }
    if (allowlist.length === 0 || !allowlist.includes(email)) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Admin allowlist does not include this account" },
          { status: 403 },
        ),
      };
    }
    return { ok: true, actor: { email } };
  }

  if (env.NODE_ENV === "production") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Admin authentication is required" }, { status: 401 }),
    };
  }

  const session = await auth().catch(() => null);
  const email = session?.user?.email?.toLowerCase() ?? "dev-local";
  return { ok: true, actor: { email } };
}
