// V2 IndexedDBAdapter · 默认 V2 ship adapter, 0 config first-launch usable.
//
// 实现 AdapterBundle (types.ts) over `lib/idb.ts` wrapper.
// 全 collection 用 同一 IDB DB `kimi`, 各 object store 对应 1 entry type.

import {
  idbClearAll,
  idbDelete,
  idbExportAll,
  idbGet,
  idbImportAll,
  idbList,
  idbPut,
  newId,
  nowISO,
  type StoreName,
} from "../idb";
import type {
  ActiveStateEntry,
  AdapterBundle,
  BlobContract,
  BlobEntry,
  BookEntry,
  CalendarEvent,
  ChatEntry,
  ConceptEntry,
  Filter,
  MemoEntry,
  MemoryEntry,
  PieceEntry,
  SleepEntry,
  StoreContract,
  StoreEntry,
  KeepsakeEntry,
  TrackEntry,
} from "./types";

function applyFilter<T extends StoreEntry>(
  rows: T[],
  filter?: Filter,
): T[] {
  if (!filter) return rows;
  let out = rows;
  if (filter.ids) out = out.filter((r) => filter.ids!.includes(r.id));
  if (filter.tags) {
    out = out.filter((r) => {
      const t = (r as { tags?: string[] }).tags;
      return Array.isArray(t) && filter.tags!.some((tag) => t.includes(tag));
    });
  }
  if (filter.status) {
    out = out.filter((r) => (r as { status?: string }).status === filter.status);
  }
  if (filter.activeOnly) {
    out = out.filter((r) => (r as { active?: boolean }).active !== false);
  }
  if (filter.dateRange) {
    out = out.filter((r) => {
      const d = (r as { date?: string }).date ?? r.createdAt;
      return d >= filter.dateRange!.from && d <= filter.dateRange!.to;
    });
  }
  if (filter.limit) out = out.slice(0, filter.limit);
  return out;
}

function makeStore<T extends StoreEntry>(
  storeName: StoreName,
): StoreContract<T> {
  return {
    async list(filter) {
      const rows = await idbList<T>(storeName);
      return applyFilter(rows, filter);
    },
    async get(id) {
      return idbGet<T>(storeName, id);
    },
    async put(entry) {
      const now = nowISO();
      const id = entry.id ?? newId();
      const existing = entry.id ? await idbGet<T>(storeName, entry.id) : null;
      const full = {
        ...(existing ?? {}),
        ...entry,
        id,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      } as T;
      await idbPut(storeName, full);
      return full;
    },
    async delete(id) {
      await idbDelete(storeName, id);
    },
    async search(query) {
      const q = query.toLowerCase().trim();
      if (!q) return [];
      const rows = await idbList<T>(storeName);
      return rows.filter((r) =>
        JSON.stringify(r).toLowerCase().includes(q),
      );
    },
  };
}

const blobContract: BlobContract = {
  async list(kind) {
    const rows = await idbList<BlobEntry>("blob");
    return kind ? rows.filter((r) => r.kind === kind) : rows;
  },
  async get(id) {
    return idbGet<BlobEntry>("blob", id);
  },
  async put(blob) {
    const id = blob.id ?? newId();
    const full: BlobEntry = {
      id,
      kind: blob.kind,
      contentType: blob.contentType,
      base64: blob.base64,
      createdAt: nowISO(),
    };
    await idbPut("blob", full);
    return full;
  },
  async delete(id) {
    await idbDelete("blob", id);
  },
};

export const idbAdapter: AdapterBundle = {
  keepsake: makeStore<KeepsakeEntry>("keepsake"),
  piece: makeStore<PieceEntry>("piece"),
  book: makeStore<BookEntry>("book"),
  concept: makeStore<ConceptEntry>("concept"),
  memo: makeStore<MemoEntry>("memo"),
  calendar: makeStore<CalendarEvent>("calendar"),
  memory: makeStore<MemoryEntry>("memory"),
  chat: makeStore<ChatEntry>("chat"),
  track: makeStore<TrackEntry>("track"),
  activeState: makeStore<ActiveStateEntry>("activeState"),
  sleep: makeStore<SleepEntry>("sleep"),
  blob: blobContract,

  async exportJSON() {
    const all = await idbExportAll();
    return JSON.stringify(all, null, 2);
  },

  async importJSON(json) {
    const parsed = JSON.parse(json) as Parameters<typeof idbImportAll>[0];
    return idbImportAll(parsed);
  },

  async empty() {
    await idbClearAll();
  },
};
