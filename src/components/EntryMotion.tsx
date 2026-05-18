"use client";

import { useEffect, useState } from "react";

// EntryMotion · React-level fullscreen overlay. 首次 only 显 (localStorage
// flag), 之后跳. 配合 inline ENTRY_GATE_SCRIPT (layout.tsx) + CSS rule
// (globals.css `.kimi-entry-pending`) FOUC prevention — 没 seen 时
// inline script 同步 hide body content, EntryMotion mount 后接管 overlay,
// timeline 完后 remove gate class, body 内容 fade-in.
//
// 重显 (debug): localStorage.removeItem("kimi-entry-seen") + reload
//
// timing: fade-in 400ms + hold 800ms + fade-out 400ms = 总 1.6s

const SEEN_KEY = "kimi-entry-seen";
const GATE_CLASS = "kimi-entry-pending";
const FADE_IN_MS = 400;
const HOLD_MS = 800;
const FADE_OUT_MS = 400;

type Phase = "init" | "in" | "hold" | "out" | "done";

function releaseGate() {
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove(GATE_CLASS);
  }
}

export function EntryMotion() {
  const [phase, setPhase] = useState<Phase>("init");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(SEEN_KEY)) {
      setPhase("done");
      releaseGate();
      return;
    }
    setPhase("in");
    const t1 = setTimeout(() => setPhase("hold"), FADE_IN_MS);
    const t2 = setTimeout(() => setPhase("out"), FADE_IN_MS + HOLD_MS);
    const t3 = setTimeout(() => {
      setPhase("done");
      window.localStorage.setItem(SEEN_KEY, String(Date.now()));
      releaseGate();
    }, FADE_IN_MS + HOLD_MS + FADE_OUT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done" || phase === "init") return null;

  const opacity = phase === "out" ? 0 : 1;

  return (
    <div
      aria-hidden
      className="kimi-entry-motion-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "#0c0c0c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity,
        transition: `opacity ${phase === "in" ? FADE_IN_MS : FADE_OUT_MS}ms ease-out`,
        pointerEvents: "none",
      }}
    >
      <img
        src="/entry-motion.png"
        alt=""
        width={780}
        height={780}
        style={{
          width: "65vw",
          maxWidth: 600,
          height: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
