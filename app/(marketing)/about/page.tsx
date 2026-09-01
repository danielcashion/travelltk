import { PageContainer } from "@/components/marketing/page-container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "TravelLTK turns creator itineraries into bookable trips. Shoppers book a route or a leg; creators earn a payout.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="py-10">
      <PageContainer width="narrow">
        <h1 className="font-display text-4xl">About TravelLTK</h1>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>
            TravelLTK exists because the most useful travel advice on the internet is
            trapped in a caption. Someone flew Paris to a cruise embarkation to Istanbul
            and wrote the days down. Everyone else screenshots it and starts over.
          </p>
          <p>
            We turn that itinerary into a product. Creators publish the trip. Shoppers
            book the whole route or the legs they need. The creator earns a payout on
            every booking that flows through their trip.
          </p>
          <p>
            The structure is familiar if you have used a creator commerce network for
            physical products. The object is different: a bookable leg instead of a SKU.
            We do not copy anyone else’s words, images, or software. We copy the idea
            that a trusted person can merchandise something the rest of us can actually
            buy.
          </p>
          <p>
            TravelLTK is based in the United States and books travel that is fulfilled by
            airlines, hotels, cruise lines, and local operators. We are the marketplace
            layer, not the carrier.
          </p>
        </div>
      </PageContainer>
    </main>
  );
}
