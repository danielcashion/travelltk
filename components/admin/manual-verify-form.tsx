"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ManualVerifyForm({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch(
        `/api/admin/applications/${encodeURIComponent(applicationId)}/manual-verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        },
      );
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.error ?? "Could not verify");
      }
      toast.success("Marked as manually verified. This is in the audit log.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not verify");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <div className="space-y-2">
        <Label htmlFor="manual-reason">Reason / note (required, audit log)</Label>
        <Textarea
          id="manual-reason"
          required
          minLength={8}
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="e.g. Agency-managed @handle; confirmed 520k followers via screenshot 2026-09-01"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Mark as manually verified"}
      </Button>
    </form>
  );
}
