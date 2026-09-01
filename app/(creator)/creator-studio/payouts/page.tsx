import { PageContainer } from "@/components/marketing/page-container";
import { StudioNav } from "@/components/creator-studio/studio-nav";
import { EmptyState } from "@/components/trip/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { payouts } from "@/lib/mock-data";
import { env } from "@/lib/config";
import { formatCurrency } from "@/lib/formatting";

export default function PayoutsPage() {
  const mine = payouts.filter((item) => item.creatorId === "creator-mira");
  const connectConfigured = Boolean(env.STRIPE_CONNECT_CLIENT_ID);

  return (
    <main className="py-10">
      <PageContainer>
        <StudioNav current="/creator-studio/payouts" />
        <h1 className="mt-6 font-display text-4xl">Payouts</h1>
        <p className="mt-2 text-muted-foreground">
          Stripe Connect Express is the payout rail. Onboarding uses an Account Link
          once STRIPE_CONNECT_CLIENT_ID is set.
        </p>
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p className="font-medium">Connect status</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {connectConfigured
              ? "Client ID present. Complete Express onboarding from the Stripe-hosted link."
              : "Not configured. Set STRIPE_CONNECT_CLIENT_ID after creating a Connect platform in the Stripe Dashboard."}
          </p>
          <Button className="mt-4" disabled={!connectConfigured} asChild={connectConfigured}>
            {connectConfigured ? (
              <a href="https://connect.stripe.com/express/oauth/authorize">Continue onboarding</a>
            ) : (
              <span>Onboarding unavailable</span>
            )}
          </Button>
        </div>
        {mine.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No payouts yet"
              description="When a shopper booking confirms, a payout row appears here."
            />
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {mine.map((payout) => (
              <li
                key={payout.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <p className="font-medium">{formatCurrency(payout.amountUsd, true)}</p>
                  <p className="text-sm text-muted-foreground">Booking {payout.bookingId}</p>
                </div>
                <Badge variant="secondary">{payout.status.replace("_", " ")}</Badge>
              </li>
            ))}
          </ul>
        )}
      </PageContainer>
    </main>
  );
}
