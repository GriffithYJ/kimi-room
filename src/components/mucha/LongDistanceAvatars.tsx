"use client";

// V2 LongDistanceAvatars · canon 异地情侣 vibe (两 avatar 各自轴 spin · 中
// 间音符 pulse). canon V1 hardcode /images/pairs/pair-rose-{owner,ito}.jpg
// (V2 owner 0701 删 pair JPG · 这是 maintainer face 合成).
// V2 swap to portrait-store IDB (settings runtime upload p2 path) · 没 portrait
// 时 fall back inline SVG ring placeholder.

import { useEffect, useState } from "react";
import {
  getOtherPortraitDataURL,
  getSelfPortraitDataURL,
} from "@/lib/portrait-store";

const PLACEHOLDER_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-opacity="0.25" stroke-width="0.8"/></svg>',
  );

export function LongDistanceAvatars({
  size = 72,
  gap = 36,
  accent = "#8a6558",
  playing = true,
}: {
  size?: number;
  gap?: number;
  accent?: string;
  playing?: boolean;
}) {
  const [selfSrc, setSelfSrc] = useState<string | undefined>(undefined);
  const [otherSrc, setOtherSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [s, o] = await Promise.all([
          getSelfPortraitDataURL(),
          getOtherPortraitDataURL(),
        ]);
        if (!alive) return;
        if (s) setSelfSrc(s);
        if (o) setOtherSrc(o);
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  const spinAnim = playing ? "ld-spin 14s linear infinite" : "none";
  const pulseAnim = playing ? "ld-pulse 2.6s ease-in-out infinite" : "none";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap,
        position: "relative",
        padding: "4px 8px",
      }}
    >
      <style>{`
        @keyframes ld-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ld-pulse { 0%,100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
        @keyframes ld-drift {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>

      <Avatar
        src={selfSrc ?? PLACEHOLDER_SVG}
        size={size}
        accent={accent}
        anim={spinAnim}
      />

      <div
        aria-hidden
        style={{
          color: accent,
          animation: pulseAnim,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Connector size={Math.round(size * 0.7)} />
      </div>

      <Avatar
        src={otherSrc ?? PLACEHOLDER_SVG}
        size={size}
        accent={accent}
        anim={spinAnim}
      />
    </div>
  );
}

function Avatar({
  src,
  size,
  accent,
  anim,
  ito = false,
}: {
  src: string;
  size: number;
  accent: string;
  anim: string;
  ito?: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${accent}`,
        padding: 3,
        boxShadow: `0 0 0 1px ${accent}33, 0 6px 20px rgba(0,0,0,0.18)`,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundImage: `url(${src})`,
          backgroundSize: ito ? "125%" : "cover",
          backgroundPosition: ito ? "center 28%" : "center",
          animation: anim,
        }}
      />
    </div>
  );
}

function Connector({ size = 50 }: { size?: number }) {
  // 两个 4 分音符 + 弧形横连 (like a beam) — 异地但 phrasing 同一句
  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 60 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="6" cy="22" rx="4" ry="3" fill="currentColor" transform="rotate(-12 6 22)" />
      <line x1="9.4" y1="22" x2="9.4" y2="4" stroke="currentColor" strokeWidth="0.9" />
      <path d="M 9.4 6 Q 30 -1, 50.6 6" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.55" />
      <ellipse cx="54" cy="22" rx="4" ry="3" fill="currentColor" transform="rotate(-12 54 22)" />
      <line x1="50.6" y1="22" x2="50.6" y2="4" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="30" cy="2" r="0.9" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
