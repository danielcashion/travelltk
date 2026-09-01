/**
 * In-memory catalog used until NEXT_PUBLIC_API_BASE_URL is set.
 *
 * TODO: every exported getter is a swap-point. Prefer lib/data.ts (which already
 * calls apiClient when configured) from new code. Remaining direct imports
 * below should move to lib/data.ts as routes are touched.
 */
import { unsplash } from "@/lib/images";
import {
  confirmedCreators,
  confirmedTrips,
  confirmedUsers,
} from "@/lib/confirmed-creators";
import type {
  Booking,
  CreatorProfile,
  Payout,
  Review,
  Trip,
  TripDay,
  TripLeg,
  User,
} from "@/types";

function leg(
  partial: Omit<TripLeg, "includedInTrip" | "bookingUrl" | "bookingApiRef"> &
    Partial<Pick<TripLeg, "includedInTrip" | "bookingUrl" | "bookingApiRef">>,
): TripLeg {
  return {
    includedInTrip: true,
    bookingUrl: null,
    bookingApiRef: null,
    ...partial,
  };
}

const PARIS_CRUISE_ISTANBUL_DAYS: TripDay[] = [
  {
    dayNumber: 1,
    title: "Arrive in Paris",
    location: "Paris, France",
    summary: "Land at CDG, check in near the Marais, and walk the Seine at dusk.",
    legs: [
      leg({
        id: "leg-pci-1-flight",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 1,
        type: "flight",
        title: "Overnight flight into Charles de Gaulle",
        description:
          "Evening departure with a morning arrival. Window seat on the left side for a sunrise approach.",
        supplierName: "Air France",
        supplierRef: "AF-007",
        priceEstimateUsd: 780,
        startTime: "19:40",
        endTime: "09:10",
        location: "JFK → CDG",
        includedInTrip: false,
        bookingUrl: "https://example-supplier.invalid/flights/af-007",
      }),
      leg({
        id: "leg-pci-1-hotel",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 1,
        type: "hotel",
        title: "Hôtel Providence, 11th arrondissement",
        description:
          "A 18-room townhouse with a tiny cocktail bar. Request a courtyard room if you are a light sleeper.",
        supplierName: "Hôtel Providence",
        supplierRef: "HTL-PROV-PAR",
        priceEstimateUsd: 310,
        startTime: "15:00",
        endTime: null,
        location: "Paris",
      }),
      leg({
        id: "leg-pci-1-dinner",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 1,
        type: "restaurant",
        title: "Dinner at Le Servan",
        description: "Walk-in counter seats after 8:30 if you missed the reservation window.",
        supplierName: "Le Servan",
        supplierRef: "RST-SERVAN",
        priceEstimateUsd: 95,
        startTime: "20:30",
        endTime: null,
        location: "Paris",
        includedInTrip: false,
        bookingUrl: "https://example-supplier.invalid/restaurants/le-servan",
      }),
    ],
  },
  {
    dayNumber: 2,
    title: "Marais to Musée d'Orsay",
    location: "Paris, France",
    summary: "A slow museum morning, then a reserved-time Orsay visit before golden hour on the Left Bank.",
    legs: [
      leg({
        id: "leg-pci-2-act",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 2,
        type: "activity",
        title: "Musée d'Orsay reserved entry",
        description: "Skip-the-line for 10:30. Start on floor 5 for the light, then work down.",
        supplierName: "Musée d'Orsay",
        supplierRef: "ACT-ORSAY",
        priceEstimateUsd: 16,
        startTime: "10:30",
        endTime: "13:00",
        location: "Paris",
      }),
    ],
  },
  {
    dayNumber: 3,
    title: "Versailles half-day",
    location: "Versailles, France",
    summary: "RER C out, gardens first, palace second — the opposite of the tour-bus order.",
    legs: [
      leg({
        id: "leg-pci-3-train",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 3,
        type: "transport",
        title: "RER C to Versailles Château Rive Gauche",
        description: "Buy a Navigo Easy and load a day pass the night before.",
        supplierName: "Île-de-France Mobilités",
        supplierRef: "TRN-RERC",
        priceEstimateUsd: 10,
        startTime: "08:20",
        endTime: "09:00",
        location: "Paris → Versailles",
      }),
      leg({
        id: "leg-pci-3-act",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 3,
        type: "activity",
        title: "Palace of Versailles timed ticket",
        description: "Gardens at opening, Hall of Mirrors after the first coach wave leaves.",
        supplierName: "Château de Versailles",
        supplierRef: "ACT-VERS",
        priceEstimateUsd: 21,
        startTime: "09:15",
        endTime: "14:00",
        location: "Versailles",
      }),
    ],
  },
  {
    dayNumber: 4,
    title: "Transfer to Barcelona",
    location: "Barcelona, Spain",
    summary: "Morning flight to BCN, drop bags, and a long lunch in El Born before embarkation day.",
    legs: [
      leg({
        id: "leg-pci-4-flight",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 4,
        type: "flight",
        title: "Paris Orly to Barcelona",
        description: "90-minute hop. Sit on the right for the Pyrenees.",
        supplierName: "Vueling",
        supplierRef: "VY-8001",
        priceEstimateUsd: 95,
        startTime: "08:05",
        endTime: "09:35",
        location: "ORY → BCN",
        includedInTrip: false,
        bookingUrl: "https://example-supplier.invalid/flights/vy-8001",
      }),
      leg({
        id: "leg-pci-4-hotel",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 4,
        type: "hotel",
        title: "One night at Cotton House Hotel",
        description: "A former textile guild. Ask for a room off the courtyard.",
        supplierName: "Cotton House Hotel",
        supplierRef: "HTL-COTTON-BCN",
        priceEstimateUsd: 280,
        startTime: "15:00",
        endTime: null,
        location: "Barcelona",
      }),
    ],
  },
  {
    dayNumber: 5,
    title: "Embark Mediterranean cruise",
    location: "Barcelona, Spain",
    summary: "Embark by 14:00. Unpack, then take the sail-away from the top deck, not the buffet.",
    legs: [
      leg({
        id: "leg-pci-5-cruise",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 5,
        type: "cruise",
        title: "5-night Western Mediterranean, balcony cabin",
        description:
          "Barcelona → Marseille → Livorno → Civitavecchia. Mid-ship balcony, deck 8. Specialty dining night 3.",
        supplierName: "Explora Journeys",
        supplierRef: "CRU-EX-WMED",
        priceEstimateUsd: 2100,
        startTime: "16:00",
        endTime: null,
        location: "Western Mediterranean",
      }),
    ],
  },
  {
    dayNumber: 6,
    title: "Marseille / Aix",
    location: "Marseille, France",
    summary: "Skip the ship shuttle. Private transfer to Aix for the market and a Calanques late-afternoon swim.",
    legs: [
      leg({
        id: "leg-pci-6-act",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 6,
        type: "activity",
        title: "Aix market + Calanques swim",
        description: "Independent, not a ship excursion. Back on board by 17:30 all-aboard.",
        supplierName: "Provence Footpaths",
        supplierRef: "ACT-AIX",
        priceEstimateUsd: 140,
        startTime: "08:30",
        endTime: "16:30",
        location: "Marseille",
        includedInTrip: false,
        bookingUrl: "https://example-supplier.invalid/activities/aix-calanques",
      }),
    ],
  },
  {
    dayNumber: 10,
    title: "Disembark Civitavecchia, fly to Istanbul",
    location: "Istanbul, Türkiye",
    summary: "Private transfer to FCO, afternoon flight, evening arrival in Karaköy.",
    legs: [
      leg({
        id: "leg-pci-10-transport",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 10,
        type: "transport",
        title: "Private transfer Civitavecchia → Fiumicino",
        description: "Pre-booked car. Do not take the ship shuttle if you have a same-day flight.",
        supplierName: "Rome Port Cars",
        supplierRef: "TRN-CIV-FCO",
        priceEstimateUsd: 160,
        startTime: "08:00",
        endTime: "09:45",
        location: "Civitavecchia → FCO",
      }),
      leg({
        id: "leg-pci-10-flight",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 10,
        type: "flight",
        title: "Rome to Istanbul",
        description: "Afternoon THY flight into IST. Sit on the left for the Bosphorus on descent.",
        supplierName: "Turkish Airlines",
        supplierRef: "TK-1862",
        priceEstimateUsd: 210,
        startTime: "13:20",
        endTime: "16:55",
        location: "FCO → IST",
        includedInTrip: false,
        bookingUrl: "https://example-supplier.invalid/flights/tk-1862",
      }),
      leg({
        id: "leg-pci-10-hotel",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 10,
        type: "hotel",
        title: "Soho House Istanbul, 4 nights",
        description: "Hamam in the basement. Rooftop for sunset, not brunch — brunch is a scrum.",
        supplierName: "Soho House Istanbul",
        supplierRef: "HTL-SOHO-IST",
        priceEstimateUsd: 420,
        startTime: "15:00",
        endTime: null,
        location: "Istanbul",
      }),
    ],
  },
  {
    dayNumber: 11,
    title: "Old City, unhurried",
    location: "Istanbul, Türkiye",
    summary: "Hagia Sophia at opening, then the Basilica Cistern before the cruise groups arrive.",
    legs: [
      leg({
        id: "leg-pci-11-act",
        tripId: "trip-paris-cruise-istanbul",
        dayNumber: 11,
        type: "activity",
        title: "Hagia Sophia + Basilica Cistern",
        description: "Combined skip-the-line. Go straight to the upper gallery first.",
        supplierName: "Istanbul Monument Pass",
        supplierRef: "ACT-AYASOFYA",
        priceEstimateUsd: 55,
        startTime: "09:00",
        endTime: "12:30",
        location: "Sultanahmet",
      }),
    ],
  },
];

