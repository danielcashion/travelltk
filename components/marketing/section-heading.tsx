import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="text-xs font-medium tracking-[0.22em] text-secondary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-3xl text-balance sm:text-4xl",
          eyebrow && "mt-2",
          tone === "dark" ? "text-neutral-50" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 max-w-xl text-sm leading-relaxed sm:text-base",
            tone === "dark" ? "text-neutral-300" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
