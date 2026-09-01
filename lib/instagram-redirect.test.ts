import { describe, expect, it } from "vitest";
import { resolveInstagramRedirectUri } from "@/lib/instagram-redirect";

describe("resolveInstagramRedirectUri", () => {
  it("uses localhost from env in development", () => {
    expect(
      resolveInstagramRedirectUri({
        configured: "http://localhost:3000/api/instagram/callback",
        appUrl: "http://localhost:3000",
        vercelEnv: "development",
      }),
    ).toBe("http://localhost:3000/api/instagram/callback");
  });

  it("ignores a localhost INSTAGRAM_REDIRECT_URI on Vercel production", () => {
    expect(
      resolveInstagramRedirectUri({
        configured: "http://localhost:3000/api/instagram/callback",
        appUrl: "https://www.travelltk.com",
        vercelEnv: "production",
      }),
    ).toBe("https://www.travelltk.com/api/instagram/callback");
  });

  it("prefers a non-local INSTAGRAM_REDIRECT_URI in production", () => {
    expect(
      resolveInstagramRedirectUri({
        configured: "https://www.travelltk.com/api/instagram/callback",
        appUrl: "https://travelltk.com",
        vercelEnv: "production",
      }),
    ).toBe("https://www.travelltk.com/api/instagram/callback");
  });

  it("falls back to VERCEL_PROJECT_PRODUCTION_URL when app URL is local", () => {
    expect(
      resolveInstagramRedirectUri({
        configured: "http://localhost:3000/api/instagram/callback",
        appUrl: "http://localhost:3000",
        vercelEnv: "production",
        vercelProductionUrl: "www.travelltk.com",
      }),
    ).toBe("https://www.travelltk.com/api/instagram/callback");
  });
});
