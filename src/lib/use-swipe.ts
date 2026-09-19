"use client";

import { useRef } from "react";

// The foyer's sideways turn — pointer down to pointer up. It fires only when the
// drag is mostly horizontal and past a threshold, so taps and vertical drags
// pass straight through. Pointer events cover touch and mouse alike.
export function useSwipe(onNext: () => void, onPrev: () => void, threshold = 48) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onPointerDown: (e: React.PointerEvent) => {
      start.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return;
      if (dx < 0) onNext();
      else onPrev();
    },
  };
}
