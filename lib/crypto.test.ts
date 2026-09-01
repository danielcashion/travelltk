import { describe, expect, it } from "vitest";
import { decrypt, encrypt } from "@/lib/crypto";

const KEY = "a".repeat(64);

describe("token encryption", () => {
  it("round-trips a long-lived access token", () => {
    const token = "IGQW-long-lived-token-example";
    const cipher = encrypt(token, KEY);
    expect(cipher).not.toContain(token);
    expect(cipher.split(".")).toHaveLength(3);
    expect(decrypt(cipher, KEY)).toBe(token);
  });

  it("fails closed with the wrong key", () => {
    const cipher = encrypt("secret", KEY);
    expect(() => decrypt(cipher, "b".repeat(64))).toThrow();
  });
});
