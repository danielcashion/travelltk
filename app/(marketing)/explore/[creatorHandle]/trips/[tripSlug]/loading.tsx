import { PageContainer } from "@/components/marketing/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { TripGridSkeleton } from "@/components/trip/trip-grid";

export default function TripDetailLoading() {
  return (
    <main>
      <PageContainer className="py-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="mt-6 aspect-[21/9] w-full" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="mt-12">
          <TripGridSkeleton count={3} />
        </div>
      </PageContainer>
    </main>
  );
}
