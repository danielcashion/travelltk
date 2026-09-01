import { PageContainer } from "@/components/marketing/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConfirmationLoading() {
  return (
    <main className="py-10">
      <PageContainer width="narrow">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-8 h-48 w-full" />
      </PageContainer>
    </main>
  );
}
