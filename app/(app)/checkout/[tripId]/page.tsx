import { notFound } from "next/navigation";
import { PageContainer } from "@/components/marketing/page-container";
import { CheckoutWizard } from "@/components/booking/checkout-wizard";
import { env } from "@/lib/config";
import { getTripById } from "@/lib/mock-data";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  return (
    <main className="py-10">
      <PageContainer width="narrow">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">Checkout</p>
        <h1 className="mt-2 font-display text-4xl">{trip.title}</h1>
        <p className="mt-2 text-muted-foreground">{trip.subtitle}</p>
        <div className="mt-8">
          <CheckoutWizard
            trip={trip}
            publishableKey={env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""}
          />
        </div>
      </PageContainer>
    </main>
  );
}
