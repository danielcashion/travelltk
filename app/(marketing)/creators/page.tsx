import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/marketing/page-container";
import { isConfirmedCreatorHandle } from "@/lib/confirmed-creators";
import { formatCompactNumber } from "@/lib/formatting";
import { creatorCoverPositionClass, IMAGE_BLUR_DATA_URL } from "@/lib/images";
import { cn } from "@/lib/utils";
import { creators, getTripsByCreator } from "@/lib/mock-data";
import { creatorPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Creators",
  description:
    "Public itineraries from confirmed TravelLTK creators. Open a profile for historical trips, hotels, and linked videos.",
  path: "/creators",
});

export default function CreatorsIndexPage() {
  const ranked = [...creators].sort((a, b) => {
    const aConfirmed = isConfirmedCreatorHandle(a.handle) ? 1 : 0;
    const bConfirmed = isConfirmedCreatorHandle(b.handle) ? 1 : 0;
    return bConfirmed - aConfirmed;
  });

  return (
    <main>
      <section className="border-b border-border bg-neutral-900 py-16 text-neutral-50 sm:py-20">
        <PageContainer>
          <p className="text-xs font-medium tracking-widest text-secondary uppercase">
            The collection
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Creators</h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-200">
            Confirmed creators publish the trips they actually took — day by day,
            with the hotels and the films that belong to the route.
          </p>
        </PageContainer>
      </section>

      <PageContainer className="py-12 sm:py-16">
        <ul className="grid gap-6 sm:grid-cols-2">
          {ranked.map((creator) => {
            const tripCount = getTripsByCreator(creator.id).length;
            const confirmed = isConfirmedCreatorHandle(creator.handle);
            return (
              <li key={creator.id}>
                <Link
                  href={creatorPath(creator.handle)}
                  className="group relative block overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none"
                >
                  <div className="relative aspect-[4/5] bg-muted sm:aspect-[5/4]">
                    <Image
                      src={creator.coverImageUrl ?? creator.avatarUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      className={cn(
                        "object-cover transition-transform duration-700 group-hover:scale-105",
                        creatorCoverPositionClass(creator.handle),
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-neutral-50">
                      {confirmed ? (
                        <p className="text-xs font-medium tracking-widest text-secondary uppercase">
                          Confirmed
                        </p>
                      ) : null}
                      <h2 className="mt-2 font-display text-3xl">{creator.displayName}</h2>
                      <p className="mt-1 text-sm text-neutral-200">
                        @{creator.handle} · {formatCompactNumber(creator.followerCount)}{" "}
                        followers
                      </p>
                      <p className="mt-2 text-sm text-neutral-300">
                        {tripCount} {tripCount === 1 ? "itinerary" : "itineraries"}
                      </p>
                      <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
                        View profile
                        <ArrowRight className="size-4" aria-hidden />
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageContainer>
    </main>
  );
}
