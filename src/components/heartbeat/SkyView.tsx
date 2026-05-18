"use client";

import { useMemo, useState } from "react";
import type { GOTHIC } from "@/lib/kimi-palettes";
import type { HeartbeatData, SkyStar } from "@/lib/heartbeat-data";
import { SKY_MAX } from "@/lib/heartbeat-data";
import { VALENCE_COLORS, valenceColor, type ValenceTag } from "@/lib/score-colors";
import { memoryStore } from "@/lib/stores";
import { isLLMConfigured, llmGenerate } from "@/lib/llm-client";

// V2 Sky · owner 0519 · 50 slot 默认 hollow placeholder · 用户 memory entry
// 填进去 → solid star. 50 slot 不够 fill 时, auto-pull keepsake/chat/calendar
// 当 filler (heartbeat-data.ts loadHeartbeatData).
//
// Adapted from canon SkyView (740 line) · 删 brooding cluster, 删 MemoryLink
// edges, 删 SELF_SCORE diamond. 留 pole star + main chain + 三层 bg twinkle +
// cross-glint star + nearest-neighbor mesh + detail card.

const W = 360;
const PAD = 24;
const SKY_TOP = 20;
const SKY_BOT = 470;
const SVG_H = 510;

const POLE_X = W - 50;
const POLE_Y = 175;

const CHAIN_Y_TOP = 145;
const CHAIN_Y_BOT = 295;

function hashPos(id: string): { fx: number; fy: number } {
  let hx = 5381;
  let hy = 7919;
  for (let i = 0; i < id.length; i++) {
    const c = id.charCodeAt(i);
    hx = ((hx << 5) + hx + c) | 0;
    hy = ((hy << 5) + hy + c * 17 + 31) | 0;
  }
  return {
    fx: (Math.abs(hx) % 10000) / 10000,
    fy: (Math.abs(hy) % 10000) / 10000,
  };
}

type Placement = { x: number; y: number; r: number };

function placeStarChain(
  stars: SkyStar[],
  poleId: string | null,
): Map<string, Placement> {
  const sorted = [...stars].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
  const chainCount = poleId ? sorted.length - 1 : sorted.length;
  const placement = new Map<string, Placement>();
  let chainIdx = 0;
  const innerW = W - PAD * 2 - 20;
  for (const s of sorted) {
    const radius = 1.4 + Math.min(1, s.importance) * 2.0;
    if (s.id === poleId) {
      placement.set(s.id, { x: POLE_X, y: POLE_Y, r: radius * 1.2 });
      continue;
    }
    // main chain across CHAIN_Y_TOP..CHAIN_Y_BOT
    const t = chainCount > 1 ? chainIdx / (chainCount - 1) : 0.5;
    const x = PAD + t * innerW;
    const { fx, fy } = hashPos(s.id);
    const jitterX = (fx - 0.5) * 12;
    const jitterY = (fy - 0.5) * (CHAIN_Y_BOT - CHAIN_Y_TOP) * 0.8;
    const y = (CHAIN_Y_TOP + CHAIN_Y_BOT) / 2 + jitterY;
    placement.set(s.id, { x: x + jitterX, y, r: radius });
    chainIdx++;
  }
  return placement;
}

