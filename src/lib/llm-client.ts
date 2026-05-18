// V2 LLM API client · reusable across surfaces.
//
// 设计 (owner 0525 ack):
// - 用户 settings 填 LLM key + endpoint URL, localStorage 存
// - 所有 调 API 的 surface 走 这条:
//   · /chat (主对话)
//   · /room/keepsakes 一句话感想 (auto comment on photo upload)
//   · 未来 surface (会再加)
// - OpenAI-format chat completion (兼容 Anthropic via 任何 OpenAI-compat proxy /
//   OpenRouter / DeepSeek / Together / 自建 vLLM / Ollama)
//
// 官端 closed SaaS 用户 (ChatGPT app / Claude.ai) 路径: 不调 API, 用 manual
// 输入 archive · /chat 入口 fallback "configure LLM key in settings" prompt.

const KEY_API_KEY = "kimi-llm-api-key";
const KEY_ENDPOINT = "kimi-llm-endpoint";
const KEY_MODEL = "kimi-llm-model";

const DEFAULT_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

function readLS(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeLS(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    const t = value.trim();
    if (!t) localStorage.removeItem(key);
    else localStorage.setItem(key, t);
  } catch {}
}

export type LLMConfig = {
  apiKey: string;
  endpoint: string;
  model: string;
};

export function getLLMConfig(): LLMConfig {
  return {
    apiKey: readLS(KEY_API_KEY),
    endpoint: readLS(KEY_ENDPOINT) || DEFAULT_ENDPOINT,
    model: readLS(KEY_MODEL) || DEFAULT_MODEL,
  };
}

export function setLLMConfig(c: Partial<LLMConfig>): void {
  if (c.apiKey !== undefined) writeLS(KEY_API_KEY, c.apiKey);
  if (c.endpoint !== undefined) writeLS(KEY_ENDPOINT, c.endpoint);
  if (c.model !== undefined) writeLS(KEY_MODEL, c.model);
}

export function isLLMConfigured(): boolean {
  return !!getLLMConfig().apiKey;
}

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatOptions = {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
};

export type ChatResult = {
  text: string;
  raw?: unknown;
};

export async function llmChat(
  messages: ChatMessage[],
  opts: ChatOptions = {},
): Promise<ChatResult> {
  const cfg = getLLMConfig();
  if (!cfg.apiKey) {
    throw new Error(
      "LLM API key not configured. Open settings → fill API key.",
    );
  }
  const body = {
    model: cfg.model,
    messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 1024,
    stream: false,
  };
  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`LLM request failed (${res.status}): ${errText.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  return { text, raw: data };
}

// Convenience · single-shot prompt → text (system + user message format).
export async function llmGenerate(
  prompt: string,
  system?: string,
  opts?: ChatOptions,
): Promise<string> {
  const messages: ChatMessage[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });
  const r = await llmChat(messages, opts);
  return r.text;
}

// V2 vision · owner 0518 disc auto-parse screenshot. OpenAI vision format ·
// 兼容 gpt-4o / claude-3.5-sonnet (via Anthropic OpenAI-compat proxy) /
// deepseek-vl / 等. 不支持 vision 的 endpoint 会 400 — 调用方 catch fallback.
export async function llmGenerateWithImage(
  prompt: string,
  imageDataUrl: string,
  system?: string,
  opts?: ChatOptions,
): Promise<string> {
  const cfg = getLLMConfig();
  if (!cfg.apiKey) {
    throw new Error("LLM API key not configured. Open settings.");
  }
  const userContent = [
    { type: "text" as const, text: prompt },
    { type: "image_url" as const, image_url: { url: imageDataUrl } },
  ];
  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: userContent });
  const body = {
    model: cfg.model,
    messages,
    temperature: opts?.temperature ?? 0.3,
    max_tokens: opts?.maxTokens ?? 2048,
    stream: false,
  };
  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`vision request failed (${res.status}): ${errText.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}