export const users: User[] = [
  ...confirmedUsers,
  {
    id: "user-shopper-1",
    email: "jordan@example.com",
    name: "Jordan Hale",
    avatarUrl: unsplash("photo-1500648767791-00dcc994a43e", 256),
    cognitoSub: "cognito-sub-shopper-1",
    role: "shopper",
    createdAt: "2025-11-02T12:00:00.000Z",
    updatedAt: "2026-08-12T12:00:00.000Z",
  },
  {
    id: "user-creator-mira",
    email: "mira@example.com",
    name: "Mira Solano",
    avatarUrl: unsplash("photo-1534528741775-53994a69daeb", 256),
    cognitoSub: "cognito-sub-mira",
    role: "creator",
    createdAt: "2024-03-18T12:00:00.000Z",
    updatedAt: "2026-07-01T12:00:00.000Z",
  },
  {
    id: "user-creator-owen",
    email: "owen@example.com",
    name: "Owen Park",
    avatarUrl: unsplash("photo-1507003211169-0a1dd7228f2d", 256),
    cognitoSub: "cognito-sub-owen",
    role: "creator",
    createdAt: "2024-06-09T12:00:00.000Z",
    updatedAt: "2026-06-20T12:00:00.000Z",
  },
  {
    id: "user-creator-leila",
    email: "leila@example.com",
    name: "Leila Okonkwo",
    avatarUrl: unsplash("photo-1494790108377-be9c29b29330", 256),
    cognitoSub: "cognito-sub-leila",
    role: "creator",
    createdAt: "2023-11-01T12:00:00.000Z",
    updatedAt: "2026-08-01T12:00:00.000Z",
  },
  {
    id: "user-creator-nate",
    email: "nate@example.com",
    name: "Nate Voss",
    avatarUrl: unsplash("photo-1506794778202-cad84cf45f1d", 256),
    cognitoSub: "cognito-sub-nate",
    role: "creator",
    createdAt: "2025-01-14T12:00:00.000Z",
    updatedAt: "2026-05-11T12:00:00.000Z",
  },
];

