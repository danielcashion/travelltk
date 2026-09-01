import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/marketing/page-container";
import {
  listCreatorApplications,
  toPublicApplication,
} from "@/lib/creator-applications-store";
import { formatCompactNumber } from "@/lib/formatting";

export const dynamic = "force-dynamic";

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "pending_review" || status === "flagged_handle_mismatch") return "default";
  if (status === "rejected_follower_threshold" || status === "rejected") return "destructive";
  if (status === "approved") return "secondary";
  return "outline";
}

export default function AdminApplicationsPage() {
  const applications = listCreatorApplications().map(toPublicApplication);

  return (
    <main className="py-10">
      <PageContainer>
        <p className="text-sm text-muted-foreground">
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>{" "}
          / Applications
        </p>
        <h1 className="mt-2 font-display text-4xl">Creator applications</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Instagram Login proves ownership and follower count. Use manual verify when a
          legitimate creator cannot complete OAuth (agency-managed or declined connect).
        </p>

        {applications.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">No applications yet.</p>
        ) : (
          <ul className="mt-8 space-y-3">
            {applications.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/admin/applications/${row.id}`}
                  className="block rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{row.name}</p>
                    <Badge variant={statusVariant(row.status)}>
                      {row.status.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{row.email}</p>
                  <p className="mt-2 text-sm">
                    Claimed IG @{row.claimedInstagramHandle || "—"}
                    {row.instagramUsername
                      ? ` · connected @${row.instagramUsername}`
                      : ""}
                    {row.followersCount != null
                      ? ` · ${formatCompactNumber(row.followersCount)} followers`
                      : ""}
                    {row.selfReportedFollowers != null
                      ? ` · self-reported ${formatCompactNumber(row.selfReportedFollowers)}`
                      : ""}
                    {row.tiktokHandle ? ` · TikTok @${row.tiktokHandle} (unverified)` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageContainer>
    </main>
  );
}
