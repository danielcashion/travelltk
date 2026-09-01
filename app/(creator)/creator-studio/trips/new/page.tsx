import { PageContainer } from "@/components/marketing/page-container";
import { StudioNav } from "@/components/creator-studio/studio-nav";
import { TripBuilder } from "@/components/creator-studio/trip-builder";

export default function NewTripPage() {
  return (
    <main className="py-10">
      <PageContainer>
        <StudioNav current="/creator-studio/trips/new" />
        <h1 className="mt-6 font-display text-4xl">New trip</h1>
        <p className="mt-2 mb-8 text-muted-foreground">
          Metadata first, then a day-by-day itinerary. Cover media upload hits S3 after
          Phase 7; for now the URL field is a stand-in.
        </p>
        <TripBuilder />
      </PageContainer>
    </main>
  );
}
