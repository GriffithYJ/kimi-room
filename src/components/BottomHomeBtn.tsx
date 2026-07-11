"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * BottomHomeBtn — 底部居中返回主界面按钮。
 *
 * 仅在非 /room 页面可见。点击导航到 /room。
 * 使用 max(env(safe-area-inset-bottom), 8px) 兼容 iOS PWA 和 Android 手势导航。
 *
 * ★ 始终渲染 button DOM（position:fixed），用 opacity:0 + pointer-events:none
 *   控制显隐，避免 SSR null vs client button 的结构性 hydration mismatch。
 */

export function BottomHomeBtn() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // visible = 客户端挂载完毕 且 非 /room 页面
  const visible = mounted && pathname !== null && pathname !== "/room";

  const goHome = useCallback(() => {
    if (!visible) return;
    router.push("/room");
  }, [router, visible]);

  return (
    <button
      type="button"
      onClick={goHome}
      aria-label="返回主界面"
      title="返回主界面"
      aria-hidden={!visible}
      style={{
        position: "fixed",
        bottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 101,
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-muted-gold, #b8a070)",
        background: pressed
          ? "rgba(184, 160, 112, 0.22)"
          : "rgba(184, 160, 112, 0.10)",
        border: "0.5px solid rgba(184, 160, 112, 0.25)",
        borderRadius: "50%",
        cursor: visible ? "pointer" : "default",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        backdropFilter: "blur(12px) saturate(150%)",
        WebkitBackdropFilter: "blur(12px) saturate(150%)",
        transition: "background 150ms, opacity 150ms",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        padding: 0,
        margin: 0,
        outline: "none",
      }}
      onPointerDown={() => visible && setPressed(true)}
      onPointerUp={() => visible && setPressed(false)}
      onPointerLeave={() => visible && setPressed(false)}
      tabIndex={visible ? 0 : -1}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 10L12 3L21 10" />
        <path d="M6 8.5V20H18V8.5" />
      </svg>
    </button>
  );
}
