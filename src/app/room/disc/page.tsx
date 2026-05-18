import { DiscClient } from "@/components/disc/DiscClient";
import { KimiPage, KimiTopNav } from "@/components/mucha/KimiPage";
import { palGold } from "@/lib/kimi-palettes";
import { getTheme } from "@/lib/day-theme";

export const dynamic = "force-dynamic";

// V2 /room/disc · canon restore · server theme + KimiTopNav 灵动岛 + DiscClient.
// canon V1 auth gate stripped (V2 0 web auth · owner 0429 ack). LLM 不用 (disc =
// shuffle 截图存档, 不 LLM 入口).

export default async function DiscPage() {
  const theme = await getTheme();
  const isDay = theme === "day";
  const P = palGold(theme);
  return (
    <KimiPage P={P} vines={false}>
      <KimiTopNav title="DISC" sub="music" P={P} />
      <DiscClient isDay={isDay} />
    </KimiPage>
  );
}
