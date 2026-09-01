import { LeadForm } from "@/components/marketing/lead-form";
import { PageContainer } from "@/components/marketing/page-container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Shopper support, press, and partnerships.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="py-10">
      <PageContainer width="narrow">
        <h1 className="font-display text-4xl">Contact</h1>
        <p className="mt-2 mb-8 text-muted-foreground">
          Shopper support, press, partnerships, and everything else. We read this queue
          on business days.
        </p>
        <LeadForm kind="contact" />
      </PageContainer>
    </main>
  );
}
