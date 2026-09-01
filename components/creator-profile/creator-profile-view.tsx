import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Clock,
  MapPin,
  Play,
} from "lucide-react";
import { PageContainer } from "@/components/marketing/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LegCard } from "@/components/trip/leg-card";
import { isConfirmedCreatorHandle } from "@/lib/confirmed-creators";
import { formatCompactNumber, formatCurrency, formatDuration } from "@/lib/formatting";
import { creatorCoverPositionClass, IMAGE_BLUR_DATA_URL } from "@/lib/images";
import { cn } from "@/lib/utils";
import { tripPath } from "@/lib/paths";
import { tripAnchorId, tripVideos, uniqueHotelLegs } from "@/lib/trip-itinerary";
import { TRIP_CATEGORIES, type CreatorProfile, type Trip, type TripVideo } from "@/types";

function platformLabel(platform: TripVideo["platform"]): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube") return "YouTube";
  return "Notes";
}

function VideoCard({ video }: { video: TripVideo }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noreferrer"
      className="group relative block overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none"
    >
      <div className="relative aspect-[16/10] bg-muted">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-neutral-900/25" />
        <span className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-50/95 text-neutral-900 shadow-sm">
          <Play className="size-5 fill-current" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-xs font-medium tracking-widest text-secondary uppercase">
        {platformLabel(video.platform)}
      </p>
      <p className="mt-1 flex items-center gap-1 font-medium">
        {video.title}
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </p>
    </a>
  );
}

