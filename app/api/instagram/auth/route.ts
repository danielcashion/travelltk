import { NextResponse } from "next/server";
import {
  IG_OAUTH_COOKIE,
  IG_OAUTH_TTL_SECONDS,
  createOAuthStateCookie,
} from "@/lib/instagram-oauth-state";
import { instagramAuthorizeUrl } from "@/lib/instagram-oauth";
import { getCreatorApplication } from "@/lib/creator-applications-store";
import { isInstagramOAuthConfigured } from "@/lib/config";
import { getOAuthStateSecret } from "@/lib/token-encryption-key";
import { applyPageUrl } from "@/lib/instagram-callback-redirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const applicationId = url.searchParams.get("applicationId")?.trim();

  if (!applicationId) {
    return NextResponse.redirect(applyPageUrl(url.origin, { ig: "auth_failed" }));
  }

  if (!isInstagramOAuthConfigured) {
    return NextResponse.redirect(
      applyPageUrl(url.origin, {
        applicationId,
        ig: "oauth_not_configured",
      }),
    );
  }

  const application = getCreatorApplication(applicationId);
  if (!application) {
    return NextResponse.redirect(applyPageUrl(url.origin, { ig: "auth_failed" }));
  }

  const { state, cookieValue } = createOAuthStateCookie(
    applicationId,
    getOAuthStateSecret(),
  );

  const response = NextResponse.redirect(instagramAuthorizeUrl(state));
  response.cookies.set(IG_OAUTH_COOKIE, cookieValue, {
    httpOnly: true,
    secure: url.protocol === "https:" || Boolean(process.env.VERCEL),
    sameSite: "lax",
    maxAge: IG_OAUTH_TTL_SECONDS,
    path: "/",
  });
  return response;
}
