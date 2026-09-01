"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCompactNumber } from "@/lib/formatting";
import type { PublicCreatorApplication } from "@/types/applications";

type IgReturn =
  | "verified"
  | "handle_mismatch"
  | "below_threshold"
  | "personal_account"
  | "auth_failed"
  | "invalid_state"
  | "oauth_not_configured";

const IG_MESSAGES: Record<
  IgReturn,
  { title: string; body: string; destructive: boolean }
> = {
  verified: {
    title: "Instagram verified",
    body: "Ownership confirmed. Follower count is shown below.",
    destructive: false,
  },
  handle_mismatch: {
    title: "Connected account does not match the handle you entered",
    body: "We flagged this application for manual review instead of auto-approving. You may manage more than one Instagram account — a reviewer will confirm which one to use.",
    destructive: true,
  },
  below_threshold: {
    title: "Below the follower threshold",
    body: "This Instagram account does not currently meet TravelLTK’s 400,000-follower requirement.",
    destructive: true,
  },
  personal_account: {
    title: "Professional account required",
    body: "Instagram personal accounts do not expose a follower count. Switch to a Business or Creator account in Instagram settings, then connect again.",
    destructive: true,
  },
  auth_failed: {
    title: "Instagram connection failed",
    body: "Authorization was cancelled or Instagram returned an error. You can try connecting again.",
    destructive: true,
  },
  invalid_state: {
    title: "Verification session expired",
    body: "That Instagram login could not be matched to this application (invalid or expired). Start Connect Instagram again.",
    destructive: true,
  },
  oauth_not_configured: {
    title: "Instagram Login is not configured yet",
    body: "The site is missing INSTAGRAM_APP_ID / INSTAGRAM_APP_SECRET. Add a TikTok handle to submit for manual review, or try again once Instagram Login is enabled.",
    destructive: true,
  },
};

function handleFromSearch(value: string | null): IgReturn | null {
  if (!value) return null;
  if (value in IG_MESSAGES) return value as IgReturn;
  return null;
}

