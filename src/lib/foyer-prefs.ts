// The foyer's own settings — kept in the browser (localStorage), alongside the
// names and portraits, and edited under "门厅" in /backstage/settings.
// Client-safe; called on the server it simply returns the defaults.
//
//   kimi-foyer-since    start date, YYYY-MM-DD. Recorded automatically the first
//                       time the foyer opens, and editable afterwards.
//   kimi-foyer-quote    the line on the screen, one line per newline.
//   kimi-foyer-note     the slip by the door.
//   kimi-foyer-weather  { label, lat, lng } as JSON; absent = no weather row.
//
// Two more travel by cookie, because the server reads them to choose what to
// render (the same mechanism as kimi-theme):
//   kimi-foyer          composition, full | tria — the seal at the lower right.
//   kimi-foyer-skip     1 = skip the foyer, open straight into /room.

export const FOYER_COOKIE = "kimi-foyer";
export const FOYER_SKIP_COOKIE = "kimi-foyer-skip";

export type FoyerComposition = "full" | "tria";

export function parseFoyerComposition(v: string | undefined | null): FoyerComposition {
  return v?.trim().toLowerCase() === "tria" ? "tria" : "full";
}

const KEY_SINCE = "kimi-foyer-since";
const KEY_QUOTE = "kimi-foyer-quote";
const KEY_NOTE = "kimi-foyer-note";
const KEY_WEATHER = "kimi-foyer-weather";

export const FOYER_QUOTE_DEFAULT = "Whatever the hour, the lamp is on.\nThe door only pretends to be shut.";
export const FOYER_NOTE_DEFAULT = "Come in as you are.";

export type FoyerWeatherLocation = { label: string; lat: number; lng: number };

export type FoyerPrefs = {
  since: string | null;
  quote: string;
  note: string;
  weather: FoyerWeatherLocation | null;
};

function readLS(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLS(key: string, value: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value == null || !value.trim()) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

export function todayISO(now: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

function parseWeather(raw: string | null): FoyerWeatherLocation | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    const lat = Number(j?.lat);
    const lng = Number(j?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { label: String(j?.label ?? "").trim(), lat, lng };
  } catch {
    return null;
  }
}

export function readFoyerPrefs(): FoyerPrefs {
  return {
    since: readLS(KEY_SINCE),
    quote: readLS(KEY_QUOTE) ?? FOYER_QUOTE_DEFAULT,
    note: readLS(KEY_NOTE) ?? FOYER_NOTE_DEFAULT,
    weather: parseWeather(readLS(KEY_WEATHER)),
  };
}

export function writeFoyerPrefs(p: Partial<FoyerPrefs>): void {
  if ("since" in p) writeLS(KEY_SINCE, p.since ?? null);
  if ("quote" in p) writeLS(KEY_QUOTE, p.quote ?? null);
  if ("note" in p) writeLS(KEY_NOTE, p.note ?? null);
  if ("weather" in p) writeLS(KEY_WEATHER, p.weather ? JSON.stringify(p.weather) : null);
}

/** The start date, defaulting to today and remembering it: the day this room
 *  was first opened. Returns YYYY-MM-DD. */
export function ensureSince(now: Date = new Date()): string {
  const cur = readLS(KEY_SINCE);
  if (cur && /^\d{4}-\d{1,2}-\d{1,2}$/.test(cur.trim())) return cur.trim();
  const today = todayISO(now);
  writeLS(KEY_SINCE, today);
  return today;
}

/** The line on the screen, split for rendering. Where it breaks is part of the
 *  typesetting, so it is not left to the width of the container. */
export function quoteLines(q: string): string[] {
  const lines = q.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.length ? lines : FOYER_QUOTE_DEFAULT.split("\n");
}

/** Skipping the foyer travels by cookie: written here on the client, read by the
 *  home page on the server, which then redirects before rendering anything. */
export function setFoyerSkipCookie(skip: boolean): void {
  if (typeof document === "undefined") return;
  document.cookie = skip
    ? `${FOYER_SKIP_COOKIE}=1; path=/; max-age=31536000; samesite=lax`
    : `${FOYER_SKIP_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function readFoyerSkipCookie(): boolean {
  if (typeof document === "undefined") return false;
  return new RegExp(`(?:^|;\\s*)${FOYER_SKIP_COOKIE}=1(?:;|$)`).test(document.cookie);
}
