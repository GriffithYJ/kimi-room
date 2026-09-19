"use client";

// Turning the glass on the night triptych — the same as the full screen: swipe
// sideways; a window that has three cut pieces uses them over its own black,
// one without them is cropped three ways. Opens on the day's window, persists
// nothing.

import { useState } from "react";
import { WINDOW_PANELS } from "@/lib/foyer";
import { useSwipe } from "@/lib/use-swipe";
import { NightTriptych } from "./NightTriptych";
import type { FoyerScreenProps } from "./types";

export function NightTriptychRotor({
  initialIndex,
  illumination,
  ...shared
}: FoyerScreenProps & { initialIndex: number; illumination: number }) {
  const [idx, setIdx] = useState(initialIndex % WINDOW_PANELS.length);
  const cycle = (d: number) =>
    setIdx((i) => (i + d + WINDOW_PANELS.length) % WINDOW_PANELS.length);
  const swipe = useSwipe(() => cycle(1), () => cycle(-1));
  const w = WINDOW_PANELS[idx];

  return (
    <NightTriptych
      key={idx}
      {...shared}
      illumination={illumination}
      windowSrc={w.src}
      pieces={w.pieces}
      bg={w.bg}
      swipeHandlers={swipe}
    />
  );
}
