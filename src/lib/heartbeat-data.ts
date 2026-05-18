// V2 Heartbeat data aggregator · owner 0519 ack:
//   Sky 数据 · memoryStore (主) + auto-pull keepsake/chat/calendar 当 fallback
//   Score 数据 · chat archive 当 wake + manual pulse + LLM-gen pulse
// 全 client · 读 IDB · 0 server / Prisma.

import {
  calendarStore,
  chatStore,
  keepsakeStore,
  memoryStore,
} from "./stores";
import type {
  CalendarEvent,
  ChatEntry,
  KeepsakeEntry,
  MemoryEntry,
} from "./stores/types";
import type { ValenceTag } from "./score-colors";

export type SkyStar = {
  id: string;
  source: "memory" | "keepsake" | "chat" | "calendar";
  title: string;
  content: string;
  createdAt: string;     // ISO
  valence: ValenceTag;   // default 'calm' if not tagged
  pinned: boolean;
  importance: number;    // proxy = char count + bonuses, normalized 0-1
};

// V2 Score · pulse entries (manual + LLM-gen) live in localStorage
// 'kimi-heartbeat-pulses' as flat array. Plus auto-feed from chatStore (wakes).
export type PulseEntry = {
  id: string;
  kind: "manual" | "llm" | "chat";
  at: string;            // ISO
  hour: number;          // JST hour 0-23
  valence: ValenceTag | null;
  arousal: number;       // 0-1
  note: string;
  isExtra?: boolean;     // ♥ heartbeat-extra flag (LLM-gen)
};

export type HeartbeatData = {
  stars: SkyStar[];
  pulses: PulseEntry[];
  poleStarId: string | null;
};

const PULSES_KEY = "kimi-heartbeat-pulses";
export const SKY_MAX = 50;

function jstHour(iso: string): number {
  const d = new Date(iso);
  const jst = new Date(d.getTime() + 9 * 3600 * 1000);
  return jst.getUTCHours();
}

function importanceProxy(text: string, hasReflection: boolean, tagCount: number): number {
  // crude: char count contribution + reflection + tags
  const cc = Math.min(1, text.length / 800);
  const bonus = (hasReflection ? 0.2 : 0) + Math.min(0.2, tagCount * 0.05);
  return Math.min(1, cc * 0.7 + bonus);
}

function entryToStar(e: MemoryEntry): SkyStar {
  return {
    id: e.id,
    source: "memory",
    title: e.key || e.content.slice(0, 30),
    content: e.content,
    createdAt: e.createdAt,
    valence: (e.valence as ValenceTag) ?? "calm",
    pinned: !!e.pinned,
    importance: importanceProxy(e.content, false, e.tags?.length ?? 0),
  };
}

function keepsakeToStar(k: KeepsakeEntry): SkyStar {
  const body = `${k.title ?? ""} ${k.record ?? ""} ${k.note ?? ""}`.trim();
  return {
    id: `kp-${k.id}`,
    source: "keepsake",
    title: k.title || k.record || "(keepsake)",
    content: body,
    createdAt: k.createdAt,
    valence: "calm",
    pinned: false,
    importance: importanceProxy(body, !!k.note, k.tags?.length ?? 0),
  };
}

function chatToStar(c: ChatEntry): SkyStar {
  const body = c.messages.map((m) => m.content).join(" ").slice(0, 600);
  return {
    id: `ch-${c.id}`,
    source: "chat",
    title: c.title || "(chat)",
    content: body,
    createdAt: c.createdAt,
    valence: "calm",
    pinned: false,
    importance: importanceProxy(body, false, 0),
  };
}

function calendarToStar(ev: CalendarEvent): SkyStar {
  const body = `${ev.title} ${ev.body ?? ""}`.trim();
  return {
    id: `cal-${ev.id}`,
    source: "calendar",
    title: ev.title,
    content: body,
    createdAt: ev.createdAt,
    valence: "calm",
    pinned: false,
    importance: importanceProxy(body, false, 0),
  };
}

function loadPulses(): PulseEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PULSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePulse(p: PulseEntry) {
  if (typeof window === "undefined") return;
  const list = loadPulses();
  list.push(p);
  try {
    localStorage.setItem(PULSES_KEY, JSON.stringify(list));
  } catch {}
}

export function deletePulse(id: string) {
  if (typeof window === "undefined") return;
  const list = loadPulses().filter((p) => p.id !== id);
  try {
    localStorage.setItem(PULSES_KEY, JSON.stringify(list));
  } catch {}
}

export async function loadHeartbeatData(): Promise<HeartbeatData> {
  // Sky · memory 主, 不够 50 时 auto-pull keepsake/chat/calendar 凑.
  const memories = (await memoryStore().list()) as MemoryEntry[];
  let stars: SkyStar[] = memories.map(entryToStar);

  if (stars.length < SKY_MAX) {
    const [keepsakes, chats, evs] = await Promise.all([
      keepsakeStore().list() as Promise<KeepsakeEntry[]>,
      chatStore().list() as Promise<ChatEntry[]>,
      calendarStore().list() as Promise<CalendarEvent[]>,
    ]);
    const fillers: SkyStar[] = [
      ...keepsakes.map(keepsakeToStar),
      ...chats.map(chatToStar),
      ...evs.map(calendarToStar),
    ];
    stars = [...stars, ...fillers];
  }

  // top SKY_MAX by importance · ties broken by createdAt desc
  stars.sort((a, b) => {
    if (b.importance !== a.importance) return b.importance - a.importance;
    return b.createdAt.localeCompare(a.createdAt);
  });
  stars = stars.slice(0, SKY_MAX);

  // pole star: pinned first · else most-recent
  const pinned = stars.find((s) => s.pinned);
  const newest = [...stars].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const poleStarId = pinned?.id ?? newest?.id ?? null;

  // Score · pulses · chat archive 当 wake auto + saved pulses
  const persistedPulses = loadPulses();
  const chatPulses: PulseEntry[] = [];
  try {
    const chats = (await chatStore().list()) as ChatEntry[];
    for (const c of chats) {
      chatPulses.push({
        id: `chat-${c.id}`,
        kind: "chat",
        at: c.createdAt,
        hour: jstHour(c.createdAt),
        valence: null,
        arousal: 0.5,
        note: c.title || `${c.messages.length} msg`,
      });
    }
  } catch {}
  const pulses = [...persistedPulses, ...chatPulses];

  return { stars, pulses, poleStarId };
}
