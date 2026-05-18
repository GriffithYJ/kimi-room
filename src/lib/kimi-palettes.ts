// Extra palettes for Wellbeing / Taste / Study pages.
// Separate from Mucha ivory/bronze/pearl because these pages use a different
// shared-Page shell (vines + top-nav) — see components/mucha/KimiPage.tsx.
//
// Each palette has _NIGHT (existing dark) and _DAY (玫瑰哥特 day) variants.
// Pages pick via paletteForTheme helpers based on cookie.

import type { KimiTheme } from "./day-theme-client";

export type KimiPalette = {
  name: string;
  ink: string;
  accent: string;
  bg: string;
  paper: string;
  card: string;
  mute: string;
  hair: string;
  hairSoft: string;
  chipTint: string;
  chipSelTint: string;
  chipBorder: string;
  softAccent: string;
  navGlass: string;
  navBorder: string;
};

export const PAL_ROSE: KimiPalette = {
  name: "粉色 · rose blush",
  ink: "#3a2a1c",
  accent: "#a04d42",
  bg: "#fbf5f0",
  paper: "rgba(255, 255, 253, 0.85)",
  card: "#fdfbf6",
  mute: "rgba(58, 42, 28, 0.55)",
  hair: "rgba(138, 101, 88, 0.22)",
  hairSoft: "rgba(138, 101, 88, 0.12)",
  chipTint: "rgba(238, 227, 220, 0.55)",
  chipSelTint: "rgba(238, 227, 220, 0.95)",
  chipBorder: "rgba(238, 227, 220, 0.85)",
  softAccent: "rgba(160,77,66,0.12)",
  navGlass: "rgba(255,255,255,0.5)",
  navBorder: "rgba(255,255,255,0.9)",
};

export const PAL_GOLD: KimiPalette = {
  name: "香槟金 · champagne gold",
  ink: "#e9d6ad",
  accent: "#d4af6c",
  bg: "#0a0506",
  paper: "rgba(18, 12, 14, 0.55)",
  card: "rgba(22, 14, 18, 0.7)",
  mute: "rgba(240, 220, 184, 0.45)",
  hair: "rgba(212, 184, 134, 0.28)",
  hairSoft: "rgba(212, 184, 134, 0.15)",
  chipTint: "rgba(22, 14, 18, 0.55)",
  chipSelTint: "rgba(22, 14, 18, 0.9)",
  chipBorder: "rgba(212, 184, 134, 0.28)",
  softAccent: "rgba(212, 184, 134, 0.18)",
  navGlass: "rgba(20,14,16,0.5)",
  navBorder: "rgba(212, 184, 134, 0.4)",
};

// Day-mode variant of PAL_GOLD (taste/study). 玫瑰哥特 day base.
export const PAL_GOLD_DAY: KimiPalette = {
  name: "玫瑰哥特 · day",
  ink: "#1a0e0a",
  accent: "#A42B5E",
  bg: "#ebdfd4",
  paper: "rgba(220,207,194,0.55)",
  card: "rgba(220,207,194,0.85)",
  mute: "rgba(26,14,10,0.5)",
  hair: "rgba(106,74,72,0.32)",
  hairSoft: "rgba(106,74,72,0.18)",
  chipTint: "rgba(168,48,64,0.06)",
  chipSelTint: "rgba(168,48,64,0.16)",
  chipBorder: "rgba(106,74,72,0.32)",
  softAccent: "rgba(168,48,64,0.10)",
  navGlass: "rgba(255,255,255,0.5)",
  navBorder: "rgba(106,74,72,0.32)",
};

export function palGold(theme: KimiTheme): KimiPalette {
  return theme === "day" ? PAL_GOLD_DAY : PAL_GOLD;
}

// Gothic (for Wellbeing) — separate because it has extra tokens (blood / roseDust / petals).
export const GOTHIC = {
  name: "玫瑰哥特 · rose gothic",
  ink: "#f0dcb8",
  inkSoft: "#c4a78a",
  accent: "#d4b886",
  accentDeep: "#9a7e4e",
  blood: "#9a2f3c",
  roseDust: "#7a3a4a",
  roseDustSoft: "#5a2a38",
  bg: "#0a0506",
  paper: "rgba(18, 12, 14, 0.55)",
  card: "rgba(22, 14, 18, 0.7)",
  mute: "rgba(240, 220, 184, 0.45)",
  hair: "rgba(212, 184, 134, 0.22)",
  hairSoft: "rgba(212, 184, 134, 0.1)",
  softAccent: "rgba(212, 184, 134, 0.14)",
  navGlass: "rgba(20,14,16,0.5)",
  navBorder: "rgba(212, 184, 134, 0.4)",
  rose1: "#b05870",
  rose2: "#6a2838",
};

// Day-mode variant of GOTHIC (wellbeing). 玫瑰哥特 day base.
export const GOTHIC_DAY = {
  name: "玫瑰哥特 · day",
  ink: "#1a0e0a",
  inkSoft: "#3a1c18",
  accent: "#A42B5E",      // 玫瑰深红
  accentDeep: "#5a1820",  // oxblood
  blood: "#5a1820",       // oxblood as 'blood' deep tone
  roseDust: "#9a7888",    // mauve mist
  roseDustSoft: "#b89aa4",
  bg: "#ebdfd4",
  paper: "rgba(220,207,194,0.55)",
  card: "rgba(220,207,194,0.85)",
  mute: "rgba(26,14,10,0.5)",
  hair: "rgba(106,74,72,0.32)",
  hairSoft: "rgba(106,74,72,0.18)",
  softAccent: "rgba(168,48,64,0.10)",
  navGlass: "rgba(255,255,255,0.5)",
  navBorder: "rgba(106,74,72,0.32)",
  rose1: "#A42B5E",
  rose2: "#5a1820",
};

export function gothicFor(theme: KimiTheme): typeof GOTHIC {
  return (theme === "day" ? GOTHIC_DAY : GOTHIC) as typeof GOTHIC;
}
