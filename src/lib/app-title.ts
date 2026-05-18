// App title · client-side localStorage helper.
// V2 用户 fork 后 走 settings page 改 instance title 不 改 code.
// SSR safe — getAppTitle() server-side 返 DEFAULT.

const KEY = "kimi-app-title";
const DEFAULT = "kimi";

export function getAppTitle(): string {
  if (typeof window === "undefined") return DEFAULT;
  try {
    return localStorage.getItem(KEY) ?? DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function setAppTitle(title: string): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = title.trim();
    if (trimmed.length === 0) {
      localStorage.removeItem(KEY);
    } else {
      localStorage.setItem(KEY, trimmed);
    }
  } catch {}
}

export const APP_TITLE_DEFAULT = DEFAULT;
