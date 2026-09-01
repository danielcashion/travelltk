import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const IG_OAUTH_COOKIE = "travelltk_ig_oauth";
export const IG_OAUTH_TTL_SECONDS = 10 * 60;

interface OAuthStatePayload {
  nonce: string;
  applicationId: string;
  exp: number;
}

function sign(encoded: string, secret: string): string {
  return createHmac("sha256", secret).update(encoded).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** Random `state` plus a signed cookie binding it to `applicationId`. */
export function createOAuthStateCookie(
  applicationId: string,
  secret: string,
  now = Date.now(),
): { state: string; cookieValue: string } {
  const nonce = randomBytes(16).toString("hex");
  const payload: OAuthStatePayload = {
    nonce,
    applicationId,
    exp: now + IG_OAUTH_TTL_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return { state: nonce, cookieValue: `${encoded}.${sign(encoded, secret)}` };
}

/**
 * Returns the bound applicationId when the query `state` matches the signed
 * cookie and the cookie has not expired. Otherwise null (CSRF / expiry).
 */
export function verifyOAuthState(
  cookieValue: string | undefined,
  state: string | null | undefined,
  secret: string,
  now = Date.now(),
): { applicationId: string } | null {
  if (!cookieValue || !state) return null;
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return null;
  const encoded = cookieValue.slice(0, dot);
  const mac = cookieValue.slice(dot + 1);
  if (!encoded || !mac) return null;
  if (!safeEqual(mac, sign(encoded, secret))) return null;

  let payload: OAuthStatePayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as OAuthStatePayload;
  } catch {
    return null;
  }
  if (typeof payload.exp !== "number" || payload.exp < now) return null;
  if (!payload.applicationId || !payload.nonce) return null;
  if (!safeEqual(payload.nonce, state)) return null;
  return { applicationId: payload.applicationId };
}
