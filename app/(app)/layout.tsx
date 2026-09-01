import type { ReactNode } from "react";
import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-surface-sunken">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
