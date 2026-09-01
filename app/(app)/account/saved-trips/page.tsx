import { PageContainer } from "@/components/marketing/page-container";
import { EmptyState } from "@/components/trip/empty-state";
import { TripGrid } from "@/components/trip/trip-grid";
import { savedTripIds, trips } from "@/lib/mock-data";

export default function SavedTripsPage() {
  const saved = trips.filter((trip) => savedTripIds.includes(trip.id));

  return (
    <main className="py-10">
      <PageContainer>
        <h1 className="font-display text-4xl">Saved trips</h1>
        <p className="mt-2 text-muted-foreground">
          Heart a trip from any card to pin it here. Saves are local/mock until the API
          is live.
        </p>
        <div className="mt-8">
          {saved.length === 0 ? (
            <EmptyState
              title="Nothing saved"
              description="Browse explore and tap the heart on a trip you want to come back to."
            />
          ) : (
            <TripGrid trips={saved} />
          )}
        </div>
      </PageContainer>
    </main>
  );
}
