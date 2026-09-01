import { notFound } from "next/navigation";
import { PageContainer } from "@/components/marketing/page-container";
import { StudioNav } from "@/components/creator-studio/studio-nav";
import { TripBuilder } from "@/components/creator-studio/trip-builder";
import { getTripById } from "@/lib/mock-data";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  return (
    <main className="py-10">
      <PageContainer>
        <StudioNav />
        <h1 className="mt-6 font-display text-4xl">Edit trip</h1>
        <p className="mt-2 mb-8 text-muted-foreground">{trip.title}</p>
        <TripBuilder trip={trip} />
      </PageContainer>
    </main>
  );
}
