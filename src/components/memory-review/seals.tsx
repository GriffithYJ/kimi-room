"use client";

import { ReactNode } from "react";
import { paletteFor } from "./theme";

/**
 * Shared visual primitives for /room/memory-review:
 * - Chip (pill with accent-dot prefix, 9.5px Inter)
 * - WaxSeal (34px round button w/ inset double-ring stamp shadow)
 * - Seal glyphs (Check / Pen / Cross / Back / Close)
 *
 * Aligned to design-final (memory-review-final.html · Variant B 蜡封圆章).
 */

export function Chip({
  src,
  palette: p,
}: {
  src: string;
  palette: ReturnType<typeof paletteFor>;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 9px 3px 8px",
        borderRadius: 999,
        border: `1px solid ${p.chipBorder}`,
        background: p.chipBg,
        fontFamily: '"Inter", sans-serif',
        fontSize: 9.5,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: p.chipInk,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: p.accent,
          display: "inline-block",
        }}
      />
      {src}
    </span>
  );
}

export function WaxSeal({
  title,
  color,
  ring,
  bg,
  disabled,
  onClick,
  children,
}: {
  title: string;
  color: string;
  ring: string;
  bg: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="kimi-btn-anim"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: bg,
        border: `1px solid ${ring}`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        cursor: disabled ? "wait" : "pointer",
        opacity: disabled ? 0.4 : 1,
        boxShadow: `inset 0 0 0 3px ${bg}, inset 0 0 0 4px ${ring}`,
        transition: "transform 150ms",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "rgba(0,0,0,0.1)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(1.06)";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
}

/* ── seal glyphs ──────────────────────────────────────────────── */

export function SealCheck({ c }: { c: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path
        d="M 3 7.5 L 5.8 10.2 L 11 4.5"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SealPen({ c }: { c: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path
        d="M 2.5 11.5 L 4.5 11 L 11 4.5 L 9.5 3 L 3 9.5 Z"
        stroke={c}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M 8.6 3.9 L 10.1 5.4"
        stroke={c}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SealCross({ c }: { c: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path
        d="M 4 4 L 10 10 M 10 4 L 4 10"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SealBack({ c }: { c: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path
        d="M 4 7 L 8 7 Q 11 7 11 9.5 L 11 10.5"
        stroke={c}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 6 5 L 4 7 L 6 9"
        stroke={c}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ── card frame helpers ──────────────────────────────────────────
 * Shared <CardFrame/> wrapper rendering the L1 (DAY · 卷叶) / L4
 * (NIGHT · 手抄本) chrome consistently — top hinge medallion bridging
 * the border, lacquer / glass fill, 1px accent border.
 */

export function HingeMedallion({ color, paper }: { color: string; paper: string }) {
  return (
    <svg
      width="60"
      height="10"
      viewBox="0 0 60 10"
      aria-hidden
      style={{
        position: "absolute",
        top: -6,
        left: "50%",
        transform: "translateX(-50%)",
        background: paper,
        padding: "0 8px",
        boxSizing: "content-box",
      }}
    >
      <g stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round">
        <path d="M 4 5 L 22 5" />
        <circle cx="30" cy="5" r="1.4" fill={color} />
        <circle cx="30" cy="5" r="2.6" />
        <path d="M 38 5 L 56 5" />
      </g>
    </svg>
  );
}
