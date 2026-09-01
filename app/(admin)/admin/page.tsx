import Link from "next/link";
import { PageContainer } from "@/components/marketing/page-container";
import {
  listCreatorApplications,
  toPublicApplication,
} from "@/lib/creator-applications-store";
import { formatCompactNumber } from "@/lib/formatting";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  const applications = listCreatorApplications().map(toPublicApplication);
  const pending = applications.filter(
    (row) =>
      row.status === "pending_review" || row.status === "flagged_handle_mismatch",
  ).length;

  return (
    <main className="py-10">
      <PageContainer>
        <h1 className="font-display text-4xl">Admin</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Internal tooling: creator applications, partner leads, and catalog
          moderation.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/applications"
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/40"
          >
            <p className="font-display text-xl">Creator applications</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {applications.length} total
              {pending > 0 ? ` · ${pending} waiting on review` : ""}
            </p>
          </Link>
        </div>
        {applications.slice(0, 5).length > 0 ? (
          <ul className="mt-8 space-y-2">
            {applications.slice(0, 5).map((row) => (
              <li key={row.id}>
                <Link
                  href={`/admin/applications/${row.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-muted/40"
                >
                  <span>
                    {row.name}{" "}
                    <span className="text-muted-foreground">
                      @{row.claimedInstagramHandle || "no-ig"}
                    </span>
                  </span>
                  <Badge variant="outline">{row.status.replaceAll("_", " ")}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        {applications[0]?.followersCount != null ? (
          <p className="sr-only">
            Latest verified followers {formatCompactNumber(applications[0].followersCount)}
          </p>
        ) : null}
      </PageContainer>
    </main>
  );
}
