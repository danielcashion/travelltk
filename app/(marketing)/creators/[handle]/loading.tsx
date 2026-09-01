import { PageContainer } from "@/components/marketing/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreatorProfileLoading() {
  return (
    <main>
      <Skeleton className="h-[28rem] w-full rounded-none sm:h-[32rem]" />
      <PageContainer className="py-16">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-40 w-full" />
        <Skeleton className="mt-6 h-64 w-full" />
      </PageContainer>
    </main>
  );
}
