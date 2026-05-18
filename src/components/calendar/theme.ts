// Day / Night theme tokens for /room/calendar
// Day · 玫瑰哥特 day base + sage (botanical med/cycle markers, anchor accent)
// Night · Obsidian 24K 黑金
//
// (Backup) Old 青铜苔绿 day palette preserved as DAY_PALETTE_GREEN.

export type CalTheme = "day" | "night";

export type CalPalette = {
  pageBg: string;
  paper: string; // base panel paper
  paperHi: string; // today highlight
  ink: string; // body text
  inkSoft: string;
  inkMute: string;
  gold: string; // event line + accent
  goldSoft: string;
  line: string; // moss-green / olive line
  flowLight: string; // 例假 light
  flowMed: string; // medium
  flowHeavy: string; // heavy
  med: string; // 用药点
  medHalo: string; // halo around 用药点
  medText: string; // 用药 line 文字
  note: string; // 备忘 dot — 替代之前 📖 emoji
  hairline: string;
  weekendBg: string;
  todayBorder: string;
};

// 玫瑰哥特 day + sage botanical accent on med dots / event lines.
// flow (例假) stays in rose chord (blush → rose → oxblood) since it's
// thematically rose.
export const DAY_PALETTE: CalPalette = {
  pageBg: "#ebdfd4",
  paper: "#dccfc2",
  paperHi: "#e3d3c5",
  ink: "#1a0e0a", // 真黑
  inkSoft: "rgba(26,14,10,0.7)",
  inkMute: "rgba(26,14,10,0.5)",
  gold: "#c89548", // bronze gilt — event line + accent
  goldSoft: "rgba(200,149,72,0.6)",
  line: "#7a8a6a", // sage moss — calendar's personality accent
  flowLight: "#e8a8a8", // blush
  flowMed: "#A42B5E", // rose
  flowHeavy: "#5a1820", // oxblood
  med: "#7a8a6a", // sage 苔绿 — med dots botanical
  medHalo: "rgba(122,138,106,0.32)",
  medText: "#7a8a6a", // sage match
  note: "#9a7888", // mauve mist (calendar spark)
  hairline: "rgba(106,74,72,0.32)",
  weekendBg: "rgba(168,48,64,0.05)",
  todayBorder: "#c89548", // bronze gilt
};

// (Backup) Original 青铜苔绿 day palette — preserved for reference.
export const DAY_PALETTE_GREEN: CalPalette = {
  pageBg: "#ece4d4",
  paper: "#f3eee2",
  paperHi: "#fbf5ea",
  ink: "#2e2618",
  inkSoft: "rgba(46,38,24,0.7)",
  inkMute: "rgba(46,38,24,0.42)",
  gold: "#8a7a4a",
  goldSoft: "rgba(138,122,74,0.6)",
  line: "#4a6a4a",
  flowLight: "#c88078",
  flowMed: "#9a4a40",
  flowHeavy: "#6a2a24",
  med: "#4a6a4a",
  medHalo: "rgba(255,255,255,0.55)",
  medText: "#4a6a4a",
  note: "#5e6a8a",
  hairline: "rgba(46,38,24,0.18)",
  weekendBg: "rgba(200,128,120,0.06)",
  todayBorder: "#8a7a4a",
};

export const NIGHT_PALETTE: CalPalette = {
  pageBg: "#080605",
  paper: "#0e0c0a",
  paperHi: "#181410",
  ink: "#ece2cc",
  inkSoft: "rgba(236,226,204,0.72)",
  inkMute: "rgba(236,226,204,0.4)",
  gold: "#d4af6c",
  goldSoft: "rgba(212,175,108,0.6)",
  line: "#8aa872",
  flowLight: "#c87878",
  flowMed: "#a04d42",
  flowHeavy: "#6a2828",
  // 玫瑰红 — owner ask night meds 改成你之前做过的吃药玫瑰花开放配色
  med: "#c8576f",
  medHalo: "rgba(200, 87, 111, 0.4)",
  medText: "#d4af6c", // 金 — night 玫瑰 dot + 金字, 避免双红过冲, 跟 event 同金调
  note: "#9eb5d2", // 淡靛蓝 — night 上跟金 (event) + 玫瑰 (meds) 区分
  hairline: "rgba(236,226,204,0.2)",
  weekendBg: "rgba(200,120,120,0.06)",
  todayBorder: "#d4af6c",
};

// Auto theme by Tokyo hour: 06-17 day, 18-05 night
export function autoCalTheme(now: Date = new Date()): CalTheme {
  const jstHour = (now.getUTCHours() + 9) % 24;
  return jstHour >= 6 && jstHour < 18 ? "day" : "night";
}

export function calPaletteFor(theme: CalTheme): CalPalette {
  return theme === "day" ? DAY_PALETTE : NIGHT_PALETTE;
}

export function flowColor(p: CalPalette, level: number): string {
  if (level === 1) return p.flowLight;
  if (level === 2) return p.flowMed;
  if (level >= 3) return p.flowHeavy;
  return "transparent";
}
