// V2 IndexedDB wrapper · DB-primary local store.
//
// 1 DB `kimi` w/ object stores per collection. version bump 加 store 时.
// 全 async + Promise wrap, idb-batteries-included pattern.
//
// canon prod 不 use 这条 (走 Prisma). V2 用户 first-launch + Notion/Supabase
// adapter 用户 都走 IDB cache.

const DB_NAME = "kimi";
const DB_VERSION = 2;

export const STORE_NAMES = [
  "keepsake",
  "piece",
  "book",
  "concept",
  "memo",
  "calendar",
  "memory",
  "chat",
  "track",
  "activeState",
  "sleep",
  "blob",
] as const;

export type StoreName = (typeof STORE_NAMES)[number];

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IDB unavailable server-side"));
  }
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORE_NAMES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id" });
        }
      }
    };
  });
  return dbPromise;
}

function tx(
  store: StoreName,
  mode: IDBTransactionMode,
): Promise<IDBObjectStore> {
  return openDB().then((db) => db.transaction(store, mode).objectStore(store));
}

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function idbGet<T>(
  store: StoreName,
  id: string,
): Promise<T | null> {
  const os = await tx(store, "readonly");
  const result = await reqToPromise(os.get(id));
  return (result as T) ?? null;
}

export async function idbList<T>(store: StoreName): Promise<T[]> {
  const os = await tx(store, "readonly");
  const result = await reqToPromise(os.getAll());
  return (result as T[]) ?? [];
}

export async function idbPut<T extends { id: string }>(
  store: StoreName,
  entry: T,
): Promise<void> {
  const os = await tx(store, "readwrite");
  await reqToPromise(os.put(entry));
}

export async function idbDelete(
  store: StoreName,
  id: string,
): Promise<void> {
  const os = await tx(store, "readwrite");
  await reqToPromise(os.delete(id));
}

export async function idbClear(store: StoreName): Promise<void> {
  const os = await tx(store, "readwrite");
  await reqToPromise(os.clear());
}

export async function idbClearAll(): Promise<void> {
  for (const s of STORE_NAMES) await idbClear(s);
}

export async function idbExportAll(): Promise<Record<StoreName, unknown[]>> {
  const out = {} as Record<StoreName, unknown[]>;
  for (const s of STORE_NAMES) {
    out[s] = await idbList(s);
  }
  return out;
}

export async function idbImportAll(
  payload: Partial<Record<StoreName, unknown[]>>,
): Promise<{ added: number }> {
  let added = 0;
  for (const s of STORE_NAMES) {
    const rows = payload[s];
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      if (row && typeof row === "object" && "id" in row) {
        await idbPut(s, row as { id: string });
        added++;
      }
    }
  }
  return { added };
}

// Small uuid (browser crypto, no lib).
export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}
