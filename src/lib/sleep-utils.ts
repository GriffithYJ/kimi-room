// V2 sleep utils · 手工 SleepEntry → candle row data.
//
// canon V1 走 sleep-infer.ts (APP_OPEN gap detection from Prisma activity
// log). V2 没 activity log, 全 manual entry. 此 util 只做 SleepEntry → candle
// transform + day label.

import type { SleepEntry } from "./stores/types";

export type SleepCandle = {
  h: number;             // candle height 0-100 by duration
  label: string;         // weekday label, e.g. "Mon"
  date: string;          // YYYY-MM-DD JST
  startISO: string;
  endISO: string;
  durationHrs: number;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function jstDateKey(iso: string): string {
  const d = new Date(iso);
  const j = new Date(d.getTime() + 9 * 3600000);
  return j.toISOString().slice(0, 10);
}

function jstWeekdayLabel(dateKey: string): string {
  // dateKey is JST YYYY-MM-DD · construct local-JST date noon to dodge tz.
  const d = new Date(dateKey + "T12:00:00+09:00");
  return WEEKDAYS[d.getUTCDay()];
}

export function entryToCandle(e: SleepEntry): SleepCandle {
  const start = new Date(e.startISO);
  const end = new Date(start.getTime() + e.durationHrs * 3600000);
  // candle h: 4h→30, 6h→60, 8h→90, cap 100
  const h = Math.min(100, Math.max(20, Math.round(e.durationHrs * 12)));
  return {
    h,
    label: jstWeekdayLabel(e.date),
    date: e.date,
    startISO: e.startISO,
    endISO: end.toISOString(),
    durationHrs: e.durationHrs,
  };
}

// last-N candles (sorted oldest → newest, gaps fill blank-low candle).
export function lastNCandles(entries: SleepEntry[], n: number): SleepCandle[] {
  const todayKey = jstDateKey(new Date().toISOString());
  const out: SleepCandle[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const key = jstDateAddDays(todayKey, -i);
    const found = entries.find((e) => e.date === key);
    if (found) {
      out.push(entryToCandle(found));
    } else {
      // 用 JST noon ISO 当 blank candle 占位 startISO/endISO — modal title 走
      // jstDateKey(endISO), JST noon 不跨日.
      const noonIso = new Date(key + "T12:00:00+09:00").toISOString();
      out.push({
        h: 10,
        label: jstWeekdayLabel(key),
        date: key,
        startISO: noonIso,
        endISO: noonIso,
        durationHrs: 0,
      });
    }
  }
  return out;
}

function jstDateAddDays(yyyymmdd: string, delta: number): string {
  const [y, m, d] = yyyymmdd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().slice(0, 10);
}

export function endDateKeyOf(startISO: string, durationHrs: number): string {
  const start = new Date(startISO);
  const end = new Date(start.getTime() + durationHrs * 3600000);
  return jstDateKey(end.toISOString());
}
