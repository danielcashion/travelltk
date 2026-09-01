import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/marketing/page-container";
import { Button } from "@/components/ui/button";
import { IMAGE_BLUR_DATA_URL } from "@/lib/images";
import { type FeaturedCreator } from "@/lib/instagram";
import { creatorPath } from "@/lib/paths";

export function HomeHero({ creator }: { creator: FeaturedCreator }) {
  return (
    <section className="relative isolate min-h-[15rem] overflow-hidden bg-neutral-900 md:min-h-[17rem]">
      <div className="absolute inset-0">
        <Image
          src={creator.moodImageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className="object-cover object-[center_45%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/50 to-neutral-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-neutral-900/20" />
      </div>

      <PageContainer className="relative flex min-h-[15rem] flex-col justify-end py-6 text-neutral-50 md:min-h-[17rem] md:py-8">
        <p className="text-xs font-medium tracking-[0.22em] text-secondary uppercase">
          Featured creator
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight text-balance sm:text-5xl">
          {creator.name}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-100/90 sm:text-lg">
          Book the trip, not just the inspiration. {creator.tagline}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={creatorPath(creator.handle)}>View itineraries</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/explore">Explore trips</Link>
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
