import {
  Building2,
  Compass,
  Plane,
  Ship,
  TrainFront,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatting";
import type { LegType, TripLeg } from "@/types";

const LEG_ICONS: Record<LegType, typeof Plane> = {
  flight: Plane,
  hotel: Building2,
  cruise: Ship,
  activity: Compass,
  restaurant: UtensilsCrossed,
  transport: TrainFront,
};

export function LegCard({ leg }: { leg: TripLeg }) {
  const Icon = LEG_ICONS[leg.type];

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {leg.type}
          </p>
          <h4 className="font-medium text-foreground">{leg.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{leg.description}</p>
          <p className="mt-2 text-sm text-foreground">
            {leg.supplierName}
            {leg.startTime ? ` · ${leg.startTime}` : ""}
            {leg.location ? ` · ${leg.location}` : ""}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
        <p className="font-medium text-foreground">{formatCurrency(leg.priceEstimateUsd)}</p>
        {leg.includedInTrip ? (
          <Badge variant="secondary">Included in trip</Badge>
        ) : (
          <Button size="sm" variant="outline" asChild>
            <a href={leg.bookingUrl ?? "#"} rel="noreferrer">
              Book this leg
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}
