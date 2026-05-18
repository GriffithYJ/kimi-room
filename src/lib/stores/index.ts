// V2 store entry-point · public hooks 6 module page 调.
//
// canon mode: 走 CanonPrismaAdapter (TODO Phase 3 · wrap existing prisma + lib/*-data.ts).
// V2 mode:    走 IndexedDBAdapter (default), 后续 settings 切 NotionAdapter / SupabaseAdapter.
//
// 现 Phase 2: IDB only. Phase 3 page rewrite 后 + Phase 5 community adapter PR.

import { isCanon } from "../kimi-mode";
import { idbAdapter } from "./idb-adapter";
import type { AdapterBundle } from "./types";

// canon path placeholder · Phase 3 真 wire.
// 现 Phase 2 即使 canon 也 fall through IDB (canon prod 没 page 调 useStore 还,
// 所以 不影响). Phase 3 加 CanonPrismaAdapter 时 此 switch 启用.
function selectAdapter(): AdapterBundle {
  if (isCanon) {
    // TODO Phase 3: return canonPrismaAdapter
    return idbAdapter;
  }
  return idbAdapter;
}

let _bundle: AdapterBundle | null = null;
export function getAdapter(): AdapterBundle {
  if (!_bundle) _bundle = selectAdapter();
  return _bundle;
}

// Convenience hooks · page 调.
export const keepsakeStore = () => getAdapter().keepsake;
export const pieceStore = () => getAdapter().piece;
export const bookStore = () => getAdapter().book;
export const conceptStore = () => getAdapter().concept;
export const memoStore = () => getAdapter().memo;
export const calendarStore = () => getAdapter().calendar;
export const memoryStore = () => getAdapter().memory;
export const chatStore = () => getAdapter().chat;
export const trackStore = () => getAdapter().track;
export const activeStateStore = () => getAdapter().activeState;
export const sleepStore = () => getAdapter().sleep;
export const blobStore = () => getAdapter().blob;

export type {
  ActiveStateEntry,
  AdapterBundle,
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
