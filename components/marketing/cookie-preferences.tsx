"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "travelltk-cookie-prefs";

interface Prefs {
  analytics: boolean;
  marketing: boolean;
}

export function CookiePreferences() {
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, marketing: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs(JSON.parse(raw) as Prefs);
    } catch {
      /* ignore */
    }
  }, []);

  function update(next: Prefs) {
    setPrefs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <div className="mt-4 space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="analytics">Analytics cookies</Label>
        <Switch
          id="analytics"
          checked={prefs.analytics}
          onCheckedChange={(analytics) => update({ ...prefs, analytics })}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="marketing">Marketing cookies</Label>
        <Switch
          id="marketing"
          checked={prefs.marketing}
          onCheckedChange={(marketing) => update({ ...prefs, marketing })}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Essential cookies stay on. This control is a placeholder until a CMP is chosen.
      </p>
    </div>
  );
}
