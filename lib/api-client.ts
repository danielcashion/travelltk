import { env, isApiConfigured } from "@/lib/config";
import type {
  Booking,
  CreatorProfile,
  Payout,
  Review,
  Trip,
  User,
} from "@/types";

/**
 * Typed client for the AWS API Gateway HTTP API.
 *
 * When NEXT_PUBLIC_API_BASE_URL is unset, callers should keep using mock data
 * (see lib/data.ts). Every method is a TODO swap-point for the corresponding
 * mock helper.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API ${path} failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const apiClient = {
  configured: isApiConfigured,
  users: {
    get: (id: string) => request<User>(`/users/${id}`),
    upsert: (body: Partial<User> & { email: string; cognitoSub: string }) =>
      request<User>("/users", { method: "POST", body: JSON.stringify(body) }),
  },
  trips: {
    list: (query = "") => request<Trip[]>(`/trips${query}`),
    get: (id: string) => request<Trip>(`/trips/${id}`),
    create: (body: Partial<Trip>) =>
      request<Trip>("/trips", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Trip>) =>
      request<Trip>(`/trips/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (id: string) =>
      request<void>(`/trips/${id}`, { method: "DELETE" }),
    search: (q: string) => request<Trip[]>(`/trips?q=${encodeURIComponent(q)}`),
  },
  creators: {
    getByHandle: (handle: string) =>
      request<CreatorProfile>(`/creators/${handle}`),
  },
  bookings: {
    list: (userId: string) => request<Booking[]>(`/bookings?userId=${userId}`),
    create: (body: Partial<Booking>) =>
      request<Booking>("/bookings", { method: "POST", body: JSON.stringify(body) }),
    updateStatus: (id: string, status: Booking["status"]) =>
      request<Booking>(`/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },
  payouts: {
    list: (creatorId: string) =>
      request<Payout[]>(`/payouts?creatorId=${creatorId}`),
    create: (body: Partial<Payout>) =>
      request<Payout>("/payouts", { method: "POST", body: JSON.stringify(body) }),
  },
  applications: {
    create: (body: Record<string, unknown>) =>
      request<{ ok: true }>("/applications", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    list: () => request<Record<string, unknown>[]>("/applications"),
  },
  reviews: {
    list: (tripId: string) => request<Review[]>(`/reviews?tripId=${tripId}`),
    create: (body: Partial<Review>) =>
      request<Review>("/reviews", { method: "POST", body: JSON.stringify(body) }),
  },
};
