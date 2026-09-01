import { HelpFaq } from "@/components/marketing/help-faq";
import { PageContainer } from "@/components/marketing/page-container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Help Center",
  description: "Answers about booking trips, payouts, cancellations, and creator applications.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <main className="py-10">
      <PageContainer width="narrow">
        <h1 className="font-display text-4xl">Help Center</h1>
        <p className="mt-2 mb-8 text-muted-foreground">
          Short answers for shoppers and creators. For something that is not here, use
          the contact form.
        </p>
        <HelpFaq />
      </PageContainer>
    </main>
  );
}
