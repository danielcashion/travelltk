import Stripe from "stripe";
import { env, requireEnv } from "@/lib/config";

let stripe: Stripe | undefined;

/**
 * Server-side Stripe client. Instantiated once per process. Do not set a
 * global `stripe.api_key`. Prefer a restricted key (`rk_`) in production.
 */
export function getStripe(): Stripe {
  const key = requireEnv("STRIPE_SECRET_KEY");
  stripe ??= new Stripe(key);
  return stripe;
}

export function isStripeClientConfigured(): boolean {
  return Boolean(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function dollarsToCents(amountUsd: number): number {
  return Math.round(amountUsd * 100);
}
