"use client";

import { FOYER_DAY } from "./tokens";
import { CornerScroll, RoseSpiralGlyph } from "./Ornaments";
import { FoyerWeather } from "./FoyerWeather";
import { FoyerFooter } from "./FoyerFooter";
import { FoyerToggles } from "./FoyerToggles";
import { FoyerNames } from "./FoyerNames";
import { Lancet } from "./Lancet";
import { SEASON_PANELS } from "@/lib/foyer";
import type { FoyerScreenProps } from "./types";

/**
 * Day · three niches.
 *
 * Three of them, the middle one taller. Built like the night triptych — turn to
 * night and it is the same three, glazed.
 *
 * The Seasons hang on either side: this season on the left, the next on the
 * right, ROSA fixed between them. Time comes past on the left and goes on to
 * the right. The eighteen floral panels turn daily on the curtain screen
 * instead.
 */
export function DayTriptych({
  dies,
  diesRoman,
  greet,
  milestone,
  quote,
  note,
  sinceLine,
  composition,
  theme,
  weather,
  seasonIndex,
}: FoyerScreenProps) {
  const here = SEASON_PANELS[seasonIndex];
  const next = SEASON_PANELS[(seasonIndex + 1) % SEASON_PANELS.length];
  return (
    <div
      className="foyer-stage"
      style={{
        color: FOYER_DAY.ink,
        fontFamily: "var(--font-serif)",
        background: FOYER_DAY.bg,
      }}
    >
      <div style={{ position: "absolute", inset: 12, border: `1px solid rgba(150,110,90,.4)`, pointerEvents: "none", zIndex: 5 }} />
      <div style={{ position: "absolute", inset: 17, border: `1px solid rgba(150,110,90,.18)`, pointerEvents: "none", zIndex: 5 }} />
      <CornerScroll position="tl" night={false} />
      <CornerScroll position="tr" night={false} />
      <CornerScroll position="bl" night={false} />
      <CornerScroll position="br" night={false} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          paddingTop: 56,
        }}
      >
        <div style={{ textAlign: "center", flex: "none", animation: "foyer-fadeup .8s ease .05s both" }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: FOYER_DAY.mute }}>{greet}</div>
        </div>

        <FoyerWeather night={false} marginTop={10} delay={0.12} location={weather} />

        <div style={{ flex: "none", display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 12, marginTop: 14 }}>
          <Lancet variant="side" night={false} src={here.src} label={here.name} fadeDelay={0.15} glowDelay={0} />
          <Lancet variant="center" night={false} src="/images/foyer/mucha-a5.webp" label="ROSA" labelAccent fadeDelay={0.25} glowDelay={-2.5} />
          <Lancet variant="side" night={false} src={next.src} label={next.name} fadeDelay={0.2} glowDelay={-5} />
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
            night={false}
            ringBg={FOYER_DAY.bgSolid}
            nameSize={16}
            nameMarginTop={9}
            whiplash={{ width: 120, delay: 0.9 }}
          />
        </div>

        <div style={{ textAlign: "center", flex: "none", marginTop: 8, animation: "foyer-fadeup .9s ease .5s both" }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: FOYER_DAY.mute }}>DIES</div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 500,
              lineHeight: "44px",
              color: FOYER_DAY.ink,
              letterSpacing: 1,
              fontFeatureSettings: "'onum' 1",
            }}
          >
            {dies}
          </div>
          <div style={{ fontSize: 8.5, fontStyle: "italic", letterSpacing: 3, color: FOYER_DAY.mute, marginTop: 1 }}>
            · {diesRoman} ·
          </div>
          <div style={{ fontSize: 7, letterSpacing: 2.5, color: FOYER_DAY.rose, marginTop: 3 }}>{sinceLine}</div>
          <div style={{ fontSize: 6.5, letterSpacing: 2, color: FOYER_DAY.mute, marginTop: 2 }}>{milestone}</div>
        </div>

        <div style={{ textAlign: "center", flex: "none", padding: "8px 52px 0", animation: "foyer-fadeup .9s ease .6s both" }}>
          <div style={{ fontSize: 13, fontStyle: "italic", lineHeight: 1.6, color: FOYER_DAY.inkQuote }}>
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
          <RoseSpiralGlyph />
          <span style={{ fontSize: 8, letterSpacing: 2.5, color: FOYER_DAY.roseFlower }}>
            FLOS HODIERNVS · ROSA — AMOR SINE VERBIS
          </span>
        </div>

        <div style={{ flex: "none", display: "flex", justifyContent: "center", marginTop: 10, animation: "foyer-fadeup .9s ease .75s both" }}>
          <div
            style={{
              position: "relative",
              width: 190,
              boxSizing: "border-box",
              background: FOYER_DAY.card,
              border: `1px solid ${FOYER_DAY.cardLine}`,
              boxShadow: "0 5px 13px rgba(90,60,40,.1)",
              padding: "8px 12px 7px",
              transform: "rotate(-1.4deg)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: FOYER_DAY.rose,
              }}
            />
            <div style={{ fontSize: 6.5, letterSpacing: 2, color: FOYER_DAY.rose }}>AD ALTERUM · P.S.</div>
            <div style={{ fontSize: 11, fontStyle: "italic", color: FOYER_DAY.inkBody, marginTop: 2 }}>{note}</div>
          </div>
        </div>

        <FoyerFooter night={false} />
      </div>

      <FoyerToggles theme={theme} composition={composition} night={false} />
    </div>
  );
}