export const creators: CreatorProfile[] = [
  ...confirmedCreators,
  {
    id: "creator-mira",
    userId: "user-creator-mira",
    handle: "mirasolano",
    displayName: "Mira Solano",
    bio: "I write the trips I actually take — city weeks stitched to a cruise, with the transfers no one puts on a highlight reel.",
    avatarUrl: unsplash("photo-1534528741775-53994a69daeb", 256),
    coverImageUrl: unsplash("photo-1502602898657-3e91760cbb34"),
    followerCount: 184200,
    verified: true,
    socials: {
      instagram: "https://instagram.com/mirasolano",
      youtube: "https://youtube.com/@mirasolano",
    },
    categories: ["cruise", "city-break", "luxury"],
    createdAt: "2024-03-18T12:00:00.000Z",
  },
  {
    id: "creator-owen",
    userId: "user-creator-owen",
    handle: "owenpark",
    displayName: "Owen Park",
    bio: "Ski journalist turned itinerary nerd. If a lodge is only reachable by snowcat, I have the timetable.",
    avatarUrl: unsplash("photo-1507003211169-0a1dd7228f2d", 256),
    coverImageUrl: unsplash("photo-1551524559-8af4e6624178"),
    followerCount: 96200,
    verified: true,
    socials: { instagram: "https://instagram.com/owenpark" },
    categories: ["ski", "adventure", "solo"],
    createdAt: "2024-06-09T12:00:00.000Z",
  },
  {
    id: "creator-leila",
    userId: "user-creator-leila",
    handle: "leilaokonkwo",
    displayName: "Leila Okonkwo",
    bio: "Family trips that do not feel like a compromise. Multi-gen, multi-city, still a nap window every afternoon.",
    avatarUrl: unsplash("photo-1494790108377-be9c29b29330", 256),
    coverImageUrl: unsplash("photo-1523906834658-6e24ef2386f9"),
    followerCount: 241000,
    verified: true,
    socials: {
      instagram: "https://instagram.com/leilaokonkwo",
      tiktok: "https://tiktok.com/@leilaokonkwo",
    },
    categories: ["family", "adventure", "city-break"],
    createdAt: "2023-11-01T12:00:00.000Z",
  },
  {
    id: "creator-nate",
    userId: "user-creator-nate",
    handle: "natevoss",
    displayName: "Nate Voss",
    bio: "Honeymoons without the cliché overlay. I map the quiet table, the late checkout, and the one hike worth the alarm.",
    avatarUrl: unsplash("photo-1506794778202-cad84cf45f1d", 256),
    coverImageUrl: unsplash("photo-1514282401047-d79a71a590e8"),
    followerCount: 67300,
    verified: false,
    socials: { website: "https://natevoss.example" },
    categories: ["honeymoon", "luxury", "solo"],
    createdAt: "2025-01-14T12:00:00.000Z",
  },
];

