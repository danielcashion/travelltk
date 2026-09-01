import { encrypt, decrypt } from "@/lib/crypto";
import {
  listCreatorApplications,
  saveCreatorApplication,
} from "@/lib/creator-applications-store";
import { refreshLongLivedToken } from "@/lib/instagram-oauth";
import { shouldRefreshInstagramToken } from "@/lib/instagram-verification";
import { getTokenEncryptionKey } from "@/lib/token-encryption-key";

export async function refreshExpiringInstagramTokens(now = new Date()) {
  const key = getTokenEncryptionKey();
  const refreshed: string[] = [];
  const failed: string[] = [];

  for (const application of listCreatorApplications()) {
    if (!application.instagramAccessTokenEncrypted) continue;
    if (!shouldRefreshInstagramToken(application.instagramTokenExpiresAt, now)) {
      continue;
    }
    try {
      const current = decrypt(application.instagramAccessTokenEncrypted, key);
      const { accessToken, expiresIn } = await refreshLongLivedToken(current);
      saveCreatorApplication({
        ...application,
        instagramAccessTokenEncrypted: encrypt(accessToken, key),
        instagramTokenExpiresAt: new Date(
          now.getTime() + expiresIn * 1000,
        ).toISOString(),
        updatedAt: now.toISOString(),
        auditLog: [
          ...application.auditLog,
          {
            at: now.toISOString(),
            actor: "system:instagram-token-refresh",
            action: "instagram_token_refreshed",
          },
        ],
      });
      refreshed.push(application.id);
    } catch {
      failed.push(application.id);
    }
  }

  return { refreshed, failed };
}
