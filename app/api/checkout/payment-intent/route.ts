import { NextResponse } from "next/server";
import { getTripById } from "@/lib/mock-data";
import { dollarsToCents, getStripe, isStripeClientConfigured } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.tripId !== "string") {
    return NextResponse.json({ error: "tripId required" }, { status: 400 });
  }

  const trip = getTripById(body.tripId);
  if (!trip) {
    return NextResponse.json({ error: "Unknown trip" }, { status: 404 });
  }

  const travelerCount = Math.max(1, Number(body.travelerCount) || 1);
  const taxesUsd = Math.round(trip.priceFromUsd * 0.045);
  const totalUsd = (trip.priceFromUsd + trip.bookingFeeUsd + taxesUsd) * travelerCount;

  if (!isStripeClientConfigured()) {
    return NextResponse.json({
      clientSecret: null,
      mock: true,
      amountUsd: totalUsd,
      bookingId: `bkg-mock-${Date.now()}`,
    });
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: dollarsToCents(totalUsd),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      tripId: trip.id,
      bookingId: `bkg-pending-${Date.now()}`,
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    mock: false,
    amountUsd: totalUsd,
    bookingId: paymentIntent.metadata.bookingId,
  });
}
