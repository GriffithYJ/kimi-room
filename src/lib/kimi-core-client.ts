"use client";

import { isCoreBackend } from "./backend-mode";

// Browser-side helper for the "core" backend: call a kimi-core tool through the
// /api/core redirect (the server holds the key). kimi-core tools return
// agent-readable TEXT, not JSON — so these helpers deal in strings, meant for
// RAG injection into your chat prompt, not for reconstructing structured rows.
// In "local" mode every helper is a no-op. See docs/BACKENDS.md.
// Persisted MCP session ID — kept across calls so kimi-core sees the same
// session for all requests from this browser tab (otherwise the “store” tool
// scopes data per MCP session and old writes are invisible to new reads).
let _mcpSessionId: string | undefined;

// Tool-call observer system - lets the UI show live tool activity during a
// chat turn. Every callCoreTool call emits "pending" then "done" or "error".
export type CoreToolCallEvent = {
  name: string;
  args?: Record<string, unknown>;
  status: "pending" | "done" | "error";
  preview?: string;
};
type CoreToolObserver = (ev: CoreToolCallEvent) => void;
let _toolObservers: CoreToolObserver[] = [];
export function subscribeCoreToolCalls(fn: CoreToolObserver): () => void {
  _toolObservers.push(fn);
  return () => {
    _toolObservers = _toolObservers.filter((x) => x !== fn);
  };
}

export async function callCoreTool(
  name: string,
  args: Record<string, unknown> = {},
): Promise<string> {
  // Emit "pending" so the UI can show something before we wait
  const pending: CoreToolCallEvent = { name, args, status: "pending" };
  for (const fn of _toolObservers) fn(pending);

  const res = await fetch("/api/core", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      arguments: args,
      ...(_mcpSessionId ? { sessionId: _mcpSessionId } : {}),
    }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    for (const fn of _toolObservers) fn({ name, status: "error", preview: err.error });
    throw new Error(err.error || `core tool ${name} failed (${res.status})`);
  }
  const data = (await res.json()) as { text?: string };
  // Persist session ID returned by the server so subsequent requests share
  // the same MCP session (data written in one request is read by another).
  const sid = res.headers.get("x-mcp-session-id");
  if (sid) _mcpSessionId = sid;
  const text = typeof data.text === "string" ? data.text : "";
  const preview = text.length > 0
    ? (text.length > 60 ? text.slice(0, 60) + "\u2026" : text)
    : undefined;
  for (const fn of _toolObservers) fn({ name, status: "done", preview });
  return text;
}

// RAG: pull memory context from kimi-core to prepend to a chat turn. Uses the
// non-sensitive `memory_search_safe` tool (built for external callers). Returns
// "" in local mode or on any failure, so the chat degrades to BYO-only.
export async function fetchCoreMemoryContext(query: string): Promise<string> {
  if (!isCoreBackend() || !query.trim()) return "";
  try {
    return await callCoreTool("memory_search_safe", { query });
  } catch {
    return "";
 }
}

// ──────────────────────────────────────────────────────────────
// Memory tools (beyond memory_search_safe / memory_write)
// ──────────────────────────────────────────────────────────────

// Full memory search with all query parameters. Returns raw text from core.
export async function fetchCoreMemorySearch(
  query: string,
  opts: { limit?: number; threshold?: number } = {},
): Promise<string> {
  if (!isCoreBackend()) return "";
  try {
    return await callCoreTool("memory_search", { query, ...opts });
  } catch {
    return "";
  }
}

// Read a specific memory by its key/id.
export async function fetchCoreMemoryRead(key: string): Promise<string> {
  if (!isCoreBackend() || !key) return "";
  try {
    return await callCoreTool("memory_read", { key });
  } catch {
    return "";
  }
}

// Close/archive a memory so it's no longer active.
export async function closeCoreMemory(key: string): Promise<boolean> {
  if (!isCoreBackend() || !key) return false;
  try {
    await callCoreTool("memory_close", { key });
    return true;
  } catch {
    return false;
  }
}

