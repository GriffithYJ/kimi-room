import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/stores/owner-session";

export const runtime = "nodejs";
export const maxDuration = 30;

// On-demand TTS for one chat reply. The "听" button POSTs the reply text here; we
// strip markdown / timestamps, then synthesize with ElevenLabs and return
// audio/mpeg. Bring your own key — ELEVENLABS_API_KEY (+ optional
// ELEVENLABS_VOICE_ID / ELEVENLABS_MODEL). No key set → 503, and the button just
// stays quiet. This route spends YOUR ElevenLabs credits, so it requires the
// owner session cookie (same gate /api/core and /api/store use) — an anonymous
// visitor who finds the deployment URL cannot burn quota. ElevenLabs is
// multilingual, so the text is spoken in its original language (no translation).

const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY ?? "";
const ELEVEN_MODEL = process.env.ELEVENLABS_MODEL || "eleven_v3";
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "42ZF7GefiwXbnDaSkPpY";
const SETTINGS = {
  stability: 0.62,
  similarity_boost: 0.8,
  style: 0.3,
  use_speaker_boost: true,
};
const MAX_CHARS = 2800;

// Clean a chat reply into speakable text: drop code blocks, markdown emphasis /
// headings / list markers, link shells, and timestamp blocks like [2026.06.13 00:06].
function cleanForTts(raw: string): string {
  let s = String(raw || "");
  s = s.replace(/```[\s\S]*?```/g, " ");
  s = s.replace(/`([^`]+)`/g, "$1");
  s = s.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1");
  s = s.replace(/\[[^\]\n]*\d{4}\.\d{2}\.\d{2}[^\]\n]*\]/g, "");
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/^\s*>\s?/gm, "");
  s = s.replace(/^\s*[-*+]\s+/gm, "");
  s = s.replace(/(\*\*|__|\*|_|~~)/g, "");
  s = s.replace(/\s{2,}/g, " ").trim();
  return s;
}

export async function POST(req: Request) {
  if (!isAuthed(req)) {
    return NextResponse.json(
      { error: "unauthorized — sign in via POST /api/auth (see docs/SELF-HOST.md)" },
      { status: 401 },
    );
  }
  if (!ELEVEN_KEY) {
    return NextResponse.json({ error: "missing_elevenlabs_key" }, { status: 503 });
  }

  let body: { text?: string };
  try {
    body = (await req.json()) as { text?: string };
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const cleaned = cleanForTts(body?.text ?? "").slice(0, MAX_CHARS);
  if (!cleaned) {
    return NextResponse.json({ error: "empty_text" }, { status: 400 });
  }

  // v3 understands [audio tags]; for non-v3 models strip bracketed tags so they
  // are not read aloud.
  const input = /v3/.test(ELEVEN_MODEL)
    ? cleaned
    : cleaned.replace(/\[[^\]\n]{1,24}\]/g, "").replace(/\s{2,}/g, " ").trim();

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": ELEVEN_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, model_id: ELEVEN_MODEL, voice_settings: SETTINGS }),
      },
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "elevenlabs_failed", status: res.status, detail: detail.slice(0, 300) },
        { status: 502 },
      );
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length) {
      return NextResponse.json({ error: "empty_audio" }, { status: 502 });
    }
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "tts_exception", detail: msg.slice(0, 300) }, { status: 500 });
  }
}
