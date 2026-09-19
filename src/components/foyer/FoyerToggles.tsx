import { toggleKimiTheme, toggleFoyerComposition } from "@/lib/foyer-actions";
import type { KimiTheme } from "@/lib/day-theme-client";
import type { FoyerComposition } from "@/lib/foyer-prefs";
import { FOYER_DAY, FOYER_NIGHT } from "./tokens";
import { SunGlyph, MoonGlyph, TriArchGlyph, SingleArchGlyph } from "./Ornaments";

/**
 * The two seals — one at each bottom corner, either side of INTRARE, within
 * reach of a thumb and off the centre line. The left turns day and night (the
 * site-wide kimi-theme, so /room follows); the right turns the composition,
 * which is this page's alone.
 *
 * A seal shows **where tapping it takes you**, not where you are — the same
 * next-stop figure as INTRARE itself: by day a moon · NOX, by night a sun ·
 * DIES; on the full screen three arches · TRIA, on the triptych one · PLENA.
 *
 * They sit at half opacity and come up only under a finger. Quiet.
 *
 * The actions are imported from foyer-actions (a "use server" file) rather than
 * written inline: this component is imported by client components, and an
 * inline action is not legal there.
 */
export function FoyerToggles({
  theme,
  composition,
  night,
}: {
  theme: KimiTheme;
  composition: FoyerComposition;
  night: boolean;
}) {
  const glyph = night ? FOYER_NIGHT.goldBright : FOYER_DAY.muteWarm;
  const label = night ? FOYER_NIGHT.gold : FOYER_DAY.mute;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 26,
        zIndex: 20,
        display: "flex",
        justifyContent: "space-between",
        padding: "0 32px",
        pointerEvents: "none",
      }}
    >
      <Seal
        action={toggleKimiTheme}
        night={night}
        label={theme === "day" ? "NOX" : "DIES"}
        labelColor={label}
        aria={theme === "day" ? "切到夜" : "切到昼"}
      >
        {theme === "day" ? <MoonGlyph size={13} color={glyph} /> : <SunGlyph size={13} color={glyph} />}
      </Seal>

      <Seal
        action={toggleFoyerComposition}
        night={night}
        label={composition === "full" ? "TRIA" : "PLENA"}
        labelColor={label}
        aria={composition === "full" ? "切到三联" : "切到满窗"}
      >
        {composition === "full" ? <TriArchGlyph color={glyph} /> : <SingleArchGlyph color={glyph} />}
      </Seal>
    </div>
  );
}

function Seal({
  action,
  night,
  label,
  labelColor,
  aria,
  children,
}: {
  action: () => Promise<void>;
  night: boolean;
  label: string;
  labelColor: string;
  aria: string;
  children: React.ReactNode;
}) {
  return (
    <form action={action} style={{ pointerEvents: "auto", margin: 0, padding: 0 }}>
      <button
        type="submit"
        aria-label={aria}
        className="foyer-seal"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
          ["--foyer-seal-hover" as string]: night ? FOYER_NIGHT.paper : FOYER_DAY.rose,
        }}
      >
        <span
          className="foyer-seal-ring"
          style={{
            width: 34,
            height: 34,
            boxSizing: "border-box",
            borderRadius: "50%",
            border: `1px solid ${night ? "rgba(201,167,104,.32)" : "rgba(150,110,90,.34)"}`,
            background: night ? "rgba(10,8,6,.32)" : "rgba(251,245,234,.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </span>
        <span style={{ fontSize: 6, letterSpacing: 2.5, color: labelColor }}>{label}</span>
      </button>
    </form>
  );
}
