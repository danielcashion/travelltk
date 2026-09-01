import Link from "next/link";
import { PageContainer } from "@/components/marketing/page-container";
import { StudioNav } from "@/components/creator-studio/studio-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { payouts, getTripsByCreator } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatting";

export default function CreatorStudioPage() {
  const trips = getTripsByCreator("creator-mira");
  const earnings = payouts
    .filter((item) => item.creatorId === "creator-mira")
    .reduce((sum, item) => sum + item.amountUsd, 0);

  return (
    <main className="py-10">
      <PageContainer>
        <StudioNav />
        <h1 className="mt-6 font-display text-4xl">Studio</h1>
        <p className="mt-2 text-muted-foreground">
          Views, saves, bookings, and payouts for the signed-in creator. Charts are
          mocked until analytics land on the AWS API.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Trip views (30d)" value="18.4k" />
          <Stat label="Saves" value="2,103" />
          <Stat label="Bookings" value="41" />
          <Stat label="Conversion" value="1.9%" />
        </div>
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl">Earnings</h2>
          <p className="mt-2 font-display text-3xl">{formatCurrency(earnings)}</p>
          <p className="text-sm text-muted-foreground">Paid out to Stripe Connect Express</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/creator-studio/payouts">Payout status</Link>
          </Button>
        </div>
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl">Views by week (mock)</h2>
          <div className="mt-4 flex h-32 items-end gap-2">
            {[40, 55, 38, 72, 64, 80, 91, 70].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t bg-primary/70"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-display text-xl">Your trips</h2>
          <Badge variant="secondary">{trips.length} published</Badge>
        </div>
      </PageContainer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}
