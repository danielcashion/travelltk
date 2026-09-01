import { NextResponse } from "next/server";
import { upsertUser } from "@/lib/users";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.email !== "string" ||
    typeof body.cognitoSub !== "string"
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const record = await upsertUser({
    email: body.email,
    name: typeof body.name === "string" ? body.name : body.email,
    avatarUrl: typeof body.avatarUrl === "string" ? body.avatarUrl : null,
    cognitoSub: body.cognitoSub,
  });

  return NextResponse.json(record);
}