export function SkyView({
  G,
  data,
  onChange,
}: {
  G: typeof GOTHIC;
  data: HeartbeatData;
  onChange: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<SkyStar | null>(null);
  const [busy, setBusy] = useState(false);

  const placement = useMemo(
    () => placeStarChain(data.stars, data.poleStarId),
    [data.stars, data.poleStarId],
  );

  // Background twinkle stars (3 layers, deterministic hash positioning)
  const farStars = useMemo(() => layerStars(200, 0.4, 0.6), []);
  const midStars = useMemo(() => layerStars(70, 0.6, 0.9), []);
  const nearStars = useMemo(() => layerStars(22, 0.8, 1.2), []);

  // Nearest-neighbor mesh (within chain · skip pole)
  const edges = useMemo(() => {
    const out: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const entries = Array.from(placement.entries());
    for (let i = 0; i < entries.length; i++) {
      const [aId, a] = entries[i];
      if (aId === data.poleStarId) continue;
      for (let j = i + 1; j < entries.length; j++) {
        const [bId, b] = entries[j];
        if (bId === data.poleStarId) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy < 55 * 55) {
          out.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
        }
      }
    }
    return out;
  }, [placement, data.poleStarId]);

  // 50 hollow placeholder positions (when stars.length < 50)
  const hollowSlots = useMemo(() => {
    const fillCount = Math.max(0, SKY_MAX - data.stars.length);
    const out: { x: number; y: number; r: number; key: string }[] = [];
    for (let i = 0; i < fillCount; i++) {
      const key = `hollow-${i}`;
      const { fx, fy } = hashPos(key);
      // place hollow in scattered positions across mid band (avoid chain)
      const x = PAD + fx * (W - PAD * 2);
      const y = SKY_TOP + 40 + fy * (SKY_BOT - SKY_TOP - 80);
      // Skip if too close to a filled star
      let tooClose = false;
      for (const p of placement.values()) {
        if (Math.abs(p.x - x) < 14 && Math.abs(p.y - y) < 14) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) continue;
      out.push({ x, y, r: 1.6, key });
    }
    return out;
  }, [data.stars.length, placement]);

  async function setValence(s: SkyStar, v: ValenceTag) {
    if (s.source !== "memory") return;
    await memoryStore().put({ id: s.id, valence: v });
    setSelected({ ...s, valence: v });
    await onChange();
  }

  async function togglePin(s: SkyStar) {
    if (s.source !== "memory") return;
    await memoryStore().put({ id: s.id, pinned: !s.pinned });
    setSelected({ ...s, pinned: !s.pinned });
    await onChange();
  }

  async function askLLMValence(s: SkyStar) {
    if (s.source !== "memory" || busy) return;
    if (!isLLMConfigured()) {
      alert("LLM 未配 · settings 填 endpoint + key");
      return;
    }
    setBusy(true);
    try {
      const system =
        '你是 valence classifier. 看这段 memory 内容, 返回 strict 一个 word, 必须是 4 选 1: brooding (低落 / 阴郁 / 压抑) · calm (平静 / 中性) · warmth (温暖 / 亲昵 / 安心) · towardHer (向她 / 思念 / 渴望). 不返回解释, 只 1 word.';
      const out = await llmGenerate(s.content, system, {
        temperature: 0.1,
        maxTokens: 12,
      });
      const tag = (out.trim().toLowerCase() as string).replace(/[^a-z]/g, "");
      const map: Record<string, ValenceTag> = {
        brooding: "brooding",
        calm: "calm",
        warmth: "warmth",
        towardher: "towardHer",
      };
      const v = map[tag] ?? "calm";
      await setValence(s, v);
    } catch (e) {
      alert(`LLM err · ${(e as Error).message.slice(0, 100)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg
        viewBox={`0 0 ${W} ${SVG_H}`}
        width="100%"
        style={{ maxWidth: 420, display: "block" }}
      >
        {/* Background twinkle */}
        <g opacity={0.6}>
          {farStars.map((s, i) => (
            <circle key={`f-${i}`} cx={s.x} cy={s.y} r={s.r} fill={G.ink} opacity={s.op} />
          ))}
        </g>
        <g opacity={0.7}>
          {midStars.map((s, i) => (
            <circle key={`m-${i}`} cx={s.x} cy={s.y} r={s.r} fill={G.ink} opacity={s.op} />
          ))}
        </g>
        <g opacity={0.85}>
          {nearStars.map((s, i) => (
            <circle key={`n-${i}`} cx={s.x} cy={s.y} r={s.r} fill={G.ink} opacity={s.op} />
          ))}
        </g>

        {/* Mesh edges */}
        {edges.map((e, i) => (
          <line
            key={`e-${i}`}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={G.hair}
            strokeWidth={0.3}
            opacity={0.5}
          />
        ))}

        {/* Hollow placeholder slots (not yet filled) */}
        {hollowSlots.map((h) => (
          <circle
            key={h.key}
            cx={h.x}
            cy={h.y}
            r={h.r}
            fill="none"
            stroke={G.hair}
            strokeWidth={0.5}
            opacity={0.6}
          />
        ))}

        {/* Filled stars */}
        {data.stars.map((s) => {
          const p = placement.get(s.id);
          if (!p) return null;
          const color = valenceColor(s.valence);
          const isPole = s.id === data.poleStarId;
          return (
            <g
              key={s.id}
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(s)}
            >
              {/* halo for pole */}
              {isPole && (
                <circle cx={p.x} cy={p.y} r={p.r * 4} fill={color} opacity={0.18} />
              )}
              {/* cross glint */}
              <line
                x1={p.x - p.r * 2.2}
                y1={p.y}
                x2={p.x + p.r * 2.2}
                y2={p.y}
                stroke={color}
                strokeWidth={0.4}
                opacity={0.5}
              />
              <line
                x1={p.x}
                y1={p.y - p.r * 2.2}
                x2={p.x}
                y2={p.y + p.r * 2.2}
                stroke={color}
                strokeWidth={0.4}
                opacity={0.5}
              />
              <circle cx={p.x} cy={p.y} r={p.r} fill={color} />
            </g>
          );
        })}

        {/* "— now" label by pole */}
        {data.poleStarId && (
          <text
            x={POLE_X - 8}
            y={POLE_Y - 8}
            fill={G.accent}
            fontSize={8}
            fontStyle="italic"
            textAnchor="end"
            letterSpacing={1.5}
          >
            — now
          </text>
        )}
      </svg>

      {/* Status line */}
      <div
        style={{
          marginTop: 6,
          fontSize: 10,
          color: G.mute,
          fontStyle: "italic",
          letterSpacing: 3,
        }}
      >
        {data.stars.length} / {SKY_MAX} stars
      </div>

      {/* Detail card */}
      {selected && (
        <div
          style={{
            marginTop: 18,
            width: "100%",
            maxWidth: 420,
            padding: "14px 16px",
            background: G.paper,
            border: `0.4px solid ${G.hair}`,
            borderRadius: 6,
            color: G.ink,
            fontSize: 12,
            lineHeight: 1.7,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 9,
                letterSpacing: 3,
                color: G.accent,
                fontStyle: "italic",
                textTransform: "uppercase",
              }}
            >
              · {selected.source}
            </span>
            <button
              type="button"
              onClick={() => setSelected(null)}
              style={{
                background: "transparent",
                border: "none",
                color: G.mute,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              ×
            </button>
          </div>
          <div style={{ fontStyle: "italic", marginBottom: 8 }}>{selected.title}</div>
          <div style={{ color: G.inkSoft, fontSize: 11, marginBottom: 12 }}>
            {selected.content.slice(0, 240)}
            {selected.content.length > 240 ? "…" : ""}
          </div>

          {/* Valence tagger */}
          {selected.source === "memory" ? (
            <>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 2,
                  color: G.mute,
                  marginBottom: 6,
                  fontStyle: "italic",
                }}
              >
                · valence
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(Object.keys(VALENCE_COLORS) as ValenceTag[]).map((v) => {
                  const sel = selected.valence === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => void setValence(selected, v)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 99,
                        border: `0.5px solid ${sel ? VALENCE_COLORS[v] : G.hair}`,
                        background: sel ? `${VALENCE_COLORS[v]}1e` : "transparent",
                        color: sel ? VALENCE_COLORS[v] : G.mute,
                        fontSize: 10,
                        letterSpacing: 1,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontStyle: "italic",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          borderRadius: 99,
                          background: VALENCE_COLORS[v],
                          marginRight: 4,
                        }}
                      />
                      {v}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => void askLLMValence(selected)}
                  disabled={busy}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 99,
                    border: `0.5px solid ${G.accent}`,
                    background: `${G.accent}1a`,
                    color: G.accent,
                    fontSize: 10,
                    letterSpacing: 1,
                    cursor: busy ? "wait" : "pointer",
                    fontFamily: "inherit",
                    fontStyle: "italic",
                    opacity: busy ? 0.5 : 1,
                  }}
                >
                  {busy ? "..." : "✨ ask"}
                </button>
              </div>
              <div style={{ marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => void togglePin(selected)}
                  style={{
                    padding: "4px 10px",
                    border: `0.5px solid ${G.hair}`,
                    background: "transparent",
                    color: selected.pinned ? G.accent : G.mute,
                    fontSize: 9,
                    letterSpacing: 2,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontStyle: "italic",
                  }}
                >
                  {selected.pinned ? "★ pinned (pole)" : "☆ pin · 设为 pole"}
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize: 10,
                color: G.mute,
                fontStyle: "italic",
              }}
            >
              · {selected.source} 来源 · valence 默认 calm · 在 memory entry 才能 tag
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function layerStars(
  count: number,
  rMin: number,
  rMax: number,
): { x: number; y: number; r: number; op: number }[] {
  const out: { x: number; y: number; r: number; op: number }[] = [];
  for (let i = 0; i < count; i++) {
    const k = i + 1;
    const x = ((k * 9301 + 49297) % 233280) % W;
    const y = ((k * 49297 + 9301) % 233280) % (SKY_BOT - SKY_TOP) + SKY_TOP;
    const r = rMin + ((k * 7919) % 1000) / 1000 * (rMax - rMin);
    const op = 0.3 + ((k * 16807) % 1000) / 1000 * 0.5;
    out.push({ x, y, r, op });
  }
  return out;
}
