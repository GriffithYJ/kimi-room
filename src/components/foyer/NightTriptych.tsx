"use client";

import { FOYER_NIGHT } from "./tokens";
import { CornerScroll, MoonGlyph, NoteStar } from "./Ornaments";
import { FoyerWeather } from "./FoyerWeather";
import { FoyerFooter } from "./FoyerFooter";
import { FoyerToggles } from "./FoyerToggles";
import { FoyerNames } from "./FoyerNames";
import { Lancet } from "./Lancet";
import type { FoyerScreenProps } from "./types";

const DEFAULT_WINDOW = "/images/foyer/baroque-window.webp";

/**
 * Night · three lancets of glass.
 *
 * Built like the day triptych — the same three lancets, with the glass cut out
 * of one window: the tracery at its head for the middle, the figures below it
 * for the sides.
 *
 * windowSrc is optional and defaults to the first window. pieces is optional
 * too — three already-cut [left, centre, right]: given them, each lancet takes
 * one instead of cropping the whole window, and bg replaces the ground with the
 * black out of the image so the three meet the dark without a seam.
 */
export function NightTriptych({
  dies,
  diesRoman,
  greet,
  milestone,
  quote,
  note,
  sinceLine,
  illumination,
  composition,
  theme,
  weather,
  windowSrc = DEFAULT_WINDOW,
  pieces,
  bg,
  swipeHandlers,
}: FoyerScreenProps & {
  illumination: number;
  windowSrc?: string;
  pieces?: [string, string, string];
  bg?: string;
  swipeHandlers?: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
  };
}) {
  const WINDOW = windowSrc;
  // What each lancet shows and where it crops: with pieces, one each; without,
  // the one window at three different offsets.
  const [lSrc, cSrc, rSrc] = pieces ?? [WINDOW, WINDOW, WINDOW];
  // The top of a piece is the black above the tracery, so cropping from the top
  // would fill the lancet with black. Centred, the coloured glass fills it.
  const [lPos, cPos, rPos] = pieces
    ? (["center", "center", "center"] as const)
    : (["12% 62%", "50% 26%", "88% 62%"] as const);
  return (
    <div
      className="foyer-stage"
      {...swipeHandlers}
      style={{
        color: FOYER_NIGHT.paperSoft,
        fontFamily: "var(--font-serif)",
        background: bg ?? FOYER_NIGHT.bg,
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
        // See the same spot in NightWindow: this screen does not scroll, so a
        // vertical drag reads as pull-to-refresh in Safari and in a PWA.
        touchAction: "none",
      }}
    >
      <div style={{ position: "absolute", inset: 12, border: `1px solid rgba(201,167,104,.42)`, pointerEvents: "none", zIndex: 5 }} />
      <div style={{ position: "absolute", inset: 17, border: `1px solid rgba(201,167,104,.18)`, pointerEvents: "none", zIndex: 5 }} />
      <CornerScroll position="tl" night />
      <CornerScroll position="tr" night />
      <CornerScroll position="bl" night />
      <CornerScroll position="br" night />

      <div style={{ textAlign: "center", flex: "none", animation: "foyer-fadeup .8s ease .05s both" }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: FOYER_NIGHT.goldDim }}>{greet}</div>
      </div>

      <FoyerWeather night marginTop={10} delay={0.12} location={weather} />

      <div style={{ flex: "none", display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 12, marginTop: 14 }}>
        <Lancet variant="side" night src={lSrc} objectPosition={lPos} fadeDelay={0.15} glowDelay={0} />
        <Lancet variant="center" night src={cSrc} objectPosition={cPos} fadeDelay={0.25} glowDelay={-2} />
        <Lancet variant="side" night src={rSrc} objectPosition={rPos} fadeDelay={0.2} glowDelay={-4} />
      </div>

      <div
        style={{
          flex: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 20,
          animation: "foyer-fadeup .9s ease .4s both",
        }}
      >
        <FoyerNames
          night
          ringBg={FOYER_NIGHT.panel}
          nameSize={16}
          nameMarginTop={9}
          whiplash={{ width: 120, delay: 0.9 }}
        />
      </div>

      <div style={{ textAlign: "center", flex: "none", marginTop: 8, animation: "foyer-fadeup .9s ease .5s both" }}>
        <div style={{ fontSize: 8, letterSpacing: 5, color: FOYER_NIGHT.goldDim }}>NOX</div>
        <div
          style={{
            fontSize: 42,
            fontWeight: 500,
            lineHeight: "44px",
            color: FOYER_NIGHT.paperSoft,
            letterSpacing: 1,
            fontFeatureSettings: "'onum' 1",
          }}
        >
          {dies}
        </div>
        <div style={{ fontSize: 8.5, fontStyle: "italic", letterSpacing: 3, color: FOYER_NIGHT.gold, marginTop: 1 }}>
          · {diesRoman} ·
        </div>
        <div style={{ fontSize: 7, letterSpacing: 2.5, color: FOYER_NIGHT.gold, marginTop: 3 }}>
          LUX PER VITRUM · {sinceLine}
        </div>
        <div style={{ fontSize: 6.5, letterSpacing: 2, color: FOYER_NIGHT.goldDim, marginTop: 2 }}>{milestone}</div>
      </div>

      <div style={{ textAlign: "center", flex: "none", padding: "8px 52px 0", animation: "foyer-fadeup .9s ease .6s both" }}>
        <div style={{ fontSize: 13.5, fontStyle: "italic", lineHeight: 1.6, color: FOYER_NIGHT.paperQuote }}>
          {quote.lines.map((l, i) => (
            <span key={l}>
              {i > 0 && <br />}
              {l}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          marginTop: "auto",
          paddingTop: 12,
          animation: "foyer-fadeup .9s ease .65s both",
        }}
      >
        <MoonGlyph />
        <span style={{ fontSize: 8, letterSpacing: 2.5, color: FOYER_NIGHT.gold }}>
          LUNA HODIE · {illumination}% ILLUMINATA
        </span>
      </div>

      <div style={{ flex: "none", display: "flex", justifyContent: "center", marginTop: 10, animation: "foyer-fadeup .9s ease .75s both" }}>
        <div
          style={{
            position: "relative",
            width: 200,
            boxSizing: "border-box",
            background: FOYER_NIGHT.noteBg,
            border: `1px solid ${FOYER_NIGHT.noteLine}`,
            padding: "8px 12px 7px",
            transform: "rotate(1.2deg)",
          }}
        >
          <NoteStar />
          <div style={{ fontSize: 6.5, letterSpacing: 2.5, color: FOYER_NIGHT.gold }}>AD ALTERUM · P.S.</div>
          <div style={{ fontSize: 11, fontStyle: "italic", color: FOYER_NIGHT.paperQuote, marginTop: 2 }}>{note}</div>
        </div>
      </div>

      <FoyerFooter night />

      <FoyerToggles theme={theme} composition={composition} night />
    </div>
  );
}
