import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/marketing/page-container";
import { Button } from "@/components/ui/button";
import { PriceBreakdown } from "@/components/trip/price-breakdown";
import { getBookingById, getTripById } from "@/lib/mock-data";
import { formatDateRange } from "@/lib/formatting";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = getBookingById(bookingId) ?? getBookingById("bkg-1");
  if (!booking) notFound();
  const trip = getTripById(booking.tripId);

  return (
    <main className="py-10">
      <PageContainer width="narrow">
        <p className="text-sm font-medium tracking-wide text-success uppercase">Confirmed</p>
        <h1 className="mt-2 font-display text-4xl">You are booked.</h1>
        <p className="mt-3 text-muted-foreground">
          {trip?.title} · {formatDateRange(booking.travelStartDate, booking.travelEndDate)}
        </p>
        <div className="mt-8">
          <PriceBreakdown
            items={[
              { label: "Trip / included legs", amountUsd: booking.subtotalUsd, kind: "trip" },
              { label: "TravelLTK booking fee", amountUsd: booking.bookingFeeUsd, kind: "fee" },
              { label: "Estimated taxes & supplier fees", amountUsd: booking.taxesUsd, kind: "tax" },
            ]}
            totalLabel="Paid"
          />
        </div>
        <section className="mt-8 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl">What happens next</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>We send traveler names to each supplier on the included legs.</li>
            <li>Optional legs you skipped stay available from the trip page if you change your mind.</li>
            <li>The creator is paid a payout after Stripe confirms the PaymentIntent.</li>
            <li>Watch email for tickets, cabin numbers, and any passport requests from the cruise line.</li>
          </ol>
        </section>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href="/account/bookings">View bookings</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/explore">Browse more trips</Link>
          </Button>
        </div>
      </PageContainer>
    </main>
  );
}
