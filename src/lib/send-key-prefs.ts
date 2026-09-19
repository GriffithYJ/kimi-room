// The send key — which picture it carries, and what Enter does.
//
// Kept in the browser under one key, `kimi-send-key`, and edited in two places:
// the "发送键" section of /backstage/settings, and the settings drawer inside the
// chat itself. Both write here; a `storage` event carries a change between open
// tabs.
//
// Custom pictures are stored the same way chat backgrounds are — downscaled into
// IndexedDB, resolved to an object URL when the chat mounts — so a picture never
// has to fit in localStorage.

import { SEND_ART_PRESETS, type SendArt, type SendKeyPreset } from "@/components/chat/arcvs/tokens";

const KEY = "kimi-send-key";

export type SendKeySettings = {
  preset: SendKeyPreset;
  /** IndexedDB ids of custom art, when the deployer supplied their own. */
  customDay: string | null;
  customNight: string | null;
  /** Enter sends and Shift+Enter breaks the line; off, it is ⌘/Ctrl+Enter. */
  enterSends: boolean;
  /** How visible the key is with nothing typed yet. */
  idleOpacity: number;
};

export const SEND_KEY_DEFAULTS: SendKeySettings = {
  preset: "default",
  customDay: null,
  customNight: null,
  enterSends: false,
  idleOpacity: 1,
};

function isPreset(v: unknown): v is SendKeyPreset {
  return typeof v === "string" && v in SEND_ART_PRESETS;
}

export function loadSendKeySettings(): SendKeySettings {
  if (typeof window === "undefined") return { ...SEND_KEY_DEFAULTS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...SEND_KEY_DEFAULTS };
    const j = JSON.parse(raw);
    return {
      preset: isPreset(j?.preset) ? j.preset : SEND_KEY_DEFAULTS.preset,
      customDay: typeof j?.customDay === "string" ? j.customDay : null,
      customNight: typeof j?.customNight === "string" ? j.customNight : null,
      enterSends: typeof j?.enterSends === "boolean" ? j.enterSends : SEND_KEY_DEFAULTS.enterSends,
      idleOpacity:
        typeof j?.idleOpacity === "number" && j.idleOpacity >= 0.2 && j.idleOpacity <= 1
          ? j.idleOpacity
          : SEND_KEY_DEFAULTS.idleOpacity,
    };
  } catch {
    return { ...SEND_KEY_DEFAULTS };
  }
}

export function saveSendKeySettings(s: SendKeySettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

/**
 * What the key should actually draw. A custom picture wins over the preset; the
 * preset may itself carry nothing, which is the drawn mark.
 *
 * `customUrl` is an object URL already resolved from IndexedDB by the caller —
 * this module does no I/O of its own.
 */
export function resolveSendArt(
  s: SendKeySettings,
  theme: "day" | "night",
  customUrl: string | null,
): SendArt | undefined {
  if (customUrl) {
    return { src: customUrl, ring: "none", bare: true, inset: 0, idleOpacity: s.idleOpacity };
  }
  const art = SEND_ART_PRESETS[s.preset]?.[theme];
  return art ? { ...art, idleOpacity: s.idleOpacity } : undefined;
}

/** The id of whichever custom picture belongs to this colourway. */
export function customIdFor(s: SendKeySettings, theme: "day" | "night"): string | null {
  return theme === "day" ? s.customDay : s.customNight;
}
