import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { IMAGE_BLUR_DATA_URL } from "@/lib/images";
import { formatCompactNumber } from "@/lib/formatting";
import { creatorPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { CreatorProfile } from "@/types";

export function CreatorAvatarRow({
  creator,
  showFollowers = false,
  className,
}: {
  creator: CreatorProfile;
  showFollowers?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={creatorPath(creator.handle)}
      className={cn("flex items-center gap-3", className)}
    >
      <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
        <Image
          src={creator.avatarUrl}
          alt=""
          fill
          sizes="48px"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className="object-cover"
        />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 font-medium text-foreground">
          {creator.displayName}
          {creator.verified ? (
            <BadgeCheck className="size-4 text-primary" aria-label="Verified creator" />
          ) : null}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          @{creator.handle}
          {showFollowers
            ? ` · ${formatCompactNumber(creator.followerCount)} followers`
            : null}
        </span>
      </span>
    </Link>
  );
}
