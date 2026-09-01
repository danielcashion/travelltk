import { PageContainer } from "@/components/marketing/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudioLoading() {
  return (
    <main className="py-10">
      <PageContainer>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-6 h-10 w-48" />
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </PageContainer>
    </main>
  );
}
