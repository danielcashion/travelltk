import { notFound } from "next/navigation";
import { PageContainer } from "@/components/marketing/page-container";
import { TripGrid } from "@/components/trip/trip-grid";
import { getTripsByCategory } from "@/lib/mock-data";
import { categoryPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";
import { TRIP_CATEGORIES } from "@/types";
import type { TripCategory } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = TRIP_CATEGORIES.find((item) => item.slug === category);
  return pageMetadata({
    title: meta?.label ?? "Category",
    description: `Creator itineraries tagged ${meta?.label ?? category}.`,
    path: categoryPath(category),
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = TRIP_CATEGORIES.find((item) => item.slug === category);
  if (!meta) notFound();

  const trips = getTripsByCategory(category as TripCategory);

  return (
    <main className="py-10">
      <PageContainer>
        <p className="text-sm font-medium tracking-wide text-primary uppercase">Category</p>
        <h1 className="mt-2 font-display text-4xl">{meta.label}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Creator itineraries tagged {meta.label.toLowerCase()} — bookable as a full trip
          or as individual legs.
        </p>
        <div className="mt-8">
          <TripGrid trips={trips} emptyTitle={`No ${meta.label.toLowerCase()} trips yet`} />
        </div>
      </PageContainer>
    </main>
  );
}