function TripSection({
  trip,
  creator,
  index,
}: {
  trip: Trip;
  creator: CreatorProfile;
  index: number;
}) {
  const hotels = uniqueHotelLegs(trip);
  const videos = tripVideos(trip);
  const category = TRIP_CATEGORIES.find((item) => item.slug === trip.category);
  const href = tripPath(creator.handle, trip.slug);
  const sunken = index % 2 === 1;

  return (
    <section
      id={tripAnchorId(trip.slug)}
      className={sunken ? "scroll-mt-32 bg-surface-sunken py-16 sm:py-20" : "scroll-mt-32 py-16 sm:py-20"}
    >
      <PageContainer>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-widest text-secondary uppercase">
              {trip.seasonLabel ?? "Published itinerary"}
              {category ? ` · ${category.label}` : ""}
            </p>
            <h2 className="mt-3 font-display text-3xl text-balance sm:text-4xl">{trip.title}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{trip.subtitle}</p>
            <p className="mt-4 max-w-2xl text-muted-foreground">{trip.description}</p>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden />
                {trip.destinations.join(" → ")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden />
                {formatDuration(trip.nights)}
              </span>
              <span className="font-medium text-foreground">
                From {formatCurrency(trip.priceFromUsd)}
              </span>
            </div>
            <Button asChild size="lg" className="mt-6">
              <Link href={href}>Book this trip</Link>
            </Button>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            <Image
              src={trip.coverImageUrl}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              className="object-cover"
            />
          </div>
        </div>

        {hotels.length > 0 ? (
          <div className="mt-14">
            <h3 className="font-display text-2xl">Hotels</h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              The rooms from this itinerary, in the order they were slept in.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel) => (
                <li
                  key={hotel.id}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Building2 className="size-5" aria-hidden />
                  </span>
                  <p className="mt-4 font-display text-xl">{hotel.supplierName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{hotel.location}</p>
                  <p className="mt-3 text-sm">{hotel.description}</p>
                  <p className="mt-4 text-sm font-medium">
                    From {formatCurrency(hotel.priceEstimateUsd)} / night
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-14">
          <h3 className="font-display text-2xl">Day by day</h3>
          <ol className="mt-8 space-y-0">
            {trip.days.map((day, dayIndex) => (
              <li key={day.dayNumber} className="relative grid gap-6 sm:grid-cols-[4.5rem_1fr]">
                <div className="relative hidden sm:block">
                  <span className="relative z-10 flex size-10 items-center justify-center rounded-full border border-secondary/40 bg-background font-display text-sm text-secondary">
                    {String(day.dayNumber).padStart(2, "0")}
                  </span>
                  {dayIndex < trip.days.length - 1 ? (
                    <span
                      className="absolute top-10 left-5 h-[calc(100%-0.5rem)] w-px bg-border"
                      aria-hidden
                    />
                  ) : null}
                </div>
                <div className="pb-10">
                  <p className="text-xs font-medium tracking-widest text-secondary uppercase sm:hidden">
                    Day {day.dayNumber}
                  </p>
                  <h4 className="font-display text-2xl">{day.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{day.location}</p>
                  <p className="mt-3 text-muted-foreground">{day.summary}</p>
                  <div className="mt-4 space-y-3">
                    {day.legs.map((item) => (
                      <LegCard key={item.id} leg={item} />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {videos.length > 0 ? (
          <div className="mt-6">
            <h3 className="font-display text-2xl">Linked videos</h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              The posts and notes that belong to this route.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        ) : null}
      </PageContainer>
    </section>
  );
}

export function CreatorProfileView({
  creator,
  trips,
}: {
  creator: CreatorProfile;
  trips: Trip[];
}) {
  const confirmed = isConfirmedCreatorHandle(creator.handle);
  const instagram = creator.socials.instagram;

  return (
    <main>
      <section className="relative isolate min-h-[28rem] overflow-hidden bg-neutral-900 sm:min-h-[32rem]">
        <div className="absolute inset-0">
          {creator.coverImageUrl ? (
            <Image
              src={creator.coverImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              className={cn(
                "object-cover",
                creator.handle === "galavantingchristine"
                  ? creatorCoverPositionClass(creator.handle)
                  : "object-[center_35%]",
              )}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/75 to-neutral-900/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-neutral-900/40" />
        </div>
        <PageContainer className="relative flex min-h-[28rem] flex-col justify-end py-12 text-neutral-50 sm:min-h-[32rem] sm:py-16">
          {confirmed ? (
            <p className="text-xs font-medium tracking-widest text-secondary uppercase">
              Confirmed creator
            </p>
          ) : (
            <p className="text-xs font-medium tracking-widest text-secondary uppercase">
              Creator
            </p>
          )}
          <h1 className="mt-2 font-display text-4xl text-balance sm:text-5xl">
            {creator.displayName}
          </h1>
          <p className="mt-2 text-neutral-200">
            @{creator.handle}
            <span className="text-neutral-400">
              {" "}
              · {formatCompactNumber(creator.followerCount)} followers
            </span>
          </p>
          <p className="mt-6 max-w-2xl text-lg text-neutral-100">{creator.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {creator.categories.map((slug) => {
              const category = TRIP_CATEGORIES.find((item) => item.slug === slug);
              return (
                <Badge key={slug} variant="secondary">
                  {category?.label ?? slug}
                </Badge>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {trips[0] ? (
              <Button asChild size="lg">
                <a href={`#${tripAnchorId(trips[0].slug)}`}>View itineraries</a>
              </Button>
            ) : null}
            {instagram ? (
              <Button asChild size="lg" variant="secondary">
                <a href={instagram} target="_blank" rel="noreferrer">
                  @{creator.handle} on Instagram
                </a>
              </Button>
            ) : null}
          </div>
        </PageContainer>
      </section>

      {trips.length > 0 ? (
        <nav
          className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur"
          aria-label="Itineraries"
        >
          <PageContainer className="flex gap-2 overflow-x-auto py-3">
            {trips.map((trip) => (
              <a
                key={trip.id}
                href={`#${tripAnchorId(trip.slug)}`}
                className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-secondary hover:text-foreground"
              >
                {trip.destinations[0]}
                {trip.seasonLabel ? ` · ${trip.seasonLabel}` : ""}
              </a>
            ))}
          </PageContainer>
        </nav>
      ) : null}

      {trips.length === 0 ? (
        <PageContainer className="py-16">
          <h2 className="font-display text-2xl">Published trips</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {creator.displayName} has not published a bookable itinerary yet.
          </p>
        </PageContainer>
      ) : (
        trips.map((trip, index) => (
          <TripSection key={trip.id} trip={trip} creator={creator} index={index} />
        ))
      )}
    </main>
  );
}
