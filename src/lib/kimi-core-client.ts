"use client";

import { isCoreBackend } from "./backend-mode";

// Browser-side helper for the "core" backend: call a kimi-core tool through the
// /api/core redirect (the server holds the key). kimi-core tools return
// agent-readable TEXT, not JSON — so these helpers deal in strings, meant for
// RAG injection into your chat prompt, not for reconstructing structured rows.
// In "local" mode every helper is a no-op. See docs/BACKENDS.md.

export async function callCoreTool(
  name: string,
  args: Record<string, unknown> = {},
): Promise<string> {
  const res = await fetch("/api/core", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, arguments: args }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error || `core tool ${name} failed (${res.status})`);
  }
  const data = (await res.json()) as { text?: string };
  return typeof data.text === "string" ? data.text : "";
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
export type CoreChatMsg = { role: "user" | "assistant"; text: string; surface: string; at: string; threadId?: string };
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
// it enters the digest path. No-op in local mode; best-effort (never blocks the chat).
export async function writeCoreChat(role: "user" | "assistant", text: string, threadId?: string): Promise<void> {
  if (!isCoreBackend() || !text.trim()) return;
  try {
    await callCoreTool("chat_write", { role, text, ...(threadId ? { threadId } : {}) });
  } catch {
    /* best-effort */
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
