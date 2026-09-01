import type { Trip } from "@/types";

export function TripJsonLd({ trip, url }: { trip: Trip; url: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.title,
    description: trip.description,
    image: trip.coverImageUrl,
    url,
    touristType: trip.category,
    itinerary: trip.destinations.map((destination, index) => ({
      "@type": "TouristDestination",
      name: destination,
      position: index + 1,
    })),
    offers: {
      "@type": "Offer",
      price: trip.priceFromUsd,
      priceCurrency: trip.currency,
      url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
