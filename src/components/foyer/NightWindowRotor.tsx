"use client";

// Turning the glass on the full night screen: swipe sideways, and each window
// brings its own colour of light. It opens on the day's window (getWindowIndex,
// by local calendar day); left alone it turns once a day. Nothing is persisted —
// a reload returns to the day's own.

import { useState } from "react";
import { WINDOW_PANELS } from "@/lib/foyer";
import { useSwipe } from "@/lib/use-swipe";
import { NightWindow } from "./NightWindow";
import type { FoyerScreenProps } from "./types";

export function NightWindowRotor({
  initialIndex,
  ...shared
}: FoyerScreenProps & { initialIndex: number }) {
  const [idx, setIdx] = useState(initialIndex % WINDOW_PANELS.length);
  const cycle = (d: number) =>
    setIdx((i) => (i + d + WINDOW_PANELS.length) % WINDOW_PANELS.length);
  const swipe = useSwipe(() => cycle(1), () => cycle(-1));
  const w = WINDOW_PANELS[idx];

  // key=idx remounts on a turn, so the entrance plays again and you can see
  // that a window was turned.
  return (
    <NightWindow
      key={idx}
      {...shared}
      windowSrc={w.src}
      lightGlow={w.light}
      swipeHandlers={swipe}
    />
  );
}
