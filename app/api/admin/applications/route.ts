import { NextResponse } from "next/server";
import { requireAdminActor } from "@/lib/admin-auth";
import {
  listCreatorApplications,
  toPublicApplication,
} from "@/lib/creator-applications-store";

export async function GET() {
  const gate = await requireAdminActor();
  if (!gate.ok) return gate.response;
  return NextResponse.json({
    applications: listCreatorApplications().map(toPublicApplication),
  });
}
