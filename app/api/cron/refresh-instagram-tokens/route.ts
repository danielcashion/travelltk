import { NextResponse } from "next/server";
import { env } from "@/lib/config";
import { refreshExpiringInstagramTokens } from "@/lib/instagram-token-refresh";

function authorized(request: Request): boolean {
  const secret = env.CRON_SECRET;
  if (!secret) return env.NODE_ENV !== "production";
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await refreshExpiringInstagramTokens();
  return NextResponse.json({ ok: true, ...result });
}
