"use client";

import { BookmarkCheck, MapPinned, SplitSquareHorizontal, Wallet } from "lucide-react";

const ITEMS = [
  {
    icon: MapPinned,
    title: "The exact route, not a mood board",
    body: "Creators publish the trip they actually took — nights, transfers, and the restaurant they would book again — as one product.",
  },
  {
    icon: SplitSquareHorizontal,
    title: "Book the whole itinerary or a single leg",
    body: "Take the Paris week, just the cruise, or the Istanbul hotel. Every leg is priced on its own and marked included or optional.",
  },
  {
    icon: Wallet,
    title: "Creators earn on every booking",
    body: "A payout lands when a traveler books through a trip. That is the incentive to publish the real logistics, not a highlight reel.",
  },
  {
    icon: BookmarkCheck,
    title: "Timing is part of the product",
    body: "Same-day port transfers, rest-day calls, and all-aboard windows are written in. You are not reverse-engineering a caption.",
  },
] as const;

export function HomeValueProps() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {ITEMS.map((item) => (
        <div key={item.title} className="rounded-xl border border-border bg-card p-6">
          <item.icon className="size-6 text-primary" aria-hidden />
          <h3 className="mt-4 font-display text-xl">{item.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
