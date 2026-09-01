const ITEMS = [
  {
    n: "01",
    title: "The exact route, not a mood board",
    body: "Creators publish the trip they actually took — nights, transfers, and the restaurant they would book again — as one product.",
  },
  {
    n: "02",
    title: "Book the whole itinerary or a single leg",
    body: "Take the Paris week, just the cruise, or the Istanbul hotel. Every leg is priced on its own and marked included or optional.",
  },
  {
    n: "03",
    title: "Creators earn on every booking",
    body: "A payout lands when a traveler books through a trip. That is the incentive to publish the real logistics, not a highlight reel.",
  },
  {
    n: "04",
    title: "Timing is part of the product",
    body: "Same-day port transfers, rest-day calls, and all-aboard windows are written in. You are not reverse-engineering a caption.",
  },
] as const;

export function HomeValueProps() {
  return (
    <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
      {ITEMS.map((item) => (
        <div key={item.title} className="border-t border-secondary/40 pt-5">
          <p className="text-xs font-medium tracking-[0.22em] text-secondary uppercase">
            {item.n}
          </p>
          <h3 className="mt-3 font-display text-xl text-balance">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
