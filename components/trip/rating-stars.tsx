import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  max = 5,
  className,
}: {
  rating: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, index) => {
        const filled = index + 1 <= Math.round(rating);
        return (
          <Star
            key={index}
            className={cn(
              "size-4",
              filled ? "fill-warning text-warning" : "text-neutral-300",
            )}
          />
        );
      })}
    </div>
  );
}
