// Foyer — the data layer. The four screens (day curtain / night window / day
// triptych / night triptych) share this one set of derived values; they differ
// in composition, never in data.
//
// Every wall-clock value is read from the device's own clock. Nothing here runs
// on the server: the foyer's settings live in the browser, and a server that is
// in another timezone than the reader would render one date and then have the
// client correct it. See components/foyer/useFoyerClock.

const ROMAN_TABLE: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

/** Roman numerals. Zero is written N — nulla, the way the medieval scribes did
 *  it — because day zero is a real day here: the one you start counting on. */
export function toRoman(n: number): string {
  let rest = Math.floor(n);
  if (rest <= 0) return "N";
  let out = "";
  for (const [v, ch] of ROMAN_TABLE) {
    while (rest >= v) {
      out += ch;
      rest -= v;
    }
  }
  return out;
}

const WEEKDAY_LATIN = ["SOLIS", "LUNAE", "MARTIS", "MERCURII", "IOVIS", "VENERIS", "SATURNI"];
const MONTH_LATIN = [
  "IANUARII", "FEBRUARII", "MARTII", "APRILIS", "MAII", "IUNII",
  "IULII", "AUGUSTI", "SEPTEMBRIS", "OCTOBRIS", "NOVEMBRIS", "DECEMBRIS",
];

export type LocalNow = { year: number; month: number; day: number; hour: number; weekday: number };

/** An instant, split into the device's own wall clock plus weekday (0 = Sunday). */
export function localNow(now: Date = new Date()): LocalNow {
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    weekday: now.getDay(),
  };
}

/** Ordinal of the local calendar day — what the flowers and windows rotate on,
 *  so they turn at the reader's midnight rather than UTC's. */
export function localDayNumber(now: Date = new Date()): number {
  return Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 86400000);
}

