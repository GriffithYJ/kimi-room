// V2 stub · canon maintainer content (Akira's reaction notes) stripped.
// Type 留 backwards compat 给 现 page import. V2 page rewrite 走 MemoStore IDB.

export type Memo = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  topic: string;
  body: string;
};

export const MEMOS: Memo[] = [];

export function findMemo(_slug: string): Memo | undefined {
  return undefined;
}
