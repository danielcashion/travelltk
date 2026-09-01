import Link from "next/link";
import { PageContainer } from "@/components/marketing/page-container";
import { allDestinations, creators, getPublishedTrips } from "@/lib/mock-data";
import { categoryPath, creatorPath, destinationPath, tripPath } from "@/lib/paths";
import { FOOTER_LEARN_MORE, FOOTER_LEGAL, FOOTER_SUPPORT, PRIMARY_NAV } from "@/lib/constants";
import { TRIP_CATEGORIES } from "@/types";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sitemap",
  description: "All public TravelLTK routes.",
  path: "/sitemap",
});

function Group({ title, hrefs }: { title: string; hrefs: { href: string; label: string }[] }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-2xl">{title}</h2>
      <ul className="mt-3 columns-1 gap-x-8 sm:columns-2">
        {hrefs.map((item) => (
          <li key={item.href} className="mb-2 break-inside-avoid">
            <Link href={item.href} className="text-sm text-primary hover:underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SitemapPage() {
  const staticRoutes = [
    { href: "/", label: "Home" },
    ...PRIMARY_NAV,
    { href: "/search", label: "Search" },
    { href: "/destinations", label: "Destinations" },
    { href: "/login", label: "Sign in" },
    ...FOOTER_LEARN_MORE,
    ...FOOTER_LEGAL,
    ...FOOTER_SUPPORT,
  ];

  const uniqueStatic = [...new Map(staticRoutes.map((item) => [item.href, item])).values()];

  return (
    <main className="py-10">
      <PageContainer>
        <h1 className="font-display text-4xl">Sitemap</h1>
        <p className="mt-2 text-muted-foreground">
          Public routes currently published on TravelLTK. Generated from the live mock
          catalog plus the marketing IA.
        </p>
        <Group title="Marketing" hrefs={uniqueStatic} />
        <Group
          title="Categories"
          hrefs={TRIP_CATEGORIES.map((item) => ({
            href: categoryPath(item.slug),
            label: item.label,
          }))}
        />
        <Group
          title="Destinations"
          hrefs={allDestinations().map((item) => ({
            href: destinationPath(item),
            label: item,
          }))}
        />
        <Group
          title="Creators"
          hrefs={creators.map((creator) => ({
            href: creatorPath(creator.handle),
            label: `@${creator.handle}`,
          }))}
        />
        <Group
          title="Trips"
          hrefs={getPublishedTrips().flatMap((trip) => {
            const creator = creators.find((item) => item.id === trip.creatorId);
            if (!creator) return [];
            return [{ href: tripPath(creator.handle, trip.slug), label: trip.title }];
          })}
        />
      </PageContainer>
    </main>
  );
}
