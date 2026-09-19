"use client";

import { FOYER_NIGHT } from "./tokens";
import { DoubleScrollNight } from "./Ornaments";
import { FoyerWeather } from "./FoyerWeather";
import { FoyerFooter } from "./FoyerFooter";
import { FoyerToggles } from "./FoyerToggles";
import { FoyerNames } from "./FoyerNames";
import type { FoyerScreenProps } from "./types";

/**
 * Night · one window, filling the screen.
 *
 * The glass runs edge to edge, dark at the top and bottom, a warm breath of
 * light at its centre, and a deep vignette over all of it to pull the eye into
 * the middle of the glass — one light source. Gilt scrollwork at the corners.
 *
 * swipeHandlers is laid over the stage to turn the windows; NightWindowRotor
 * supplies it.
 */
export function NightWindow({
  dies,
  diesRoman,
  greet,
  milestone,
  quote,
  sinceLine,
  composition,
  theme,
  weather,
  windowSrc = "/images/foyer/baroque-window.webp",
  // The colour of the light — the glow and the dust — bound to this window's
  // dominant hue, so what comes through the glass is that window's own colour.
  // The gilt frame does not move. "R,G,B".
  lightGlow = "240,190,90",
  swipeHandlers,
}: FoyerScreenProps & {
  windowSrc?: string;
  lightGlow?: string;
  swipeHandlers?: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
  };
}) {
  return (
    <div
      className="foyer-stage"
      {...swipeHandlers}
      style={{
        color: FOYER_NIGHT.paperSoft,
        fontFamily: "var(--font-serif)",
        background: FOYER_NIGHT.bgSolid,
        // This screen does not scroll, so a vertical drag can only read as
        // overscroll — which in Safari, and in a PWA on the home screen, is
        // pull-to-refresh. Turning a window runs on pointer events and does not
        // care about touch-action.
        touchAction: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={windowSrc}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 28%",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,4,3,.85) 0%, rgba(5,4,3,.32) 24%, rgba(5,4,3,.22) 50%, rgba(5,4,3,.88) 78%, rgba(5,4,3,.97) 100%)",
        }}
      />
      {/* Two layers of it: a bright core, then a wide soft wash, so the whole
          air of the screen takes the window's colour. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 40% at 50% 34%, rgba(${lightGlow},.30), transparent 68%)`,
          animation: "foyer-flick 7s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(115% 78% at 50% 42%, rgba(${lightGlow},.16), transparent 74%)`,
          mixBlendMode: "screen",
          animation: "foyer-flick 4.3s ease-in-out -1.7s infinite",
        }}
      />
      {/* Gold dust — four motes settling slowly through the window. */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 2 }}>
        {[
          { left: "40%", top: 158, s: 2, dur: "11s", delay: "-2s", o: 0.85, blur: 4 },
          { left: "47%", top: 142, s: 1.5, dur: "14s", delay: "-7s", o: 0.75, blur: 3 },
          { left: "54%", top: 170, s: 2, dur: "9.5s", delay: "-4.5s", o: 0.8, blur: 4 },
          { left: "60%", top: 150, s: 1.5, dur: "12.5s", delay: "-10s", o: 0.7, blur: 3 },
        ].map((m, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: m.left,
              top: m.top,
              width: m.s,
              height: m.s,
              borderRadius: "50%",
              background: `rgba(245,215,150,${m.o})`,
              boxShadow: `0 0 ${m.blur}px rgba(${lightGlow},.55)`,
              animation: `foyer-mote ${m.dur} linear ${m.delay} infinite`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 150px 46px rgba(3,2,1,.82)",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      <GoldCorner src="corner-gold-1" pos={{ top: 4, left: 4 }} width={136} opacity={0.34} />
      <GoldCorner src="corner-gold-1" pos={{ top: 4, right: 4 }} width={136} opacity={0.34} flip />
      <GoldCorner src="corner-gold-4" pos={{ bottom: 4, left: 4 }} width={108} opacity={0.3} />
      <GoldCorner src="corner-gold-4" pos={{ bottom: 4, right: 4 }} width={108} opacity={0.3} flip />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          paddingTop: 56,
          textShadow: FOYER_NIGHT.textShadow,
        }}
      >
        <div style={{ textAlign: "center", flex: "none", animation: "foyer-fadeup .8s ease .05s both" }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: FOYER_NIGHT.paperMute }}>{greet}</div>
        </div>

        <FoyerWeather night marginTop={12} delay={0.15} location={weather} />

        {/* everything below is pushed into the lower half; the upper half is
            the window's */}
        <div style={{ marginTop: "auto" }} />

        <div
          style={{
            flex: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "foyer-fadeup .9s ease .3s both",
          }}
        >
          <FoyerNames night ringBg={FOYER_NIGHT.avatarBg} nameSize={17} nameMarginTop={10} />
        </div>

        <div style={{ textAlign: "center", flex: "none", marginTop: 10, animation: "foyer-fadeup .9s ease .4s both" }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: FOYER_NIGHT.paperMute }}>NOX</div>
          <div
            style={{
              fontSize: 46,
              fontWeight: 500,
              lineHeight: "48px",
              color: FOYER_NIGHT.paper,
              letterSpacing: 1,
              fontFeatureSettings: "'onum' 1",
            }}
          >
            {dies}
          </div>
          <div style={{ fontSize: 9.5, fontStyle: "italic", letterSpacing: 3.5, color: FOYER_NIGHT.gold, marginTop: 1 }}>
            · {diesRoman} ·
          </div>
          <div style={{ fontSize: 7, letterSpacing: 2.5, color: FOYER_NIGHT.goldBright, marginTop: 3 }}>
            LUX PER VITRUM · {sinceLine}
          </div>
          <div style={{ fontSize: 6.5, letterSpacing: 2, color: FOYER_NIGHT.paperMute, marginTop: 2 }}>{milestone}</div>
        </div>

        <div style={{ textAlign: "center", flex: "none", padding: "8px 56px 0", animation: "foyer-fadeup .9s ease .5s both" }}>
          <DoubleScrollNight draw marginBottom={3} />
          <div style={{ fontSize: 13.5, fontStyle: "italic", lineHeight: 1.6, color: FOYER_NIGHT.paperQuote }}>
            {quote.lines.map((l, i) => (
              <span key={l}>
                {i > 0 && <br />}
                {l}
              </span>
            ))}
          </div>
        </div>

        <FoyerFooter night marginTopAuto={false} paddingTop={16} />
      </div>

      <FoyerToggles theme={theme} composition={composition} night />
    </div>
  );
}

function GoldCorner({
  src,
  pos,
  width,
  opacity,
  flip = false,
}: {
  src: string;
  pos: React.CSSProperties;
  width: number;
  opacity: number;
  flip?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/foyer/${src}.png`}
      alt=""
      style={{
        position: "absolute",
        ...pos,
        width,
        zIndex: 5,
        opacity,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    />
  );
}
