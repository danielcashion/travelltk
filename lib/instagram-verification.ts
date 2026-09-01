import { encrypt } from "@/lib/crypto";
import type {
  CreatorApplication,
  InstagramMeProfile,
  InstagramVerificationStatus,
} from "@/types/applications";

export const PROFESSIONAL_ACCOUNT_TYPES = new Set(["BUSINESS", "MEDIA_CREATOR"]);

export type VerificationOutcomeKind =
  | "personal_account"
  | "handle_mismatch"
  | "below_threshold"
  | "verified";

export interface VerificationOutcome {
  kind: VerificationOutcomeKind;
  message: string;
  instagramUserId: string | null;
  instagramUsername: string | null;
  followersCount: number | null;
  accountType: string | null;
}

export function normalizeHandle(raw: string): string {
  let value = raw.trim();
  value = value.replace(/^https?:\/\/(www\.)?(instagram|tiktok)\.com\/@?/i, "");
  value = value.replace(/^@/, "");
  value = (value.split("/")[0] ?? value).split("?")[0] ?? value;
  return value.toLowerCase();
}

export function personalAccountMessage(): string {
  return "Instagram personal accounts do not expose a follower count. Switch this account to a Professional account (Business or Creator) in Instagram settings, then connect again.";
}

export function handleMismatchMessage(claimed: string, actual: string): string {
  return `You claimed @${claimed} but connected @${actual}. This application is flagged for manual review rather than auto-approved — you may manage more than one account.`;
}

export function belowThresholdMessage(count: number, min: number): string {
  return `This Instagram account has ${count.toLocaleString()} followers. TravelLTK currently requires at least ${min.toLocaleString()} followers.`;
}

export function verifiedMessage(count: number): string {
  return `Instagram verified. This account has ${count.toLocaleString()} followers.`;
}

export function evaluateInstagramProfile(input: {
  claimedHandle: string;
  profile: InstagramMeProfile;
  minFollowerCount: number;
}): VerificationOutcome {
  const accountType = (input.profile.account_type ?? "").trim().toUpperCase();
  const username = input.profile.username
    ? normalizeHandle(input.profile.username)
    : null;
  const claimed = normalizeHandle(input.claimedHandle);
  const followersRaw = input.profile.followers_count;
  const followersCount =
    typeof followersRaw === "number" && Number.isFinite(followersRaw)
      ? followersRaw
      : null;

  if (!PROFESSIONAL_ACCOUNT_TYPES.has(accountType) || followersCount === null) {
    return {
      kind: "personal_account",
      message: personalAccountMessage(),
      instagramUserId: input.profile.id ?? null,
      instagramUsername: username,
      followersCount,
      accountType: accountType || null,
    };
  }

  if (!username || username !== claimed) {
    return {
      kind: "handle_mismatch",
      message: handleMismatchMessage(claimed || "(none)", username ?? "(unknown)"),
      instagramUserId: input.profile.id ?? null,
      instagramUsername: username,
      followersCount,
      accountType,
    };
  }

  if (followersCount < input.minFollowerCount) {
    return {
      kind: "below_threshold",
      message: belowThresholdMessage(followersCount, input.minFollowerCount),
      instagramUserId: input.profile.id ?? null,
      instagramUsername: username,
      followersCount,
      accountType,
    };
  }

  return {
    kind: "verified",
    message: verifiedMessage(followersCount),
    instagramUserId: input.profile.id ?? null,
    instagramUsername: username,
    followersCount,
    accountType,
  };
}

function statusForOutcome(
  kind: VerificationOutcomeKind,
): {
  verification: InstagramVerificationStatus;
  applicationStatus: CreatorApplication["status"];
} {
  switch (kind) {
    case "verified":
      return { verification: "verified", applicationStatus: "pending_review" };
    case "handle_mismatch":
      return {
        verification: "handle_mismatch",
        applicationStatus: "flagged_handle_mismatch",
      };
    case "below_threshold":
      return {
        verification: "rejected_follower_threshold",
        applicationStatus: "rejected_follower_threshold",
      };
    case "personal_account":
      return { verification: "personal_account", applicationStatus: "draft" };
  }
}

export function applyInstagramVerification(input: {
  application: CreatorApplication;
  profile: InstagramMeProfile;
  longLivedToken: string;
  expiresInSeconds: number;
  minFollowerCount: number;
  encryptionKey: string;
  now?: Date;
}): { application: CreatorApplication; outcome: VerificationOutcome } {
  const now = input.now ?? new Date();
  const iso = now.toISOString();
  const outcome = evaluateInstagramProfile({
    claimedHandle: input.application.claimedInstagramHandle,
    profile: input.profile,
    minFollowerCount: input.minFollowerCount,
  });
  const { verification, applicationStatus } = statusForOutcome(outcome.kind);

  const storeToken =
    outcome.kind !== "personal_account" && Boolean(input.longLivedToken);
  const encrypted = storeToken
    ? encrypt(input.longLivedToken, input.encryptionKey)
    : null;
  const expiresAt = storeToken
    ? new Date(now.getTime() + input.expiresInSeconds * 1000).toISOString()
    : null;

  const next: CreatorApplication = {
    ...input.application,
    instagramUserId: outcome.instagramUserId,
    instagramUsername: outcome.instagramUsername,
    followersCount: outcome.followersCount,
    instagramAccountType: outcome.accountType,
    instagramVerifiedAt: outcome.kind === "verified" ? iso : null,
    instagramAccessTokenEncrypted: encrypted,
    instagramTokenExpiresAt: expiresAt,
    instagramVerificationStatus: verification,
    status: applicationStatus,
    publicMessage: outcome.message,
    updatedAt: iso,
    auditLog: [
      ...input.application.auditLog,
      {
        at: iso,
        actor: "system:instagram-oauth",
        action: `instagram_${outcome.kind}`,
        reason: outcome.message,
      },
    ],
  };

  return { application: next, outcome };
}

export function shouldRefreshInstagramToken(
  expiresAt: string | null,
  now = new Date(),
  leadMs = 7 * 24 * 60 * 60 * 1000,
): boolean {
  if (!expiresAt) return false;
  const exp = Date.parse(expiresAt);
  if (Number.isNaN(exp)) return false;
  return exp - now.getTime() <= leadMs;
}