function simpleDays(
  tripId: string,
  rows: { location: string; hotel: string; hotelPrice: number }[],
): TripDay[] {
  return rows.map((row, index) => ({
    dayNumber: index + 1,
    title: row.location,
    location: row.location,
    summary: `Settle into ${row.hotel} and follow the published walking order in the trip notes.`,
    legs: [
      leg({
        id: `${tripId}-d${index + 1}-hotel`,
        tripId,
        dayNumber: index + 1,
        type: "hotel",
        title: row.hotel,
        description: `Creator-negotiated rate. Mention TravelLTK at check-in.`,
        supplierName: row.hotel,
        supplierRef: `HTL-${tripId}-${index + 1}`,
        priceEstimateUsd: row.hotelPrice,
        startTime: "15:00",
        endTime: null,
        location: row.location,
      }),
    ],
  }));
}

export const trips: Trip[] = [
  ...confirmedTrips,
  {
    id: "trip-paris-cruise-istanbul",
    slug: "paris-mediterranean-istanbul",
    creatorId: "creator-mira",
    title: "Paris, a Mediterranean balcony, then Istanbul",
    subtitle: "4 days Paris → 5-night cruise → 4 nights Istanbul",
    description:
      "The exact route Mira ran last October: a short Paris week that does not try to do everything, a five-night cruise used as a floating transfer, and four nights in Karaköy with a Hamam and a Bosphorus ferry instead of a Bosphorus cruise.",
    coverImageUrl: unsplash("photo-1502602898657-3e91760cbb34"),
    destinations: ["Paris", "Barcelona", "Marseille", "Rome", "Istanbul"],
    category: "cruise",
    nights: 13,
    priceFromUsd: 4680,
    bookingFeeUsd: 129,
    currency: "USD",
    status: "published",
    saveCount: 18420,
    bookingCount: 312,
    averageRating: 4.9,
    reviewCount: 86,
    days: PARIS_CRUISE_ISTANBUL_DAYS,
    createdAt: "2025-09-12T12:00:00.000Z",
    publishedAt: "2025-10-01T12:00:00.000Z",
  },
  {
    id: "trip-zermatt-solo",
    slug: "zermatt-solo-ski-week",
    creatorId: "creator-owen",
    title: "A solo ski week in Zermatt that actually fits a long weekend plus two days",
    subtitle: "Car-free village, one mountain pass day, no group lessons",
    description:
      "Owen's shoulder-season template: train in from Zurich, a mid-mountain hotel so you ski home, and one rest day for the Gornergrat when the light is better than the snow.",
    coverImageUrl: unsplash("photo-1551524559-8af4e6624178"),
    destinations: ["Zurich", "Zermatt"],
    category: "ski",
    nights: 6,
    priceFromUsd: 2890,
    bookingFeeUsd: 89,
    currency: "USD",
    status: "published",
    saveCount: 6402,
    bookingCount: 94,
    averageRating: 4.8,
    reviewCount: 31,
    days: simpleDays("trip-zermatt-solo", [
      { location: "Zurich", hotel: "Marktgasse Hotel", hotelPrice: 240 },
      { location: "Zermatt", hotel: "Cervo Mountain Resort", hotelPrice: 520 },
      { location: "Zermatt", hotel: "Cervo Mountain Resort", hotelPrice: 520 },
      { location: "Zermatt", hotel: "Cervo Mountain Resort", hotelPrice: 520 },
      { location: "Zermatt", hotel: "Cervo Mountain Resort", hotelPrice: 520 },
      { location: "Zermatt", hotel: "Cervo Mountain Resort", hotelPrice: 520 },
    ]),
    createdAt: "2025-11-02T12:00:00.000Z",
    publishedAt: "2025-11-20T12:00:00.000Z",
  },
  {
    id: "trip-lisbon-family",
    slug: "lisbon-sintra-family-week",
    creatorId: "creator-leila",
    title: "Lisbon with grandparents and a seven-year-old",
    subtitle: "Trams, a palace day, and a beach afternoon that is not optional",
    description:
      "Leila's family routing: an apartment in Estrela, a private driver for Sintra so nobody argues with the train, and a Cascais afternoon when the city is too much.",
    coverImageUrl: unsplash("photo-1523906834658-6e24ef2386f9"),
    destinations: ["Lisbon", "Sintra", "Cascais"],
    category: "family",
    nights: 7,
    priceFromUsd: 2140,
    bookingFeeUsd: 79,
    currency: "USD",
    status: "published",
    saveCount: 12110,
    bookingCount: 205,
    averageRating: 4.7,
    reviewCount: 54,
    days: simpleDays("trip-lisbon-family", [
      { location: "Lisbon", hotel: "Valverde Hotel", hotelPrice: 310 },
      { location: "Lisbon", hotel: "Valverde Hotel", hotelPrice: 310 },
      { location: "Sintra", hotel: "Tivoli Palácio de Seteais", hotelPrice: 390 },
      { location: "Lisbon", hotel: "Valverde Hotel", hotelPrice: 310 },
    ]),
    createdAt: "2026-01-08T12:00:00.000Z",
    publishedAt: "2026-01-22T12:00:00.000Z",
  },
  {
    id: "trip-amalfi-honeymoon",
    slug: "amalfi-honeymoon-slow",
    creatorId: "creator-nate",
    title: "An Amalfi honeymoon that skips the day-trip circuit",
    subtitle: "Ravello base, boat days, one Naples food night",
    description:
      "Nate's version: stay high in Ravello, take a private boat on the two nicest weather days, and do Naples on the way in so the last night is not a suitcase night.",
    coverImageUrl: unsplash("photo-1534113414509-0eecf413212b"),
    destinations: ["Naples", "Ravello", "Capri"],
    category: "honeymoon",
    nights: 8,
    priceFromUsd: 5120,
    bookingFeeUsd: 149,
    currency: "USD",
    status: "published",
    saveCount: 9088,
    bookingCount: 67,
    averageRating: 5,
    reviewCount: 22,
    days: simpleDays("trip-amalfi-honeymoon", [
      { location: "Naples", hotel: "Palazzo Caracciolo", hotelPrice: 260 },
      { location: "Ravello", hotel: "Palazzo Avino", hotelPrice: 780 },
      { location: "Ravello", hotel: "Palazzo Avino", hotelPrice: 780 },
    ]),
    createdAt: "2026-02-14T12:00:00.000Z",
    publishedAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "trip-tokyo-solo",
    slug: "tokyo-kyoto-solo-rail",
    creatorId: "creator-mira",
    title: "Tokyo and Kyoto on rails, no tour bus",
    subtitle: "A 9-night city break with one rural night in Hakone",
    description:
      "Neighborhood hotels, a Shinkansen that is timed to a lunch reservation, and a Hakone onsen night that resets the second city.",
    coverImageUrl: unsplash("photo-1540959733332-eab4deabeeaf"),
    destinations: ["Tokyo", "Hakone", "Kyoto"],
    category: "city-break",
    nights: 9,
    priceFromUsd: 3420,
    bookingFeeUsd: 99,
    currency: "USD",
    status: "published",
    saveCount: 15440,
    bookingCount: 188,
    averageRating: 4.8,
    reviewCount: 61,
    days: simpleDays("trip-tokyo-solo", [
      { location: "Tokyo", hotel: "Hotel Siro", hotelPrice: 280 },
      { location: "Hakone", hotel: "Gora Kadan", hotelPrice: 640 },
      { location: "Kyoto", hotel: "Ace Hotel Kyoto", hotelPrice: 320 },
    ]),
    createdAt: "2026-03-03T12:00:00.000Z",
    publishedAt: "2026-03-18T12:00:00.000Z",
  },
  {
    id: "trip-patagonia-adventure",
    slug: "patagonia-w-trek-buffer",
    creatorId: "creator-owen",
    title: "Torres del Paine with a weather buffer built in",
    subtitle: "W Trek plus two spare days so the forecast, not the itinerary, wins",
    description:
      "Refugios booked in a sequence that can slide one day. A Punta Arenas buffer night on each end because the wind does not care about your connection.",
    coverImageUrl: unsplash("photo-1548786811-dd6e2b024c14"),
    destinations: ["Punta Arenas", "Puerto Natales", "Torres del Paine"],
    category: "adventure",
    nights: 10,
    priceFromUsd: 2760,
    bookingFeeUsd: 89,
    currency: "USD",
    status: "published",
    saveCount: 4210,
    bookingCount: 41,
    averageRating: 4.9,
    reviewCount: 18,
    days: simpleDays("trip-patagonia-adventure", [
      { location: "Punta Arenas", hotel: "Hotel Cabo de Hornos", hotelPrice: 180 },
      { location: "Puerto Natales", hotel: "The Singular Patagonia", hotelPrice: 410 },
    ]),
    createdAt: "2026-04-01T12:00:00.000Z",
    publishedAt: "2026-04-16T12:00:00.000Z",
  },
  {
    id: "trip-maldives-luxury",
    slug: "maldives-no-overwater-default",
    creatorId: "creator-nate",
    title: "Maldives without defaulting to an overwater villa",
    subtitle: "Beach villa, one sandbank picnic, house reef at dusk",
    description:
      "Nate's counter-take: a beach villa faces the better reef. The overwater villa is a photo, not a better night's sleep.",
    coverImageUrl: unsplash("photo-1514282401047-d79a71a590e8"),
    destinations: ["Malé", "Raa Atoll"],
    category: "luxury",
    nights: 7,
    priceFromUsd: 8900,
    bookingFeeUsd: 199,
    currency: "USD",
    status: "published",
    saveCount: 7330,
    bookingCount: 29,
    averageRating: 4.6,
    reviewCount: 11,
    days: simpleDays("trip-maldives-luxury", [
      { location: "Raa Atoll", hotel: "Joali Maldives", hotelPrice: 1450 },
    ]),
    createdAt: "2026-05-09T12:00:00.000Z",
    publishedAt: "2026-05-20T12:00:00.000Z",
  },
  {
    id: "trip-nyc-solo",
    slug: "nyc-long-weekend-solo",
    creatorId: "creator-leila",
    title: "A New York long weekend that is not Times Square",
    subtitle: "UWS hotel, one outer-borough food day, a matinee not a night show",
    description:
      "Leila's city-break for people who already did the skyline. Walk the park, eat in Jackson Heights, sit down at 2pm.",
    coverImageUrl: unsplash("photo-1496442226666-8d4d0e62e6e9"),
    destinations: ["New York"],
    category: "solo",
    nights: 3,
    priceFromUsd: 1280,
    bookingFeeUsd: 49,
    currency: "USD",
    status: "published",
    saveCount: 5120,
    bookingCount: 140,
    averageRating: 4.5,
    reviewCount: 39,
    days: simpleDays("trip-nyc-solo", [
      { location: "New York", hotel: "The Robey — wait, The Ludlow", hotelPrice: 390 },
    ]),
    createdAt: "2026-06-02T12:00:00.000Z",
    publishedAt: "2026-06-10T12:00:00.000Z",
  },
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    tripId: "trip-paris-cruise-istanbul",
    userId: "user-shopper-1",
    authorName: "Jordan Hale",
    authorAvatarUrl: unsplash("photo-1500648767791-00dcc994a43e", 256),
    bookingId: "bkg-1",
    rating: 5,
    title: "The transfer days were the point",
    body: "I would have booked Paris and Istanbul separately and been miserable in between. The cruise-as-transfer is the part I would never have designed myself.",
    createdAt: "2026-04-02T12:00:00.000Z",
  },
  {
    id: "rev-2",
    tripId: "trip-paris-cruise-istanbul",
    userId: "user-shopper-1",
    authorName: "Priya Raman",
    authorAvatarUrl: unsplash("photo-1544005313-94ddf0286df2", 256),
    bookingId: "bkg-2",
    rating: 5,
    title: "Booked two optional legs, skipped the rest",
    body: "We used the trip as a spine and booked only the cruise and the Istanbul hotel through TravelLTK. The day-by-day still held up.",
    createdAt: "2026-05-18T12:00:00.000Z",
  },
  {
    id: "rev-3",
    tripId: "trip-zermatt-solo",
    userId: "user-shopper-1",
    authorName: "Chris Nguyen",
    authorAvatarUrl: unsplash("photo-1472099645785-5658abf4ff4e", 256),
    bookingId: "bkg-3",
    rating: 5,
    title: "Train in, ski home, no rental car",
    body: "Followed Owen's Zurich overnight and did not miss a connection. The rest-day call on Gornergrat was right.",
    createdAt: "2026-03-11T12:00:00.000Z",
  },
];

