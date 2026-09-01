import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/config";
import {
  getCreatorApplication,
  saveCreatorApplication,
} from "@/lib/creator-applications-store";
import { applyPageUrl } from "@/lib/instagram-callback-redirect";
import {
  exchangeCodeForLongLivedToken,
  fetchInstagramMe,
} from "@/lib/instagram-oauth";
import { IG_OAUTH_COOKIE, verifyOAuthState } from "@/lib/instagram-oauth-state";
import { applyInstagramVerification } from "@/lib/instagram-verification";
import { getOAuthStateSecret, getTokenEncryptionKey } from "@/lib/token-encryption-key";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Instagram Login Valid OAuth Redirect URI.
 * Register this exact URL in the Meta app (Instagram → API setup):
 *   https://www.travelltk.com/api/instagram/callback
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const jar = await cookies();
  const cookieValue = jar.get(IG_OAUTH_COOKIE)?.value;
  const bound = verifyOAuthState(cookieValue, state, getOAuthStateSecret());

  const redirect = (params: Record<string, string | number | undefined | null>) => {
    const response = NextResponse.redirect(applyPageUrl(url.origin, params));
    response.cookies.set(IG_OAUTH_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  };

  if (!bound) {
    return redirect({ ig: "invalid_state" });
  }

  if (!code) {
    const application = getCreatorApplication(bound.applicationId);
    if (application) {
      saveCreatorApplication({
        ...application,
        instagramVerificationStatus: "auth_failed",
        publicMessage:
          "Instagram authorization was cancelled or did not return a code. You can try connecting again.",
        updatedAt: new Date().toISOString(),
      });
    }
    return redirect({
      applicationId: bound.applicationId,
      ig: "auth_failed",
    });
  }

  const application = getCreatorApplication(bound.applicationId);
  if (!application) {
    return redirect({ ig: "auth_failed" });
  }

  try {
    const { accessToken, expiresIn } = await exchangeCodeForLongLivedToken(code);
    const profile = await fetchInstagramMe(accessToken);
    const { application: next, outcome } = applyInstagramVerification({
      application,
      profile,
      longLivedToken: accessToken,
      expiresInSeconds: expiresIn,
      minFollowerCount: env.MIN_FOLLOWER_COUNT,
      encryptionKey: getTokenEncryptionKey(),
    });
    saveCreatorApplication(next);

    const igParam =
      outcome.kind === "below_threshold" ? "below_threshold" : outcome.kind;

    return redirect({
      applicationId: next.id,
      ig: igParam,
      followers: outcome.followersCount ?? undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Instagram verification failed. Please try again.";
    saveCreatorApplication({
      ...application,
      instagramVerificationStatus: "auth_failed",
      publicMessage: message,
      updatedAt: new Date().toISOString(),
      auditLog: [
        ...application.auditLog,
        {
          at: new Date().toISOString(),
          actor: "system:instagram-oauth",
          action: "instagram_auth_failed",
          reason: message,
        },
      ],
    });
    return redirect({
      applicationId: application.id,
      ig: "auth_failed",
    });
  }
}
