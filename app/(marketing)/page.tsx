import Link from "next/link";
import { ClientErrorBoundary } from "@/components/client-error-boundary";
import { CategoryTile } from "@/components/marketing/category-tile";
import { CreatorCarousel } from "@/components/marketing/creator-carousel";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeValueProps } from "@/components/marketing/home-value-props";
import { PageContainer } from "@/components/marketing/page-container";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { TripGrid } from "@/components/trip/trip-grid";
import { getFeaturedCreators, getHeroCreator } from "@/lib/instagram";
import { getPublishedTrips } from "@/lib/mock-data";
import { pageMetadata } from "@/lib/seo";
import { TRIP_CATEGORIES } from "@/types";

export const metadata = pageMetadata({
  title: "Book the trip, not just the inspiration",
  description:
    "Luxury itineraries from the creators you already follow. Browse Eileen Gu and others, then book the whole route — or the legs you want.",
  path: "/",
});

export default async function HomePage() {
  const featured = getPublishedTrips().slice(0, 6);
  const creators = await getFeaturedCreators();
  const heroCreator = getHeroCreator(creators);

  return (
    <main>
      <HomeHero creator={heroCreator} />
      <ClientErrorBoundary
        fallback={
          <section className="bg-neutral-900 py-12 text-neutral-50">
            <PageContainer>
              <SectionHeading
                tone="dark"
                eyebrow="On Instagram"
                title="The creators we travel with"
                description="Open Instagram from Explore, then book the route on TravelLTK."
              />
            </PageContainer>
          </section>
        }
      >
        <CreatorCarousel creators={creators} />
      </ClientErrorBoundary>

      <section className="py-16 md:py-20">
        <PageContainer>
          <SectionHeading
            eyebrow="The difference"
            title="Why TravelLTK"
            description="Screenshots of someone else's Google Map are not a plan. These trips already have the nights, the transfers, and a price."
          />
          <HomeValueProps />
        </PageContainer>
      </section>

      <section className="bg-surface-sunken py-16 md:py-20">
        <PageContainer>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="This week"
              title="Trips travelers are booking"
              description="Live inventory from published creators. New routes land every week."
            />
            <Button asChild variant="ghost" className="hidden tracking-[0.12em] uppercase sm:inline-flex">
              <Link href="/explore">See all</Link>
            </Button>
          </div>
          <div className="mt-10">
            <TripGrid trips={featured} />
          </div>
        </PageContainer>
      </section>

      <section className="py-16 md:py-20">
        <PageContainer>
          <SectionHeading eyebrow="By temperament" title="Browse by kind of trip" />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TRIP_CATEGORIES.map((category) => (
              <CategoryTile key={category.slug} slug={category.slug} label={category.label} />
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="bg-neutral-900 py-16 text-neutral-50 md:py-20">
        <PageContainer className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            tone="dark"
            className="max-w-xl"
            eyebrow="Private inventory"
            title="Ready to travel someone's exact route?"
            description="Filter by destination, duration, and price. Save trips. Book a leg or the whole itinerary."
          />
          <Button asChild size="lg" variant="secondary">
            <Link href="/explore">Explore trips</Link>
          </Button>
        </PageContainer>
      </section>
    </main>
  );
}
