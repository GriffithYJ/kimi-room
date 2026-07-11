import { NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { isAuthed } from "@/lib/stores/owner-session";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ tools: [] }, { status: 401 });
  }

  const base = process.env.KIMI_CORE_URL;
  const key = process.env.KIMI_API_KEY;
  if (!base || !key) {
    return NextResponse.json({ tools: [] });
  }

  const url = new URL(`${base.replace(/\/$/, "")}/mcp`);
  const transport = new StreamableHTTPClientTransport(url, {
    requestInit: { headers: { Authorization: `Bearer ${key}` } },
  });
  const client = new Client({ name: "kimi-room", version: "0.1.0" });

  try {
    await client.connect(transport);
    const result = await client.listTools();
    const tools = (result.tools ?? []).map((t: { name: string; description?: string; inputSchema?: Record<string, unknown> }) => ({
      type: "function" as const,
      function: {
        name: t.name,
        description: t.description ?? "",
        parameters: t.inputSchema ?? {},
      },
    }));
    return NextResponse.json({ tools });
  } catch (e) {
    return NextResponse.json({ tools: [] });
  } finally {
    await client.close().catch(() => {});
  }
}
