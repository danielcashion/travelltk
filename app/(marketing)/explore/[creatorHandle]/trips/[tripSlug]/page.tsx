import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, Users } from "lucide-react";
import { PageContainer } from "@/components/marketing/page-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CreatorAvatarRow } from "@/components/trip/creator-avatar-row";
import { LegCard } from "@/components/trip/leg-card";
import { PriceBreakdown } from "@/components/trip/price-breakdown";
import { RatingStars } from "@/components/trip/rating-stars";
import { SaveButton } from "@/components/trip/save-button";
import { TripGrid } from "@/components/trip/trip-grid";
import { TripJsonLd } from "@/components/trip/trip-json-ld";
import { formatCompactNumber, formatCurrency, formatDuration } from "@/lib/formatting";
import { IMAGE_BLUR_DATA_URL } from "@/lib/images";
import {
  getCreatorByHandle,
  getRelatedTrips,
  getReviewsForTrip,
  getTripBySlug,
} from "@/lib/mock-data";
import { PLATFORM_BOOKING_FEE_LABEL } from "@/lib/constants";
import { tripPath } from "@/lib/paths";
import { pageMetadata, absUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ creatorHandle: string; tripSlug: string }>;
}) {
  const { creatorHandle, tripSlug } = await params;
  const trip = getTripBySlug(tripSlug);
  if (!trip) return { title: "Trip" };
  return pageMetadata({
    title: trip.title,
    description: trip.description,
    path: tripPath(creatorHandle, tripSlug),
    image: trip.coverImageUrl,
  });
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ creatorHandle: string; tripSlug: string }>;
}) {
  const { creatorHandle, tripSlug } = await params;
  const creator = getCreatorByHandle(creatorHandle);
  const trip = getTripBySlug(tripSlug);

  if (!creator || !trip || trip.creatorId !== creator.id) {
    notFound();
  }

  const reviews = getReviewsForTrip(trip.id);
  const related = getRelatedTrips(trip);
  const includedTotal = trip.days
    .flatMap((day) => day.legs)
    .filter((leg) => leg.includedInTrip)
    .reduce((sum, leg) => sum + leg.priceEstimateUsd, 0);

  return (
    <main>
      <TripJsonLd
        trip={trip}
        url={absUrl(tripPath(creator.handle, trip.slug))}
      />
      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <PageContainer className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm text-muted-foreground">
              {trip.destinations.join(" → ")} · {formatDuration(trip.nights)}
            </p>
            <p className="truncate font-medium">{trip.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">From {formatCurrency(trip.priceFromUsd)}</p>
            <Button asChild>
              <Link href={`/checkout/${trip.id}`}>Book this trip</Link>
            </Button>
          </div>
        </PageContainer>
      </div>

      <div className="relative aspect-[21/9] min-h-56 w-full bg-muted">
        <Image
          src={trip.coverImageUrl}
          alt={trip.title}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className="object-cover"
        />
      </div>

      <PageContainer className="grid gap-10 py-10 lg:grid-cols-[1fr_20rem]">
        <div>
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            {trip.subtitle}
          </p>
          <h1 className="mt-2 font-display text-4xl text-balance">{trip.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <RatingStars rating={trip.averageRating} />
            <span>
              {trip.averageRating.toFixed(1)} · {trip.reviewCount} reviews
            </span>
            <span className="inline-flex items-center gap-1">
              <Bookmark className="size-4" aria-hidden />
              {formatCompactNumber(trip.saveCount)} saves
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-4" aria-hidden />
              {formatCompactNumber(trip.bookingCount)} people booked this trip
            </span>
            <SaveButton />
          </div>
          <p className="mt-6 max-w-2xl text-muted-foreground">{trip.description}</p>

          <section className="mt-10">
            <h2 className="font-display text-2xl">Creator</h2>
            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              <CreatorAvatarRow creator={creator} showFollowers />
              <p className="mt-3 text-sm text-muted-foreground">{creator.bio}</p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href={`/explore/${creator.handle}`}>View profile</Link>
              </Button>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl">Day by day</h2>
            <Accordion type="multiple" defaultValue={["day-1"]} className="mt-4">
              {trip.days.map((day) => (
                <AccordionItem key={day.dayNumber} value={`day-${day.dayNumber}`}>
                  <AccordionTrigger>
                    <span className="text-left">
                      <span className="block font-medium">
                        Day {day.dayNumber} · {day.title}
                      </span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {day.location}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4 text-sm text-muted-foreground">{day.summary}</p>
                    <div className="space-y-3">
                      {day.legs.map((item) => (
                        <LegCard key={item.id} leg={item} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No reviews yet. Be the first traveler to book this route.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <li key={review.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{review.authorName}</p>
                      <RatingStars rating={review.rating} />
                    </div>
                    <p className="mt-1 font-display text-lg">{review.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-36 lg:self-start">
          <PriceBreakdown
            items={[
              {
                label: "Trip / included legs",
                amountUsd: includedTotal || trip.priceFromUsd,
                kind: "trip",
              },
              {
                label: PLATFORM_BOOKING_FEE_LABEL,
                amountUsd: trip.bookingFeeUsd,
                kind: "fee",
              },
            ]}
            totalLabel="From (per traveler)"
          />
          <Button asChild className="mt-4 w-full" size="lg">
            <Link href={`/checkout/${trip.id}`}>Book this trip</Link>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Trip and leg cost is what suppliers charge. The TravelLTK booking fee is a
            separate platform line item and is never bundled into a supplier rate.
          </p>
        </aside>
      </PageContainer>

      <section className="border-t border-border bg-surface-sunken py-12">
        <PageContainer>
          <h2 className="font-display text-2xl">Related trips</h2>
          <div className="mt-6">
            <TripGrid
              trips={related}
              emptyTitle="No related trips yet"
            />
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
