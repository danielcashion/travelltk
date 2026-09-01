import { NextResponse } from "next/server";
import { getStripe, isStripeClientConfigured } from "@/lib/stripe";
import { env } from "@/lib/config";

export async function POST(request: Request) {
  if (!isStripeClientConfigured() || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Awaited<ReturnType<ReturnType<typeof getStripe>["webhooks"]["constructEventAsync"]>>;

  try {
    event = await getStripe().webhooks.constructEventAsync(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const bookingId = intent.metadata?.bookingId;
    // TODO(api): apiClient.bookings.updateStatus(bookingId, "confirmed")
    console.info("[stripe] payment_intent.succeeded — mark booking confirmed", {
      bookingId,
      paymentIntentId: intent.id,
    });
  }

  return NextResponse.json({ received: true });
}
