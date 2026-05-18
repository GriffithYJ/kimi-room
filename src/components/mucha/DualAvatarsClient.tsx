"use client";

// V2 client wrapper · 在 DualAvatars 之上 读 IDB portrait → pass as props.
//
// 用法 (V2 path): 不 pass selfSrc/otherSrc, 自动 IDB fetch. fallback inline SVG ring
// if IDB empty (DualAvatars base 已 handle).
// canon path: 还是 直 用 <DualAvatars selfSrc=... otherSrc=...>  (props 显式), 不 经此 wrapper.
//
// owner 0525 ack p2: settings 上传 → IDB → DualAvatarsClient 渲染 (跨 device sync
// 走 future Notion/Supabase adapter).

import { useEffect, useState } from "react";
import { DualAvatars } from "./DualAvatars";
import {
  getOtherPortraitDataURL,
  getSelfPortraitDataURL,
} from "@/lib/portrait-store";

export function DualAvatarsClient({
  size = 58,
  accent = "#8a6558",
  gap = -6,
  playing = false,
}: {
  size?: number;
  accent?: string;
  gap?: number;
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
      } catch {
        // IDB unavailable / first-launch · fall through to inline SVG default
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <DualAvatars
      size={size}
      accent={accent}
      gap={gap}
      playing={playing}
      selfSrc={selfSrc}
      otherSrc={otherSrc}
    />
  );
}
