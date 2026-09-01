import { NextResponse } from "next/server";
import {
  createCreatorApplication,
  getCreatorApplication,
  markSubmitted,
  toPublicApplication,
  updateCreatorApplicationDraft,
} from "@/lib/creator-applications-store";
import { normalizeHandle } from "@/lib/instagram-verification";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  const application = getCreatorApplication(id);
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  return NextResponse.json({ application: toPublicApplication(application) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const name = asString(record.name);
  const email = asString(record.email);
  const instagram = asString(record.instagram);
  const tiktok = asString(record.tiktok);
  const submit = record.submit === true;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }
  if (!instagram && !tiktok) {
    return NextResponse.json(
      { error: "Add an Instagram handle or a TikTok handle" },
      { status: 400 },
    );
  }

  const draft = {
    name,
    email,
    instagram,
    tiktok,
    youtube: asString(record.youtube),
    followers: record.followers as string | number | undefined,
    sample: asString(record.sample),
  };

  const existingId = asString(record.id);
  let application = existingId
    ? updateCreatorApplicationDraft(existingId, draft)
    : createCreatorApplication(draft);

  if (!application) {
    application = createCreatorApplication(draft);
  }

  if (submit) {
    const igOk =
      application.instagramVerificationStatus === "verified" ||
      application.instagramVerificationStatus === "manually_verified" ||
      application.instagramVerificationStatus === "handle_mismatch";
    const tiktokOk = Boolean(application.tiktokHandle || normalizeHandle(tiktok));
    if (!igOk && !tiktokOk) {
      return NextResponse.json(
        {
          error:
            "Connect Instagram to verify, or add a TikTok handle so we can review manually.",
          application: toPublicApplication(application),
        },
        { status: 400 },
      );
    }
    application = markSubmitted(application.id) ?? application;
  }

  return NextResponse.json({
    ok: true,
    id: application.id,
    application: toPublicApplication(application),
  });
}
