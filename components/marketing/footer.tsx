import Link from "next/link";
import { LogoWordmark } from "@/components/marketing/logo";
import {
  FOOTER_LEARN_MORE,
  FOOTER_LEGAL,
  FOOTER_SUPPORT,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-sunken">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Link href="/" aria-label="TravelLTK home" className="inline-flex">
            <LogoWordmark alt="" className="h-9" />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Creator itineraries, bookable as a trip or as individual legs. Payouts go to
            the person who actually took the route.
          </p>
        </div>
        <FooterColumn title="Follow Us" links={SOCIAL_LINKS} />
        <FooterColumn title="Learn More" links={FOOTER_LEARN_MORE} />
        <FooterColumn title="Legal" links={FOOTER_LEGAL} />
        <FooterColumn title="Support" links={FOOTER_SUPPORT} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p>Travel bookings are fulfilled by third-party suppliers.</p>
        </div>
      </div>
    </footer>
  );
}
