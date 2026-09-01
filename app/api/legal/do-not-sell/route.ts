import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  // TODO: write to DynamoDB suppression list via api-client (Phase 7).
  console.info("[placeholder] CCPA/CPRA opt-out", body);
  return NextResponse.json({ ok: true });
}
