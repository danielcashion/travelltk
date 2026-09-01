import Image from "next/image";
import { BRAND_ASSETS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const WORDMARK_INTRINSIC = { width: 300, height: 102 } as const;
const ICON_INTRINSIC = { width: 128, height: 128 } as const;

type LogoWordmarkProps = {
  /** Color lockup for light surfaces; onDark for photos, teal, and charcoal. */
  variant?: "color" | "onDark";
  className?: string;
  priority?: boolean;
  /** Set empty when a parent already names the brand (e.g. a home link). */
  alt?: string;
};

export function LogoWordmark({
  variant = "color",
  className,
  priority = false,
  alt = SITE_NAME,
}: LogoWordmarkProps) {
  return (
    <Image
      src={variant === "onDark" ? BRAND_ASSETS.wordmarkOnDark : BRAND_ASSETS.wordmark}
      alt={alt}
      width={WORDMARK_INTRINSIC.width}
      height={WORDMARK_INTRINSIC.height}
      quality={95}
      priority={priority}
      className={cn("h-8 w-auto object-contain object-left", className)}
    />
  );
}

type LogoMarkProps = {
  className?: string;
  priority?: boolean;
  alt?: string;
};

export function LogoMark({ className, priority = false, alt = "" }: LogoMarkProps) {
  return (
    <Image
      src={BRAND_ASSETS.icon}
      alt={alt}
      width={ICON_INTRINSIC.width}
      height={ICON_INTRINSIC.height}
      quality={95}
      priority={priority}
      className={cn("size-8 object-contain", className)}
    />
  );
}
