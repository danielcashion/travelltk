import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/marketing/page-container";
import { EmptyState } from "@/components/trip/empty-state";
import { TripGrid } from "@/components/trip/trip-grid";
import { IMAGE_BLUR_DATA_URL } from "@/lib/images";
import {
  allDestinations,
  creators,
  getPublishedTrips,
} from "@/lib/mock-data";
import { creatorPath, destinationPath } from "@/lib/paths";
import { filterTrips } from "@/lib/trip-filters";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Search",
  description: "Search TravelLTK trips, creators, and destinations.",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const needle = query.toLowerCase();

  const trips = query
    ? filterTrips(getPublishedTrips(), { query, sort: "trending" })
    : [];
  const matchedCreators = query
    ? creators.filter((creator) =>
        [creator.handle, creator.displayName, creator.bio]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
    : [];
  const matchedDestinations = query
    ? allDestinations().filter((item) => item.toLowerCase().includes(needle))
    : [];

  const hasQuery = query.length > 0;
  const empty = hasQuery && trips.length + matchedCreators.length + matchedDestinations.length === 0;

  return (
    <main className="py-10">
      <PageContainer>
        <h1 className="font-display text-4xl">Search</h1>
        <form className="mt-6" action="/search">
          <label htmlFor="q" className="sr-only">
            Search trips, creators, destinations
          </label>
          <input
            id="q"
            name="q"
            defaultValue={query}
            placeholder="Try Paris, Mira, ski…"
            className="h-11 w-full max-w-xl rounded-lg border border-input bg-background px-3 text-sm"
          />
        </form>

        {!hasQuery ? (
          <div className="mt-10">
            <EmptyState
              title="Search trips, creators, and destinations"
              description="Type a city, a creator handle, or a kind of trip. Results appear in three groups so you can jump to a profile or a route."
            />
          </div>
        ) : null}

        {empty ? (
          <div className="mt-10">
            <EmptyState
              title={`No matches for “${query}”`}
              description="Try a destination name, a creator handle, or a broader word like cruise or ski."
            />
          </div>
        ) : null}

        {matchedDestinations.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-2xl">Destinations</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {matchedDestinations.map((destination) => (
                <li key={destination}>
                  <Link
                    href={destinationPath(destination)}
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-accent"
                  >
                    {destination}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {matchedCreators.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-2xl">Creators</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {matchedCreators.map((creator) => (
                <li key={creator.id}>
                  <Link
                    href={creatorPath(creator.handle)}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                  >
                    <span className="relative size-12 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={creator.avatarUrl}
                        alt=""
                        fill
                        sizes="48px"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        className="object-cover"
                      />
                    </span>
                    <span>
                      <span className="block font-medium">{creator.displayName}</span>
                      <span className="text-sm text-muted-foreground">@{creator.handle}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {trips.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-2xl">Trips</h2>
            <div className="mt-6">
              <TripGrid trips={trips} />
            </div>
          </section>
        ) : null}
      </PageContainer>
    </main>
  );
}
