import type { ReactNode } from "react";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-sunken px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        {icon ?? <Compass className="size-6" aria-hidden />}
      </div>
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
