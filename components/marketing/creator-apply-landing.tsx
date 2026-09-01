import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageContainer } from "@/components/marketing/page-container";
import { Button } from "@/components/ui/button";
import { confirmedCreators } from "@/lib/confirmed-creators";
import { formatCompactNumber } from "@/lib/formatting";
import { creatorCoverPositionClass, IMAGE_BLUR_DATA_URL, unsplash } from "@/lib/images";
import { cn } from "@/lib/utils";
import { creatorPath } from "@/lib/paths";
import { TRIP_CATEGORIES } from "@/types";

const HERO_IMAGE = "/images/creators/3965012587151108160_396557061.jpg";

const ACCESS = [
  {
    title: "A bookable itinerary, not a caption",
    body: "Days, hotels, transfers, and a price — published as a product travelers can actually buy.",
  },
  {
    title: "A payout on every booking",
    body: "When someone books your route, or a single leg of it, you earn. The relationship is with the booking.",
  },
  {
    title: "Shoppers who already want your trip",
    body: "They followed the still. They are here to reconstruct the nights, not to browse a destination in the abstract.",
  },
  {
    title: "A studio built for the route",
    body: "Add days and legs, attach supplier names, and keep optional bookings separate from what is included.",
  },
];

const VALUE = [
  {
    eyebrow: "The product",
    title: "The itinerary is the merchandise",
    body: "Travelers book the week you actually took — or the hotel, the transfer, the table. Each leg is priced on its own.",
    image: unsplash("photo-1520250497591-112f2f40a3f4"),
  },
  {
    eyebrow: "The economics",
    title: "You earn when they travel",
    body: "A payout lands on the booking, not on a screenshot of an affiliate link. That is the incentive to publish the real logistics.",
    image: unsplash("photo-1540541338287-41700207dee6"),
  },
  {
    eyebrow: "The audience",
    title: "High-intent, already converted to the idea",
    body: "They are not discovering travel. They are trying to take your Amalfi week, your alpine recovery, your desert buffer night.",
    image: unsplash("photo-1516483638261-f4dbaf036963"),
  },
  {
    eyebrow: "The standard",
    title: "Honest nights, honest names",
    body: "Supplier names, check-in times, and rest-day calls stay in the itinerary. Highlight reels do not survive review.",
    image: unsplash("photo-1551524559-8af4e6624178"),
  },
];

