"use client";

import { useEffect, useState } from "react";
import { useBoundStore } from "@/store";
import { seedItems, seedBOMs, seedMovements } from "@/data/seed";

export function HydrationGuard({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const hasHydrated = useBoundStore((s) => s._hasHydrated);
  const items = useBoundStore((s) => s.items);
  const setItems = useBoundStore((s) => s.setItems);
  const setBOMs = useBoundStore((s) => s.setBOMs);
  const setMovements = useBoundStore((s) => s.setMovements);

  useEffect(() => {
    if (hasHydrated) {
      if (items.length === 0 && seedItems.length > 0) {
        setItems(seedItems);
        setBOMs(seedBOMs);
        setMovements(seedMovements);
      }
      setHydrated(true);
    }
  }, [hasHydrated, items.length, setItems, setBOMs, setMovements]);

  if (!hydrated) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  return <>{children}</>;
}
