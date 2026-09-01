import Link from "next/link";
import { PageContainer } from "@/components/marketing/page-container";
import { EmptyState } from "@/components/trip/empty-state";
import { allDestinations, getTripsByDestination } from "@/lib/mock-data";
import { destinationPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Destinations",
  description: "Browse creator trips by the cities and regions they actually stop in.",
  path: "/destinations",
});

export default function DestinationsPage() {
  const destinations = allDestinations();

  return (
    <main className="py-10">
      <PageContainer>
        <h1 className="font-display text-4xl">Destinations</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every destination below appears in at least one published creator trip. Open a
          city to see the itineraries that actually stop there.
        </p>
        {destinations.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No destinations yet"
              description="Published trips will populate this list automatically."
            />
          </div>
        ) : (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => {
              const count = getTripsByDestination(destination).length;
              return (
                <li key={destination}>
                  <Link
                    href={destinationPath(destination)}
                    className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-5 transition-colors hover:bg-accent"
                  >
                    <span className="font-display text-xl">{destination}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} trip{count === 1 ? "" : "s"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </PageContainer>
    </main>
  );
}
