import { PageContainer } from "@/components/marketing/page-container";
import { EmptyState } from "@/components/trip/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers",
  description: "Open roles at TravelLTK.",
  path: "/careers",
});

const ROLES = [
  {
    title: "Creator partnerships lead",
    location: "Remote, US",
    blurb: "Recruit and support the first hundred travel creators who publish bookable trips.",
  },
  {
    title: "Supplier integrations engineer",
    location: "Remote, US",
    blurb: "Map hotel, air, and cruise booking APIs onto the TripLeg model.",
  },
];

export default function CareersPage() {
  return (
    <main className="py-10">
      <PageContainer width="narrow">
        <h1 className="font-display text-4xl">Careers</h1>
        <p className="mt-4 text-muted-foreground">
          We are a small team building the booking layer under creator itineraries. If
          you have shipped marketplaces or travel inventory before, we want to hear from
          you even if the title below is wrong.
        </p>
        {ROLES.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No open roles right now"
              description="Send a note via the contact form and we will keep it."
              action={
                <Button asChild>
                  <Link href="/contact">Contact us</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {ROLES.map((role) => (
              <li key={role.title} className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-display text-xl">{role.title}</h2>
                <p className="text-sm text-muted-foreground">{role.location}</p>
                <p className="mt-2 text-sm text-muted-foreground">{role.blurb}</p>
                <Button asChild className="mt-4" variant="outline" size="sm">
                  <Link href="/contact">Apply via contact</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </PageContainer>
    </main>
  );
}
