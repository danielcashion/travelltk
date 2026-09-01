import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts secrets at rest (Instagram long-lived tokens).
 * Key material is 64-char hex (32 bytes) or any passphrase, hashed with SHA-256.
 * Ciphertext format: `iv.authTag.ciphertext` (base64url, AES-256-GCM).
 */
export function deriveEncryptionKey(keyMaterial: string): Buffer {
  const trimmed = keyMaterial.trim();
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return Buffer.from(trimmed, "hex");
  }
  return createHash("sha256").update(trimmed, "utf8").digest();
}

export function encrypt(plaintext: string, keyMaterial: string): string {
  if (!keyMaterial) {
    throw new Error("Encryption key is required");
  }
  const key = deriveEncryptionKey(keyMaterial);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${ciphertext.toString("base64url")}`;
}

export function decrypt(payload: string, keyMaterial: string): string {
  if (!keyMaterial) {
    throw new Error("Encryption key is required");
  }
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Invalid ciphertext");
  }
  const key = deriveEncryptionKey(keyMaterial);
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, "base64url"), {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
