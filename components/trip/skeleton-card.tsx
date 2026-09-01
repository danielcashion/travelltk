import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}
