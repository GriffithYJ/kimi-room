"use client";

import { useEffect, useState } from "react";

/**
 * StatusBar — global top bar showing current time HH:MM.
 *
 * Renders on every page inside RootLayout. Time updates every 30s
 * (not every second) to avoid unnecessary re-renders — iOS Safari
 * bfcache restore re-syncs via pageshow listener.
 *
 * Follows Mucha dark-gold aesthetic using CSS custom properties so
 * day/night theme works without re-render.
 */

function formatTime(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function StatusBar() {
  // Start null so SSR renders nothing (avoids hydration mismatch).
  // On mount the effect populates the time and the bar appears.
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTime(new Date()));

    // Update every 30s — precise enough for a status bar clock, avoids
    // hammering React reconciliation on every second.
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 30_000);

    // iOS Safari bfcache: re-sync time on restore.
    const onShow = () => setTime(formatTime(new Date()));
    window.addEventListener("pageshow", onShow);

    return () => {
      clearInterval(interval);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

  // SSR + hydration: render nothing until client mount resolves the time.
  // This avoids a content flash because the bar itself is invisible when
  // empty — same height/layout, just no visible text.
  if (time === null) {
    return null;
  }

  return (
    <div
      className="kimi-status-bar"
      role="status"
      aria-label="Current time"
    >
      <time dateTime={time}>{time}</time>
    </div>
  );
}
