// V2 template substitution helper · Handlebars-like `{{char}}` / `{{user}}` /
// `{{scenario}}` · owner 0654 catch · keepsake "微 note" placeholder 应写
// `{{char name}} note`, render 时 sub 用户在 settings 配的 char name.

const KEY_CHAR_NAME = "kimi-char-name";
const KEY_USER_NAME = "kimi-user-name";
const KEY_SCENARIO = "kimi-scenario";

const DEFAULT_CHAR_NAME = "他";
const DEFAULT_USER_NAME = "you";
const DEFAULT_SCENARIO = "";

function readLS(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    const t = value.trim();
    if (!t) localStorage.removeItem(key);
    else localStorage.setItem(key, t);
  } catch {}
}

export function getCharName(): string {
  return readLS(KEY_CHAR_NAME, DEFAULT_CHAR_NAME);
}

export function setCharName(name: string): void {
  writeLS(KEY_CHAR_NAME, name);
}

export function getUserName(): string {
  return readLS(KEY_USER_NAME, DEFAULT_USER_NAME);
}

export function setUserName(name: string): void {
  writeLS(KEY_USER_NAME, name);
}

export function getScenario(): string {
  return readLS(KEY_SCENARIO, DEFAULT_SCENARIO);
}

export function setScenario(s: string): void {
  writeLS(KEY_SCENARIO, s);
}

// Handlebars-like `{{var}}` sub. Recognized names:
//   {{char}} / {{char_name}} / {{char name}}  → getCharName()
//   {{user}} / {{user_name}} / {{user name}}  → getUserName()
//   {{scenario}}                              → getScenario()
// Additional context can be passed via `ctx` param.
export function tmpl(s: string, ctx?: Record<string, string>): string {
  return s.replace(/\{\{\s*([\w\s-]+?)\s*\}\}/g, (_, raw: string) => {
    const key = raw.toLowerCase().replace(/[\s_-]/g, "");
    if (ctx) {
      for (const k of Object.keys(ctx)) {
        if (k.toLowerCase().replace(/[\s_-]/g, "") === key) return ctx[k];
      }
    }
    if (key === "char" || key === "charname") return getCharName();
    if (key === "user" || key === "username") return getUserName();
    if (key === "scenario") return getScenario();
    return "";
  });
}

export const CHAR_NAME_DEFAULT = DEFAULT_CHAR_NAME;
