import { z } from "zod";

/**
 * Single validated environment config for the Next.js app.
 *
 * Import `env` from this module — never read `process.env` in feature code.
 * Invalid or (in production) missing values throw at module load so the
 * process fails fast and loudly instead of running half-configured.
 */

const emptyToUndefined = (value: unknown) =>
  value === "" || value === undefined || value === null ? undefined : value;

const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalString = z.preprocess(emptyToUndefined, z.string().min(1).optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  NEXT_PUBLIC_APP_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().default("http://localhost:3000"),
  ),

  NEXT_PUBLIC_API_BASE_URL: optionalUrl,
  NEXT_PUBLIC_MEDIA_BASE_URL: optionalUrl,

  AUTH_SECRET: optionalString,

  COGNITO_USER_POOL_ID: optionalString,
  COGNITO_CLIENT_ID: optionalString,
  COGNITO_CLIENT_SECRET: optionalString,
  COGNITO_DOMAIN: optionalString,
  COGNITO_REGION: z.preprocess(emptyToUndefined, z.string().default("us-east-1")),
  COGNITO_ISSUER: optionalUrl,

  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,

  STRIPE_SECRET_KEY: optionalString,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalString,
  STRIPE_WEBHOOK_SECRET: optionalString,
  STRIPE_CONNECT_CLIENT_ID: optionalString,

  /**
   * Instagram Graph API (Business Discovery) — optional. When set, the homepage
   * can resolve @eileengu's newest post permalink. Without these, the homepage
   * uses Instagram's official profile embed instead.
   */
  INSTAGRAM_ACCESS_TOKEN: optionalString,
  INSTAGRAM_BUSINESS_ACCOUNT_ID: optionalString,
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_MEDIA_BASE_URL: process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
    COGNITO_REGION: process.env.COGNITO_REGION,
    COGNITO_ISSUER: process.env.COGNITO_ISSUER,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_CONNECT_CLIENT_ID: process.env.STRIPE_CONNECT_CLIENT_ID,
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment variables (see .env.example):\n${issues}`,
    );
  }

  return parsed.data;
}

export const env = loadEnv();

const PRODUCTION_REQUIRED: (keyof Env)[] = [
  "AUTH_SECRET",
  "COGNITO_CLIENT_ID",
  "COGNITO_ISSUER",
  "NEXT_PUBLIC_API_BASE_URL",
];

const isProductionRuntime =
  env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE !== "phase-production-build";

if (isProductionRuntime) {
  const missing = PRODUCTION_REQUIRED.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(", ")}`,
    );
  }
}

if (env.NODE_ENV === "development") {
  const unset = [
    "AUTH_SECRET",
    "COGNITO_USER_POOL_ID",
    "COGNITO_CLIENT_ID",
    "COGNITO_DOMAIN",
    "NEXT_PUBLIC_API_BASE_URL",
    "STRIPE_SECRET_KEY",
  ].filter((key) => !env[key as keyof Env]);

  if (unset.length > 0) {
    console.warn(
      `[config] Development running without: ${unset.join(", ")}. ` +
        `UI will use mock data. Copy .env.example → .env.local to wire real services.`,
    );
  }
}

export function requireEnv<K extends keyof Env>(key: K): NonNullable<Env[K]> {
  const value = env[key];
  if (value === undefined || value === "") {
    throw new Error(
      `Environment variable ${key} is required for this operation. Set it in .env.local.`,
    );
  }
  return value as NonNullable<Env[K]>;
}

export const isApiConfigured = Boolean(env.NEXT_PUBLIC_API_BASE_URL);
export const isAuthConfigured = Boolean(
  env.AUTH_SECRET && env.COGNITO_CLIENT_ID && env.COGNITO_ISSUER,
);
export const isStripeConfigured = Boolean(
  env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);
export const isInstagramConfigured = Boolean(
  env.INSTAGRAM_ACCESS_TOKEN && env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
);
