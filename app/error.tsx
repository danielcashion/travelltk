"use client";

import { useEffect } from "react";
import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";
import { LogoMark } from "@/components/marketing/logo";
import { PageContainer } from "@/components/marketing/page-container";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <PageContainer className="flex flex-1 flex-col items-center justify-center py-24 text-center">
        <LogoMark alt="" className="size-16" />
        <h1 className="mt-6 font-display text-4xl">Something went off-route.</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          We hit an unexpected error. Try again, or come back to the home page.
        </p>
        <Button className="mt-6" onClick={() => reset()}>
          Try again
        </Button>
      </PageContainer>
      <Footer />
    </div>
  );
}
