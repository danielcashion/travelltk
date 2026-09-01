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
      <p className="text-[0.7rem] font-medium tracking-[0.2em] text-secondary uppercase">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-neutral-300 transition-colors hover:text-neutral-50"
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
    <footer className="mt-auto bg-neutral-900 text-neutral-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Link href="/" aria-label="TravelLTK home" className="inline-flex">
            <LogoWordmark variant="onDark" alt="" className="h-9" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-300">
            Private itineraries from the people whose trips you already follow.
            Book the route — or a single leg — with the person who actually took it.
          </p>
        </div>
        <FooterColumn title="Follow Us" links={SOCIAL_LINKS} />
        <FooterColumn title="Learn More" links={FOOTER_LEARN_MORE} />
        <FooterColumn title="Legal" links={FOOTER_LEGAL} />
        <FooterColumn title="Support" links={FOOTER_SUPPORT} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs tracking-wide text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p>Travel bookings are fulfilled by third-party suppliers.</p>
        </div>
      </div>
    </footer>
  );
}