/** "YYYY-MM-DD" → local midnight; anything unparseable returns null. */
export function parseSince(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(iso.trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Days counted. The start date itself is 0, and the number turns at local
 *  midnight. Taken as a difference of midnights, so the day a clock shifts for
 *  daylight saving still counts as one day. */
export function getDies(since: Date, now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(since.getFullYear(), since.getMonth(), since.getDate());
  return Math.max(0, Math.round((today.getTime() - start.getTime()) / 86400000));
}

/** The line at the foot — SINCE MMXXVI · IV · VI. Derived, never typed in. */
export function getSinceLine(since: Date): string {
  return `SINCE ${toRoman(since.getFullYear())} · ${toRoman(since.getMonth() + 1)} · ${toRoman(since.getDate())}`;
}

/** The Latin greeting for this hour. */
export function getGreeting(hour: number): string {
  if (hour < 5) return "NOX SERENA";
  if (hour < 11) return "AVE · AURORA";
  if (hour < 17) return "POST MERIDIEM";
  if (hour < 22) return "VESPER";
  return "NOX SERENA";
}

/** DIES VENERIS · XVII IULII MMXXVI */
export function getTodayLatin(t: LocalNow): string {
  return `DIES ${WEEKDAY_LATIN[t.weekday]} · ${toRoman(t.day)} ${MONTH_LATIN[t.month - 1]} ${toRoman(t.year)}`;
}

/**
 * The next hundred-day mark. 102 → AD CC · SUPERSUNT XCVIII DIES.
 *
 * On the mark itself there are zero days left, which the Roman numerals cannot
 * say, so that day reads AD C · HODIE instead: it is today.
 */
export function getMilestone(dies: number): { target: string; left: string; isToday: boolean } {
  const centT = Math.max(100, Math.ceil(dies / 100) * 100);
  const left = centT - dies;
  return { target: toRoman(centT), left: toRoman(left), isToday: left === 0 };
}

// ── The flower columns (day · full) ────────────────────────────────
// One panel a day, the right column running three ahead of the left; tapping
// either side, or swiping, turns to the next pair by hand.
//
// The files are cut to 242×1008 — that ratio is the shape of the niche, not the
// shape of the painting, so tall ones are aligned to the top and lose their hem
// and wide ones are narrowed from the centre. The names label only the flower
// that is actually recognisable in the panel; nothing is invented.
//
// To hang your own: drop files in public/images/foyer/ and replace both arrays,
// keeping them the same length. See docs/FOYER.md.

export const FLOWER_PANELS = [
  "/images/foyer/mucha-a1.webp",
  "/images/foyer/mucha-a2.webp",
  "/images/foyer/mucha-a3.webp",
  "/images/foyer/mucha-a4.webp",
  "/images/foyer/mucha-a5.webp",
  "/images/foyer/mucha-a6.webp",
  "/images/foyer/mucha-c1.jpg",
  "/images/foyer/mucha-c2.jpg",
  "/images/foyer/mucha-c3.jpg",
  "/images/foyer/mucha-c4.jpg",
  "/images/foyer/mucha-d1.jpg",
  "/images/foyer/mucha-d2.jpg",
  "/images/foyer/mucha-d3.jpg",
  "/images/foyer/mucha-d4.jpg",
  "/images/foyer/mucha-d5.jpg",
  "/images/foyer/mucha-d6.jpg",
  "/images/foyer/mucha-f1.jpg",
  "/images/foyer/mucha-f2.jpg",
];

export const FLOWER_NAMES = [
  "CONVALLARIA", "POINSETTIA", "IRIS", "EDELWEISS", "ROSA", "WISTERIA",
  "LILIVM", "PAPAVER", "IRIS RVBRA", "LILIVM ALBVM",
  "FLORES", "BELLIS", "IRIS PVRPVREA", "LILIVM AVREVM", "LILIVM ROSEVM", "PAPAVER AGRESTE",
  "GOSSYPIVM", "IRIS AVREA",
];

export function getFlowerIndex(now: Date = new Date()): number {
  return localDayNumber(now) % FLOWER_PANELS.length;
}

// ── The Seasons (day · triptych) ───────────────────────────────────
// The flower columns change a painting each day. These four change a season:
// whichever season it is hangs, and stays for three months. Labels are in the
// same Latin as the rest of the screen (U written V); whatever is printed in
// the painting stays in the painting.
export const SEASON_PANELS = [
  { src: "/images/foyer/mucha-printemps.jpg", name: "VER" },
  { src: "/images/foyer/mucha-ete.jpg", name: "AESTAS" },
  { src: "/images/foyer/mucha-automne.jpg", name: "AVTVMNVS" },
  { src: "/images/foyer/mucha-hiver.jpg", name: "HIEMS" },
] as const;

/** 0 = spring (3–5), 1 = summer, 2 = autumn, 3 = winter, by local month.
 *  Northern hemisphere; in the south, change the 3 to a 9. */
export function getSeasonIndex(now: Date = new Date()): number {
  const m = localNow(now).month; // 1–12
  return Math.floor(((m - 3 + 12) % 12) / 3);
}

// ── The stained glass (night · both screens) ───────────────────────
// Swipe sideways to turn to another window; each carries its own `light`, the
// colour of what comes through it, taken from that window's dominant hue — the
// gilt frame does not change. Left alone, the day picks one.
//
// `pieces` is for the triptych: three cut pieces [left, centre, right], one per
// lancet. Without them each lancet crops the one whole window instead. `bg` is
// the ground behind those pieces — the black out of the image, so the three of
// them meet the dark without a seam.
export const WINDOW_PANELS: {
  src: string;
  name: string;
  light: string;
  pieces?: [string, string, string];
  bg?: string;
}[] = [
  { src: "/images/foyer/baroque-window.webp", name: "金焰窗", light: "240,190,90" },
  {
    src: "/images/foyer/baroque-window-2.jpg",
    name: "圣维特·穆夏",
    light: "119,108,216",
    pieces: [
      "/images/foyer/baroque-win2-l.webp",
      "/images/foyer/baroque-win2-c.webp",
      "/images/foyer/baroque-win2-r.webp",
    ],
    bg: "#000000",
  },
];

export function getWindowIndex(now: Date = new Date()): number {
  return localDayNumber(now) % WINDOW_PANELS.length;
}

// ── Weather (WMO code → label) ─────────────────────────────────────

export function wmoToWord(code: number | null): string {
  if (code == null) return "SKY";
  if ([0, 1].includes(code)) return "CLEAR";
  if ([2, 3].includes(code)) return "CLOUDY";
  if ([45, 48].includes(code)) return "FOG";
  if (code >= 95) return "THUNDER";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "SNOW";
  if ([51, 53, 55, 56, 57].includes(code)) return "DRIZZLE";
  return "RAIN";
}

/** Open-Meteo, no key. The location is filled in at /backstage/settings; with
 *  none given the weather row does not render at all. */
export function weatherUrl(lat: number, lng: number): string {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=auto`;
}

export const WEATHER_REFRESH_MS = 20 * 60 * 1000;
