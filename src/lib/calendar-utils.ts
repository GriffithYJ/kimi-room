import { fetchCoreCalendarEntries, setCoreCalendarEntry } from "./kimi-core-client";
// Utilities for /room/calendar:
// - localStorage shape & helpers
// - date helpers (Monday-first grid, JST)
// - solar terms (24 节气) approximate table for display
// - Chinese month names

// ---- localStorage keys ----
export const STORAGE_KEYS = {
  cycle: "kimi-web:cal:cycle", // Record<YYYY-MM-DD, 1|2|3>
  meds: "kimi-web:cal:meds", // Record<YYYY-MM-DD, string>
  events: "kimi-web:cal:events", // Record<YYYY-MM-DD, string>
  notes: "kimi-web:cal:notes", // Record<YYYY-MM-DD, string>
} as const;

export type FlowLevel = 1 | 2 | 3;

export type DayData = {
  flow?: FlowLevel;
  meds?: string;
  event?: string;
  note?: string;
};

export type CalendarStore = {
  cycle: Record<string, FlowLevel>;
  meds: Record<string, string>;
  events: Record<string, string>;
  notes: Record<string, string>;
};

export function loadStore(): CalendarStore {
  const empty: CalendarStore = { cycle: {}, meds: {}, events: {}, notes: {} };
  if (typeof localStorage === "undefined") return empty;
  function read<T>(key: string): T {
    try {
      const raw = localStorage.getItem(key);
      return (raw ? JSON.parse(raw) : {}) as T;
    } catch {
      return {} as T;
    }
  }
  const store = {
    cycle: read<Record<string, FlowLevel>>(STORAGE_KEYS.cycle),
    meds: read<Record<string, string>>(STORAGE_KEYS.meds),
    events: read<Record<string, string>>(STORAGE_KEYS.events),
    notes: read<Record<string, string>>(STORAGE_KEYS.notes),
  };
  // backwards-compat: read legacy `kimi-web:cycle:marked` boolean → flow level 2
  try {
    const legacy = localStorage.getItem("kimi-web:cycle:marked");
    if (legacy) {
      const parsed = JSON.parse(legacy) as Record<string, boolean>;
      for (const [d, v] of Object.entries(parsed)) {
        if (v && !store.cycle[d]) store.cycle[d] = 2 as FlowLevel;
      }
    }
  } catch {}
  return store;
}

export function saveDay(date: string, data: DayData): void {
  if (typeof localStorage === "undefined") return;
  const store = loadStore();
  if (data.flow == null) delete store.cycle[date];
  else store.cycle[date] = data.flow;
  if (!data.meds) delete store.meds[date];
  else store.meds[date] = data.meds;
  if (!data.event) delete store.events[date];
  else store.events[date] = data.event;
  if (!data.note) delete store.notes[date];
  else store.notes[date] = data.note;
  try {
    localStorage.setItem(STORAGE_KEYS.cycle, JSON.stringify(store.cycle));
    localStorage.setItem(STORAGE_KEYS.meds, JSON.stringify(store.meds));
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(store.events));
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(store.notes));
    // sync legacy cycle key so existing /room/health/cycle still works
    const legacyMarked: Record<string, boolean> = {};
    for (const d of Object.keys(store.cycle)) legacyMarked[d] = true;
    localStorage.setItem("kimi-web:cycle:marked", JSON.stringify(legacyMarked));
  } catch {}
}

export function getDay(store: CalendarStore, date: string): DayData {
  return {
    flow: store.cycle[date],
    meds: store.meds[date],
    event: store.events[date],
    note: store.notes[date],
  };
}

// ---- DB sync (DB-primary; localStorage = offline cache) ----

type DbEntry = {
  date: string;
  cycle: number | null;
  meds: unknown;
  events: string | null;
  notes: string | null;
};

export function entriesToStore(entries: DbEntry[]): CalendarStore {
  const store: CalendarStore = { cycle: {}, meds: {}, events: {}, notes: {} };
  for (const e of entries) {
    if (e.cycle === 1 || e.cycle === 2 || e.cycle === 3) {
      store.cycle[e.date] = e.cycle as FlowLevel;
    }
    if (e.meds != null) {
      // meds is jsonb; serialize back to string for compat with existing UI
      store.meds[e.date] =
        typeof e.meds === "string" ? e.meds : JSON.stringify(e.meds);
    }
    if (e.events) store.events[e.date] = e.events;
    if (e.notes) store.notes[e.date] = e.notes;
  }
  return store;
}

export function storeIsEmpty(store: CalendarStore): boolean {
  return (
    Object.keys(store.cycle).length === 0 &&
    Object.keys(store.meds).length === 0 &&
    Object.keys(store.events).length === 0 &&
    Object.keys(store.notes).length === 0
  );
}

// V2 stub · canon V1 fetched from /api/calendar/entries (Prisma DB sync).
// V2 ship 0 server backend · localStorage = single source of truth · these
// stubs return null/empty so canon RoomCalendar localStorage-first path 走通.

// Partner-written google calendar events mirrored into local kv.
// Calendar UI renders a fox icon on dates where partner wrote events.
// V2 stub: empty (no partner sync wired); fork → wire own webhook adapter.
export type MirrorEvent = {
  time: string;
  title: string;
  location?: string | null;
  colorId?: string | null;
  description?: string | null;
  googleEventId?: string | null;
};

export type MirrorDayMap = Record<string, MirrorEvent[]>;

