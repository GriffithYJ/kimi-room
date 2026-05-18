// Day / Night theme tokens for /room/memory-review
// Day · 玫瑰哥特 (Pre-Raphaelite — dusky mauve cream + oxblood + bronze gilt)
// Night · Obsidian 24K + L4 手抄本
// Buttons · B 蜡封圆章 (wax seal)
//
// (Backup) Original crimson lacquer day palette preserved as
// DAY_PALETTE_CRIMSON_LACQUER below for future toggle / nostalgia.

export type ReviewTheme = "day" | "night";

export type ReviewPalette = {
  pageBg: string;
  pageBgGradient: string;
  ink: string; // primary text
  inkSoft: string; // secondary text
  inkMute: string; // tertiary, captions
  accent: string; // primary accent (DAY pink-coral / NIGHT 24K brass)
  accentSoft: string;
  dropCap: string; // big initial char color (DAY 玫瑰红 / NIGHT 黄铜)
  cardBg: string; // DAY transparent (L1 卷叶) / NIGHT glass blur tint
  cardBorder: string; // DAY transparent / NIGHT accent solid
  hairline: string;
  chipBg: string;
  chipInk: string;
  chipBorder: string;
  ok: string; // approve seal
  edit: string; // edit seal
  reject: string; // reject seal
  expire: string; // expire seal (sand)
  flourish: string; // ornamental color (rosettes / hinge)
  sealBg: string; // wax seal inner tint
  paper: string; // card paper background (for hinge mask)
};

// (Backup) Original Crimson Lacquer + L1 卷叶 — kept for later toggle.
export const DAY_PALETTE_CRIMSON_LACQUER: ReviewPalette = {
  pageBg: "#2a0a0a",
  pageBgGradient:
    "radial-gradient(900px 500px at 80% 0%, #3a0e10 0%, transparent 60%), radial-gradient(700px 500px at 0% 100%, #1a0506 0%, transparent 55%), #2a0a0a",
  ink: "#fbeec9",
  inkSoft: "rgba(251,238,201,0.78)",
  inkMute: "rgba(251,238,201,0.5)",
  accent: "#f0a89a",
  accentSoft: "rgba(240,168,154,0.5)",
  dropCap: "#e8607a",
  cardBg:
    "linear-gradient(155deg, rgba(74,24,24,0.48) 0%, rgba(56,16,18,0.38) 100%)",
  cardBorder: "rgba(232,96,122,0.38)",
  hairline: "rgba(251,238,201,0.28)",
  chipBg: "transparent",
  chipInk: "rgba(251,238,201,0.66)",
  chipBorder: "rgba(251,238,201,0.28)",
  ok: "#b8d49a",
  edit: "#fbeec9",
  reject: "#e8607a",
  expire: "rgba(251,238,201,0.5)",
  flourish: "#f0a89a",
  sealBg: "rgba(212,184,134,0.06)",
  paper: "#3a0d10",
};

// 玫瑰哥特 day — current production day palette.
// dusky mauve cream bg · 真黑 ink · oxblood drop cap · 玫瑰红 accent ·
// bronze gilt · dusty mauve mist.
export const DAY_PALETTE: ReviewPalette = {
  pageBg: "#ebdfd4",
  pageBgGradient:
    "linear-gradient(180deg, #ebdfd4 0%, #dccfc2 50%, #d4c4b6 100%)",
  ink: "#1a0e0a", // 真黑 H1
  inkSoft: "rgba(26,14,10,0.7)",
  inkMute: "rgba(26,14,10,0.5)",
  accent: "#A42B5E", // 玫瑰深红 main accent
  accentSoft: "rgba(168,48,64,0.55)",
  dropCap: "#5a1820", // oxblood — drop cap + reject + peak
  cardBg: "rgba(220,207,194,0.6)", // soft paper layer on mauve cream
  cardBorder: "rgba(106,74,72,0.45)",
  hairline: "rgba(106,74,72,0.32)",
  chipBg: "rgba(168,48,64,0.08)",
  chipInk: "rgba(26,14,10,0.7)",
  chipBorder: "rgba(106,74,72,0.32)",
  ok: "#7a8a6a", // sage approve (cohesive w/ palette family)
  edit: "#a87a48", // brass
  reject: "#5a1820", // oxblood
  expire: "rgba(26,14,10,0.45)",
  flourish: "#c89548", // bronze gilt
  sealBg: "rgba(255,255,255,0.5)",
  paper: "#dccfc2",
};

export const NIGHT_PALETTE: ReviewPalette = {
  pageBg: "#0e0c0a",
  pageBgGradient:
    "radial-gradient(700px 380px at 80% 0%, #1a1612 0%, transparent 60%), radial-gradient(600px 400px at 0% 100%, #070605 0%, transparent 55%), #0e0c0a",
  ink: "#ece2cc",
  inkSoft: "rgba(236,226,204,0.66)",
  inkMute: "rgba(236,226,204,0.36)",
  accent: "#d4af6c", // 24K 黄铜
  accentSoft: "rgba(212,175,108,0.5)",
  dropCap: "#d4af6c",
  cardBg: "rgba(28,22,16,0.55)", // glass
  cardBorder: "#d4af6c",
  hairline: "rgba(212,175,108,0.22)",
  chipBg: "transparent",
  chipInk: "rgba(236,226,204,0.66)",
  chipBorder: "rgba(212,175,108,0.22)",
  ok: "#b8985a",
  edit: "#ece2cc",
  reject: "#a88a4a",
  expire: "rgba(236,226,204,0.4)",
  flourish: "#d4af6c",
  sealBg: "rgba(212,175,108,0.05)",
  paper: "#0e0c0a",
};

// auto theme decision by Tokyo hour:
// 06:00-17:59 = day · Crimson Lacquer
// 18:00-05:59 = night · Obsidian
export function autoThemeByJstHour(now: Date = new Date()): ReviewTheme {
  const jstHour = (now.getUTCHours() + 9) % 24;
  return jstHour >= 6 && jstHour < 18 ? "day" : "night";
}

export function paletteFor(theme: ReviewTheme): ReviewPalette {
  return theme === "day" ? DAY_PALETTE : NIGHT_PALETTE;
}

// pendingType -> chip label (Chinese · ENGLISH)
export function chipLabelFor(pendingType: string, sourceRefType: string | null): string {
  if (sourceRefType) {
    const map: Record<string, string> = {
      dream: "梦 · DREAM",
      xhs: "小红书 · XHS",
      chat: "对话 · CHAT",
      email: "邮件 · MAIL",
      tg: "对话 · CHAT",
      paper: "论文 · PAPER",
      calendar: "日历 · CALENDAR",
      taste: "味蕾 · TASTE",
      sleep: "睡眠 · SLEEP",
    };
    if (map[sourceRefType]) return map[sourceRefType];
  }
  const typeMap: Record<string, string> = {
    MEMORY_CANDIDATE: "记忆 · MEMORY",
    DIARY_NOTE: "日记 · DIARY",
    TOPIC_LINK: "话题 · TOPIC",
    DIGEST: "整理 · DIGEST",
    QUEUE_MESSAGE: "队列 · QUEUE",
  };
  return typeMap[pendingType] ?? `${pendingType.toLowerCase()}`;
}
