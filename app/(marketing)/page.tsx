import Link from "next/link";
import { ClientErrorBoundary } from "@/components/client-error-boundary";
import { CategoryTile } from "@/components/marketing/category-tile";
import { CreatorCarousel } from "@/components/marketing/creator-carousel";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeValueProps } from "@/components/marketing/home-value-props";
import { PageContainer } from "@/components/marketing/page-container";
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
          <section className="bg-neutral-900 py-16 text-neutral-50">
            <PageContainer>
              <h2 className="font-display text-3xl">The creators we travel with</h2>
              <p className="mt-3 text-neutral-300">Open Instagram from Explore, then book the route on TravelLTK.</p>
            </PageContainer>
          </section>
        }
      >
        <CreatorCarousel creators={creators} />
      </ClientErrorBoundary>

      <section className="py-16">
        <PageContainer>
          <h2 className="font-display text-3xl">Why TravelLTK</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Screenshots of someone else&apos;s Google Map are not a plan. These trips
            already have the nights, the transfers, and a price.
          </p>
          <HomeValueProps />
        </PageContainer>
      </section>

      <section className="bg-surface-sunken py-16">
        <PageContainer>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl">Trips travelers are booking</h2>
              <p className="mt-2 text-muted-foreground">
                Live-looking inventory from published creators. New routes land every week.
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/explore">See all</Link>
            </Button>
          </div>
          <div className="mt-8">
            <TripGrid trips={featured} />
          </div>
        </PageContainer>
      </section>

      <section className="py-16">
        <PageContainer>
          <h2 className="font-display text-3xl">Browse by kind of trip</h2>
          <div className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
            {TRIP_CATEGORIES.map((category) => (
              <CategoryTile key={category.slug} slug={category.slug} label={category.label} />
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="border-t border-border bg-primary py-16 text-primary-foreground">
        <PageContainer className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl">Ready to travel someone&apos;s exact route?</h2>
            <p className="mt-2 max-w-xl text-primary-foreground/80">
              Filter by destination, duration, and price. Save trips. Book a leg or the
              whole itinerary.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link href="/explore">Explore trips</Link>
          </Button>
        </PageContainer>
      </section>
    </main>
  );
}
