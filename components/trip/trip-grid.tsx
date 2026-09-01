import { TripCard } from "@/components/trip/trip-card";
import { EmptyState } from "@/components/trip/empty-state";
import { SkeletonCard } from "@/components/trip/skeleton-card";
import type { Trip } from "@/types";

export function TripGrid({ trips, emptyTitle }: { trips: Trip[]; emptyTitle?: string }) {
  if (trips.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? "No trips match yet"}
        description="Try a different destination, category, or price range — creators publish new routes every week."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}

export function TripGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
