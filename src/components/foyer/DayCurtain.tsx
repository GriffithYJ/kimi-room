"use client";

import { useState } from "react";
import { FLOWER_PANELS, FLOWER_NAMES } from "@/lib/foyer";
import { useSwipe } from "@/lib/use-swipe";
import { FOYER_DAY } from "./tokens";
import { QuoteWhiplashDay, VineSprig } from "./Ornaments";
import { FoyerWeather } from "./FoyerWeather";
import { FoyerFooter } from "./FoyerFooter";
import { FoyerToggles } from "./FoyerToggles";
import { FoyerNames } from "./FoyerNames";
import type { FoyerScreenProps } from "./types";

/**
 * Day · side curtains.
 *
 * Two floral panels printed into the cream paper from either edge (multiply,
 * masked to fade in both directions, no frame), with a drawn arch between them.
 * Tap either column, or swipe, for the next pair — left alone they turn once a
 * day.
 */
export function DayCurtain({
  dies,
  diesRoman,
  greet,
  todayLatin,
  milestone,
  quote,
  note,
  flowerIndex,
  sinceLine,
  composition,
  theme,
  weather,
}: FoyerScreenProps & { todayLatin: string; flowerIndex: number }) {
  const [idx, setIdx] = useState(flowerIndex);
  const cycle = () => setIdx((i) => (i + 1) % FLOWER_PANELS.length);
  const cyclePrev = () => setIdx((i) => (i - 1 + FLOWER_PANELS.length) % FLOWER_PANELS.length);
  const swipe = useSwipe(cycle, cyclePrev); // sideways turns the pair; tapping a column still does too

  const lIdx = idx % FLOWER_PANELS.length;
  const rIdx = (idx + 3) % FLOWER_PANELS.length;

  return (
    <div
      className="foyer-stage"
      {...swipe}
      style={{
        color: FOYER_DAY.ink,
        fontFamily: "var(--font-serif)",
        background: FOYER_DAY.bg,
        // See the same spot in NightWindow: this screen does not scroll, so a
        // vertical drag reads as pull-to-refresh in Safari and in a PWA.
        touchAction: "none",
      }}
    >
      {/* the curtains — printed onto the bare wall, dissolving into the paper */}
      <FlowerColumn side="left" src={FLOWER_PANELS[lIdx]} />
      <FlowerColumn side="right" src={FLOWER_PANELS[rIdx]} />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/foyer/corner-rose-1.png"
        alt=""
        style={{ position: "absolute", top: 4, left: 4, width: 112, opacity: 0.32 }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/foyer/corner-rose-1.png"
        alt=""
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          width: 112,
          opacity: 0.32,
          transform: "scaleX(-1)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          paddingTop: 58,
        }}
      >
        <button
          type="button"
          onClick={cycle}
          aria-label="换一对花"
          style={{ ...TAP_ZONE, left: 0 }}
        />
        <button
          type="button"
          onClick={cycle}
          aria-label="换一对花"
          style={{ ...TAP_ZONE, right: 0 }}
        />

        <div style={{ textAlign: "center", flex: "none", animation: "foyer-fadeup .8s ease .05s both" }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: FOYER_DAY.mute }}>{greet}</div>
          <div style={{ fontSize: 7.5, letterSpacing: 3, color: FOYER_DAY.rose, marginTop: 5 }}>
            {todayLatin}
          </div>
        </div>

        {/* the arch */}
        <div style={{ position: "relative", height: 240, flex: "none", animation: "foyer-fadeup .9s ease .15s both" }}>
          <svg
            width="100%"
            height="240"
            viewBox="0 0 402 240"
            fill="none"
            style={{ position: "absolute", inset: 0 }}
            aria-hidden
          >
            <path d="M18 238 C64 66 338 66 384 238" stroke={FOYER_DAY.olive} strokeWidth="1" opacity=".85" />
            <path
              d="M26 238 C70 74 332 74 376 238"
              stroke={FOYER_DAY.roseLight}
              strokeWidth="2.6"
              opacity=".45"
              strokeDasharray="0.5 9"
              strokeLinecap="round"
              style={{ animation: "foyer-dashflow 30s linear infinite" }}
            />
            <path d="M38 238 C80 84 322 84 364 238" stroke={FOYER_DAY.olive} opacity=".3" />
            <circle cx="201" cy="128" r="84" stroke={FOYER_DAY.olive} opacity=".55" />
            <g style={{ transformOrigin: "201px 128px", animation: "foyer-spin 130s linear infinite reverse" }}>
              <circle cx="201" cy="128" r="72" stroke={FOYER_DAY.roseLight} opacity=".5" strokeDasharray="2 7" />
              <circle cx="201" cy="56" r="2" fill={FOYER_DAY.rose} />
              <circle cx="201" cy="200" r="2" fill={FOYER_DAY.rose} />
              <circle cx="129" cy="128" r="2" fill={FOYER_DAY.rose} />
              <circle cx="273" cy="128" r="2" fill={FOYER_DAY.rose} />
            </g>
            <g style={{ animation: "foyer-flick 5.5s ease-in-out infinite" }}>
              <circle cx="201" cy="12" r="3.4" fill={FOYER_DAY.rose} />
              <circle cx="176" cy="20" r="2" fill={FOYER_DAY.rosePetal} />
              <circle cx="226" cy="20" r="2" fill={FOYER_DAY.rosePetal} />
            </g>
            <g style={{ transformOrigin: "44px 230px", animation: "foyer-sway 8s ease-in-out infinite alternate" }}>
              <path
                d="M30 236 C24 172 58 152 84 166 C106 178 98 206 78 204 C62 202 60 184 72 180"
                stroke={FOYER_DAY.olive}
                opacity=".7"
              />
              <ellipse cx="94" cy="154" rx="3.2" ry="7.5" fill={FOYER_DAY.rosePetal} opacity=".75" transform="rotate(-38 94 154)" />
              <ellipse cx="70" cy="200" rx="2.8" ry="6.5" fill={FOYER_DAY.rosePetal} opacity=".55" transform="rotate(-64 70 200)" />
            </g>
            <g style={{ transformOrigin: "358px 230px", animation: "foyer-sway 8s ease-in-out -4s infinite alternate" }}>
              <path
                d="M372 236 C378 172 344 152 318 166 C296 178 304 206 324 204 C340 202 342 184 330 180"
                stroke={FOYER_DAY.olive}
                opacity=".7"
              />
              <ellipse cx="308" cy="154" rx="3.2" ry="7.5" fill={FOYER_DAY.rosePetal} opacity=".75" transform="rotate(38 308 154)" />
              <ellipse cx="332" cy="200" rx="2.8" ry="6.5" fill={FOYER_DAY.rosePetal} opacity=".55" transform="rotate(64 332 200)" />
            </g>
          </svg>

          {/* portraits, names, whiplash and the two small lines — one block,
              set into the heart of the arch */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}>
            <FoyerNames
              night={false}
              size={58}
              overlap={10}
              glow
              ringBg={FOYER_DAY.bgSolid}
              nameSize={21}
              nameSpacing={12}
              nameMarginTop={16}
            >
              <div style={{ fontSize: 8, letterSpacing: 4, color: FOYER_DAY.rose, marginTop: 3 }}>
                VESTIBULUM · FOYER
              </div>
              <div style={{ fontSize: 6.5, letterSpacing: 2, color: FOYER_DAY.mute, marginTop: 4 }}>
                {FLOWER_NAMES[lIdx]} × {FLOWER_NAMES[rIdx]} · TANGE LATERA
              </div>
            </FoyerNames>
          </div>
        </div>

        <FoyerWeather night={false} marginTop={4} delay={0.3} location={weather} />

        {/* the count, with the rose drawing breathing behind it */}
        <div
          style={{
            position: "relative",
            height: 138,
            flex: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "foyer-fadeup .9s ease .4s both",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/foyer/rose-outline.webp"
            alt=""
            style={{
              position: "absolute",
              width: 150,
              height: 150,
              opacity: 0.16,
              animation: "foyer-breath 5.5s ease-in-out infinite alternate",
            }}
          />
          <VineSprig />
          <div style={{ textAlign: "center", position: "relative" }}>
            <div style={{ fontSize: 9, letterSpacing: 5, color: FOYER_DAY.mute }}>DIES</div>
            <div
              style={{
                fontSize: 60,
                fontWeight: 500,
                lineHeight: "60px",
                color: FOYER_DAY.ink,
                marginTop: 1,
                letterSpacing: 1,
                fontFeatureSettings: "'onum' 1",
              }}
            >
              {dies}
            </div>
            <div style={{ fontSize: 10, fontStyle: "italic", letterSpacing: 3.5, color: FOYER_DAY.mute, marginTop: 2 }}>
              · {diesRoman} ·
            </div>
            <div style={{ fontSize: 8, letterSpacing: 3, color: FOYER_DAY.rose, marginTop: 3 }}>{sinceLine}</div>
            <div style={{ fontSize: 7.5, letterSpacing: 2.5, color: FOYER_DAY.mute, marginTop: 2 }}>
              {milestone}
            </div>
          </div>
          <VineSprig flip />
        </div>

        <div style={{ textAlign: "center", flex: "none", padding: "4px 50px 0", animation: "foyer-fadeup .9s ease .5s both" }}>
          <QuoteWhiplashDay />
          <div style={{ fontSize: 14.5, fontStyle: "italic", lineHeight: 1.6, color: FOYER_DAY.inkQuote }}>
            {quote.lines.map((l, i) => (
              <span key={l}>
                {i > 0 && <br />}
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* the slip by the door */}
        <div style={{ flex: "none", display: "flex", justifyContent: "center", marginTop: 20, animation: "foyer-fadeup .9s ease .6s both" }}>
          <div
            style={{
              position: "relative",
              width: 236,
              boxSizing: "border-box",
              background: FOYER_DAY.card,
              border: `1px solid ${FOYER_DAY.cardLine}`,
              boxShadow: FOYER_DAY.cardShadow,
              padding: "10px 14px 9px",
              transform: "rotate(-1.6deg)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: FOYER_DAY.rose,
              }}
            />
            <div style={{ fontSize: 7.5, letterSpacing: 3, color: FOYER_DAY.rose }}>AD ALTERUM · P.S.</div>
            <div style={{ fontSize: 13, fontStyle: "italic", color: FOYER_DAY.inkBody, marginTop: 3 }}>{note}</div>
            {/* the wax seal */}
            <span
              style={{
                position: "absolute",
                right: -9,
                bottom: -9,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: FOYER_DAY.rose,
                boxShadow: "0 2px 6px rgba(140,40,80,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: "50%",
                  border: "1px solid rgba(247,240,230,.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontStyle: "italic",
                  fontSize: 10,
                  color: FOYER_DAY.bgSolid,
                }}
              >
                &amp;
              </span>
            </span>
          </div>
        </div>

        <FoyerFooter night={false} />
      </div>

      <FoyerToggles theme={theme} composition={composition} night={false} />
    </div>
  );
}

const TAP_ZONE = {
  position: "absolute",
  top: 118,
  bottom: 92,
  width: 70,
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  zIndex: 2,
} as const;

function FlowerColumn({ side, src }: { side: "left" | "right"; src: string }) {
  return (
    <div
      style={{
        position: "absolute",
        [side]: 0,
        top: 118,
        bottom: 92,
        width: 94,
        WebkitMaskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, rgba(0,0,0,1) 42%, transparent 100%)`,
        maskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, rgba(0,0,0,1) 42%, transparent 100%)`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          mixBlendMode: "multiply",
          opacity: 0.78,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 9%, rgba(0,0,0,1) 91%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 9%, rgba(0,0,0,1) 91%, transparent 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
        />
      </div>
    </div>
  );
}
