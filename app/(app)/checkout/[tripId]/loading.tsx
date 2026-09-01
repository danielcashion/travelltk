import { PageContainer } from "@/components/marketing/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <main className="py-10">
      <PageContainer width="narrow">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="mt-8 h-96 w-full" />
      </PageContainer>
    </main>
  );
}
