import type { Trip, TripLeg, TripVideo } from "@/types";

export function uniqueHotelLegs(trip: Trip): TripLeg[] {
  const seen = new Set<string>();
  const hotels: TripLeg[] = [];
  for (const day of trip.days) {
    for (const item of day.legs) {
      if (item.type !== "hotel") continue;
      const key = item.supplierName.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      hotels.push(item);
    }
  }
  return hotels;
}

export function tripVideos(trip: Trip): TripVideo[] {
  return trip.videos ?? [];
}

export function tripAnchorId(slug: string): string {
  return `trip-${slug}`;
}