export function CreatorApplyForm({
  minFollowerCount,
  oauthConfigured,
}: {
  minFollowerCount: number;
  oauthConfigured: boolean;
}) {
  const searchParams = useSearchParams();
  const [applicationId, setApplicationId] = useState(
    searchParams.get("applicationId") ?? "",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [followers, setFollowers] = useState("");
  const [sample, setSample] = useState("");
  const [application, setApplication] = useState<PublicCreatorApplication | null>(
    null,
  );
  const [pending, setPending] = useState<"connect" | "submit" | null>(null);

  const igReturn = handleFromSearch(searchParams.get("ig"));
  const followersFromQuery = searchParams.get("followers");

  useEffect(() => {
    if (!applicationId) return;
    let cancelled = false;
    fetch(`/api/applications/creators?id=${encodeURIComponent(applicationId)}`)
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { application: PublicCreatorApplication };
      })
      .then((data) => {
        if (cancelled || !data?.application) return;
        const row = data.application;
        setApplication(row);
        setName(row.name);
        setEmail(row.email);
        setInstagram(row.claimedInstagramHandle);
        setTiktok(row.tiktokHandle ?? "");
        setYoutube(row.youtube ?? "");
        setFollowers(
          row.selfReportedFollowers != null ? String(row.selfReportedFollowers) : "",
        );
        setSample(row.sampleLinks ?? "");
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  const verifiedFollowers = application?.followersCount ??
    (followersFromQuery ? Number(followersFromQuery) : null);

  const canSubmitWithoutIg = tiktok.trim().length > 0;
  const igReady =
    application?.instagramVerificationStatus === "verified" ||
    application?.instagramVerificationStatus === "manually_verified" ||
    application?.instagramVerificationStatus === "handle_mismatch";

  const banner = useMemo(() => {
    if (igReturn) return IG_MESSAGES[igReturn];
    if (application?.publicMessage && application.instagramVerificationStatus !== "unverified") {
      const destructive = application.instagramVerificationStatus !== "verified";
      return {
        title:
          application.instagramVerificationStatus === "verified"
            ? "Instagram verified"
            : "Instagram verification",
        body: application.publicMessage,
        destructive,
      };
    }
    return null;
  }, [igReturn, application]);

  async function persist(submit: boolean) {
    const response = await fetch("/api/applications/creators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: applicationId || undefined,
        name,
        email,
        instagram,
        tiktok,
        youtube,
        followers,
        sample,
        submit,
      }),
    });
    const data = (await response.json().catch(() => null)) as {
      id?: string;
      application?: PublicCreatorApplication;
      error?: string;
    } | null;
    if (!response.ok) {
      throw new Error(data?.error ?? "Request failed");
    }
    if (data?.id) setApplicationId(data.id);
    if (data?.application) setApplication(data.application);
    return data;
  }

  async function onConnect() {
    if (!name.trim() || !email.trim() || !instagram.trim()) {
      toast.error("Add your name, email, and claimed Instagram handle first.");
      return;
    }
    setPending("connect");
    try {
      const data = await persist(false);
      const id = data?.id;
      if (!id) throw new Error("Could not save application");
      window.location.href = `/api/instagram/auth?applicationId=${encodeURIComponent(id)}`;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start Instagram Login.");
      setPending(null);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!igReady && !canSubmitWithoutIg) {
      toast.error(
        "Connect Instagram to verify, or add a TikTok handle for manual review.",
      );
      return;
    }
    setPending("submit");
    try {
      await persist(true);
      toast.success("Application received. We will follow up by email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send.");
    } finally {
      setPending(null);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div>
        <h3 className="font-display text-2xl">Application</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Identity first, then Instagram, then the trip you would publish.
        </p>
      </div>
      {banner ? (
        <Alert variant={banner.destructive ? "destructive" : "default"}>
          <AlertTitle>
            {igReturn === "verified" ||
            application?.instagramVerificationStatus === "verified"
              ? "✅ "
              : "❌ "}
            {banner.title}
          </AlertTitle>
          <AlertDescription>
            {banner.body}
            {igReturn === "verified" &&
            verifiedFollowers != null &&
            Number.isFinite(verifiedFollowers) ? (
              <p className="mt-2 font-medium text-foreground">
                {formatCompactNumber(verifiedFollowers)} Instagram followers
                {verifiedFollowers >= minFollowerCount
                  ? ` (meets the ${formatCompactNumber(minFollowerCount)} minimum)`
                  : ""}
              </p>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instagram">Claimed Instagram handle</Label>
        <Input
          id="instagram"
          name="instagram"
          placeholder="@yourhandle"
          value={instagram}
          onChange={(event) => setInstagram(event.target.value)}
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">
          We will compare this to the account you connect. Mismatches are flagged for
          review, not silently accepted.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface-sunken p-4">
        <Button
          type="button"
          size="lg"
          className="h-11"
          onClick={onConnect}
          disabled={pending !== null || !oauthConfigured}
        >
          {pending === "connect" ? "Redirecting…" : "Connect Instagram to verify"}
        </Button>
        {!oauthConfigured ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Instagram Login is not configured in this environment. You can still submit
            with a TikTok handle for manual review.
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Instagram Login proves you own the account and that it has at least{" "}
            {formatCompactNumber(minFollowerCount)} followers. You do not need a Facebook
            Page.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tiktok">TikTok handle</Label>
        <Input
          id="tiktok"
          name="tiktok"
          placeholder="@yourhandle"
          value={tiktok}
          onChange={(event) => setTiktok(event.target.value)}
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">
          Stored as unverified until TikTok Login Kit is implemented. A reviewer will
          confirm the handle (screenshot or bio-link code). Adding TikTok lets you
          submit even if Instagram verification is incomplete.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="youtube">YouTube channel</Label>
        <Input
          id="youtube"
          name="youtube"
          value={youtube}
          onChange={(event) => setYoutube(event.target.value)}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="followers">Self-reported follower count</Label>
        <Input
          id="followers"
          name="followers"
          type="number"
          min={0}
          required
          value={followers}
          onChange={(event) => setFollowers(event.target.value)}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sample">Sample content links</Label>
        <Textarea
          id="sample"
          name="sample"
          required
          rows={4}
          value={sample}
          onChange={(event) => setSample(event.target.value)}
          className="min-h-28"
        />
      </div>
      <Button type="submit" size="lg" className="h-11 w-full" disabled={pending !== null}>
        {pending === "submit" ? "Sending…" : "Submit application"}
      </Button>
    </form>
  );
}
