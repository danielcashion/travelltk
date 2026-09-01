import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatting";
import { PLATFORM_BOOKING_FEE_LABEL } from "@/lib/constants";
import type { PriceLineItem } from "@/types";

export function PriceBreakdown({
  items,
  totalLabel = "Estimated total",
}: {
  items: PriceLineItem[];
  totalLabel?: string;
}) {
  const total = items.reduce((sum, item) => sum + item.amountUsd, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-muted-foreground">
              {item.kind === "fee" ? PLATFORM_BOOKING_FEE_LABEL : item.label}
              {item.kind === "fee" ? (
                <span className="mt-0.5 block text-xs">
                  Platform booking fee, separate from trip and leg cost.
                </span>
              ) : null}
            </span>
            <span className="font-medium text-foreground">
              {formatCurrency(item.amountUsd, true)}
            </span>
          </li>
        ))}
      </ul>
      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground">{totalLabel}</span>
        <span className="font-display text-xl text-foreground">
          {formatCurrency(total, true)}
        </span>
      </div>
    </div>
  );
}
