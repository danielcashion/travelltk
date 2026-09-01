import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SaveButton } from "@/components/trip/save-button";
import { formatDuration, formatPriceFrom } from "@/lib/formatting";
import { IMAGE_BLUR_DATA_URL } from "@/lib/images";
import { getCreatorById } from "@/lib/mock-data";
import { tripPath } from "@/lib/paths";
import { TRIP_CATEGORIES } from "@/types";
import type { Trip } from "@/types";

export function TripCard({ trip }: { trip: Trip }) {
  const creator = getCreatorById(trip.creatorId);
  const category = TRIP_CATEGORIES.find((item) => item.slug === trip.category);
  const href = creator ? tripPath(creator.handle, trip.slug) : "/explore";

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted sm:aspect-[4/3]">
          <Image
            src={trip.coverImageUrl}
            alt={trip.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <SaveButton />
          </div>
          {category ? (
            <Badge className="absolute bottom-3 left-3 rounded-sm tracking-[0.12em] uppercase" variant="secondary">
              {category.label}
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 p-5">
          <h3 className="font-display text-lg leading-snug text-foreground">{trip.title}</h3>
          <p className="text-sm text-muted-foreground">{trip.destinations.join(" → ")}</p>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{formatDuration(trip.nights)}</span>
            <span className="font-display text-foreground">{formatPriceFrom(trip.priceFromUsd)}</span>
          </div>
          {creator ? (
            <div className="mt-1 flex items-center gap-2">
              <span className="relative size-6 overflow-hidden rounded-full bg-muted">
                <Image
                  src={creator.avatarUrl}
                  alt=""
                  fill
                  sizes="24px"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="object-cover"
                />
              </span>
              <span className="text-sm text-muted-foreground">@{creator.handle}</span>
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
