import type { Trip, TripCategory } from "@/types";

export type TripSort = "trending" | "newest" | "price-asc" | "price-desc";

export interface TripFilters {
  destination?: string;
  category?: TripCategory | string;
  duration?: "short" | "week" | "long";
  price?: "under-2k" | "2k-4k" | "4k-plus";
  sort?: TripSort;
  query?: string;
  page?: number;
}

const PAGE_SIZE = 9;

export function durationMatch(nights: number, duration?: TripFilters["duration"]): boolean {
  if (!duration) return true;
  if (duration === "short") return nights <= 4;
  if (duration === "week") return nights >= 5 && nights <= 8;
  return nights >= 9;
}

export function priceMatch(price: number, band?: TripFilters["price"]): boolean {
  if (!band) return true;
  if (band === "under-2k") return price < 2000;
  if (band === "2k-4k") return price >= 2000 && price < 4000;
  return price >= 4000;
}

export function filterTrips(trips: Trip[], filters: TripFilters): Trip[] {
  const query = filters.query?.trim().toLowerCase();

  const filtered = trips.filter((trip) => {
    if (filters.destination) {
      const needle = filters.destination.toLowerCase();
      if (!trip.destinations.some((item) => item.toLowerCase() === needle)) {
        return false;
      }
    }
    if (filters.category && trip.category !== filters.category) return false;
    if (!durationMatch(trip.nights, filters.duration)) return false;
    if (!priceMatch(trip.priceFromUsd, filters.price)) return false;
    if (query) {
      const haystack = [
        trip.title,
        trip.subtitle,
        trip.description,
        ...trip.destinations,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "newest":
        return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
      case "price-asc":
        return a.priceFromUsd - b.priceFromUsd;
      case "price-desc":
        return b.priceFromUsd - a.priceFromUsd;
      case "trending":
      default:
        return b.saveCount + b.bookingCount * 3 - (a.saveCount + a.bookingCount * 3);
    }
  });

  return sorted;
}

export function paginate<T>(items: T[], page = 1, pageSize = PAGE_SIZE) {
  const current = Math.max(1, page);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    pageSize,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}