export const bookings: Booking[] = [
  {
    id: "bkg-1",
    userId: "user-shopper-1",
    tripId: "trip-paris-cruise-istanbul",
    creatorId: "creator-mira",
    status: "confirmed",
    travelerCount: 2,
    travelStartDate: "2026-04-10",
    travelEndDate: "2026-04-23",
    travelerDetails: [
      {
        firstName: "Jordan",
        lastName: "Hale",
        email: "jordan@example.com",
        dateOfBirth: "1991-04-12",
      },
    ],
    selectedLegIds: "full-trip",
    subtotalUsd: 4680,
    bookingFeeUsd: 129,
    taxesUsd: 210,
    totalUsd: 5019,
    stripePaymentIntentId: "pi_mock_1",
    createdAt: "2026-01-09T12:00:00.000Z",
    confirmedAt: "2026-01-09T12:05:00.000Z",
  },
  {
    id: "bkg-4",
    userId: "user-shopper-1",
    tripId: "trip-lisbon-family",
    creatorId: "creator-leila",
    status: "fulfilled",
    travelerCount: 4,
    travelStartDate: "2026-06-01",
    travelEndDate: "2026-06-08",
    travelerDetails: [],
    selectedLegIds: "full-trip",
    subtotalUsd: 2140,
    bookingFeeUsd: 79,
    taxesUsd: 96,
    totalUsd: 2315,
    stripePaymentIntentId: "pi_mock_4",
    createdAt: "2026-03-02T12:00:00.000Z",
    confirmedAt: "2026-03-02T12:04:00.000Z",
  },
];

