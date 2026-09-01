import Link from "next/link";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/creator-studio", label: "Dashboard" },
  { href: "/creator-studio/trips", label: "Trips" },
  { href: "/creator-studio/trips/new", label: "New trip" },
  { href: "/creator-studio/payouts", label: "Payouts" },
];

export function StudioNav({ current }: { current?: string }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Creator studio">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-full border border-border px-3 py-1 text-sm",
            current === link.href
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
