import Link from "next/link";
import { categoryPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { TripCategory } from "@/types";

const CATEGORY_ART: Record<TripCategory, string> = {
  cruise: "bg-primary text-primary-foreground",
  ski: "bg-neutral-900 text-neutral-50",
  "city-break": "bg-accent text-accent-foreground",
  honeymoon: "bg-secondary/30 text-foreground",
  family: "bg-neutral-100 text-neutral-800",
  solo: "bg-primary/10 text-primary",
  adventure: "bg-neutral-800 text-neutral-50",
  luxury: "bg-secondary text-secondary-foreground",
};

export function CategoryTile({
  slug,
  label,
  className,
}: {
  slug: TripCategory;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={categoryPath(slug)}
      className={cn(
        "flex min-h-28 items-end rounded-lg p-5 text-left transition-transform duration-300 hover:-translate-y-0.5",
        CATEGORY_ART[slug],
        className,
      )}
    >
      <span className="font-display text-xl tracking-tight">{label}</span>
    </Link>
  );
}
