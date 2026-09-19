"use client";

import { useEffect, useState } from "react";
import {
  getDies,
  getFlowerIndex,
  getGreeting,
  getMilestone,
  getSeasonIndex,
  getSinceLine,
  getTodayLatin,
  getWindowIndex,
  localNow,
  parseSince,
  toRoman,
} from "@/lib/foyer";
import { ensureSince, quoteLines, readFoyerPrefs, type FoyerWeatherLocation } from "@/lib/foyer-prefs";
import { getMoonPhase } from "@/lib/moon-phase";

/**
 * Everything the foyer derives from time — computed on the client, off this
 * device's own clock.
 *
 * Why not on the server: the start date, the line, the note and the weather
 * location all live in the browser, where the server cannot read them; and the
 * server is rarely in the reader's timezone, so rendering a date there and
 * correcting it on the client is precisely a hydration mismatch. The server
 * chooses which of the four screens to draw; the contents wait for the mount.
 *
 * Before that it returns null, and the caller lays down a plain ground. The
 * foyer fades in anyway, so that frame does not read as missing.
 *
 * It recomputes on the next local hour — the greeting turns with the hour, the
 * date and the count at midnight — and whenever the page becomes visible again,
 * so a PWA left on the home screen overnight shows today's number the moment it
 * is looked at.
 */
export type FoyerClock = {
  dies: number;
  diesRoman: string;
  greet: string;
  todayLatin: string;
  milestone: string;
  sinceLine: string;
  quote: { lines: string[] };
  note: string;
  weather: FoyerWeatherLocation | null;
  seasonIndex: number;
  flowerIndex: number;
  windowIndex: number;
  moonIllum: number;
  moonName: string;
  moonFraction: number;
};

function read(now: Date): FoyerClock {
  const prefs = readFoyerPrefs();
  // No start date yet means today becomes it: the day this room was opened.
  const since = parseSince(prefs.since ?? ensureSince(now)) ?? new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dies = getDies(since, now);
  const milestone = getMilestone(dies);
  const t = localNow(now);
  const moon = getMoonPhase(now);

  return {
    dies,
    diesRoman: toRoman(dies),
    greet: getGreeting(t.hour),
    todayLatin: getTodayLatin(t),
    milestone: milestone.isToday
      ? `AD ${milestone.target} · HODIE`
      : `AD ${milestone.target} · SUPERSUNT ${milestone.left} DIES`,
    sinceLine: getSinceLine(since),
    quote: { lines: quoteLines(prefs.quote) },
    note: prefs.note,
    weather: prefs.weather,
    seasonIndex: getSeasonIndex(now),
    flowerIndex: getFlowerIndex(now),
    windowIndex: getWindowIndex(now),
    moonIllum: moon.illumination,
    moonName: moon.name,
    moonFraction: moon.fraction,
  };
}

export function useFoyerClock(): FoyerClock | null {
  const [clock, setClock] = useState<FoyerClock | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const tick = () => setClock(read(new Date()));
    tick();

    // Aligned to the next local hour. Not Date.now() % 3600000 — that is UTC's
    // hour, which in a half-hour timezone lands thirty minutes off.
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setMinutes(60, 0, 0);
    const timeout = setTimeout(
      () => {
        tick();
        interval = setInterval(tick, 3600000);
      },
      Math.max(1000, nextHour.getTime() - now.getTime()),
    );

    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return clock;
}
