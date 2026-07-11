// Short, clear display labels for MCP tool calls.
// Maps tool name → human-readable label shown inline during chat.

const toolLabels: Record<string, string> = {
  reentry: "记忆恢复",
  reentry_delta: "增量更新",
  memory_search_safe: "搜索记忆",
  memory_write: "写入记忆",
  chat_read: "读取对话",
  chat_write: "写入对话",
  chat_delete: "删除对话",
  chat_threads: "对话列表",
  store: "数据库",
  paper_list: "文献列表",
  chat_postprocess: "后处理",
};

export function getToolLabel(toolName: string): string {
  return toolLabels[toolName] ?? toolName;
}
