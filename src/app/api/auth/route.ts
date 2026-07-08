import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  expectedToken,
  isAuthed,
  verifyPassword,
} from "@/lib/stores/owner-session";

// Owner sign-in for the gated server routes (/api/store, /api/core, /api/tts).
// POST { password } → sets the session cookie if it matches KIMI_OWNER_PASSWORD.
// GET → { configured, authed } for the /backstage/login page. DELETE → signs out.
// The cookie is httpOnly (never readable by JS) and Secure in production.
// See docs/SELF-HOST.md.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return NextResponse.json({ configured: !!(await expectedToken()), authed: await isAuthed(req) });
}

export async function POST(req: Request) {
  const token = await expectedToken();
  if (!token) {
    return NextResponse.json(
      { error: "owner login not configured — set KIMI_OWNER_PASSWORD (see docs/SELF-HOST.md)" },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!(await verifyPassword(password))) {
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
