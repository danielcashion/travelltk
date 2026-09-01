import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMAGE_BLUR_DATA_URL } from "@/lib/images";
import {
  FEATURED_INSTAGRAM_EMBED_URL,
  FEATURED_INSTAGRAM_HANDLE,
  FEATURED_INSTAGRAM_PROFILE_URL,
  type InstagramPost,
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

export function InstagramLatestPost({ post }: { post: InstagramPost | null }) {
  const href = post?.permalink ?? FEATURED_INSTAGRAM_PROFILE_URL;

  return (
    <section className="py-16">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-8 px-4 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-primary uppercase">
            <InstagramGlyph className="size-4" />
            Instagram
          </p>
          <h2 className="mt-2 font-display text-3xl">Latest from @{FEATURED_INSTAGRAM_HANDLE}</h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Eileen Gu&apos;s most recent post, pulled from Instagram. Open it on her
            profile to see the full caption, comments, and anything she posted after
            this page last refreshed.
          </p>
          <Button asChild className="mt-6" size="lg">
            <a href={href} target="_blank" rel="noreferrer">
              {post ? "View this post on Instagram" : `Open @${FEATURED_INSTAGRAM_HANDLE} on Instagram`}
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
          {post?.caption ? (
            <p className="mt-6 line-clamp-6 text-sm text-muted-foreground">{post.caption}</p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {post?.imageUrl ? (
            <a href={post.permalink} target="_blank" rel="noreferrer" className="block">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={post.imageUrl}
                  alt={post.caption ? post.caption.slice(0, 120) : `Latest Instagram post from @${FEATURED_INSTAGRAM_HANDLE}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
            </a>
          ) : (
            <iframe
              src={FEATURED_INSTAGRAM_EMBED_URL}
              title={`Latest Instagram posts from @${FEATURED_INSTAGRAM_HANDLE}`}
              className="h-[32rem] w-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="encrypted-media; clipboard-write"
            />
          )}
        </div>
      </div>
    </section>
  );
}
