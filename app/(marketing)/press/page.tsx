import { LogoMark, LogoWordmark } from "@/components/marketing/logo";
import { PageContainer } from "@/components/marketing/page-container";
import { BRAND_ASSETS } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Press",
  description: "Press boilerplate, brand assets, and contact for TravelLTK.",
  path: "/press",
});

const ASSET_CARDS = [
  {
    title: "Color wordmark",
    caption: "Use on light or cream surfaces. Do not recolor.",
    href: BRAND_ASSETS.wordmark,
    fileName: "travelltk_logo.png",
    surface: "light" as const,
  },
  {
    title: "White wordmark",
    caption: "Use on photography, teal, or charcoal. Do not place on white.",
    href: BRAND_ASSETS.wordmarkOnDark,
    fileName: "travelltk_logo_white.png",
    surface: "dark" as const,
  },
  {
    title: "Icon",
    caption: "App icon, favicon, and tight layouts. Keep clear space around the globe.",
    href: BRAND_ASSETS.icon,
    fileName: "travelltk_icon.png",
    surface: "light" as const,
  },
] as const;

export default function PressPage() {
  return (
    <main className="py-10">
      <PageContainer width="narrow">
        <h1 className="font-display text-4xl">Press</h1>
        <p className="mt-4 text-muted-foreground">
          For interviews, screenshots, or founder comments, email press@travelltk.com.
          Please do not scrape creator trip pages for assets — ask us, and we will get a
          release from the creator.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl">Boilerplate</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            TravelLTK is a marketplace where travel creators publish their exact
            itineraries as bookable trips. Shoppers book a whole route or individual
            legs — flights, hotels, cruises, activities, restaurants — and creators earn
            a payout on every booking made through their trip.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Brand assets</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Download the lockups below for editorial use. Do not add drop shadows,
            outlines, or alternate colors. Leave comfortable space around the mark.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {ASSET_CARDS.map((asset) => (
              <li
                key={asset.fileName}
                className={asset.fileName === "travelltk_icon.png" ? "sm:col-span-2" : undefined}
              >
                <figure className="overflow-hidden rounded-xl border border-border">
                  <div
                    className={
                      asset.surface === "dark"
                        ? "flex min-h-40 items-center justify-center bg-neutral-900 px-8 py-10"
                        : "flex min-h-40 items-center justify-center bg-card px-8 py-10"
                    }
                  >
                    {asset.fileName === "travelltk_icon.png" ? (
                      <LogoMark alt="" className="size-20" />
                    ) : (
                      <LogoWordmark
                        variant={asset.surface === "dark" ? "onDark" : "color"}
                        alt=""
                        className="h-12"
                      />
                    )}
                  </div>
                  <figcaption className="flex flex-col gap-1 border-t border-border bg-surface-sunken px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{asset.title}</p>
                      <p className="text-xs text-muted-foreground">{asset.caption}</p>
                    </div>
                    <a
                      href={asset.href}
                      download={asset.fileName}
                      className="mt-2 text-sm font-medium text-primary hover:underline sm:mt-0"
                    >
                      Download PNG
                    </a>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      </PageContainer>
    </main>
  );
}
