const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const USD_PRECISE = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(amountUsd: number, precise = false): string {
  return (precise ? USD_PRECISE : USD).format(amountUsd);
}

export function formatPriceFrom(amountUsd: number): string {
  return `From ${formatCurrency(amountUsd)}`;
}

export function formatNights(nights: number): string {
  return nights === 1 ? "1 night" : `${nights} nights`;
}

export function formatDuration(nights: number): string {
  const days = nights + 1;
  return `${days} days / ${formatNights(nights)}`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  const startFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(start);
  const endFmt = new Intl.DateTimeFormat("en-US", {
    month: sameMonth ? undefined : "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(end);
  return `${startFmt} – ${endFmt}`;
}
