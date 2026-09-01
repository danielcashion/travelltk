"use client";

import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/trip/empty-state";

const FAQ = [
  {
    q: "What is a TravelLTK trip?",
    a: "A published itinerary from a creator: destinations, nights, and bookable legs (flights, hotels, cruises, activities, restaurants, transfers). You can book the whole trip or individual legs.",
  },
  {
    q: "Do I have to book every leg?",
    a: "No. Legs marked included-in-trip are part of the advertised from-price. Optional legs have their own Book this leg action.",
  },
  {
    q: "What is the booking fee?",
    a: "A platform fee TravelLTK charges on top of the trip and leg cost. It is always shown as its own line. It is not a supplier surcharge.",
  },
  {
    q: "When does a creator get paid?",
    a: "After a booking is confirmed (payment succeeds). Payouts go through Stripe Connect Express to the creator’s connected account.",
  },
  {
    q: "Can I cancel?",
    a: "Cancellation terms follow the underlying supplier for each leg, plus TravelLTK’s booking terms. See Terms of Service. Placeholder policy until legal review.",
  },
  {
    q: "How do I become a creator?",
    a: "Apply at Become a Creator. We look for people who can document a real trip day by day, not a destination mood board.",
  },
  {
    q: "Is my Google account data used for ads?",
    a: "Sign-in uses Google via Amazon Cognito. See the Privacy Policy for what is collected and why. Google account data is used to create your TravelLTK user record, not sold.",
  },
];

export function HelpFaq() {
  const [query, setQuery] = useState("");
  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return FAQ;
    return FAQ.filter(
      (item) =>
        item.q.toLowerCase().includes(needle) || item.a.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <div>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search help articles"
        aria-label="Search help"
      />
      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No articles match"
            description="Try booking, payout, cancel, or creator. You can also write to us from the contact page."
          />
        </div>
      ) : (
        <Accordion type="single" collapsible className="mt-6">
          {items.map((item, index) => (
            <AccordionItem key={item.q} value={`faq-${index}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
