import { describe, expect, it } from "vitest";
import { decrypt } from "@/lib/crypto";
import {
  applyInstagramVerification,
  evaluateInstagramProfile,
  personalAccountMessage,
} from "@/lib/instagram-verification";
import type { CreatorApplication } from "@/types/applications";

const KEY = "c".repeat(64);
const MIN = 400_000;

function draft(claimed = "claimedhandle"): CreatorApplication {
  const iso = "2026-09-01T14:00:00.000Z";
  return {
    id: "capp-test",
    name: "Test Creator",
    email: "creator@example.com",
    claimedInstagramHandle: claimed,
    tiktokHandle: null,
    tiktokVerified: false,
    youtube: null,
    selfReportedFollowers: 500_000,
    sampleLinks: "https://instagram.com/p/example",
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
    auditLog: [],
    createdAt: iso,
    updatedAt: iso,
    submittedAt: null,
  };
}

describe("evaluateInstagramProfile", () => {
  it("rejects a personal account that does not expose followers_count", () => {
    const outcome = evaluateInstagramProfile({
      claimedHandle: "star",
      profile: { id: "1", username: "star", account_type: "PERSONAL" },
      minFollowerCount: MIN,
    });
    expect(outcome.kind).toBe("personal_account");
    expect(outcome.message).toBe(personalAccountMessage());
  });

  it("rejects BUSINESS accounts that omit followers_count", () => {
    const outcome = evaluateInstagramProfile({
      claimedHandle: "star",
      profile: { id: "1", username: "star", account_type: "BUSINESS" },
      minFollowerCount: MIN,
    });
    expect(outcome.kind).toBe("personal_account");
    expect(outcome.message).toBe(personalAccountMessage());
  });

  it("flags a handle mismatch for review instead of auto-approving", () => {
    const outcome = evaluateInstagramProfile({
      claimedHandle: "the-real-one",
      profile: {
        id: "9",
        username: "otherbrand",
        followers_count: 900_000,
        account_type: "MEDIA_CREATOR",
      },
      minFollowerCount: MIN,
    });
    expect(outcome.kind).toBe("handle_mismatch");
    expect(outcome.instagramUsername).toBe("otherbrand");
  });

  it("rejects follower counts below the threshold", () => {
    const outcome = evaluateInstagramProfile({
      claimedHandle: "almost",
      profile: {
        id: "2",
        username: "almost",
        followers_count: 399_999,
        account_type: "BUSINESS",
      },
      minFollowerCount: MIN,
    });
    expect(outcome.kind).toBe("below_threshold");
    expect(outcome.followersCount).toBe(399_999);
  });

  it("accepts follower counts at or above the threshold", () => {
    const outcome = evaluateInstagramProfile({
      claimedHandle: "@Almost",
      profile: {
        id: "3",
        username: "almost",
        followers_count: 400_000,
        account_type: "BUSINESS",
      },
      minFollowerCount: MIN,
    });
    expect(outcome.kind).toBe("verified");
  });
});

describe("applyInstagramVerification", () => {
  it("persists encrypted tokens on success, never plaintext", () => {
    const token = "IGQW-refreshable-long-lived";
    const { application, outcome } = applyInstagramVerification({
      application: draft("almost"),
      profile: {
        id: "3",
        username: "almost",
        followers_count: 512_000,
        account_type: "BUSINESS",
      },
      longLivedToken: token,
      expiresInSeconds: 5184000,
      minFollowerCount: MIN,
      encryptionKey: KEY,
      now: new Date("2026-09-01T14:00:00.000Z"),
    });
    expect(outcome.kind).toBe("verified");
    expect(application.status).toBe("pending_review");
    expect(application.instagramVerificationStatus).toBe("verified");
    expect(application.instagramVerifiedAt).toBe("2026-09-01T14:00:00.000Z");
    expect(application.instagramAccessTokenEncrypted).toBeTruthy();
    expect(application.instagramAccessTokenEncrypted).not.toContain(token);
    expect(decrypt(application.instagramAccessTokenEncrypted!, KEY)).toBe(token);
  });

  it("sets rejected_follower_threshold below the minimum", () => {
    const { application } = applyInstagramVerification({
      application: draft("almost"),
      profile: {
        id: "2",
        username: "almost",
        followers_count: 1000,
        account_type: "MEDIA_CREATOR",
      },
      longLivedToken: "token",
      expiresInSeconds: 100,
      minFollowerCount: MIN,
      encryptionKey: KEY,
    });
    expect(application.status).toBe("rejected_follower_threshold");
    expect(application.instagramVerificationStatus).toBe("rejected_follower_threshold");
  });

  it("flags handle mismatch without auto-approving", () => {
    const { application } = applyInstagramVerification({
      application: draft("claimedhandle"),
      profile: {
        id: "9",
        username: "wrongone",
        followers_count: 900_000,
        account_type: "BUSINESS",
      },
      longLivedToken: "token",
      expiresInSeconds: 100,
      minFollowerCount: MIN,
      encryptionKey: KEY,
    });
    expect(application.status).toBe("flagged_handle_mismatch");
    expect(application.instagramVerificationStatus).toBe("handle_mismatch");
    expect(application.instagramVerifiedAt).toBeNull();
  });
});
