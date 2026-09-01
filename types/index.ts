export type UserRole = "shopper" | "creator" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  cognitoSub: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type TripCategory =
  | "cruise"
  | "ski"
  | "city-break"
  | "honeymoon"
  | "family"
  | "solo"
  | "adventure"
  | "luxury";

export interface CreatorSocials {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  website?: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl: string | null;
  followerCount: number;
  verified: boolean;
  socials: CreatorSocials;
  categories: TripCategory[];
  createdAt: string;
}

export type TripStatus = "draft" | "published" | "archived";

export type LegType =
  | "flight"
  | "hotel"
  | "cruise"
  | "activity"
  | "restaurant"
  | "transport";

export interface TripLeg {
  id: string;
  tripId: string;
  dayNumber: number;
  type: LegType;
  title: string;
  description: string;
  supplierName: string;
  supplierRef: string;
  priceEstimateUsd: number;
  includedInTrip: boolean;
  /** Affiliate-link MVP: shopper is sent to the supplier to complete the booking. */
  bookingUrl: string | null;
  /** Placeholder for a future direct-API booking reference. */
  bookingApiRef: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string;
}

export interface TripDay {
  dayNumber: number;
  title: string;
  location: string;
  summary: string;
  legs: TripLeg[];
}

export interface Trip {
  id: string;
  slug: string;
  creatorId: string;
  title: string;
  subtitle: string;
  description: string;
  coverImageUrl: string;
  destinations: string[];
  category: TripCategory;
  nights: number;
  priceFromUsd: number;
  bookingFeeUsd: number;
  currency: "USD";
  status: TripStatus;
  saveCount: number;
  bookingCount: number;
  averageRating: number;
  reviewCount: number;
  days: TripDay[];
  createdAt: string;
  publishedAt: string | null;
}

export interface TravelerDetails {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "fulfilled";

export type BookingSelection = "full-trip" | string[];

export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  creatorId: string;
  status: BookingStatus;
  travelerCount: number;
  travelStartDate: string;
  travelEndDate: string;
  travelerDetails: TravelerDetails[];
  selectedLegIds: BookingSelection;
  subtotalUsd: number;
  bookingFeeUsd: number;
  taxesUsd: number;
  totalUsd: number;
  stripePaymentIntentId: string | null;
  createdAt: string;
  confirmedAt: string | null;
}

export type PayoutStatus = "pending" | "in_transit" | "paid" | "failed";

export interface Payout {
  id: string;
  creatorId: string;
  bookingId: string;
  amountUsd: number;
  status: PayoutStatus;
  stripeTransferId: string | null;
  createdAt: string;
  paidAt: string | null;
}

export interface Review {
  id: string;
  tripId: string;
  userId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  bookingId: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface PriceLineItem {
  label: string;
  amountUsd: number;
  kind: "trip" | "leg" | "fee" | "tax";
}

export const TRIP_CATEGORIES: { slug: TripCategory; label: string }[] = [
  { slug: "cruise", label: "Cruise" },
  { slug: "ski", label: "Ski" },
  { slug: "city-break", label: "City Break" },
  { slug: "honeymoon", label: "Honeymoon" },
  { slug: "family", label: "Family" },
  { slug: "solo", label: "Solo" },
  { slug: "adventure", label: "Adventure" },
  { slug: "luxury", label: "Luxury" },
];

export const LEG_TYPES: { slug: LegType; label: string }[] = [
  { slug: "flight", label: "Flight" },
  { slug: "hotel", label: "Hotel" },
  { slug: "cruise", label: "Cruise" },
  { slug: "activity", label: "Activity" },
  { slug: "restaurant", label: "Restaurant" },
  { slug: "transport", label: "Transport" },
];
