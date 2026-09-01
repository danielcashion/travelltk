"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormKind = "creator" | "partner" | "contact";

const FIELDS: Record<
  FormKind,
  { name: string; label: string; type?: string; textarea?: boolean; required?: boolean }[]
> = {
  creator: [
    { name: "name", label: "Full name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "instagram", label: "Instagram handle" },
    { name: "tiktok", label: "TikTok handle" },
    { name: "youtube", label: "YouTube channel" },
    { name: "followers", label: "Combined follower count", type: "number", required: true },
    { name: "sample", label: "Sample content links", textarea: true, required: true },
  ],
  partner: [
    { name: "name", label: "Contact name", required: true },
    { name: "email", label: "Work email", type: "email", required: true },
    { name: "company", label: "Company", required: true },
    { name: "category", label: "You are a (hotel / airline / cruise / tour operator)", required: true },
    { name: "message", label: "How you want to work with TravelLTK", textarea: true, required: true },
  ],
  contact: [
    { name: "name", label: "Name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "topic", label: "Topic", required: true },
    { name: "message", label: "Message", textarea: true, required: true },
  ],
};

const ENDPOINTS: Record<FormKind, string> = {
  creator: "/api/applications/creators",
  partner: "/api/applications/partners",
  contact: "/api/contact",
};

export function LeadForm({ kind }: { kind: FormKind }) {
  const [pending, setPending] = useState(false);
  const fields = FIELDS[kind];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setPending(true);
    try {
      const response = await fetch(ENDPOINTS[kind], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      toast.success("Received. We will follow up by email.");
      form.reset();
    } catch {
      toast.error("Could not send. Try again or email hello@travelltk.com.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.textarea ? (
            <Textarea
              id={field.name}
              name={field.name}
              required={field.required}
              rows={4}
            />
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
            />
          )}
        </div>
      ))}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Submit"}
      </Button>
    </form>
  );
}