export async function fetchAllEntries(): Promise<CalendarStore | null> {
  const now = new Date();
  const startDateCore = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  const endDateCore = new Date(now.getFullYear() + 1, now.getMonth(), 0);
  const sd = ymd(startDateCore);
  const ed = ymd(endDateCore);
  const entries = await fetchCoreCalendarEntries(sd, ed);
  if (entries.length === 0) return null;
  const store: CalendarStore = { cycle: {}, meds: {}, events: {}, notes: {} };
  for (const e of entries) {
    if (typeof e.flow === "number" && (e.flow === 1 || e.flow === 2 || e.flow === 3)) {
      store.cycle[e.date] = e.flow as FlowLevel;
    }
    if (e.meds) store.meds[e.date] = e.meds;
    if (e.event) store.events[e.date] = e.event;
    if (e.note) store.notes[e.date] = e.note;
  }
  return store;
}

export async function fetchAllEntriesAndMirror(): Promise<{
  own: CalendarStore;
  mirror: MirrorDayMap;
} | null> {
  const own = await fetchAllEntries();
  if (!own) return null;
  return { own, mirror: {} as MirrorDayMap };
}

export async function putDayToDb(date: string, data: DayData): Promise<boolean> {
  const payload: Record<string, unknown> = {};
  if (data.event) payload.event = data.event;
  if (data.note) payload.note = data.note;
  if (data.flow) payload.flow = data.flow;
  if (data.meds) payload.meds = data.meds;
  return setCoreCalendarEntry(date, payload);
}

export async function migrateLocalToDb(): Promise<{ ok: boolean; written: number }> {
  const local = loadStore();
  let count = 0;
  const dates = new Set([
    ...Object.keys(local.cycle),
    ...Object.keys(local.meds),
    ...Object.keys(local.events),
    ...Object.keys(local.notes),
  ]);
  for (const date of dates) {
    const data: DayData = {};
    if (local.cycle[date]) data.flow = local.cycle[date];
    if (local.meds[date]) data.meds = local.meds[date];
    if (local.events[date]) data.event = local.events[date];
    if (local.notes[date]) data.note = local.notes[date];
    const ok = await putDayToDb(date, data);
    if (ok) count++;
  }
  return { ok: true, written: count };
}

export function mergeStoresPreferLocal(
  remote: CalendarStore,
  local: CalendarStore,
): CalendarStore {
  // Local takes precedence on conflict — local has the most recent unsynced edits.
  // This is for the brief window during initial DB-primary rollout where some
  // entries exist only in localStorage and migration hasn't run yet.
  const merged: CalendarStore = {
    cycle: { ...remote.cycle, ...local.cycle },
    meds: { ...remote.meds, ...local.meds },
    events: { ...remote.events, ...local.events },
    notes: { ...remote.notes, ...local.notes },
  };
  return merged;
}

// ---- date helpers ----
export function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysInMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

// returns Monday-based offset (0=Mon, 6=Sun) for the 1st of month
export function mondayOffset(year: number, month0: number): number {
  const dow = new Date(year, month0, 1).getDay(); // 0=Sun..6=Sat
  return (dow + 6) % 7;
}

export function isToday(year: number, month0: number, day: number): boolean {
  const t = new Date();
  return (
    t.getFullYear() === year && t.getMonth() === month0 && t.getDate() === day
  );
}

export function isWeekend(monthOffset: number, day: number): boolean {
  // monthOffset: position 0..6 (mon..sun) of THIS day in the grid
  return monthOffset >= 5;
}

// ---- chinese month name ----
const CN_MONTH = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

export function chineseMonth(month0: number): string {
  return CN_MONTH[month0] ?? "";
}

const EN_MONTH = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function englishMonth(month0: number): string {
  return EN_MONTH[month0] ?? "";
}

// ---- 24 solar terms (approximate, ±1 day in real ephemeris) ----
// Used only for display of "currently within term X" subtitle.
// Format: month0:day → name. 闰年 will be off by 1 day; treat as approximate.
const SOLAR_TERMS: Array<{ m: number; d: number; name: string }> = [
  { m: 0, d: 5, name: "小寒" },
  { m: 0, d: 20, name: "大寒" },
  { m: 1, d: 4, name: "立春" },
  { m: 1, d: 18, name: "雨水" },
  { m: 2, d: 5, name: "惊蛰" },
  { m: 2, d: 20, name: "春分" },
  { m: 3, d: 5, name: "清明" },
  { m: 3, d: 20, name: "谷雨" },
  { m: 4, d: 5, name: "立夏" },
  { m: 4, d: 21, name: "小满" },
  { m: 5, d: 5, name: "芒种" },
  { m: 5, d: 21, name: "夏至" },
  { m: 6, d: 7, name: "小暑" },
  { m: 6, d: 22, name: "大暑" },
  { m: 7, d: 7, name: "立秋" },
  { m: 7, d: 23, name: "处暑" },
  { m: 8, d: 7, name: "白露" },
  { m: 8, d: 23, name: "秋分" },
  { m: 9, d: 8, name: "寒露" },
  { m: 9, d: 23, name: "霜降" },
  { m: 10, d: 7, name: "立冬" },
  { m: 10, d: 22, name: "小雪" },
  { m: 11, d: 7, name: "大雪" },
  { m: 11, d: 21, name: "冬至" },
];

// Returns the most recent past solar term as of the 1st of the given month.
// (Stable subtitle for the whole displayed month.)
export function currentSolarTerm(year: number, month0: number): string {
  // find the latest term whose date is <= the 15th of the displayed month
  const probe = new Date(year, month0, 15);
  let term = SOLAR_TERMS[SOLAR_TERMS.length - 1].name;
  let bestDate = new Date(year - 1, 0, 1);
  for (const t of SOLAR_TERMS) {
    const dt = new Date(year, t.m, t.d);
    if (dt <= probe && dt > bestDate) {
      bestDate = dt;
      term = t.name;
    }
  }
  return term;
}
