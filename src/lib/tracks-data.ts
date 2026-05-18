export type Track = {
  n: number;
  title: string;
  artist: string;
  who: "owner" | "ito";
  tag: string;
  length: string;
  quote?: string;
  note?: string;
  // 网易云分享链接 (https://music.163.com/#/song?id=xxx 或 https://y.music.163.com/m/song?id=xxx)
  // 点 track → 新 tab 打开网易云
  neteaseUrl?: string;
  // 备用平台 (apple music / spotify) — 网易云不可用时 fallback
  appleMusicUrl?: string;
  spotifyUrl?: string;
};

// helper: 从分享 URL 抓 song id (用来构造官方 outchain embed 或验证 URL)
export function extractNeteaseId(url: string): string | null {
  try {
    const m = url.match(/[?&#/]id=(\d+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

// V2 · 1 mock track demo · 用户 fork 后 删 + 加 own. 网易云 share URL → station
// outchain iframe 自动 embed at /playlist/now-playing (大陆可用 default).
// 用户 在 PlaylistTabsAndList "+" 加 own track (localStorage persist).
export const TRACKS: Track[] = [
  {
    n: 1,
    title: "夜空中最亮的星",
    artist: "逃跑计划",
    who: "owner",
    tag: "ALL",
    length: "4:03",
    neteaseUrl: "https://music.163.com/#/song?id=29022447",
  },
];

export const PROMISE_LINE = "就算忘了也会重新认识你。";

// V2 placeholder · canon V1 含 maintainer 自己 6 tabs (拿铁/酸/PAPER/...). V2 只
// 留 ALL · 用户 在 PlaylistTabsAndList "+" 加 own tag (localStorage persist).
// ALL 永远 first + 不 deletable.
export const TAB_FILTERS = ["ALL"] as const;
