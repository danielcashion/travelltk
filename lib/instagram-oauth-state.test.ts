import { describe, expect, it } from "vitest";
import {
  createOAuthStateCookie,
  verifyOAuthState,
} from "@/lib/instagram-oauth-state";

const SECRET = "oauth-state-test-secret";

describe("Instagram OAuth state", () => {
  it("rejects a mismatched state (CSRF)", () => {
    const { cookieValue } = createOAuthStateCookie("capp-1", SECRET);
    expect(verifyOAuthState(cookieValue, "totally-different-state", SECRET)).toBeNull();
  });

  it("rejects a missing or tampered cookie", () => {
    const { state } = createOAuthStateCookie("capp-1", SECRET);
    expect(verifyOAuthState(undefined, state, SECRET)).toBeNull();
    expect(verifyOAuthState("not-a-valid-cookie", state, SECRET)).toBeNull();
  });

  it("accepts a matching state and returns the applicationId", () => {
    const { state, cookieValue } = createOAuthStateCookie("capp-99", SECRET);
    expect(verifyOAuthState(cookieValue, state, SECRET)).toEqual({
      applicationId: "capp-99",
    });
  });

  it("rejects an expired cookie", () => {
    const now = 1_000_000;
    const { state, cookieValue } = createOAuthStateCookie("capp-1", SECRET, now);
    expect(
      verifyOAuthState(cookieValue, state, SECRET, now + 11 * 60 * 1000),
    ).toBeNull();
  });
});