// Reopen a previously closed memory.
export async function reopenCoreMemory(key: string): Promise<boolean> {
  if (!isCoreBackend() || !key) return false;
  try {
    await callCoreTool("memory_reopen", { key });
    return true;
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────────────────────────
// Profile / private profile
// ──────────────────────────────────────────────────────────────

// Read the character's base profile (persona description, identity, etc.).
export async function fetchCoreProfile(): Promise<string> {
  if (!isCoreBackend()) return "";
  try {
    return await callCoreTool("profile_read", {});
  } catch {
    return "";
  }
}

// Read the character's private/internal profile (not shared with the user).
export async function fetchCorePrivateProfile(): Promise<string> {
  if (!isCoreBackend()) return "";
  try {
    return await callCoreTool("private_read", {});
  } catch {
    return "";
  }
}

// Write/update attributes in the character's profile.
export async function setCoreProfile(data: Record<string, unknown>): Promise<boolean> {
  if (!isCoreBackend()) return false;
  try {
    await callCoreTool("profile_set", data);
    return true;
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────────────────────────
// Observation
// ──────────────────────────────────────────────────────────────

// Write an observation about the user or world state.
export async function writeCoreObservation(
  content: string,
  opts: { tags?: string[]; source?: string } = {},
): Promise<boolean> {
  if (!isCoreBackend() || !content.trim()) return false;
  try {
    await callCoreTool("observation_write", { content, ...opts });
    return true;
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────────────────────────
// Register (key-value storage)
// ──────────────────────────────────────────────────────────────

// Set a key-value pair in the register.
export async function setCoreRegister(key: string, value: unknown): Promise<boolean> {
  if (!isCoreBackend() || !key) return false;
  try {
    await callCoreTool("register_set", { key, value });
    return true;
  } catch {
    return false;
  }
}

// Read a value from the register by key.
export async function fetchCoreRegister(key: string): Promise<string> {
  if (!isCoreBackend() || !key) return "";
  try {
    return await callCoreTool("register_read", { key });
  } catch {
    return "";
  }
}

// ──────────────────────────────────────────────────────────────
// State
// ──────────────────────────────────────────────────────────────

// Set an ongoing state (e.g. mood, activity, location).
export async function setCoreState(data: Record<string, unknown>): Promise<boolean> {
  if (!isCoreBackend()) return false;
  try {
    await callCoreTool("state_set", data);
    return true;
  } catch {
    return false;
  }
}

// Read all active/recent states.
export async function fetchCoreStates(
  opts: { limit?: number; since?: string } = {},
): Promise<string> {
  if (!isCoreBackend()) return "";
  try {
    return await callCoreTool("state_read", opts);
  } catch {
    return "";
  }
}

// Get a specific state by key.
export async function fetchCoreState(key: string): Promise<string> {
  if (!isCoreBackend() || !key) return "";
  try {
    return await callCoreTool("state_get", { key });
  } catch {
    return "";
  }
}

// Close/complete a state.
export async function closeCoreState(key: string): Promise<boolean> {
  if (!isCoreBackend() || !key) return false;
  try {
    await callCoreTool("state_close", { key });
    return true;
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────────────────────────
// Event
// ──────────────────────────────────────────────────────────────

// Log a general event (independent of chat_write).
export async function logCoreEvent(
  event: string,
  data?: Record<string, unknown>,
): Promise<boolean> {
  if (!isCoreBackend() || !event.trim()) return false;
  try {
    await callCoreTool("event_log", { event, ...(data ?? {}) });
    return true;
  } catch {
    return false;
  }
}

// Read events, optionally filtered.
export async function fetchCoreEvents(
  opts: { limit?: number; since?: string; type?: string } = {},
): Promise<string> {
  if (!isCoreBackend()) return "";
  try {
    return await callCoreTool("event_read", opts);
  } catch {
    return "";
  }
}

// ──────────────────────────────────────────────────────────────
// Topic
// ──────────────────────────────────────────────────────────────

// Create a new topic.
export async function createCoreTopic(
  title: string,
  data?: Record<string, unknown>,
): Promise<string> {
  if (!isCoreBackend() || !title.trim()) return "";
  try {
    return await callCoreTool("topic_create", { title, ...(data ?? {}) });
  } catch {
    return "";
  }
}

// List topics.
export async function listCoreTopics(opts: { limit?: number } = {}): Promise<string> {
  if (!isCoreBackend()) return "";
  try {
    return await callCoreTool("topic_list", opts);
  } catch {
    return "";
  }
}

// ──────────────────────────────────────────────────────────────
// Entity
// ──────────────────────────────────────────────────────────────

// Write entity data (people, places, objects).
export async function writeCoreEntity(data: Record<string, unknown>): Promise<boolean> {
  if (!isCoreBackend()) return false;
  try {
    await callCoreTool("entity_write", data);
    return true;
  } catch {
    return false;
  }
}

// List known entities.
export async function listCoreEntities(opts: { limit?: number; type?: string } = {}): Promise<string> {
  if (!isCoreBackend()) return "";
  try {
    return await callCoreTool("entity_list", opts);
  } catch {
    return "";
  }
}

// Search entities by query.
export async function searchCoreEntities(
  query: string,
  opts: { limit?: number; type?: string } = {},
): Promise<string> {
  if (!isCoreBackend() || !query.trim()) return "";
  try {
    return await callCoreTool("entity_search", { query, ...opts });
  } catch {
    return "";
  }
}

// Close an entity record.
export async function closeCoreEntity(id: string): Promise<boolean> {
  if (!isCoreBackend() || !id) return false;
  try {
    await callCoreTool("entity_close", { id });
    return true;
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────────────────────────
// Graph
// ──────────────────────────────────────────────────────────────

// Walk the knowledge graph from a starting node.
export async function walkCoreGraph(
  start: string,
  opts: { depth?: number; direction?: "in" | "out" | "both" } = {},
): Promise<string> {
  if (!isCoreBackend() || !start) return "";
  try {
    return await callCoreTool("graph_walk", { start, ...opts });
  } catch {
    return "";
  }
}

// ──────────────────────────────────────────────────────────────
// Closeout
// ──────────────────────────────────────────────────────────────

// Manually trigger closeout (finalize conversation, archive memory, trigger digest).
export async function triggerCoreCloseout(
  reason: string,
  data?: Record<string, unknown>,
): Promise<boolean> {
  if (!isCoreBackend() || !reason.trim()) return false;
  try {
    await callCoreTool("closeout", { reason, ...(data ?? {}) });
    return true;
  } catch {
    return false;
  }
}

// Best-effort: persist a memory back to kimi-core. No-op in local mode.
export async function persistCoreMemory(key: string, content: string): Promise<void> {
  if (!isCoreBackend() || !content.trim()) return;
  try {
    await callCoreTool("memory_write", { key, content });
  } catch {
    /* best-effort — never block the chat on a write */
  }
}

// Recent cross-surface conversation from kimi-core — the merged timeline (chat_read
// tool). For rendering history another device wrote, or polling for new lines.
// Returns [] in local mode or on any failure, so the chat degrades to local-only.
export type CoreChatMsg = { id: string; role: "user" | "assistant"; text: string; surface: string; at: string; threadId?: string };
export async function readCoreChat(
  opts: { take?: number; sinceISO?: string; threadId?: string } = {},
): Promise<CoreChatMsg[]> {
  if (!isCoreBackend()) return [];
  try {
    const args: Record<string, unknown> = {};
    if (opts.take) args.take = opts.take;
    if (opts.sinceISO) args.sinceISO = opts.sinceISO;
    if (opts.threadId) args.threadId = opts.threadId;
    const text = await callCoreTool("chat_read", args);
    const arr = JSON.parse(text) as unknown;
    return Array.isArray(arr) ? (arr as CoreChatMsg[]) : [];
  } catch {
    return [];
  }
}

// Append one chat message to kimi-core (chat_write tool) so other devices see it and
// it enters the digest path. Returns the new CHAT event id so the caller can later
// delete that exact row (see deleteCoreChat / retry); null in local mode or on any
// failure. Best-effort, but not silently lossy: every write carries a fresh
// idempotency key (kimi-core dedupes on Event.dedupeKey), and a failed attempt is
// retried once with the SAME key — so a lost response can't duplicate the row and
// a transient blip can't silently drop the message from the cross-device timeline.
export async function writeCoreChat(
  role: "user" | "assistant",
  text: string,
  threadId?: string,
): Promise<string | null> {
  if (!isCoreBackend() || !text.trim()) return null;
  const dedupeKey =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `dk-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const args = { role, text, ...(threadId ? { threadId } : {}), dedupeKey };
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const out = await callCoreTool("chat_write", args);
      const r = JSON.parse(out) as { ok?: boolean; id?: string };
      return r.ok && typeof r.id === "string" ? r.id : null;
    } catch {
      if (attempt === 0) await new Promise((res) => setTimeout(res, 1500));
    }
  }
  return null; /* best-effort after one retry */
}

// Delete one chat message in kimi-core (chat_delete tool). The only delete the room
// does: retry calls this to drop the reply it's replacing, so the bad answer doesn't
// linger on other devices or get digested. No-op in local mode; best-effort.
export async function deleteCoreChat(id: string): Promise<void> {
  if (!isCoreBackend() || !id) return;
  try {
    await callCoreTool("chat_delete", { id });
  } catch {
    /* best-effort — never block the chat on a delete */
  }
}

// Distinct conversation threads from kimi-core (chat_threads tool), for a history
// list. Returns [] in local mode or on failure.
export type CoreChatThread = { threadId: string; title: string; lastAt: string; count: number };
export async function readCoreThreads(
  opts: { limit?: number; lookbackDays?: number } = {},
): Promise<CoreChatThread[]> {
  if (!isCoreBackend()) return [];
  try {
    const args: Record<string, unknown> = {};
    if (opts.limit) args.limit = opts.limit;
    if (opts.lookbackDays) args.lookbackDays = opts.lookbackDays;
    const text = await callCoreTool("chat_threads", args);
    const arr = JSON.parse(text) as unknown;
    return Array.isArray(arr) ? (arr as CoreChatThread[]) : [];
  } catch {
    return [];
  }
}
// Reentry: pull full global context from kimi-core (reentry) into the system
// prompt. Pass an optional tag (e.g. sessionId) to isolate the marker chain.
export async function fetchCoreReentryContext(tag?: string): Promise<string> {
  if (!isCoreBackend()) return "";
  try {
    return await callCoreTool("reentry", tag ? { tag } : {});
  } catch {
    return "";
  }
}

// Incremental reentry: pull context new/updated since the last call. Requires
// a prior reentry (or reentry_delta) with the same tag to establish the anchor.
export async function fetchCoreReentryDelta(tag?: string): Promise<string> {
  if (!isCoreBackend()) return "";
  try {
    return await callCoreTool("reentry_delta", tag ? { tag } : {});
  } catch {
    return "";
  }
}

// Calendar: query entries from kimi-core by date range. Returns the raw array
// of { date, event, note, flow, meds } from calendar_events_query. Empty []
// in local mode or on failure, so callers always get a clean iterable.
export type CoreCalendarEntry = {
  date: string;
  event?: string | null;
  note?: string | null;
  flow?: number | null;
  meds?: string | null;
};
export async function fetchCoreCalendarEntries(
  startDate: string,
  endDate: string,
): Promise<CoreCalendarEntry[]> {
  if (!isCoreBackend()) return [];
  try {
    const text = await callCoreTool("calendar_events_query", { startDate, endDate });
    const arr = JSON.parse(text) as unknown;
    return Array.isArray(arr) ? (arr as CoreCalendarEntry[]) : [];
  } catch {
    return [];
  }
}

// Calendar: set entry for a specific date. Writes event/note/flow/meds via
// calendar_event_set. Returns true on success; false in local mode or on failure.
export async function setCoreCalendarEntry(
  date: string,
  data: Record<string, unknown>,
): Promise<boolean> {
  if (!isCoreBackend()) return false;
  try {
    await callCoreTool("calendar_event_set", { date, ...data });
    return true;
  } catch {
    return false;
  }
}

// Calendar: delete entry for a specific date via calendar_event_delete.
// Returns true on success; false in local mode or on failure.
export async function deleteCoreCalendarEntry(date: string): Promise<boolean> {
  if (!isCoreBackend()) return false;
  try {
    await callCoreTool("calendar_event_delete", { date });
    return true;
  } catch {
    return false;
  }
}
