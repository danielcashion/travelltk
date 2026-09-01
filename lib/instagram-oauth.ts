import { env, instagramRedirectUri } from "@/lib/config";
import type { InstagramMeProfile } from "@/types/applications";

const AUTHORIZE_URL = "https://api.instagram.com/oauth/authorize";
const SHORT_LIVED_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const LONG_LIVED_TOKEN_URL = "https://graph.instagram.com/access_token";
const REFRESH_TOKEN_URL = "https://graph.instagram.com/refresh_access_token";
const GRAPH_ME_URL = "https://graph.instagram.com/v22.0/me";

export const INSTAGRAM_LOGIN_SCOPE = "instagram_business_basic";

export function instagramAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env.INSTAGRAM_APP_ID ?? "",
    redirect_uri: instagramRedirectUri(),
    scope: INSTAGRAM_LOGIN_SCOPE,
    response_type: "code",
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

async function parseBody(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return Object.fromEntries(new URLSearchParams(text));
  }
}

function readString(body: Record<string, unknown>, key: string): string | null {
  const value = body[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readNumber(body: Record<string, unknown>, key: string): number | null {
  const value = body[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export interface LongLivedToken {
  accessToken: string;
  expiresIn: number;
}

export async function exchangeCodeForLongLivedToken(code: string): Promise<LongLivedToken> {
  const appId = env.INSTAGRAM_APP_ID;
  const appSecret = env.INSTAGRAM_APP_SECRET;
  if (!appId || !appSecret) {
    throw new Error("Instagram Login is not configured");
  }

  const shortLived = await fetch(SHORT_LIVED_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: "authorization_code",
      redirect_uri: instagramRedirectUri(),
      code,
    }),
    cache: "no-store",
  });
  const shortBody = await parseBody(shortLived);
  const shortToken = readString(shortBody, "access_token");
  if (!shortLived.ok || !shortToken) {
    const message =
      readString(shortBody, "error_message") ??
      readString(shortBody, "error") ??
      "Instagram did not return an access token";
    throw new Error(message);
  }

  const longUrl = new URL(LONG_LIVED_TOKEN_URL);
  longUrl.searchParams.set("grant_type", "ig_exchange_token");
  longUrl.searchParams.set("client_secret", appSecret);
  longUrl.searchParams.set("access_token", shortToken);

  const longLived = await fetch(longUrl, { cache: "no-store" });
  const longBody = await parseBody(longLived);
  const longToken = readString(longBody, "access_token");
  const expiresIn = readNumber(longBody, "expires_in") ?? 60 * 24 * 60 * 60;
  if (!longLived.ok || !longToken) {
    throw new Error(
      readString(longBody, "error_message") ??
        "Could not exchange for a long-lived Instagram token",
    );
  }

  return { accessToken: longToken, expiresIn };
}

export async function fetchInstagramMe(accessToken: string): Promise<InstagramMeProfile> {
  const url = new URL(GRAPH_ME_URL);
  url.searchParams.set("fields", "id,username,followers_count,account_type");
  url.searchParams.set("access_token", accessToken);
  const response = await fetch(url, { cache: "no-store" });
  const body = await parseBody(response);
  if (!response.ok) {
    throw new Error(
      readString(body, "error_message") ??
        (typeof (body.error as { message?: string } | undefined)?.message === "string"
          ? (body.error as { message: string }).message
          : "Could not load Instagram profile"),
    );
  }
  return {
    id: readString(body, "id") ?? undefined,
    username: readString(body, "username") ?? undefined,
    followers_count: readNumber(body, "followers_count") ?? undefined,
    account_type: readString(body, "account_type") ?? undefined,
  };
}

export async function refreshLongLivedToken(accessToken: string): Promise<LongLivedToken> {
  const url = new URL(REFRESH_TOKEN_URL);
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", accessToken);
  const response = await fetch(url, { cache: "no-store" });
  const body = await parseBody(response);
  const token = readString(body, "access_token");
  const expiresIn = readNumber(body, "expires_in") ?? 60 * 24 * 60 * 60;
  if (!response.ok || !token) {
    throw new Error(
      readString(body, "error_message") ?? "Could not refresh Instagram token",
    );
  }
  return { accessToken: token, expiresIn };
}
