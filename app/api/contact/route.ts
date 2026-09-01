import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // TODO: persist via lib/api-client.ts or SES once the AWS API is live.
  console.info("[placeholder] contact message", body);
  return NextResponse.json({ ok: true });
}
