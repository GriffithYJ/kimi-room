"use client";

import { useEffect } from "react";

// iOS PWA standalone has no native swipe-back gesture. This client component
// adds one: finger starts in the left 30px edge, drags right > 80px with
// vertical drift < 50px → history.back(). Default-on for all users
// (人机恋 + airp 用户都习惯 iOS swipe back).
//
// Non-conflict with PullToRefresh: PTR arms on touchstart only when
// window.scrollY === 0 AND requires vertical drag down; SwipeBack arms on
// left edge x < 30 AND requires mostly-horizontal drag right. Their armed
// states are mutually exclusive in practice.
//
// Skip when there's nowhere to go back (history length 1) — avoids the
// browser navigating off-site.
const EDGE_PX = 30;
const TRIGGER_DX = 80;
const MAX_DRIFT_Y = 50;

export function SwipeBack() {
  useEffect(() => {
    let startX: number | null = null;
    let startY: number | null = null;
    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      if (t.clientX > EDGE_PX) {
        startX = null;
        startY = null;
        return;
      }
      startX = t.clientX;
      startY = t.clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      if (startX == null || startY == null) return;
      const t = e.changedTouches[0];
      if (!t) {
        startX = null;
        startY = null;
        return;
      }
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      startX = null;
      startY = null;
      if (dx >= TRIGGER_DX && dy <= MAX_DRIFT_Y && window.history.length > 1) {
        window.history.back();
      }
    }
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
  return null;
}
