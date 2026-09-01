import { PageContainer } from "@/components/marketing/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <main className="py-10">
      <PageContainer>
        <Skeleton className="h-10 w-48" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </PageContainer>
    </main>
  );
}
