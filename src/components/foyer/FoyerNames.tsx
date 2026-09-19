"use client";

import { useEffect, useState } from "react";
import { getCharName, getUserName } from "@/lib/template";
import { getOtherPortraitDataURL, getSelfPortraitDataURL } from "@/lib/portrait-store";
import { FOYER_DAY, FOYER_NIGHT } from "./tokens";
import { Whiplash } from "./Ornaments";

/**
 * The pair at the centre of the screen: two portraits, the two names on one
 * line, and the whiplash beneath them.
 *
 * The names come from "TA 的名字" / "你的名字" in /backstage/settings
 * (localStorage); the portraits from the two uploads on the same page
 * (IndexedDB). With nothing uploaded each is an empty ring — the ring is the
 * place. Theirs on the left, yours on the right, and the right one overlaps the
 * left a little.
 *
 * A portrait fills its whole circle (object-fit: cover at 100%): no gap is left
 * between the ring and the picture.
 */
export function FoyerNames({
  night,
  size = 48,
  overlap = 9,
  ringBg,
  nameSize = 16,
  nameSpacing = 10,
  nameMarginTop = 9,
  whiplash,
  glow = false,
  children,
}: {
  night: boolean;
  size?: number;
  overlap?: number;
  /** The ground inside the ring — what shows while a portrait is still loading,
   *  or when there is none. */
  ringBg: string;
  nameSize?: number;
  nameSpacing?: number;
  nameMarginTop?: number;
  whiplash?: { width?: number; delay?: number; opacity?: number };
  /** On the curtain screen the rings carry a slow rose glow. */
  glow?: boolean;
  /** Anything set below the names and the whiplash — the curtain screen's
   *  VESTIBULUM lines. */
  children?: React.ReactNode;
}) {
  const [names] = useState(() => ({ char: getCharName(), user: getUserName() }));
  const [portraits, setPortraits] = useState<{ char: string | null; user: string | null }>({
    char: null,
    user: null,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [self, other] = await Promise.all([getSelfPortraitDataURL(), getOtherPortraitDataURL()]);
        if (alive) setPortraits({ char: other, user: self });
      } catch {
        // With IndexedDB unavailable the rings simply stay empty.
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const leadBorder = night ? FOYER_NIGHT.gold : FOYER_DAY.rose;
  const trailBorder = night ? "rgba(201,167,104,.6)" : "rgba(178,58,110,.6)";
  const nameColor = night ? FOYER_NIGHT.goldBright : FOYER_DAY.ink;
  const stroke = night ? FOYER_NIGHT.gold : FOYER_DAY.roseLight;
  const dot = night ? FOYER_NIGHT.goldBright : FOYER_DAY.rose;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex" }}>
        <Ring src={portraits.char} alt={names.char} size={size} bg={ringBg} border={leadBorder} lead glow={glow} />
        <Ring src={portraits.user} alt={names.user} size={size} bg={ringBg} border={trailBorder} overlap={overlap} glow={glow} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif-cn)",
          fontSize: nameSize,
          letterSpacing: nameSpacing,
          paddingLeft: nameSpacing,
          color: nameColor,
          marginTop: nameMarginTop,
          whiteSpace: "nowrap",
        }}
      >
        {names.char} · {names.user}
      </div>
      <Whiplash stroke={stroke} dot={dot} opacity={whiplash?.opacity ?? 0.7} width={whiplash?.width} delay={whiplash?.delay} />
      {children}
    </div>
  );
}

function Ring({
  src,
  alt,
  size,
  bg,
  border,
  lead = false,
  overlap = 9,
  glow = false,
}: {
  src: string | null;
  alt: string;
  size: number;
  bg: string;
  border: string;
  lead?: boolean;
  overlap?: number;
  glow?: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${border}`,
        padding: 2,
        background: bg,
        zIndex: lead ? 2 : undefined,
        marginLeft: lead ? undefined : -overlap,
        animation: glow ? `foyer-glowp 4.5s ease-in-out ${lead ? "" : "-2.2s "}infinite alternate` : undefined,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <svg viewBox="0 0 64 64" width="100%" height="100%" style={{ display: "block" }} aria-label={alt} role="img">
          <circle cx="32" cy="32" r="29" fill="none" stroke={border} strokeOpacity="0.35" strokeWidth="0.8" />
        </svg>
      )}
    </div>
  );
}
