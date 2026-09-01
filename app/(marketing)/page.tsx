import Link from "next/link";
import { ArrowRight, BookmarkCheck, MapPinned, SplitSquareHorizontal, Wallet } from "lucide-react";
import { CategoryTile } from "@/components/marketing/category-tile";
import { CreatorCarousel } from "@/components/marketing/creator-carousel";
import { HomeHero } from "@/components/marketing/home-hero";
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

const VALUE_PROPS = [
  {
    icon: MapPinned,
    title: "The exact route, not a mood board",
    body: "Creators publish the trip they actually took — nights, transfers, and the restaurant they would book again — as one product.",
  },
  {
    icon: SplitSquareHorizontal,
    title: "Book the whole itinerary or a single leg",
    body: "Take the Paris week, just the cruise, or the Istanbul hotel. Every leg is priced on its own and marked included or optional.",
  },
  {
    icon: Wallet,
    title: "Creators earn on every booking",
    body: "A payout lands when a traveler books through a trip. That is the incentive to publish the real logistics, not a highlight reel.",
  },
  {
    icon: BookmarkCheck,
    title: "Timing is part of the product",
    body: "Same-day port transfers, rest-day calls, and all-aboard windows are written in. You are not reverse-engineering a caption.",
  },
];

export default async function HomePage() {
  const featured = getPublishedTrips().slice(0, 6);
  const creators = await getFeaturedCreators();
  const heroCreator = getHeroCreator(creators);

  return (
    <main>
      <HomeHero creator={heroCreator} />
      <CreatorCarousel creators={creators} />

      <section className="py-16">
        <PageContainer>
          <h2 className="font-display text-3xl">Why TravelLTK</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Screenshots of someone else&apos;s Google Map are not a plan. These trips
            already have the nights, the transfers, and a price.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {VALUE_PROPS.map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                <item.icon className="size-6 text-primary" aria-hidden />
                <h3 className="mt-4 font-display text-xl">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
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
              <Link href="/explore">
                See all <ArrowRight className="size-4" />
              </Link>
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
