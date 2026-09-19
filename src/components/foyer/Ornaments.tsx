// The foyer's ornaments — every one a drawn SVG path. No icon library, no icon
// font, no emoji.

import { FOYER_DAY, FOYER_NIGHT } from "./tokens";

// Tailwind's preflight sets svg to display:block, so one dropped into a
// text-align:center container will not centre itself. Every ornament that lands
// inside a block of text carries this; inside a flex-centred container it is
// harmless.
//
// Written out as marginLeft/marginRight rather than the marginInline shorthand:
// the shorthand serialises differently on the server and the client, which is a
// hydration mismatch. Written out, both sides agree.
const CENTERED = { marginLeft: "auto", marginRight: "auto" } as const;

/** The whiplash under the names, a dot at either end. Drawn in one stroke as
 *  the screen enters. */
export function Whiplash({
  stroke,
  dot,
  opacity = 0.75,
  width = 130,
  delay = 1,
}: {
  stroke: string;
  dot: string;
  opacity?: number;
  width?: number;
  delay?: number;
}) {
  return (
    <svg
      width={width}
      height={width * (12 / 130)}
      viewBox="0 0 130 12"
      fill="none"
      style={{ marginTop: 3, ...CENTERED }}
      aria-hidden
    >
      <path
        d="M6 7 C34 -1 52 13 65 6 C78 -1 96 13 124 5"
        stroke={stroke}
        opacity={opacity}
        strokeDasharray="150"
        style={{ animation: `foyer-drawin 1.6s ease ${delay}s both` }}
      />
      <circle cx="6" cy="7" r="1.4" fill={dot} />
      <circle cx="124" cy="5" r="1.4" fill={dot} />
    </svg>
  );
}

/** The small whiplash above the line, day. */
export function QuoteWhiplashDay() {
  return (
    <svg width="56" height="10" viewBox="0 0 56 10" fill="none" style={{ marginBottom: 4, ...CENTERED }} aria-hidden>
      <path
        d="M2 5 C12 1 20 9 28 5 C36 1 44 9 54 5"
        stroke={FOYER_DAY.roseLight}
        opacity=".6"
        strokeDasharray="150"
        style={{ animation: "foyer-drawin 1.6s ease 1.2s both" }}
      />
      <circle cx="28" cy="5" r="1.6" fill={FOYER_DAY.rose} />
    </svg>
  );
}

/** The gilt double volute of night — one shape, used above the line (draw=true
 *  strokes it on entry) and again in the footer. */
export function DoubleScrollNight({
  width = 72,
  draw = false,
  opacity = 0.7,
  marginBottom = 0,
  marginTop = 0,
}: {
  width?: number;
  draw?: boolean;
  opacity?: number;
  marginBottom?: number;
  marginTop?: number;
}) {
  return (
    <svg
      width={width}
      height={14}
      viewBox="0 0 72 14"
      fill="none"
      style={{ marginBottom, marginTop, ...CENTERED }}
      aria-hidden
    >
      <path
        d="M36 7 C30 1 22 1 18 5 C15 8 17 12 21 11 C24 10 24 6 20 6 M36 7 C42 1 50 1 54 5 C57 8 55 12 51 11 C48 10 48 6 52 6"
        stroke={FOYER_NIGHT.gold}
        opacity={opacity}
        {...(draw
          ? { strokeDasharray: "150", style: { animation: "foyer-drawin 1.6s ease 1.2s both" } }
          : {})}
      />
      <path d="M2 7 H12 M60 7 H70" stroke={FOYER_NIGHT.gold} opacity={draw ? ".35" : ".4"} />
      <circle cx="36" cy="7" r={draw ? 1.6 : 1.4} fill={FOYER_NIGHT.goldBright} />
    </svg>
  );
}

/** The footer whiplash, day. */
export function FooterWhiplashDay() {
  return (
    <svg width="96" height="10" viewBox="0 0 96 10" fill="none" style={{ marginTop: 4, ...CENTERED }} aria-hidden>
      <path
        d="M4 6 C24 -1 40 11 48 5 C56 -1 72 11 92 4"
        stroke={FOYER_DAY.roseLight}
        opacity=".7"
      />
      <circle cx="48" cy="5" r="1.3" fill={FOYER_DAY.rose} />
    </svg>
  );
}

/** A small sun — the weather row in rose, the day seal at night in gilt. The
 *  caller gives the colour. */
