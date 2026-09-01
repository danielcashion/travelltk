function stripSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isLocalhost(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return /localhost|127\.0\.0\.1/.test(url);
  }
}

function withHttps(hostOrUrl: string): string {
  if (hostOrUrl.startsWith("http://") || hostOrUrl.startsWith("https://")) {
    return stripSlash(hostOrUrl);
  }
  return `https://${hostOrUrl.replace(/^\/+/, "")}`;
}

/**
 * Canonical Instagram Login redirect URI for Meta.
 * On Vercel production, never send a localhost URI even if env was copied from .env.
 */
export function resolveInstagramRedirectUri(input: {
  configured?: string;
  appUrl: string;
  vercelEnv?: string;
  vercelProductionUrl?: string;
}): string {
  const path = "/api/instagram/callback";
  const configured = input.configured ? stripSlash(input.configured) : undefined;
  const onVercelProduction = input.vercelEnv === "production";

  if (onVercelProduction) {
    if (configured && !isLocalhost(configured)) return configured;
    const appUrl = stripSlash(input.appUrl);
    if (appUrl && !isLocalhost(appUrl)) return `${appUrl}${path}`;
    if (input.vercelProductionUrl) {
      return `${withHttps(input.vercelProductionUrl)}${path}`;
    }
    return `${appUrl}${path}`;
  }

  return configured ?? `${stripSlash(input.appUrl)}${path}`;
}
