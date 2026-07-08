// Single-user owner session (Edge-safe Web Crypto API).
//
// 1v1: the whole database belongs to one person, so "auth" is one password. A
// correct password mints a cookie whose value is sha256(password:secret); every
// /api/store request must present it. No password configured -> locked shut
// (isAuthed / verifyPassword both return false), never open-by-default. Only the
// four server routes import this. See docs/SELF-HOST.md.
//
// Uses crypto.subtle (Web Crypto API) instead of node:crypto so the module is
// compatible with both Edge Runtime and Node.js. All exported functions are
// async because crypto.subtle.digest is Promise-based.

export const SESSION_COOKIE = "kimi_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

function constantTimeBufEqual(a: ArrayBuffer, b: ArrayBuffer): boolean {
  const ua = new Uint8Array(a);
  const ub = new Uint8Array(b);
  if (ua.length !== ub.length) return false;
  let result = 0;
  for (let i = 0; i < ua.length; i++) result |= ua[i] ^ ub[i];
  return result === 0;
}

async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
}

export async function expectedToken(): Promise<string | null> {
  const pw = process.env.KIMI_OWNER_PASSWORD;
  if (!pw) return null;
  const secret = process.env.KIMI_SESSION_SECRET ?? "";
  return hex(await sha256(`${pw}:${secret}`));
}

export async function isAuthed(req: Request): Promise<boolean> {
  const expected = await expectedToken();
  if (!expected) return false;
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)kimi_session=([a-f0-9]+)/);
  return !!m && constantTimeEqual(m[1], expected);
}

export async function verifyPassword(input: string): Promise<boolean> {
  const pw = process.env.KIMI_OWNER_PASSWORD;
  if (!pw) return false;
  const [a, b] = await Promise.all([sha256(input), sha256(pw)]);
  return constantTimeBufEqual(a, b);
}
