import { PageContainer } from "@/components/marketing/page-container";
import { TripGridSkeleton } from "@/components/trip/trip-grid";

export default function SearchLoading() {
  return (
    <main className="py-10">
      <PageContainer>
        <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="mt-10">
          <TripGridSkeleton />
        </div>
      </PageContainer>
    </main>
  );
}
