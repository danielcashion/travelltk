import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { PageContainer } from "@/components/marketing/page-container";
import { EmptyState } from "@/components/trip/empty-state";
import { TripGrid } from "@/components/trip/trip-grid";
import { formatCompactNumber } from "@/lib/formatting";
import { IMAGE_BLUR_DATA_URL } from "@/lib/images";
import { getCreatorByHandle, getTripsByCreator } from "@/lib/mock-data";
import { creatorPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ creatorHandle: string }>;
}) {
  const { creatorHandle } = await params;
  const creator = getCreatorByHandle(creatorHandle);
  if (!creator) return { title: "Creator" };
  return pageMetadata({
    title: `${creator.displayName} (@${creator.handle})`,
    description: creator.bio,
    path: creatorPath(creator.handle),
    image: creator.avatarUrl,
  });
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ creatorHandle: string }>;
}) {
  const { creatorHandle } = await params;
  const creator = getCreatorByHandle(creatorHandle);
  if (!creator) notFound();

  const trips = getTripsByCreator(creator.id);

  return (
    <main>
      <div className="relative h-48 w-full bg-muted sm:h-64">
        {creator.coverImageUrl ? (
          <Image
            src={creator.coverImageUrl}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
            className="object-cover"
          />
        ) : null}
      </div>
      <PageContainer className="pb-16">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
          <span className="relative size-24 overflow-hidden rounded-full border-4 border-background bg-muted">
            <Image
              src={creator.avatarUrl}
              alt=""
              fill
              sizes="96px"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              className="object-cover"
            />
          </span>
          <div className="pb-2">
            <h1 className="flex items-center gap-2 font-display text-3xl">
              {creator.displayName}
              {creator.verified ? (
                <BadgeCheck className="size-6 text-primary" aria-label="Verified" />
              ) : null}
            </h1>
            <p className="text-muted-foreground">
              @{creator.handle} · {formatCompactNumber(creator.followerCount)} followers
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-muted-foreground">{creator.bio}</p>
        <section className="mt-10">
          <h2 className="font-display text-2xl">Published trips</h2>
          <div className="mt-6">
            {trips.length === 0 ? (
              <EmptyState
                title="No published trips yet"
                description={`${creator.displayName} has not published a bookable itinerary. Check back soon.`}
              />
            ) : (
              <TripGrid trips={trips} />
            )}
          </div>
        </section>
      </PageContainer>
    </main>
  );
}
