import Link from "next/link";
import { notFound } from "next/navigation";
import { ManualVerifyForm } from "@/components/admin/manual-verify-form";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/marketing/page-container";
import {
  getCreatorApplication,
  toPublicApplication,
} from "@/lib/creator-applications-store";
import { formatCompactNumber } from "@/lib/formatting";

export const dynamic = "force-dynamic";

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = getCreatorApplication(id);
  if (!row) notFound();
  const application = toPublicApplication(row);

  return (
    <main className="py-10">
      <PageContainer className="max-w-3xl">
        <p className="text-sm text-muted-foreground">
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>{" "}
          /{" "}
          <Link href="/admin/applications" className="hover:underline">
            Applications
          </Link>{" "}
          / {application.name}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl">{application.name}</h1>
          <Badge variant="outline">{application.status.replaceAll("_", " ")}</Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{application.email}</p>

        <section className="mt-8 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl">Claimed vs connected</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Claimed Instagram</dt>
              <dd className="font-medium">@{application.claimedInstagramHandle || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Connected Instagram</dt>
              <dd className="font-medium">
                {application.instagramUsername
                  ? `@${application.instagramUsername}`
                  : "Not connected"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Self-reported followers</dt>
              <dd className="font-medium">
                {application.selfReportedFollowers != null
                  ? formatCompactNumber(application.selfReportedFollowers)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Instagram followers (API)</dt>
              <dd className="font-medium">
                {application.followersCount != null
                  ? formatCompactNumber(application.followersCount)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">IG verification</dt>
              <dd className="font-medium">
                {application.instagramVerificationStatus.replaceAll("_", " ")}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">TikTok</dt>
              <dd className="font-medium">
                {application.tiktokHandle
                  ? `@${application.tiktokHandle} (unverified)`
                  : "—"}
              </dd>
            </div>
          </dl>
          {application.publicMessage ? (
            <p className="mt-4 text-sm text-muted-foreground">{application.publicMessage}</p>
          ) : null}
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl">Manual verify</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use this when OAuth is not possible (shared/agency-managed accounts, or the
            creator declines to connect). Requires an authenticated admin and writes who
            approved and why.
          </p>
          {application.manualVerification ? (
            <p className="mt-3 text-sm">
              Already verified by {application.manualVerification.verifiedBy} on{" "}
              {new Date(application.manualVerification.verifiedAt).toLocaleString()}:{" "}
              {application.manualVerification.reason}
            </p>
          ) : null}
          <ManualVerifyForm applicationId={application.id} />
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl">Audit log</h2>
          {application.auditLog.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No events yet.</p>
          ) : (
            <ol className="mt-4 space-y-3 text-sm">
              {[...application.auditLog].reverse().map((entry, index) => (
                <li key={`${entry.at}-${index}`} className="border-b border-border pb-3 last:border-0">
                  <p className="font-medium">{entry.action.replaceAll("_", " ")}</p>
                  <p className="text-muted-foreground">
                    {entry.actor} · {new Date(entry.at).toLocaleString()}
                  </p>
                  {entry.reason ? <p className="mt-1">{entry.reason}</p> : null}
                </li>
              ))}
            </ol>
          )}
        </section>
      </PageContainer>
    </main>
  );
}
