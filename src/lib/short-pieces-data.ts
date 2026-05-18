// V2 stub · canon maintainer content (xhs short essays) stripped.
// Type 留 backwards compat. V2 page rewrite 走 PieceStore IDB.

export type ShortPiece = {
  slug: string;
  title: string;
  subtitle?: string;
  kind: "xhs-short" | "xhs-long" | "snippet";
  date: string;
  excerpt?: string;
  fullText?: string;
  note?: string;
};

export const SHORT_PIECES: ShortPiece[] = [];

export function findShortPiece(_slug: string): ShortPiece | undefined {
  return undefined;
}
