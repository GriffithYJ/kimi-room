import { ChatRoom } from "@/components/chat/ChatRoom";

// V2 chat · /room 点 rose/moon hero 跳进来. settings 填 LLM key 后 自动 wire
// 到 chatroom (lib/llm-client.ts). 没填 key · ChatRoom 内 inline banner
// prompt 引导 → /settings (Phase 3b polish, defer).
//
// canon V1 这 page 走 backstage cookie auth gate (chat 烧 LLM 钱). V2 strip
// auth · LLM key 自带 即用, 0 web auth.

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return <ChatRoom />;
}
