import { Suspense } from "react";
import { CreatorApplyForm } from "@/components/marketing/creator-apply-form";
import { CreatorApplyLanding } from "@/components/marketing/creator-apply-landing";
import { env, isInstagramOAuthConfigured } from "@/lib/config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Become a creator",
  description:
    "Publish the trip you actually took. Earn a payout when travelers book your itinerary or a single leg.",
  path: "/creators/apply",
});

export default function CreatorApplyPage() {
  return (
    <CreatorApplyLanding minFollowerCount={env.MIN_FOLLOWER_COUNT}>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading application…</p>}>
        <CreatorApplyForm
          minFollowerCount={env.MIN_FOLLOWER_COUNT}
          oauthConfigured={isInstagramOAuthConfigured}
        />
      </Suspense>
    </CreatorApplyLanding>
  );
}
