import Link from "next/link";
import { PageContainer } from "@/components/marketing/page-container";
import { EmptyState } from "@/components/trip/empty-state";
import { Badge } from "@/components/ui/badge";
import { bookings, getTripById } from "@/lib/mock-data";
import { formatCurrency, formatDateRange } from "@/lib/formatting";

export default function BookingsPage() {
  return (
    <main className="py-10">
      <PageContainer>
        <h1 className="font-display text-4xl">Booking history</h1>
        {bookings.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No bookings yet"
              description="When you book a creator trip, it will land here with dates, travelers, and status."
            />
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {bookings.map((booking) => {
              const trip = getTripById(booking.tripId);
              return (
                <li key={booking.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl">{trip?.title ?? booking.tripId}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateRange(booking.travelStartDate, booking.travelEndDate)} ·{" "}
                        {booking.travelerCount} traveler{booking.travelerCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <Badge variant="secondary">{booking.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="mt-3 text-sm">{formatCurrency(booking.totalUsd, true)}</p>
                  <Link
                    href={`/booking-confirmation/${booking.id}`}
                    className="mt-2 inline-block text-sm text-primary hover:underline"
                  >
                    View confirmation
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </PageContainer>
    </main>
  );
}
