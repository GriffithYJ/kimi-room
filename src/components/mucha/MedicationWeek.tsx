"use client";

import { useEffect, useMemo, useState } from "react";
import { RoseBud } from "./Gothic";
import { GOTHIC } from "@/lib/kimi-palettes";

const STORAGE_KEY = "kimi-web:medication:taken";

// ISO week key: YYYY-Www so stored state resets each week automatically.
function isoWeek(d: Date): string {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const dayDiff = Math.round((target.getTime() - firstThursday.getTime()) / 86400000);
  const week = 1 + Math.floor(dayDiff / 7);
  return `${target.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

// Mon..Sun labels + computed dayIndex where 0=Mon ... 6=Sun (ISO).
const DAYS = [
  { key: "mon", label: "一" },
  { key: "tue", label: "二" },
  { key: "wed", label: "三" },
  { key: "thu", label: "四" },
  { key: "fri", label: "五" },
  { key: "sat", label: "六" },
  { key: "sun", label: "今" },
];

/** @deprecated 2026-05-16 dead-tag — 0 imports as of theme sweep. 之后若仍未引用可删. */
export function MedicationWeek() {
  const today = useMemo(() => new Date(), []);
  const week = useMemo(() => isoWeek(today), [today]);
  const todayIsoIdx = useMemo(() => (today.getDay() + 6) % 7, [today]); // 0..6, Mon..Sun

  // state: { "2026-W17": { mon: true, tue: false, ... } }
  const [taken, setTaken] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const all = JSON.parse(raw) as Record<string, Record<string, boolean>>;
      if (all[week]) setTaken(all[week]);
    } catch {}
  }, [week]);

  function toggle(key: string) {
    setTaken((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const all = raw ? (JSON.parse(raw) as Record<string, Record<string, boolean>>) : {};
        all[week] = next;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      } catch {}
      return next;
    });
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      {DAYS.map((d, i) => {
        const isToday = i === todayIsoIdx;
        const isFuture = i > todayIsoIdx;
        const isTaken = !!taken[d.key];
        const state: "bloom" | "closed" | "wilted" = isTaken
          ? "bloom"
          : isFuture
          ? "closed"
          : "wilted"; // past but not taken
        return (
          <button
            key={d.key}
            type="button"
            onClick={() => toggle(d.key)}
            disabled={isFuture}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: isFuture ? "default" : "pointer",
              opacity: isFuture ? 0.55 : 1,
            }}
          >
            <RoseBud state={state} size={28} />
            <div
              style={{
                fontSize: 9,
                color: isToday ? GOTHIC.accent : GOTHIC.mute,
                marginTop: 4,
                fontStyle: isToday ? "italic" : "normal",
              }}
            >
              {d.label === "今" || isToday ? "今" : d.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
