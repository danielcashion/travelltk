import type { ReactNode } from "react";
import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
