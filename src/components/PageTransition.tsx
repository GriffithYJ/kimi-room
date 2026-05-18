"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

// PageTransition: 包 layout children. 每次 pathname 变, 重启 wrapper 的
// kimi-page-in animation (CSS keyframes 在 globals.css). 新页 fade-in
// opacity 0→1 + slide 6px→0, 280ms.
//
// 2026-05-11 fix: 跳过 full-screen position:fixed 布局的页面 (e.g. /chat).
// 有 transform 的 ancestor 会让子 `position:fixed` 退化成 absolute, 相对
// wrapper 而不是 viewport. ChatRoom main inset:0 → 0×0 黑屏永远.
//
// 2026-05-12 fix: 之前 keyframe 只 translateY 6px 没 opacity, 视觉上几乎看
// 不见 — owner报 backstage ops 切页面没 fade. 加 opacity 0→1 + 用
// useLayoutEffect 替 useEffect (paint 前 apply animation) + fill-mode:both
// (from 状态在 paint 时已生效) — 否则 useEffect 在 paint 后才跑, 用户先看到
// 完整 opacity 1 再被强行掉回 0 = 白闪.
//
// 也用 animationend 监听 — animation 结束后清掉 inline style, 不留
// transform: matrix(1,0,0,1,0,0) 残留 (此值依然算 non-none, 创 containing
// block, 影响后续 navigation 进 /chat).

const SKIP_PATHS = ["/chat"];

// SSR 安全 — useLayoutEffect 在 server 跑会 warn, useEffect 在 server 是
// no-op. PageTransition 本身 'use client' 但 Next.js 仍 SSR 一次.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const shouldSkip = SKIP_PATHS.some((p) => pathname.startsWith(p));
    if (shouldSkip) {
      // 立刻清掉任何残留, /chat 不能有 transform ancestor
      el.style.animation = "";
      el.style.transform = "";
      el.style.opacity = "";
      return;
    }
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "kimi-page-in 280ms cubic-bezier(0.4, 0, 0.2, 1) both";
    const onEnd = () => {
      // animation 结束后清 inline style, 防 transform:matrix 残留创 containing block
      el.style.animation = "";
    };
    el.addEventListener("animationend", onEnd, { once: true });
    return () => el.removeEventListener("animationend", onEnd);
  }, [pathname]);

  return (
    <div ref={ref} data-page-transition style={{ minHeight: "100%" }}>
      {children}
    </div>
  );
}
