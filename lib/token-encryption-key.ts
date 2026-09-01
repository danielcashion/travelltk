import { env } from "@/lib/config";

/** Key used only for token ciphertext — never stored in the application table. */
export function getTokenEncryptionKey(): string {
  if (env.TOKEN_ENCRYPTION_KEY) return env.TOKEN_ENCRYPTION_KEY;
  if (env.NODE_ENV === "production") {
    throw new Error("TOKEN_ENCRYPTION_KEY is required in production");
  }
  return env.AUTH_SECRET ?? "dev-only-token-encryption-key";
}

export function getOAuthStateSecret(): string {
  return env.AUTH_SECRET ?? env.TOKEN_ENCRYPTION_KEY ?? "dev-only-oauth-state-secret";
}
