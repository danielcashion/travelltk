import Link from "next/link";
import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";
import { LogoMark } from "@/components/marketing/logo";
import { PageContainer } from "@/components/marketing/page-container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <PageContainer className="flex flex-1 flex-col items-center justify-center py-24 text-center">
        <LogoMark alt="" className="size-16" />
        <p className="mt-6 text-sm font-medium tracking-wide text-primary uppercase">404</p>
        <h1 className="mt-2 font-display text-4xl">That page is not on the itinerary.</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The trip, creator, or document you asked for is missing. Head back to explore.
        </p>
        <Button asChild className="mt-6">
          <Link href="/explore">Explore trips</Link>
        </Button>
      </PageContainer>
      <Footer />
    </div>
  );
}
