import { NextResponse } from "next/server";

// External calendar sync endpoint — accepts POST from iOS Shortcuts (or any
// external caller) and forwards the event to kimi-core's calendar_event_set
// tool.
//
// Append mode: if the date already has an event text, the new event is
// appended on a new line. This way multiple events on the same day don't
// overwrite each other.
//
// No cookie auth required; uses a dedicated CALENDAR_SYNC_SECRET.
//
// iOS Shortcuts: send "date" as "YYYY-MM-DD" or "YYYY-MM-DD HH:mm".
// If a time is included, the server strips the date part and prepends the
// time to the event text automatically — so you only need one Format Date
// action that outputs "yyyy-MM-dd HH:mm".
//
//   POST /api/calendar/sync
//   Authorization: Bearer <CALENDAR_SYNC_SECRET>
//   { "date": "2026-07-11 14:00", "event": "开会" }
//   → stored as date=2026-07-11, event="14:00 开会"

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // 1. Auth — Bearer token in header
  const secret = process.env.CALENDAR_SYNC_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CALENDAR_SYNC_SECRET not configured" },
      { status: 503 },
    );
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  let body: {
    date?: string;
    event?: string;
    note?: string;
    flow?: number;
    meds?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  if (!body.date) {
    return NextResponse.json(
      { error: "missing date (YYYY-MM-DD or YYYY-MM-DD HH:mm)" },
      { status: 400 },
    );
  }

  // 2a. Parse "2026-07-11" or "2026-07-11 14:00"
  //     If a time is included, prepend it to event text automatically.
  let dateOnly = body.date.trim();
  let timePrefix = "";
  const spaceIdx = dateOnly.indexOf(" ");
  if (spaceIdx > 0) {
    timePrefix = dateOnly.slice(spaceIdx + 1).trim();
    dateOnly = dateOnly.slice(0, spaceIdx);
  }
  let mergedEvent = body.event?.trim() || "";
  if (timePrefix && mergedEvent) {
    mergedEvent = `${timePrefix} ${mergedEvent}`;
  }

  // 3. Forward to kimi-core via MCP Streamable HTTP
  const base = process.env.KIMI_CORE_URL;
  const key = process.env.KIMI_API_KEY;
  if (!base || !key) {
    return NextResponse.json(
      {
        error:
          "kimi-core not configured — set KIMI_CORE_URL + KIMI_API_KEY",
      },
      { status: 503 },
    );
  }

  const { Client } = await import(
    "@modelcontextprotocol/sdk/client/index.js"
  );
  const { StreamableHTTPClientTransport } = await import(
    "@modelcontextprotocol/sdk/client/streamableHttp.js"
  );

  const url = new URL(`${base.replace(/\/$/, "")}/mcp`);
  const transport = new StreamableHTTPClientTransport(url, {
    requestInit: { headers: { Authorization: `Bearer ${key}` } },
  });
  const client = new Client({
    name: "kimi-room-calendar-sync",
    version: "0.1.0",
  });

  try {
    await client.connect(transport);

    // 3a. Read existing entry for this date (append mode)
    if (mergedEvent) {
      try {
        const queryText = await client.callTool({
          name: "calendar_events_query",
          arguments: {
            startDate: dateOnly,
            endDate: dateOnly,
          },
        });
        const existing = (
          (queryText?.content ?? []) as Array<{
            type?: string;
            text?: string;
          }>
        )
          .filter((c) => c?.type === "text")
          .map((c) => c.text)
          .join("");
        const parsed = JSON.parse(existing || "[]") as Array<{
          event?: string | null;
        }>;
        const existingEvent = parsed?.[0]?.event;
        if (existingEvent) {
          const lines = existingEvent.split("\n");
          if (!lines.includes(mergedEvent)) {
            mergedEvent = existingEvent + "\n" + mergedEvent;
          } else {
            mergedEvent = existingEvent;
          }
        }
      } catch {
        // Query failed — use the new event as-is
      }
    }

    const args: Record<string, unknown> = { date: dateOnly };
    if (mergedEvent) args.event = mergedEvent;
    if (body.note != null) args.note = body.note;
    if (body.flow != null) args.flow = body.flow;
    if (body.meds != null) args.meds = body.meds;
    const result = await client.callTool({
      name: "calendar_event_set",
      arguments: args,
    });
    const content = (result?.content ?? []) as Array<{
      type?: string;
      text?: string;
    }>;
    const text = content
      .filter((c) => c?.type === "text" && typeof c.text === "string")
      .map((c) => c.text as string)
      .join("\n");
    return NextResponse.json({ ok: true, text });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 502 },
    );
  } finally {
    await client.close().catch(() => {});
  }
}