export const payouts: Payout[] = [
  {
    id: "po-1",
    creatorId: "creator-mira",
    bookingId: "bkg-1",
    amountUsd: 421,
    status: "paid",
    stripeTransferId: "tr_mock_1",
    createdAt: "2026-01-16T12:00:00.000Z",
    paidAt: "2026-01-18T12:00:00.000Z",
  },
  {
    id: "po-2",
    creatorId: "creator-leila",
    bookingId: "bkg-4",
    amountUsd: 193,
    status: "in_transit",
    stripeTransferId: "tr_mock_2",
    createdAt: "2026-06-10T12:00:00.000Z",
    paidAt: null,
  },
];

export const savedTripIds = ["trip-paris-cruise-istanbul", "trip-zermatt-solo"];

export function getPublishedTrips(): Trip[] {
  return trips.filter((trip) => trip.status === "published");
}

export function getTripBySlug(slug: string): Trip | undefined {
  return trips.find((trip) => trip.slug === slug);
}

export function getTripById(id: string): Trip | undefined {
  return trips.find((trip) => trip.id === id);
}

export function getCreatorByHandle(handle: string): CreatorProfile | undefined {
  const needle = handle.toLowerCase();
  return creators.find((creator) => creator.handle.toLowerCase() === needle);
}

export function getCreatorById(id: string): CreatorProfile | undefined {
  return creators.find((creator) => creator.id === id);
}

