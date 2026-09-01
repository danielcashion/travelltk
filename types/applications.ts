/**
 * Creator onboarding applications.
 *
 * Instagram ownership is proven via Instagram Login (OAuth). TikTok is stored
 * unverified until Login Kit is implemented — see docs/creator-verification.md.
 */

export type InstagramAccountType = "BUSINESS" | "MEDIA_CREATOR" | "PERSONAL" | string;

export type InstagramVerificationStatus =
  | "unverified"
  | "verified"
  | "handle_mismatch"
  | "rejected_follower_threshold"
  | "personal_account"
  | "auth_failed"
  | "manually_verified";

export type CreatorApplicationStatus =
  | "draft"
  | "pending_review"
  | "flagged_handle_mismatch"
  | "rejected_follower_threshold"
  | "rejected"
  | "approved";

export interface ApplicationAuditEntry {
  at: string;
  actor: string;
  action: string;
  reason?: string;
}

export interface ManualVerification {
  verifiedBy: string;
  verifiedAt: string;
  reason: string;
}

export interface CreatorApplication {
  id: string;
  name: string;
  email: string;
  claimedInstagramHandle: string;
  /** Stored without a leading @. Unverified until TikTok Login Kit. */
  tiktokHandle: string | null;
  /**
   * TODO: TikTok Login Kit OAuth is not implemented yet. Always false.
   * Reviewers check the handle against a screenshot or bio-link code
   * (see docs/creator-verification.md).
   */
  tiktokVerified: false;
  youtube: string | null;
  selfReportedFollowers: number | null;
  sampleLinks: string | null;
  instagramUserId: string | null;
  instagramUsername: string | null;
  followersCount: number | null;
  instagramAccountType: InstagramAccountType | null;
  instagramVerifiedAt: string | null;
  /** AES-256-GCM ciphertext. Never returned to the client. */
  instagramAccessTokenEncrypted: string | null;
  instagramTokenExpiresAt: string | null;
  instagramVerificationStatus: InstagramVerificationStatus;
  status: CreatorApplicationStatus;
  publicMessage: string | null;
  manualVerification: ManualVerification | null;
  auditLog: ApplicationAuditEntry[];
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
}

/** Safe for browser / admin UI — token omitted. */
export type PublicCreatorApplication = Omit<
  CreatorApplication,
  "instagramAccessTokenEncrypted"
>;

export interface InstagramMeProfile {
  id?: string;
  username?: string;
  followers_count?: number;
  account_type?: string;
}
