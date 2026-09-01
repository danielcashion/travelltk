"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DoNotSellForm() {
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setPending(true);
    try {
      const response = await fetch("/api/legal/do-not-sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("failed");
      toast.success("Opt-out recorded (placeholder).");
      form.reset();
    } catch {
      toast.error("Could not record the request.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email on the account</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Do not sell or share my info"}
      </Button>
    </form>
  );
}
