import type { CSSProperties, ReactNode } from "react";

// Liquid-glass panel — frosted light blur with subtle shine.
// Ported from Kimi-to-Mucha.html Glass component.
export function Glass({
  children,
  style,
  radius = 22,
  tint = "rgba(255,255,255,0.55)",
  border = "rgba(255,255,255,0.8)",
}: {
  children: ReactNode;
  style?: CSSProperties;
  radius?: number;
  tint?: string;
  border?: string;
}) {
  return (
    <div
      style={{
        borderRadius: radius,
        background: tint,
        backdropFilter: "blur(28px) saturate(160%)",
        WebkitBackdropFilter: "blur(28px) saturate(160%)",
        border: `0.5px solid ${border}`,
        boxShadow:
          "inset 1px 1px 0 rgba(255,255,255,0.6), inset -1px -1px 0 rgba(255,255,255,0.25), 0 10px 40px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
