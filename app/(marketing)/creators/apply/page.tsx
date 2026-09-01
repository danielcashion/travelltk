import { PageContainer } from "@/components/marketing/page-container";
import { LeadForm } from "@/components/marketing/lead-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Become a creator",
  description:
    "Publish the trip you actually took. Earn a payout when travelers book your itinerary or a single leg.",
  path: "/creators/apply",
});

const PROPS = [
  {
    title: "Earn a payout on every booking",
    body: "When a traveler books your itinerary — the whole trip or a single leg — you earn. The commercial relationship is with the booking, not a one-off affiliate click.",
  },
  {
    title: "Reach people who want your exact trip",
    body: "Shoppers on TravelLTK are not browsing a destination in the abstract. They are trying to reconstruct a route that already worked for someone they follow.",
  },
  {
    title: "A trip builder, not a blank document",
    body: "Add days, legs, suppliers, and a price estimate. Link an affiliate booking URL for the MVP, or leave a booking API reference for when we connect a supplier directly.",
  },
];

export default function CreatorApplyPage() {
  return (
    <main className="py-10">
      <PageContainer className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Creators
          </p>
          <h1 className="mt-2 font-display text-4xl">Publish the trip you actually took.</h1>
          <p className="mt-4 text-muted-foreground">
            TravelLTK turns a creator itinerary into a bookable product. You write the
            route once. Travelers book it — or the legs they need — and you get paid when
            they do.
          </p>
          <ul className="mt-8 space-y-6">
            {PROPS.map((item) => (
              <li key={item.title}>
                <h2 className="font-display text-xl">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl bg-surface-sunken p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Requirements</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Public travel content (any platform) with a traceable audience</li>
              <li>At least one complete trip you can document day by day</li>
              <li>Willingness to keep supplier names, nights, and prices honest</li>
              <li>A payout destination (Stripe Connect Express, set up in the studio)</li>
            </ul>
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl">Apply</h2>
          <p className="mt-2 mb-4 text-sm text-muted-foreground">
            We read every application. Typical response time is two weeks.
          </p>
          <LeadForm kind="creator" />
        </div>
      </PageContainer>
    </main>
  );
}
