import Link from "next/link";
import { PageContainer } from "@/components/marketing/page-container";
import { Button } from "@/components/ui/button";
import { bookings, getTripById, getUserById, savedTripIds, trips } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatting";

export default function AccountPage() {
  const user = getUserById("user-shopper-1");
  const saved = trips.filter((trip) => savedTripIds.includes(trip.id));

  return (
    <main className="py-10">
      <PageContainer>
        <h1 className="font-display text-4xl">Account</h1>
        <p className="mt-2 text-muted-foreground">
          Profile, bookings, and saved trips. Data is mocked until Cognito + the AWS
          API are wired.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-xl border border-border bg-card p-6 lg:col-span-1">
            <h2 className="font-display text-xl">Profile</h2>
            <p className="mt-3 font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="mt-2 text-xs text-muted-foreground">Role: {user?.role}</p>
          </section>
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">Bookings</h2>
            <p className="mt-2 text-sm text-muted-foreground">{bookings.length} on file</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/account/bookings">View history</Link>
            </Button>
          </section>
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">Saved trips</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {saved.length} saved · next from {formatCurrency(saved[0]?.priceFromUsd ?? 0)}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/account/saved-trips">Open saved</Link>
            </Button>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
