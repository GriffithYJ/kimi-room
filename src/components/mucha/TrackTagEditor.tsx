"use client";

import { useEffect, useState } from "react";

// owner 260517 0249 catch: 现 tag 怎么 打到 已有 歌曲. 解 · 各 track
// detail page 显 current tag, click → prompt 输入 new tag, 写
// localStorage `kimi-playlist-track-tags` ({trackTitle: customTag}).
// PlaylistTabsAndList read this localStorage 跟 hardcoded fallback 一起
// effective tag.

const STORAGE = "kimi-playlist-track-tags";

export function TrackTagEditor({
  trackTitle,
  fallback,
  accent,
  mute,
}: {
  trackTitle: string;
  fallback: string;
  accent: string;
  mute: string;
}) {
  const [tag, setTag] = useState<string>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const stored = localStorage.getItem(STORAGE);
      if (stored) {
        const map = JSON.parse(stored) as Record<string, string>;
        if (map && typeof map === "object" && map[trackTitle]) {
          setTag(map[trackTitle]);
        }
      }
    } catch {}
  }, [trackTitle]);

  const editTag = () => {
    const input = window.prompt(`分类: 当前「${tag}」, 输入新分类 (留空恢复默认)`, tag);
    if (input === null) return;
    const trimmed = input.trim();
    try {
      const stored = localStorage.getItem(STORAGE);
      const map = stored ? (JSON.parse(stored) as Record<string, string>) : {};
      if (trimmed === "" || trimmed === fallback) {
        delete map[trackTitle];
        setTag(fallback);
      } else {
        map[trackTitle] = trimmed;
        setTag(trimmed);
      }
      localStorage.setItem(STORAGE, JSON.stringify(map));
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={editTag}
      style={{
        background: "transparent",
        border: `0.5px dashed ${mute}`,
        color: accent,
        fontSize: 9,
        letterSpacing: 2,
        padding: "3px 10px",
        borderRadius: 99,
        marginTop: 10,
        cursor: "pointer",
        fontFamily: "inherit",
        fontStyle: "italic",
        opacity: hydrated ? 1 : 0.5,
      }}
      aria-label="edit tag"
    >
      # {tag}
    </button>
  );
}
