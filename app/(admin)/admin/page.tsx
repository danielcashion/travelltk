import { PageContainer } from "@/components/marketing/page-container";

export default function AdminHomePage() {
  return (
    <main className="py-10">
      <PageContainer>
        <h1 className="font-display text-4xl">Admin</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Internal tooling lives here: creator applications, partner leads, and catalog
          moderation. Endpoints will list applications from DynamoDB once Phase 7 is
          deployed.
        </p>
      </PageContainer>
    </main>
  );
}
