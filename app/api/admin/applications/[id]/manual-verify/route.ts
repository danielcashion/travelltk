import { NextResponse } from "next/server";
import { requireAdminActor } from "@/lib/admin-auth";
import {
  getCreatorApplication,
  saveCreatorApplication,
  toPublicApplication,
} from "@/lib/creator-applications-store";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminActor();
  if (!gate.ok) return gate.response;

  const { id } = await context.params;
  const application = getCreatorApplication(id);
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const reason =
    body && typeof body === "object" && typeof (body as { reason?: unknown }).reason === "string"
      ? (body as { reason: string }).reason.trim()
      : "";
  if (reason.length < 8) {
    return NextResponse.json(
      { error: "Add a reason (at least 8 characters) for the audit log" },
      { status: 400 },
    );
  }

  const iso = new Date().toISOString();
  const next = saveCreatorApplication({
    ...application,
    instagramVerificationStatus: "manually_verified",
    instagramVerifiedAt: iso,
    status:
      application.status === "rejected_follower_threshold" ||
      application.status === "draft" ||
      application.status === "flagged_handle_mismatch"
        ? "pending_review"
        : application.status,
    publicMessage: `Manually verified by ${gate.actor.email}.`,
    manualVerification: {
      verifiedBy: gate.actor.email,
      verifiedAt: iso,
      reason,
    },
    updatedAt: iso,
    auditLog: [
      ...application.auditLog,
      {
        at: iso,
        actor: gate.actor.email,
        action: "manual_instagram_verify",
        reason,
      },
    ],
  });

  return NextResponse.json({ application: toPublicApplication(next) });
}
