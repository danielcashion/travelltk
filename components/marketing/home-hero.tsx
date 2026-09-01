import Image from "next/image";
import Link from "next/link";
import { LogoWordmark } from "@/components/marketing/logo";
import { PageContainer } from "@/components/marketing/page-container";
import { Button } from "@/components/ui/button";
import { IMAGE_BLUR_DATA_URL, unsplash } from "@/lib/images";
import {
  EILEEN_HERO_IMAGE_ID,
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

export function HomeHero({ creator }: { creator: FeaturedCreator }) {
  const imageSrc = getCreatorCoverUrl(creator);
  const usingLivePost = Boolean(creator.latestPost?.imageUrl);
  const igHref = getCreatorHref(creator);

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-neutral-900">
      <div className="absolute inset-0">
        <Image
          src={usingLivePost ? imageSrc : unsplash(EILEEN_HERO_IMAGE_ID)}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/70 to-neutral-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-neutral-900/30" />
      </div>

      <PageContainer className="relative flex min-h-[92vh] flex-col justify-end py-16 text-neutral-50 sm:py-20">
        <LogoWordmark variant="onDark" alt="" priority className="h-9 sm:h-10" />
        <p className="mt-10 text-xs font-medium tracking-widest text-secondary uppercase">
          Featured creator
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl text-balance sm:text-6xl">
          {creator.name}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-neutral-100">
          Book the trip, not just the inspiration. {creator.tagline}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href={igHref} target="_blank" rel="noreferrer">
              <InstagramGlyph className="size-4" />
              @{creator.handle}
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/explore">Explore trips</Link>
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
