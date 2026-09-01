"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SaveButton({
  initialSaved = false,
  className,
}: {
  initialSaved?: boolean;
  className?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved trips" : "Save trip"}
      className={cn("rounded-full bg-background/80 backdrop-blur", className)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setSaved((value) => !value);
      }}
    >
      <Heart className={cn(saved && "fill-error text-error")} />
    </Button>
  );
}
