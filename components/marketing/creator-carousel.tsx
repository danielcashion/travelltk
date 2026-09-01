"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PageContainer } from "@/components/marketing/page-container";
import { IMAGE_BLUR_DATA_URL } from "@/lib/images";
import {
  getCreatorCoverUrl,
  getCreatorHref,
  type FeaturedCreator,
} from "@/lib/instagram";

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function formatFollowers(count: number | null): string | null {
  if (!count) return null;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(count);
}

export function CreatorCarousel({ creators }: { creators: FeaturedCreator[] }) {
  return (
    <section className="bg-neutral-900 py-16 text-neutral-50 sm:py-20">
      <PageContainer width="wide">
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-medium tracking-widest text-secondary uppercase">
              On Instagram
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">The creators we travel with</h2>
            <p className="mt-3 text-sm text-neutral-300 sm:text-base">
              Luxury itineraries from the people whose trips you already follow. Open a
              profile, then book the route — or a single leg — on TravelLTK.
            </p>
          </div>

          <div className="relative">
            <CarouselContent className="-ml-4">
            {creators.map((creator, index) => {
              const href = getCreatorHref(creator);
              const cover = getCreatorCoverUrl(creator);
              const followers = formatFollowers(creator.followersCount);

              return (
                <CarouselItem
                  key={creator.handle}
                  className="basis-4/5 pl-4 sm:basis-1/2 lg:basis-1/3"
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none"
                  >
                    <div className="relative aspect-[3/4] bg-neutral-800">
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        priority={index < 2}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-secondary">
                          <InstagramGlyph className="size-3.5" />
                          @{creator.handle}
                          {followers ? (
                            <span className="text-neutral-300"> · {followers}</span>
                          ) : null}
                        </p>
                        <h3 className="mt-2 font-display text-2xl">{creator.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-neutral-200">{creator.tagline}</p>
                        <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-neutral-50">
                          View on Instagram
                          <ArrowUpRight className="size-4" />
                        </p>
                      </div>
                    </div>
                  </a>
                </CarouselItem>
              );
            })}
          </CarouselContent>
            <CarouselPrevious className="left-2 size-10 border-neutral-100/20 bg-neutral-900/70 text-neutral-50 hover:bg-neutral-800 hover:text-neutral-50" />
            <CarouselNext className="right-2 size-10 border-neutral-100/20 bg-neutral-900/70 text-neutral-50 hover:bg-neutral-800 hover:text-neutral-50" />
          </div>
        </Carousel>
      </PageContainer>
    </section>
  );
}
