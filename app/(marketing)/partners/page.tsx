import { PageContainer } from "@/components/marketing/page-container";
import { LeadForm } from "@/components/marketing/lead-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "For partners",
  description:
    "Hotels, airlines, cruise lines, and tour operators: appear as a bookable leg inside a creator itinerary.",
  path: "/partners",
});

const PROPS = [
  {
    title: "Show up inside a finished itinerary",
    body: "Travelers see your hotel, cabin, or tour as a leg in a creator’s published trip — not as an orphan listing in a giant inventory dump.",
  },
  {
    title: "Creators already did the merchandising",
    body: "The person who stayed with you writes why that night belongs in the route. You supply availability and a booking path.",
  },
  {
    title: "Affiliate now, API later",
    body: "MVP bookings can complete on your site via a tracked URL. Direct API inventory is on the roadmap; leave a booking reference and we will map it.",
  },
];

export default function PartnersPage() {
  return (
    <main className="py-10">
      <PageContainer className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Partners
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Hotels, airlines, cruise lines, tour operators.
          </h1>
          <p className="mt-4 text-muted-foreground">
            TravelLTK is a marketplace for creator itineraries. Your inventory becomes a
            bookable leg inside a trip someone already wants to take.
          </p>
          <ul className="mt-8 space-y-6">
            {PROPS.map((item) => (
              <li key={item.title}>
                <h2 className="font-display text-xl">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl">Partner with us</h2>
          <p className="mt-2 mb-4 text-sm text-muted-foreground">
            Tell us who you are and how you want travelers to complete a booking.
          </p>
          <LeadForm kind="partner" />
        </div>
      </PageContainer>
    </main>
  );
}
