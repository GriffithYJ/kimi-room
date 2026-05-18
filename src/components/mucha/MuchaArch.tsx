// Mucha poster arch — supports two modes:
//
//   - Legacy fixed-size SVG (width + height props provided): single SVG
//     viewBox 350x500 — used by /playlist where the page has known dimensions.
//
//   - Adaptive (neither width nor height provided): 3-layer DOM frame that
//     fills its 100% parent — top arch svg + CSS column borders that stretch
//     + bottom laurel svg. Used by /room (6-tile grid) where content height
//     varies and the base laurel must sit under the last row.
//
// 2026-05-11: split because /room single-SVG version put the base laurel in
// the middle of the page instead of under V/VI. owner catch.

export function MuchaArch({
  color,
  accent,
  width,
  height,
}: {
  color: string;
  accent: string;
  width?: number;
  height?: number;
}) {
  if (width != null && height != null) {
    return <LegacyMuchaArch color={color} accent={accent} width={width} height={height} />;
  }
  return <AdaptiveMuchaArch color={color} accent={accent} />;
}

function LegacyMuchaArch({
  color,
  accent,
  width,
  height,
}: {
  color: string;
  accent: string;
  width: number;
  height: number;
}) {
  return (
    <svg viewBox="0 0 350 500" width={width} height={height} style={{ color }}>
      <defs>
        <pattern id="mk-dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.4" fill="currentColor" opacity="0.5" />
        </pattern>
      </defs>
      <g stroke="currentColor" fill="none" strokeWidth="0.7">
        <line x1="18" y1="80" x2="18" y2="460" />
        <line x1="26" y1="80" x2="26" y2="460" />
        <rect x="14" y="76" width="16" height="6" fill="currentColor" opacity="0.3" />
        <rect x="14" y="460" width="16" height="6" fill="currentColor" opacity="0.3" />
        <path d="M10 76 Q22 60 22 46 Q22 60 34 76" />
        <circle cx="22" cy="46" r="2" fill={accent} />
      </g>
      <g stroke="currentColor" fill="none" strokeWidth="0.7">
        <line x1="332" y1="80" x2="332" y2="460" />
        <line x1="324" y1="80" x2="324" y2="460" />
        <rect x="320" y="76" width="16" height="6" fill="currentColor" opacity="0.3" />
        <rect x="320" y="460" width="16" height="6" fill="currentColor" opacity="0.3" />
        <path d="M316 76 Q328 60 328 46 Q328 60 340 76" />
        <circle cx="328" cy="46" r="2" fill={accent} />
      </g>
      <path d="M30 80 Q30 30 175 24 Q320 30 320 80" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <path d="M42 80 Q42 42 175 36 Q308 42 308 80" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <g fill="currentColor" opacity="0.85">
        <circle cx="175" cy="18" r="5" />
        <circle cx="160" cy="24" r="3.5" />
        <circle cx="190" cy="24" r="3.5" />
        <circle cx="148" cy="30" r="2.5" />
        <circle cx="202" cy="30" r="2.5" />
      </g>
      <g stroke="currentColor" fill="none" strokeWidth="0.5">
        <path d="M140 34 Q120 60 110 90" />
        <path d="M210 34 Q230 60 240 90" />
        <path d="M175 26 L175 80" />
      </g>
      <g fill={accent} opacity="0.6">
        <ellipse cx="100" cy="85" rx="3" ry="8" transform="rotate(-30 100 85)" />
        <ellipse cx="250" cy="85" rx="3" ry="8" transform="rotate(30 250 85)" />
        <ellipse cx="80" cy="110" rx="2.5" ry="7" transform="rotate(-40 80 110)" />
        <ellipse cx="270" cy="110" rx="2.5" ry="7" transform="rotate(40 270 110)" />
      </g>
      <g stroke="currentColor" fill="none" strokeWidth="0.5" opacity="0.7">
        <path d="M40 470 Q100 478 175 474 Q250 478 310 470" />
        <path d="M60 478 Q110 484 175 482 Q240 484 290 478" opacity="0.5" />
      </g>
    </svg>
  );
}

function AdaptiveMuchaArch({ color, accent }: { color: string; accent: string }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", color }}>
      {/* TOP — flower crown + arch curves + column caps */}
      <svg viewBox="0 0 350 120" width="350" height="120" style={{ position: "absolute", top: 0, left: 0 }}>
        <path d="M30 80 Q30 30 175 24 Q320 30 320 80" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <path d="M42 80 Q42 42 175 36 Q308 42 308 80" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        <g fill="currentColor" opacity="0.85">
          <circle cx="175" cy="18" r="5" />
          <circle cx="160" cy="24" r="3.5" />
          <circle cx="190" cy="24" r="3.5" />
          <circle cx="148" cy="30" r="2.5" />
          <circle cx="202" cy="30" r="2.5" />
        </g>
        <g stroke="currentColor" fill="none" strokeWidth="0.5">
          <path d="M140 34 Q120 60 110 90" />
          <path d="M210 34 Q230 60 240 90" />
          <path d="M175 26 L175 80" />
        </g>
        <g fill={accent} opacity="0.6">
          <ellipse cx="100" cy="85" rx="3" ry="8" transform="rotate(-30 100 85)" />
          <ellipse cx="250" cy="85" rx="3" ry="8" transform="rotate(30 250 85)" />
          <ellipse cx="80" cy="110" rx="2.5" ry="7" transform="rotate(-40 80 110)" />
          <ellipse cx="270" cy="110" rx="2.5" ry="7" transform="rotate(40 270 110)" />
        </g>
        <rect x="14" y="76" width="16" height="6" fill="currentColor" opacity="0.3" />
        <rect x="320" y="76" width="16" height="6" fill="currentColor" opacity="0.3" />
        <g stroke="currentColor" fill="none" strokeWidth="0.7">
          <path d="M10 76 Q22 60 22 46 Q22 60 34 76" />
          <path d="M316 76 Q328 60 328 46 Q328 60 340 76" />
        </g>
        <circle cx="22" cy="46" r="2" fill={accent} />
        <circle cx="328" cy="46" r="2" fill={accent} />
      </svg>

      {/* LEFT column — double pillar CSS borders (stretches, ends above base wrap) */}
      <div style={{ position: "absolute", top: 80, bottom: 60, left: 18, width: 8, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, borderLeft: `0.7px solid ${color}` }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 8, borderLeft: `0.7px solid ${color}` }} />
      </div>

      {/* RIGHT column — mirror */}
      <div style={{ position: "absolute", top: 80, bottom: 60, right: 18, width: 8, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, borderLeft: `0.7px solid ${color}` }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 8, borderLeft: `0.7px solid ${color}` }} />
      </div>

      {/* BASE — closed horizontal line wrapping corners. Mirror of top arch
          curves: column lines enter at y=0, curve outward + downward,
          straighten into a clean horizontal line across bottom, curve back
          up to the opposite column. Two-layer (outer thicker, inner lighter)
          mirrors top double curve. No 装饰 (owner ask 不要 finial dots/laurels).  */}
      <svg viewBox="0 0 350 60" width="350" height="60" style={{ position: "absolute", bottom: 0, left: 0 }}>
        {/* outer wrap — connects left outer column line (x=18) to right outer (x=332) */}
        <path
          d="M18 0 Q18 35 35 45 L315 45 Q332 35 332 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
        />
        {/* inner wrap — lighter, mirrors top inner arch */}
        <path
          d="M26 0 Q26 28 40 38 L310 38 Q324 28 324 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