export function CreatorApplyLanding({
  minFollowerCount,
  children,
}: {
  minFollowerCount: number;
  children: ReactNode;
}) {
  const followerLabel = formatCompactNumber(minFollowerCount);

  return (
    <main>
      <section className="relative isolate min-h-[32rem] overflow-hidden bg-neutral-900 sm:min-h-[38rem]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/75 to-neutral-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/40" />
        </div>
        <PageContainer className="relative flex min-h-[32rem] flex-col justify-end py-16 text-neutral-50 sm:min-h-[38rem] sm:py-20">
          <p className="text-xs font-medium tracking-widest text-secondary uppercase">
            Become a creator
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl text-balance sm:text-6xl">
            Publish the trip you actually took.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-neutral-100">
            Write the route once. Travelers book the itinerary — or a single leg —
            and you earn when they do.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-6">
              <a href="#apply">Apply now</a>
            </Button>
            <Button asChild size="lg" variant="secondary" className="h-11 px-6">
              <Link href="/creators">See the collection</Link>
            </Button>
          </div>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-24">
        <PageContainer className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/images/creators/christine-dz8c-home.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              className="object-cover object-[center_bottom]"
            />
          </div>
          <div>
            <p className="text-xs font-medium tracking-widest text-secondary uppercase">
              What you publish
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              The route becomes a product.
            </h2>
            <p className="mt-4 text-muted-foreground">
              TravelLTK exists so a trip that already worked does not die in a
              Stories archive. Creators document the nights. Shoppers book them.
            </p>
            <ol className="mt-10 space-y-8">
              {ACCESS.map((item, index) => (
                <li key={item.title} className="flex gap-5">
                  <span className="font-display text-sm tracking-widest text-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </PageContainer>
      </section>

      <section className="border-y border-border bg-surface-sunken py-16 sm:py-24">
        <PageContainer>
          <p className="text-xs font-medium tracking-widest text-secondary uppercase">
            Who we review
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl sm:text-4xl">
            We are looking for creators who already travel this way.
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            <li className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-medium tracking-widest text-secondary uppercase">
                Audience
              </p>
              <h3 className="mt-3 font-display text-2xl">
                {followerLabel} followers, verified
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Instagram Business or Creator account, proven with Instagram Login.
                A TikTok handle can go to manual review if Login is not complete.
              </p>
            </li>
            <li className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-medium tracking-widest text-secondary uppercase">
                Craft
              </p>
              <h3 className="mt-3 font-display text-2xl">A trip you can write day by day</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Hotels, transfers, and the order you actually moved. Not a mood board.
                Not a city list without nights.
              </p>
            </li>
            <li className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-medium tracking-widest text-secondary uppercase">
                Honesty
              </p>
              <h3 className="mt-3 font-display text-2xl">Real suppliers, real prices</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Name the hotel. Keep optional legs optional. Reviewers flag routes that
                cannot be booked as written.
              </p>
            </li>
            <li className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-medium tracking-widest text-secondary uppercase">
                Payouts
              </p>
              <h3 className="mt-3 font-display text-2xl">A destination for earnings</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Stripe Connect Express is set up in the studio after acceptance. We do
                not bundle your payout into a supplier rate.
              </p>
            </li>
          </ul>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-24">
        <PageContainer>
          <p className="text-xs font-medium tracking-widest text-secondary uppercase">
            The value of publishing here
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl sm:text-4xl">
            Built for the trip, not for a product grid.
          </h2>
          <ul className="mt-10 grid gap-6 lg:grid-cols-2">
            {VALUE.map((item) => (
              <li
                key={item.title}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="relative aspect-[16/9] bg-muted">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-medium tracking-widest text-secondary uppercase">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">{item.title}</h3>
                  <p className="mt-3 text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>

      <section className="bg-neutral-900 py-16 text-neutral-50 sm:py-20">
        <PageContainer>
          <p className="text-xs font-medium tracking-widest text-secondary uppercase">
            Confirmed creators
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl sm:text-4xl">
            This is the standard we publish against.
          </h2>
          <p className="mt-4 max-w-xl text-neutral-300">
            Eileen Gu and Christine Drinan are live on TravelLTK — historical trips,
            hotels, and the films that belong to the route.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {confirmedCreators.map((creator) => (
              <li key={creator.id}>
                <Link
                  href={creatorPath(creator.handle)}
                  className="group relative block overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none"
                >
                  <div className="relative aspect-[5/4] bg-neutral-800">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-xs font-medium tracking-widest text-secondary uppercase">
                        Confirmed
                      </p>
                      <h3 className="mt-2 font-display text-3xl">{creator.displayName}</h3>
                      <p className="mt-1 text-sm text-neutral-200">@{creator.handle}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer>
          <p className="text-xs font-medium tracking-widest text-secondary uppercase">
            Categories we publish
          </p>
          <h2 className="mt-3 font-display text-3xl">Every kind of route, if it is real.</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TRIP_CATEGORIES.map((category) => (
              <li
                key={category.slug}
                className="rounded-xl border border-border bg-card px-4 py-5 text-center font-display text-lg"
              >
                {category.label}
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>

      <section
        id="apply"
        className="scroll-mt-20 border-t border-border bg-surface-sunken py-16 sm:py-24"
      >
        <PageContainer className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div>
            <p className="text-xs font-medium tracking-widest text-secondary uppercase">
              Ready to apply
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Start with the itinerary you already have.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Connect Instagram to prove you own the account. Typical response after
              review is two weeks. Incomplete applications are not queued.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li>Instagram Login — no Facebook Page required.</li>
              <li>
                Minimum {followerLabel} followers on a Business or Creator account.
              </li>
              <li>Sample links to the trip you intend to publish first.</li>
            </ul>
          </div>
          <div>{children}</div>
        </PageContainer>
      </section>
    </main>
  );
}
