// Moon phase calculation — pure JS, server-safe.
// Reference: 2000-01-06 18:14 UTC = NASA-recorded new moon.
// Synodic month = 29.530588853 days.
//
// 8-phase emoji 对应: 🌑🌒🌓🌔🌕🌖🌗🌘
// 中文名: 新月/蛾眉月/上弦月/盈凸月/满月/亏凸月/下弦月/残月.
//
// /room cover 中间那个 chat 入口 emoji 跟今天的真实月相同步, 每天打开形状不一样.

const REF_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);
const SYNODIC_MS = 29.530588853 * 24 * 3600 * 1000;

export type MoonPhase = {
  /** 0..1 — fractional progress through synodic month */
  fraction: number;
  /** 0..7 — index into 8-phase scheme (rounded to nearest 1/8) */
  index: number;
  emoji: string;
  name: string;
};

const PHASES: { emoji: string; name: string }[] = [
  { emoji: "🌑", name: "新月" },
  { emoji: "🌒", name: "蛾眉月" },
  { emoji: "🌓", name: "上弦月" },
  { emoji: "🌔", name: "盈凸月" },
  { emoji: "🌕", name: "满月" },
  { emoji: "🌖", name: "亏凸月" },
  { emoji: "🌗", name: "下弦月" },
  { emoji: "🌘", name: "残月" },
];

export function getMoonPhase(date: Date = new Date()): MoonPhase {
  const t = date.getTime();
  let frac = ((t - REF_NEW_MOON_MS) / SYNODIC_MS) % 1;
  if (frac < 0) frac += 1;
  const index = Math.round(frac * 8) % 8;
  return {
    fraction: frac,
    index,
    emoji: PHASES[index].emoji,
    name: PHASES[index].name,
  };
}
