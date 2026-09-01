import Link from "next/link";
import { categoryPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { TripCategory } from "@/types";

const CATEGORY_ART: Record<TripCategory, string> = {
  cruise: "bg-primary/10 text-primary",
  ski: "bg-accent text-accent-foreground",
  "city-break": "bg-secondary/20 text-foreground",
  honeymoon: "bg-error/10 text-error",
  family: "bg-success/10 text-success",
  solo: "bg-neutral-100 text-neutral-800",
  adventure: "bg-warning/20 text-warning-foreground",
  luxury: "bg-primary text-primary-foreground",
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
        "flex min-h-24 items-end rounded-xl p-4 text-left transition-transform hover:-translate-y-0.5",
        CATEGORY_ART[slug],
        className,
      )}
    >
      <span className="font-display text-xl">{label}</span>
    </Link>
  );
}
