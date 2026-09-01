import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { normalizeHandle } from "@/lib/instagram-verification";
import type {
  ApplicationAuditEntry,
  CreatorApplication,
  PublicCreatorApplication,
} from "@/types/applications";

const STORE_PATH = join(process.cwd(), ".data", "creator-applications.json");

type GlobalStore = {
  __travelltkCreatorApplications?: Map<string, CreatorApplication>;
};

function persistEnabled(): boolean {
  return process.env.NODE_ENV !== "test";
}

function loadFromDisk(): Map<string, CreatorApplication> {
  try {
    const raw = readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as CreatorApplication[];
    return new Map(parsed.map((row) => [row.id, row]));
  } catch {
    return new Map();
  }
}

function getMap(): Map<string, CreatorApplication> {
  const g = globalThis as GlobalStore;
  if (!g.__travelltkCreatorApplications) {
    g.__travelltkCreatorApplications = persistEnabled() ? loadFromDisk() : new Map();
  }
  return g.__travelltkCreatorApplications;
}

function persist(map: Map<string, CreatorApplication>): void {
  if (!persistEnabled()) return;
  mkdirSync(dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify([...map.values()], null, 2), "utf8");
}

export function toPublicApplication(
  application: CreatorApplication,
): PublicCreatorApplication {
  const { instagramAccessTokenEncrypted: _token, ...rest } = application;
  void _token;
  return rest;
}

export interface CreatorApplicationDraftInput {
  name: string;
  email: string;
  instagram: string;
  tiktok?: string;
  youtube?: string;
  followers?: string | number;
  sample?: string;
}

function parseFollowers(value: string | number | undefined): number | null {
  if (value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function createCreatorApplication(
  input: CreatorApplicationDraftInput,
  now = new Date(),
): CreatorApplication {
  const iso = now.toISOString();
  const tiktok = input.tiktok ? normalizeHandle(input.tiktok) : null;
  const application: CreatorApplication = {
    id: `capp-${randomUUID()}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    claimedInstagramHandle: normalizeHandle(input.instagram),
    tiktokHandle: tiktok || null,
    tiktokVerified: false,
    youtube: input.youtube?.trim() || null,
    selfReportedFollowers: parseFollowers(input.followers),
    sampleLinks: input.sample?.trim() || null,
    instagramUserId: null,
    instagramUsername: null,
    followersCount: null,
    instagramAccountType: null,
    instagramVerifiedAt: null,
    instagramAccessTokenEncrypted: null,
    instagramTokenExpiresAt: null,
    instagramVerificationStatus: "unverified",
    status: "draft",
    publicMessage: null,
    manualVerification: null,
    auditLog: [
      {
        at: iso,
        actor: input.email.trim().toLowerCase(),
        action: "created",
      },
    ],
    createdAt: iso,
    updatedAt: iso,
    submittedAt: null,
  };
  const map = getMap();
  map.set(application.id, application);
  persist(map);
  return application;
}

export function getCreatorApplication(id: string): CreatorApplication | null {
  return getMap().get(id) ?? null;
}

export function listCreatorApplications(): CreatorApplication[] {
  return [...getMap().values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function saveCreatorApplication(application: CreatorApplication): CreatorApplication {
  const map = getMap();
  map.set(application.id, application);
  persist(map);
  return application;
}

export function updateCreatorApplicationDraft(
  id: string,
  input: CreatorApplicationDraftInput,
  now = new Date(),
): CreatorApplication | null {
  const existing = getCreatorApplication(id);
  if (!existing) return null;
  const iso = now.toISOString();
  const tiktok = input.tiktok ? normalizeHandle(input.tiktok) : null;
  const next: CreatorApplication = {
    ...existing,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    claimedInstagramHandle: normalizeHandle(input.instagram),
    tiktokHandle: tiktok || null,
    tiktokVerified: false,
    youtube: input.youtube?.trim() || null,
    selfReportedFollowers: parseFollowers(input.followers),
    sampleLinks: input.sample?.trim() || null,
    updatedAt: iso,
  };
  return saveCreatorApplication(next);
}

export function appendAudit(
  application: CreatorApplication,
  entry: ApplicationAuditEntry,
): CreatorApplication {
  return saveCreatorApplication({
    ...application,
    updatedAt: entry.at,
    auditLog: [...application.auditLog, entry],
  });
}

export function markSubmitted(
  id: string,
  now = new Date(),
): CreatorApplication | null {
  const existing = getCreatorApplication(id);
  if (!existing) return null;
  const iso = now.toISOString();
  const canQueue =
    existing.instagramVerificationStatus === "verified" ||
    existing.instagramVerificationStatus === "manually_verified" ||
    existing.instagramVerificationStatus === "handle_mismatch" ||
    Boolean(existing.tiktokHandle);

  let status = existing.status;
  if (canQueue && existing.status === "draft") {
    status = "pending_review";
  }

  return saveCreatorApplication({
    ...existing,
    status,
    submittedAt: iso,
    updatedAt: iso,
    auditLog: [
      ...existing.auditLog,
      {
        at: iso,
        actor: existing.email,
        action: "submitted",
        reason: canQueue
          ? "Application submitted for review"
          : "Submitted without Instagram verification or TikTok handle",
      },
    ],
  });
}

export function resetStoreForTests(): void {
  const g = globalThis as GlobalStore;
  g.__travelltkCreatorApplications = new Map();
}