export function getTripsByCreator(creatorId: string): Trip[] {
  return getPublishedTrips().filter((trip) => trip.creatorId === creatorId);
}

export function getTripsByDestination(destination: string): Trip[] {
  const needle = destination.toLowerCase();
  return getPublishedTrips().filter((trip) =>
    trip.destinations.some((item) => item.toLowerCase() === needle),
  );
}

export function getTripsByCategory(category: string): Trip[] {
  return getPublishedTrips().filter((trip) => trip.category === category);
}

export function getReviewsForTrip(tripId: string): Review[] {
  return reviews.filter((review) => review.tripId === tripId);
}

export function getRelatedTrips(trip: Trip, limit = 3): Trip[] {
  return getPublishedTrips()
    .filter((item) => item.id !== trip.id)
    .sort((a, b) => {
      const aScore =
        (a.category === trip.category ? 2 : 0) +
        a.destinations.filter((d) => trip.destinations.includes(d)).length;
      const bScore =
        (b.category === trip.category ? 2 : 0) +
        b.destinations.filter((d) => trip.destinations.includes(d)).length;
      return bScore - aScore;
    })
    .slice(0, limit);
}

export function allDestinations(): string[] {
  return [...new Set(getPublishedTrips().flatMap((trip) => trip.destinations))].sort();
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((booking) => booking.id === id);
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id);
}
