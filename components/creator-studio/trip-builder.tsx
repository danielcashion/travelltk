"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEG_TYPES, TRIP_CATEGORIES, type LegType, type Trip, type TripCategory } from "@/types";

interface DraftLeg {
  type: LegType;
  title: string;
  description: string;
  supplierName: string;
  supplierRef: string;
  priceEstimateUsd: string;
  bookingUrl: string;
  bookingApiRef: string;
}

interface DraftDay {
  title: string;
  location: string;
  summary: string;
  legs: DraftLeg[];
}

const emptyLeg = (): DraftLeg => ({
  type: "hotel",
  title: "",
  description: "",
  supplierName: "",
  supplierRef: "",
  priceEstimateUsd: "",
  bookingUrl: "",
  bookingApiRef: "",
});

export function TripBuilder({ trip }: { trip?: Trip }) {
  const [title, setTitle] = useState(trip?.title ?? "");
  const [destinations, setDestinations] = useState(trip?.destinations.join(", ") ?? "");
  const [category, setCategory] = useState<TripCategory>(trip?.category ?? "city-break");
  const [cover, setCover] = useState(trip?.coverImageUrl ?? "");
  const [days, setDays] = useState<DraftDay[]>(
    trip?.days.map((day) => ({
      title: day.title,
      location: day.location,
      summary: day.summary,
      legs: day.legs.map((leg) => ({
        type: leg.type,
        title: leg.title,
        description: leg.description,
        supplierName: leg.supplierName,
        supplierRef: leg.supplierRef,
        priceEstimateUsd: String(leg.priceEstimateUsd),
        bookingUrl: leg.bookingUrl ?? "",
        bookingApiRef: leg.bookingApiRef ?? "",
      })),
    })) ?? [
      {
        title: "Arrival",
        location: "",
        summary: "",
        legs: [emptyLeg()],
      },
    ],
  );

  function addDay() {
    setDays((current) => [
      ...current,
      { title: `Day ${current.length + 1}`, location: "", summary: "", legs: [emptyLeg()] },
    ]);
  }

  function addLeg(dayIndex: number) {
    setDays((current) =>
      current.map((day, index) =>
        index === dayIndex ? { ...day, legs: [...day.legs, emptyLeg()] } : day,
      ),
    );
  }

  function updateLeg(dayIndex: number, legIndex: number, patch: Partial<DraftLeg>) {
    setDays((current) =>
      current.map((day, d) =>
        d === dayIndex
          ? {
              ...day,
              legs: day.legs.map((leg, l) => (l === legIndex ? { ...leg, ...patch } : leg)),
            }
          : day,
      ),
    );
  }

  function save() {
    // TODO(api): apiClient.trips.create / update
    console.info("[placeholder] save trip", { title, destinations, category, cover, days });
    toast.success("Trip saved locally (mock). Wire apiClient.trips in Phase 7.");
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-xl">Trip metadata</h2>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destinations">Destinations (comma-separated)</Label>
          <Input
            id="destinations"
            value={destinations}
            onChange={(e) => setDestinations(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as TripCategory)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRIP_CATEGORIES.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cover">Cover media URL</Label>
          <Input
            id="cover"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="Upload to S3/CloudFront after Phase 7, or paste a URL"
          />
          <p className="text-xs text-muted-foreground">
            File upload will POST to a signed S3 URL. This field is the stand-in.
          </p>
        </div>
      </section>

      {days.map((day, dayIndex) => (
        <section key={dayIndex} className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-xl">Day {dayIndex + 1}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Day title</Label>
              <Input
                value={day.title}
                onChange={(e) =>
                  setDays((current) =>
                    current.map((item, i) =>
                      i === dayIndex ? { ...item, title: e.target.value } : item,
                    ),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={day.location}
                onChange={(e) =>
                  setDays((current) =>
                    current.map((item, i) =>
                      i === dayIndex ? { ...item, location: e.target.value } : item,
                    ),
                  )
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Summary</Label>
            <Textarea
              value={day.summary}
              onChange={(e) =>
                setDays((current) =>
                  current.map((item, i) =>
                    i === dayIndex ? { ...item, summary: e.target.value } : item,
                  ),
                )
              }
            />
          </div>
          {day.legs.map((leg, legIndex) => (
            <div key={legIndex} className="space-y-3 rounded-lg border border-border p-4">
              <p className="text-sm font-medium">Leg {legIndex + 1}</p>
              <Select
                value={leg.type}
                onValueChange={(value) =>
                  updateLeg(dayIndex, legIndex, { type: value as LegType })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEG_TYPES.map((item) => (
                    <SelectItem key={item.slug} value={item.slug}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Title"
                value={leg.title}
                onChange={(e) => updateLeg(dayIndex, legIndex, { title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={leg.description}
                onChange={(e) => updateLeg(dayIndex, legIndex, { description: e.target.value })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Supplier"
                  value={leg.supplierName}
                  onChange={(e) =>
                    updateLeg(dayIndex, legIndex, { supplierName: e.target.value })
                  }
                />
                <Input
                  placeholder="Supplier reference"
                  value={leg.supplierRef}
                  onChange={(e) =>
                    updateLeg(dayIndex, legIndex, { supplierRef: e.target.value })
                  }
                />
                <Input
                  placeholder="Price estimate (USD)"
                  type="number"
                  value={leg.priceEstimateUsd}
                  onChange={(e) =>
                    updateLeg(dayIndex, legIndex, { priceEstimateUsd: e.target.value })
                  }
                />
                <Input
                  placeholder="Affiliate booking URL (MVP)"
                  value={leg.bookingUrl}
                  onChange={(e) =>
                    updateLeg(dayIndex, legIndex, { bookingUrl: e.target.value })
                  }
                />
              </div>
              <Input
                placeholder="bookingApiRef (future direct API)"
                value={leg.bookingApiRef}
                onChange={(e) =>
                  updateLeg(dayIndex, legIndex, { bookingApiRef: e.target.value })
                }
              />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => addLeg(dayIndex)}>
            Add leg
          </Button>
        </section>
      ))}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={addDay}>
          Add day
        </Button>
        <Button type="submit">Save trip</Button>
      </div>
    </form>
  );
}
