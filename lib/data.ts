/**
 * Data access facade.
 *
 * TODO: every helper below should call `apiClient.*` once NEXT_PUBLIC_API_BASE_URL
 * is set after `cdk deploy`. Until then we fall back to lib/mock-data.ts.
 */
import { apiClient } from "@/lib/api-client";
import { isApiConfigured } from "@/lib/config";
import {
  allDestinations as mockDestinations,
  getBookingById as mockBooking,
  getCreatorByHandle as mockCreatorByHandle,
  getCreatorById as mockCreatorById,
  getPublishedTrips as mockPublished,
  getRelatedTrips as mockRelated,
  getReviewsForTrip as mockReviews,
  getTripById as mockTripById,
  getTripBySlug as mockTripBySlug,
  getTripsByCategory as mockByCategory,
  getTripsByCreator as mockByCreator,
  getTripsByDestination as mockByDestination,
  getUserById as mockUser,
} from "@/lib/mock-data";
import type { Trip } from "@/types";

export async function listPublishedTrips(): Promise<Trip[]> {
  // TODO: swap mock for apiClient.trips.list("?status=published")
  if (isApiConfigured) return apiClient.trips.list("?status=published");
  return mockPublished();
}

export async function loadTripBySlug(slug: string) {
  // TODO: swap mock for apiClient.trips.get / search-by-slug
  if (isApiConfigured) {
    const trips = await apiClient.trips.list(`?slug=${slug}`);
    return trips[0];
  }
  return mockTripBySlug(slug);
}

export async function loadTripById(id: string) {
  // TODO: swap mock for apiClient.trips.get(id)
  if (isApiConfigured) return apiClient.trips.get(id);
  return mockTripById(id);
}

export async function loadCreatorByHandle(handle: string) {
  // TODO: swap mock for apiClient.creators.getByHandle(handle)
  if (isApiConfigured) return apiClient.creators.getByHandle(handle);
  return mockCreatorByHandle(handle);
}

export function loadCreatorByIdSync(id: string) {
  // TODO: swap mock for apiClient once creator-by-id exists
  return mockCreatorById(id);
}

export async function loadTripsByCreator(creatorId: string) {
  // TODO: swap mock for apiClient.trips.list(`?creatorId=${creatorId}`)
  if (isApiConfigured) return apiClient.trips.list(`?creatorId=${creatorId}`);
  return mockByCreator(creatorId);
}

export async function loadTripsByDestination(destination: string) {
  // TODO: swap mock for apiClient.trips.list(`?destination=${destination}`)
  if (isApiConfigured) {
    return apiClient.trips.list(`?destination=${encodeURIComponent(destination)}`);
  }
  return mockByDestination(destination);
}

export async function loadTripsByCategory(category: string) {
  // TODO: swap mock for apiClient.trips.list(`?category=${category}`)
  if (isApiConfigured) return apiClient.trips.list(`?category=${category}`);
  return mockByCategory(category);
}

export async function loadReviews(tripId: string) {
  // TODO: swap mock for apiClient.reviews.list(tripId)
  if (isApiConfigured) return apiClient.reviews.list(tripId);
  return mockReviews(tripId);
}

export async function loadRelated(trip: Trip) {
  if (isApiConfigured) {
    return apiClient.trips.list(`?relatedTo=${trip.id}`);
  }
  return mockRelated(trip);
}

export async function loadDestinations() {
  if (isApiConfigured) {
    const trips = await apiClient.trips.list("?status=published");
    return [...new Set(trips.flatMap((trip) => trip.destinations))].sort();
  }
  return mockDestinations();
}

export async function loadBooking(id: string) {
  // TODO: swap mock for a bookings.get endpoint
  return mockBooking(id);
}

export async function loadUser(id: string) {
  // TODO: swap mock for apiClient.users.get(id)
  if (isApiConfigured) return apiClient.users.get(id);
  return mockUser(id);
}

export { mockPublished };
