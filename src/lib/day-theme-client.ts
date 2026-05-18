// Client-safe day/night theme helpers + palette constants.
// Server-only stuff (getTheme using cookies from next/headers) is in
// day-theme.ts. Both server and client components can import this file.

export type KimiTheme = "day" | "night";

export function getThemeFromCookieValue(cookieStr: string): KimiTheme {
  return /(?:^|;\s*)kimi-theme=day(?:;|$)/.test(cookieStr) ? "day" : "night";
}

// ────────────────────────────────────────────────────────────────
// 玫瑰哥特 day palette — shared across all pages as the day base.
// ────────────────────────────────────────────────────────────────

export const ROSE_GOTHIC_DAY = {
  bg: "linear-gradient(180deg, #ebdfd4 0%, #dccfc2 100%)",
  bgSolid: "#ebdfd4",
  paper: "#dccfc2",
  paperSoft: "#e3d3c5",
  ink: "#1a0e0a",
  inkBody: "#2a1a14",
  inkMute: "rgba(26,14,10,0.55)",
  inkFaint: "rgba(26,14,10,0.36)",
  rose: "#A42B5E",
  roseDeep: "#5a1820",
  blush: "#e8a8a8",
  bronze: "#c89548",
  silverGold: "#a89890",
  brass: "#a87a48",
  mauveMist: "#9a7888",
  hair: "rgba(106,74,72,0.32)",
  hairBold: "rgba(106,74,72,0.45)",
  sage: "#7a8a6a",
  fern: "#4a6a3a",
  cinnabar: "#c8362a",
} as const;

export type RoseGothicPalette = typeof ROSE_GOTHIC_DAY;
