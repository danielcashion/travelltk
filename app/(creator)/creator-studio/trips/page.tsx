import Link from "next/link";
import { PageContainer } from "@/components/marketing/page-container";
import { StudioNav } from "@/components/creator-studio/studio-nav";
import { EmptyState } from "@/components/trip/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTripsByCreator, trips } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatting";

export default function CreatorTripsPage() {
  const published = getTripsByCreator("creator-mira");
  const drafts = trips.filter(
    (trip) => trip.creatorId === "creator-mira" && trip.status === "draft",
  );
  const list = [...published, ...drafts];

  return (
    <main className="py-10">
      <PageContainer>
        <StudioNav current="/creator-studio/trips" />
        <div className="mt-6 flex items-center justify-between">
          <h1 className="font-display text-4xl">Your trips</h1>
          <Button asChild>
            <Link href="/creator-studio/trips/new">New trip</Link>
          </Button>
        </div>
        {list.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No trips yet"
              description="Start a trip, add days and legs, then publish when the route is honest."
              action={
                <Button asChild>
                  <Link href="/creator-studio/trips/new">Create a trip</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {list.map((trip) => (
              <li
                key={trip.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <p className="font-medium">{trip.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(trip.priceFromUsd)} · {trip.nights} nights
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{trip.status}</Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/creator-studio/trips/${trip.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PageContainer>
    </main>
  );
}
