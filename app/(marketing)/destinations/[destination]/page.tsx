import { notFound } from "next/navigation";
import { PageContainer } from "@/components/marketing/page-container";
import { TripGrid } from "@/components/trip/trip-grid";
import { allDestinations, getTripsByDestination } from "@/lib/mock-data";
import { destinationPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ destination: string }>;
}) {
  const { destination } = await params;
  const decoded = decodeURIComponent(destination);
  return pageMetadata({
    title: decoded,
    description: `Creator trips that include ${decoded}.`,
    path: destinationPath(decoded),
  });
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ destination: string }>;
}) {
  const { destination } = await params;
  const decoded = decodeURIComponent(destination);
  const match = allDestinations().find((item) => item.toLowerCase() === decoded.toLowerCase());
  if (!match) notFound();

  const trips = getTripsByDestination(match);

  return (
    <main className="py-10">
      <PageContainer>
        <p className="text-sm font-medium tracking-wide text-primary uppercase">Destination</p>
        <h1 className="mt-2 font-display text-4xl">{match}</h1>
        <p className="mt-2 text-muted-foreground">
          Published trips that include at least one night or transfer in {match}.
        </p>
        <div className="mt-8">
          <TripGrid
            trips={trips}
            emptyTitle={`No trips through ${match} yet`}
          />
        </div>
      </PageContainer>
    </main>
  );
}
