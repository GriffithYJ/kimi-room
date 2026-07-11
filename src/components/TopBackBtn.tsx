"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useEffect, useState } from "react";

/**
 * TopBackBtn — 全局左上角返回按钮，位于 StatusBar 时间下方。
 *
 * 仅在非 /room 页面可见。从当前路径派生父路径，实现确定性、无状态的返回导航。
 *
 * ★ 始终渲染 button DOM（position:fixed），用 opacity:0 + pointer-events:none
 *   控制显隐，避免 SSR null vs client button 的结构性 hydration mismatch。
 */

export function TopBackBtn() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // visible = 客户端挂载完毕 且 非 /room 页面
  const visible = mounted && pathname !== null && pathname !== "/room";

  const parentPath = useMemo(() => {
    // pathname 在 SSR 时为 null → 安全回退
    if (!pathname) return "/room";
    const segs = pathname.split("/").filter(Boolean);
    if (segs.length <= 1) return "/room";
    return "/" + segs.slice(0, -1).join("/");
  }, [pathname]);

  const goBack = useCallback(() => {
    if (!visible) return;
    router.push(parentPath);
  }, [router, parentPath, visible]);

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="返回上一级"
      title="返回上一级"
      aria-hidden={!visible}
      style={{
        position: "fixed",
        top: "calc(44px + env(safe-area-inset-top, 0px))",
        left: "calc(env(safe-area-inset-left, 0px) + 12px)",
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 5L8 12L15 19" />
      </svg>
    </button>
  );
}
