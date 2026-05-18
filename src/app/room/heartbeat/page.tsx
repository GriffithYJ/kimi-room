import { GothicPage } from "@/components/mucha/Gothic";
import { HeartbeatClient } from "@/components/heartbeat/HeartbeatClient";
import { getTheme } from "@/lib/day-theme";
import { gothicFor } from "@/lib/kimi-palettes";
import { SCORE_FONT_BODY } from "@/lib/score-colors";

// V2 Heartbeat · owner 0519 ack ·
//   Sky 星 = 纯记忆空间 · 只画 memory · 50 slot 默认 hollow placeholder
//   Score 谱 = 30 天情绪 timeline · 15 上 + 15 下 · chat / manual / LLM 三源
// canon HEARTBEAT 同 toggle pattern (ScoreClient).

export const dynamic = "force-dynamic";

export default async function HeartbeatPage() {
  const G = gothicFor(await getTheme());
  return (
    <GothicPage G={G}>
      <div style={{ fontFamily: SCORE_FONT_BODY }}>
        <HeartbeatClient G={G} />
      </div>
    </GothicPage>
  );
}
