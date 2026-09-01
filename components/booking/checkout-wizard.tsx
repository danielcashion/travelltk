"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PriceBreakdown } from "@/components/trip/price-breakdown";
import { PLATFORM_BOOKING_FEE_LABEL } from "@/lib/constants";
import type { Trip } from "@/types";

const STEPS = ["Travelers", "Dates", "Payment", "Review"] as const;

export function CheckoutWizard({
  trip,
  publishableKey,
}: {
  trip: Trip;
  publishableKey: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [travelerCount, setTravelerCount] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [mock, setMock] = useState(false);
  const [pending, setPending] = useState(false);

  const taxesUsd = Math.round(trip.priceFromUsd * 0.045);
  const perPerson = trip.priceFromUsd + trip.bookingFeeUsd + taxesUsd;
  const totalUsd = perPerson * travelerCount;

  const items = useMemo(
    () => [
      { label: "Trip / included legs", amountUsd: trip.priceFromUsd * travelerCount, kind: "trip" as const },
      { label: PLATFORM_BOOKING_FEE_LABEL, amountUsd: trip.bookingFeeUsd * travelerCount, kind: "fee" as const },
      { label: "Estimated taxes & supplier fees", amountUsd: taxesUsd * travelerCount, kind: "tax" as const },
    ],
    [trip.priceFromUsd, trip.bookingFeeUsd, taxesUsd, travelerCount],
  );

  async function createIntent() {
    setPending(true);
    try {
      const response = await fetch("/api/checkout/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: trip.id, travelerCount }),
      });
      const data = (await response.json()) as {
        clientSecret: string | null;
        mock: boolean;
        bookingId: string;
      };
      setClientSecret(data.clientSecret);
      setMock(data.mock);
      setBookingId(data.bookingId);
      setStep(2);
    } finally {
      setPending(false);
    }
  }

  function confirmMock() {
    router.push(`/booking-confirmation/${bookingId ?? "bkg-1"}`);
  }

  return (
    <div>
      <ol className="mb-6 flex gap-2 text-sm">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={index === step ? "font-medium text-foreground" : "text-muted-foreground"}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Lead traveler first name</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button
            onClick={() => setStep(1)}
            disabled={!firstName || !lastName || !email}
          >
            Continue
          </Button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="start">Travel start date</Label>
            <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="count">Travelers</Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={8}
              value={travelerCount}
              onChange={(e) => setTravelerCount(Number(e.target.value) || 1)}
            />
          </div>
          <PriceBreakdown items={items} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button onClick={() => void createIntent()} disabled={!startDate || pending}>
              {pending ? "Preparing payment…" : "Continue to payment"}
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          {mock || !clientSecret || !publishableKey ? (
            <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Stripe is not configured in this environment. The next step will confirm a
              mock booking so you can review the confirmation page.
            </p>
          ) : (
            <StripePayment
              clientSecret={clientSecret}
              publishableKey={publishableKey}
            />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)}>Review</Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 text-sm">
            <p>
              <span className="text-muted-foreground">Traveler · </span>
              {firstName} {lastName} ({email})
            </p>
            <p className="mt-1">
              <span className="text-muted-foreground">Start · </span>
              {startDate} · {travelerCount} traveler{travelerCount === 1 ? "" : "s"}
            </p>
          </div>
          <PriceBreakdown items={items} totalLabel="Amount due" />
          <p className="text-xs text-muted-foreground">
            Trip/leg cost and the TravelLTK booking fee are separate line items. Estimated
            taxes are a placeholder until Stripe Tax + supplier tax are enabled.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={confirmMock}>Confirm booking {totalUsd ? "" : ""}</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StripePayment({
  clientSecret,
  publishableKey,
}: {
  clientSecret: string;
  publishableKey: string;
}) {
  const stripePromise = useMemoStripe(publishableKey);
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="space-y-4">
        <PaymentElement />
        <StripeConfirmButton />
      </div>
    </Elements>
  );
}

function useMemoStripe(publishableKey: string): Promise<Stripe | null> {
  const [promise] = useState(() => loadStripe(publishableKey));
  return promise;
}

function StripeConfirmButton() {
  const stripe = useStripe();
  const elements = useElements();
  return (
    <Button
      type="button"
      disabled={!stripe || !elements}
      onClick={() => {
        void stripe?.confirmPayment({
          elements: elements!,
          confirmParams: { return_url: `${window.location.origin}/account/bookings` },
        });
      }}
    >
      Pay
    </Button>
  );
}
