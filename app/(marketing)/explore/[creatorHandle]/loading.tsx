import { PageContainer } from "@/components/marketing/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { TripGridSkeleton } from "@/components/trip/trip-grid";

export default function CreatorLoading() {
  return (
    <main>
      <Skeleton className="h-48 w-full rounded-none sm:h-64" />
      <PageContainer className="py-8">
        <Skeleton className="size-24 rounded-full" />
        <Skeleton className="mt-4 h-8 w-48" />
        <div className="mt-10">
          <TripGridSkeleton />
        </div>
      </PageContainer>
    </main>
  );
}
