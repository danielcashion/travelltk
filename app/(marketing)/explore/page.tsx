import Link from "next/link";
import { Suspense } from "react";
import { ExploreFilters } from "@/components/marketing/explore-filters";
import { PageContainer } from "@/components/marketing/page-container";
import { Button } from "@/components/ui/button";
import { TripGrid } from "@/components/trip/trip-grid";
import { allDestinations, getPublishedTrips } from "@/lib/mock-data";
import { pageMetadata } from "@/lib/seo";
import { filterTrips, paginate, type TripSort } from "@/lib/trip-filters";
import type { TripCategory } from "@/types";

export const metadata = pageMetadata({
  title: "Explore trips",
  description:
    "Filter published creator itineraries by destination, category, duration, and price. Book the whole trip or individual legs.",
  path: "/explore",
});

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const read = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const filters = {
    destination: read("destination"),
    category: read("category") as TripCategory | undefined,
    duration: read("duration") as "short" | "week" | "long" | undefined,
    price: read("price") as "under-2k" | "2k-4k" | "4k-plus" | undefined,
    sort: (read("sort") as TripSort | undefined) ?? "trending",
    query: read("q"),
    page: Number(read("page") ?? "1"),
  };

  const filtered = filterTrips(getPublishedTrips(), filters);
  const page = paginate(filtered, filters.page);

  return (
    <main className="py-10">
      <PageContainer>
        <h1 className="font-display text-4xl">Explore trips</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Filter published creator itineraries by where they go, how long they run, and
          what they cost from. Book the whole trip or individual legs on the trip page.
        </p>
        <div className="mt-8">
          <Suspense fallback={<div className="h-40 rounded-xl bg-muted" />}>
            <ExploreFilters destinations={allDestinations()} />
          </Suspense>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {page.total} trip{page.total === 1 ? "" : "s"}
        </p>
        <div className="mt-4">
          <TripGrid trips={page.items} />
        </div>
        {page.totalPages > 1 ? (
          <div className="mt-8 flex justify-center gap-2">
            {page.page > 1 ? (
              <Button asChild variant="outline">
                <Link href={`/explore?${nextQuery(params, page.page - 1)}`}>Previous</Link>
              </Button>
            ) : null}
            <span className="self-center text-sm text-muted-foreground">
              Page {page.page} of {page.totalPages}
            </span>
            {page.page < page.totalPages ? (
              <Button asChild variant="outline">
                <Link href={`/explore?${nextQuery(params, page.page + 1)}`}>Next</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </PageContainer>
    </main>
  );
}

function nextQuery(
  params: Record<string, string | string[] | undefined>,
  page: number,
): string {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const resolved = Array.isArray(value) ? value[0] : value;
    if (resolved) next.set(key, resolved);
  }
  next.set("page", String(page));
  return next.toString();
}
