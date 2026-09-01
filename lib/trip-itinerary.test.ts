import { describe, expect, it } from "vitest";
import { confirmedTrips } from "@/lib/confirmed-creators";
import { tripAnchorId, tripVideos, uniqueHotelLegs } from "@/lib/trip-itinerary";

describe("trip itinerary helpers", () => {
  it("dedupes hotels that appear on more than one night", () => {
    const atacama = confirmedTrips.find((trip) => trip.slug === "atacama-tierra-altitude");
    expect(atacama).toBeDefined();
    const hotels = uniqueHotelLegs(atacama!);
    const names = hotels.map((hotel) => hotel.supplierName);
    expect(names).toEqual(["The Lastarria", "Tierra Atacama"]);
  });

  it("exposes linked videos and a stable trip anchor", () => {
    const yacht = confirmedTrips.find((trip) => trip.slug === "antibes-yacht-week");
    expect(tripVideos(yacht!)).toHaveLength(2);
    expect(tripAnchorId("antibes-yacht-week")).toBe("trip-antibes-yacht-week");
  });
});
