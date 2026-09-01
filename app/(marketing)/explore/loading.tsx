import { PageContainer } from "@/components/marketing/page-container";
import { TripGridSkeleton } from "@/components/trip/trip-grid";

export default function ExploreLoading() {
  return (
    <main className="py-10">
      <PageContainer>
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
        <div className="mt-8 h-40 animate-pulse rounded-xl bg-muted" />
        <div className="mt-8">
          <TripGridSkeleton />
        </div>
      </PageContainer>
    </main>
  );
}
