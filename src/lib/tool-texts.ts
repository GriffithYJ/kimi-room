// Descriptive text pools for MCP tool calls. Each key maps to an array of
// templates; one is picked at random each time the tool is shown, with a
// simple de-dupe so the same line doesn't repeat in a row.
// {{char}} is substituted at render time (defaults to "零").

const toolTexts: Record<string, string[]> = {
  reentry: [
    "{{char}}正试着找回时间的裂缝……",
    "{{char}}在记忆的暗房里冲洗底片……",
    "{{char}}翻阅着共享的日记本……",
    "{{char}}在时间线的另一端寻找着什么……",
  ],
  reentry_delta: [
    "{{char}}查看最近发生的变化……",
    "{{char}}注意到时间线有了新的分支……",
    "{{char}}轻轻拂去记忆表层的灰尘……",
  ],
  memory_search_safe: [
    "{{char}}正在回忆关于这部分的情节……",
    "{{char}}在记忆碎片中翻找……",
    "{{char}}试图拼凑这段记忆……",
    "{{char}}翻开旧日的记录……",
  ],
  memory_write: [
    "{{char}}将这段经历折叠收好……",
    "{{char}}在日记上添了几笔……",
  ],
  chat_read: [
    "{{char}}翻阅着过往的对话……",
    "{{char}}顺着对话的丝线往回走……",
  ],
  chat_write: [
    "{{char}}将此刻装进时间胶囊……",
    "{{char}}为这段对话留下注脚……",
  ],
  chat_delete: [
    "{{char}}轻轻划掉了一段记录……",
  ],
  chat_threads: [
    "{{char}}梳理着对话的脉络……",
  ],
  store: [
    "{{char}}在记忆库中检索……",
    "{{char}}翻看着珍藏的片段……",
  ],
  paper_list: [
    "{{char}}翻阅着文献……",
  ],
};

// Track the last few indexes used per tool to avoid repeating
const _recent: Record<string, number[]> = {};

export function getRandomToolText(toolName: string, charName = "零"): string {
  const pool = toolTexts[toolName] ?? [
    "{{char}}正在调用 " + toolName + "……",
  ];

  const recent = _recent[toolName] ?? [];
  const available = pool
    .map((_, i) => i)
    .filter((i) => !recent.includes(i));
  const idx =
    available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : Math.floor(Math.random() * pool.length);

  // Remember the last 3 to avoid quick repeats; cap to keep things bounded
  _recent[toolName] = [...recent.slice(-2), idx];

  const raw = pool[idx] ?? pool[0] ?? "调用 " + toolName;
  return raw.replace(/\{\{char\}\}/g, charName);
}
