"use client";

import { useEffect, useState } from "react";
import { KimiTopNav } from "@/components/mucha/KimiPage";
import type { GOTHIC } from "@/lib/kimi-palettes";
import { SkyView } from "./SkyView";
import { ScoreSheet } from "./ScoreSheet";
import {
  loadHeartbeatData,
  type HeartbeatData,
} from "@/lib/heartbeat-data";

// V2 Heartbeat toggle shell · canon ScoreClient mirror.
// Sky / Score 两 view · 一页 一 toggle (owner 0519 G4 'canon 一样').

export function HeartbeatClient({ G }: { G: typeof GOTHIC }) {
  // owner 0519 0407: heartbeat = score 双关 · 默认 score 在前, sky 在后.
  const [view, setView] = useState<"sky" | "score">("score");
  const [data, setData] = useState<HeartbeatData | null>(null);

  useEffect(() => {
    void (async () => {
      const d = await loadHeartbeatData();
      setData(d);
    })();
  }, []);

  return (
    <>
      <KimiTopNav title="HEARTBEAT" sub={view === "sky" ? "sky" : "score"} P={G} />

      <div style={{ padding: "8px 16px 40px" }}>
        {data ? (
          view === "sky" ? (
            <SkyView G={G} data={data} onChange={async () => {
              const d = await loadHeartbeatData();
              setData(d);
            }} />
          ) : (
            <ScoreSheet G={G} data={data} onChange={async () => {
              const d = await loadHeartbeatData();
              setData(d);
            }} />
          )
        ) : (
          <div
            style={{
              padding: "60px 0",
              textAlign: "center",
              fontSize: 11,
              color: G.mute,
              fontStyle: "italic",
            }}
          >
            loading …
          </div>
        )}
      </div>

      {/* bottom toggle */}
      <div
        style={{
          position: "sticky",
          bottom: 16,
          margin: "0 auto 24px",
          maxWidth: 240,
          height: 42,
          background: G.paper,
          border: `0.6px solid ${G.navBorder}`,
          borderRadius: 99,
          display: "flex",
          alignItems: "center",
          padding: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {(["score", "sky"] as const).map((v) => {
          const sel = v === view;
          return (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 99,
                border: "none",
                background: sel ? `${G.accent}26` : "transparent",
                color: sel ? G.accent : G.mute,
                fontFamily: "inherit",
                fontStyle: "italic",
                fontSize: 11,
                letterSpacing: 3,
                cursor: "pointer",
              }}
            >
              {v === "sky" ? "星 · sky" : "谱 · score"}
            </button>
          );
        })}
      </div>
    </>
  );
}