export function SunGlyph({ size = 11, color = FOYER_DAY.rose }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="3" stroke={color} />
      <path
        d="M7 1 V2.4 M7 11.6 V13 M1 7 H2.4 M11.6 7 H13 M2.8 2.8 L3.8 3.8 M10.2 10.2 L11.2 11.2 M11.2 2.8 L10.2 3.8 M3.8 10.2 L2.8 11.2"
        stroke={color}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A waning moon — the weather row, LUNA HODIE, and the night seal by day. */
export function MoonGlyph({
  size = 10,
  color = FOYER_NIGHT.goldBright,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M9.5 1.5 A5.8 5.8 0 1 0 9.5 12.5 A4.6 4.6 0 1 1 9.5 1.5 Z" fill={color} />
    </svg>
  );
}

/** Three arches — shown on the right seal while full, since tapping goes to
 *  the triptych. */
export function TriArchGlyph({ color }: { color: string }) {
  return (
    <svg width="16" height="13" viewBox="0 0 18 14" fill="none" aria-hidden>
      <path d="M2 13 V9 A2.2 2.2 0 0 1 6.4 9 V13 Z" stroke={color} />
      <path d="M6.9 13 V7 A2.1 2.1 0 0 1 11.1 7 V13 Z" stroke={color} />
      <path d="M11.6 13 V9 A2.2 2.2 0 0 1 16 9 V13 Z" stroke={color} />
    </svg>
  );
}

/** A single arch — shown on the right seal while the triptych is up. */
export function SingleArchGlyph({ color }: { color: string }) {
  return (
    <svg width="16" height="13" viewBox="0 0 18 14" fill="none" aria-hidden>
      <path d="M4.5 13 V7 A4.5 4.5 0 0 1 13.5 7 V13 Z" stroke={color} />
      <path d="M2 13 H16" stroke={color} opacity=".5" />
    </svg>
  );
}

/** The five-petalled sprig flanking the count on the curtain screen; flip
 *  mirrors it for the right side. */
export function VineSprig({ flip = false }: { flip?: boolean }) {
  const petals: [number, number, number][] = [
    [30, 18, 42],
    [23, 34, 24],
    [20, 51, 4],
    [23, 68, -18],
    [30, 82, -38],
  ];
  return (
    <svg
      width="46"
      height="92"
      viewBox="0 0 46 92"
      fill="none"
      style={{
        marginLeft: flip ? 14 : undefined,
        marginRight: flip ? undefined : 14,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      aria-hidden
    >
      <path d="M40 6 C16 26 12 62 34 88" stroke={FOYER_DAY.olive} opacity=".75" />
      {petals.map(([cx, cy, rot]) => (
        <ellipse
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          rx="2.6"
          ry="7"
          fill={FOYER_DAY.rosePetal}
          opacity=".7"
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
      ))}
    </svg>
  );
}

/** The rose spiral on the FLOS HODIERNVS line. */
export function RoseSpiralGlyph() {
  return (
    <svg width="9" height="9" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 7 C7.8 6.4 7.6 5.2 6.6 5 C5.2 4.7 4.2 6 4.6 7.4 C5.1 9.2 7.2 9.9 8.9 9.1 C11 8.1 11.4 5.4 10 3.7 C8.9 2.4 7 1.9 5.3 2.5"
        stroke={FOYER_DAY.rose}
      />
    </svg>
  );
}

/** The gilt star at the crown of a night lancet. */
export function LancetStar() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 8 8"
      fill="none"
      style={{ position: "absolute", left: "50%", top: -4, transform: "translateX(-50%)" }}
      aria-hidden
    >
      <path d="M4 0 L4.9 3.1 L8 4 L4.9 4.9 L4 8 L3.1 4.9 L0 4 L3.1 3.1 Z" fill={FOYER_NIGHT.gold} />
    </svg>
  );
}

/** The star pinning the night slip to the wall. */
export function NoteStar() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)" }}
      aria-hidden
    >
      <path d="M7 1 L8.2 5.8 L13 7 L8.2 8.2 L7 13 L5.8 8.2 L1 7 L5.8 5.8 Z" fill={FOYER_NIGHT.gold} />
    </svg>
  );
}

/** The corner scroll at each corner of the triptych's double frame. */
export function CornerScroll({
  position,
  night,
}: {
  position: "tl" | "tr" | "bl" | "br";
  night: boolean;
}) {
  const transform = {
    tl: undefined,
    tr: "scaleX(-1)",
    bl: "scaleY(-1)",
    br: "scale(-1, -1)",
  }[position];
  const pos = {
    tl: { top: 13, left: 13 },
    tr: { top: 13, right: 13 },
    bl: { bottom: 13, left: 13 },
    br: { bottom: 13, right: 13 },
  }[position];
  const outer = night ? FOYER_NIGHT.gold : FOYER_DAY.olive;
  const inner = night ? FOYER_NIGHT.goldBright : FOYER_DAY.roseLight;
  const dot = night ? FOYER_NIGHT.goldBright : FOYER_DAY.rose;
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      style={{ position: "absolute", ...pos, zIndex: 6, transform }}
      aria-hidden
    >
      <path d="M2 28 A26 26 0 0 1 28 2" stroke={outer} opacity={night ? ".55" : ".6"} />
      <path d="M2 20 A18 18 0 0 1 20 2" stroke={inner} opacity={night ? ".4" : ".5"} />
      <circle cx="9" cy="9" r="1.6" fill={dot} opacity={night ? ".8" : ".7"} />
    </svg>
  );
}
