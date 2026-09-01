"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TripCategory } from "@/types";
import { TRIP_CATEGORIES } from "@/types";

const ALL = "all";

export function ExploreFilters({ destinations }: { destinations: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <form
      className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Select
          value={searchParams.get("destination") ?? ALL}
          onValueChange={(value) => update("destination", value)}
        >
          <SelectTrigger id="destination" className="w-full">
            <SelectValue placeholder="Anywhere" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Anywhere</SelectItem>
            {destinations.map((destination) => (
              <SelectItem key={destination} value={destination.toLowerCase()}>
                {destination}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={searchParams.get("category") ?? ALL}
          onValueChange={(value) => update("category", value)}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Any category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any category</SelectItem>
            {TRIP_CATEGORIES.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Select
          value={searchParams.get("duration") ?? ALL}
          onValueChange={(value) => update("duration", value)}
        >
          <SelectTrigger id="duration" className="w-full">
            <SelectValue placeholder="Any length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any length</SelectItem>
            <SelectItem value="short">Up to 4 nights</SelectItem>
            <SelectItem value="week">5–8 nights</SelectItem>
            <SelectItem value="long">9+ nights</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Select
          value={searchParams.get("price") ?? ALL}
          onValueChange={(value) => update("price", value)}
        >
          <SelectTrigger id="price" className="w-full">
            <SelectValue placeholder="Any price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any price</SelectItem>
            <SelectItem value="under-2k">Under $2,000</SelectItem>
            <SelectItem value="2k-4k">$2,000–$4,000</SelectItem>
            <SelectItem value="4k-plus">$4,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sort">Sort</Label>
        <Select
          value={searchParams.get("sort") ?? "trending"}
          onValueChange={(value) => update("sort", value)}
        >
          <SelectTrigger id="sort" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 sm:col-span-2 lg:col-span-5">
        <Label htmlFor="q">Search trips</Label>
        <Input
          id="q"
          name="q"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder="Paris, cruise, ski week…"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              update("q", (event.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
    </form>
  );
}

export type { TripCategory };
