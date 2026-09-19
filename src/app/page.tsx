import { redirect } from "next/navigation";
import { getTheme } from "@/lib/day-theme";
import { getFoyerComposition, getFoyerSkip } from "@/lib/foyer-composition";
import { Foyer } from "@/components/foyer/Foyer";
import { FOYER_DAY, FOYER_NIGHT } from "@/components/foyer/tokens";

// The foyer (Vestibulum) — the front door. One screen, no scrolling, one way
// in: INTRARE → /room.
//
// Four screens = day/night (the site-wide kimi-theme cookie) × composition (the
// kimi-foyer cookie, this page alone), a seal at each bottom corner turning one
// of them. The start date, the line, the note and the weather location are
// filled in at /backstage/settings. See docs/FOYER.md.
//
// Not wanted? Tick "skip the foyer" in settings and this page redirects
// straight into /room (the kimi-foyer-skip cookie).
//
// force-dynamic: this page reads cookies to choose a screen, and going static
// would weld one build's screen onto everybody.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [theme, composition, skip] = await Promise.all([
    getTheme(),
    getFoyerComposition(),
    getFoyerSkip(),
  ]);

  if (skip) redirect("/room");

  const night = theme === "night";

  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        background: night ? FOYER_NIGHT.edge : FOYER_DAY.edge,
      }}
    >
      <Foyer theme={theme} composition={composition} />
    </main>
  );
}
