"use client";

import { useState } from "react";
import type { GOTHIC } from "@/lib/kimi-palettes";
import type { HeartbeatData, PulseEntry } from "@/lib/heartbeat-data";
import { deletePulse, savePulse } from "@/lib/heartbeat-data";
import { VALENCE_COLORS, valenceColor, type ValenceTag } from "@/lib/score-colors";
import { isLLMConfigured, llmGenerate } from "@/lib/llm-client";

// V2 ScoreSheet · owner 0519 design:
//   30 天 · 15 上 system + 15 下 system · grand staff (treble + bass)
//   3 source:
//     auto · chatStore entries (timestamp hour 决定 treble/bass)
//     manual · 玫瑰 button (用户填 valence/arousal/hour)
//     llm · 狐狸 ✨ ask 今日 pulse (returns 50-200 字 commentary + valence)
//
// canon ScoreSheet 698 line · V2 简化保 essence: 五线谱 + 音符 by arousal +
// 颜色 by valence + ♥ heartbeat-extra flag (LLM-gen). 删 clef / time sig /
// brace / slur / dynamics 复杂 engraving.

const W = 360;
const PAD_L = 14;
const PAD_R = 14;
const NOTE_W = W - PAD_L - PAD_R;
const GAP = 9;
const STAFF_H = GAP * 4;

function jstDayKey(iso: string): string {
  const d = new Date(iso);
  const jst = new Date(d.getTime() + 9 * 3600 * 1000);
  return jst.toISOString().slice(0, 10);
}

function jstHour(iso: string): number {
  const d = new Date(iso);
  const jst = new Date(d.getTime() + 9 * 3600 * 1000);
  return jst.getUTCHours();
}

function last30Days(): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const jst = new Date(d.getTime() + 9 * 3600 * 1000);
    out.push(jst.toISOString().slice(0, 10));
  }
  return out;
}

function yForArousal(a: number, top: number): number {
  const ar = Math.max(0, Math.min(1, a));
  return top + STAFF_H - ar * (STAFF_H + 6);
}

export function ScoreSheet({
  G,
  data,
  onChange,
}: {
  G: typeof GOTHIC;
  data: HeartbeatData;
  onChange: () => Promise<void>;
}) {
  const days = last30Days();
  const firstHalf = days.slice(0, 15);
  const secondHalf = days.slice(15);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<PulseEntry | null>(null);

  const pulsesByDay = groupByDay(data.pulses);

  async function fireLLMPulse() {
    if (busy) return;
    if (!isLLMConfigured()) {
      alert("LLM 未配 · settings");
      return;
    }
    setBusy(true);
    try {
      const todayKey = days[days.length - 1];
      const todayPulses = pulsesByDay.get(todayKey) ?? [];
      const todayChats = data.pulses.filter(
        (p) => p.kind === "chat" && jstDayKey(p.at) === todayKey,
      );
      const summary = [...todayPulses, ...todayChats]
        .map((p) => `${p.hour}:00 ${p.note}`)
        .join("\n");
      const system =
        '你是 daily pulse aggregator. 看今天的 events, 写 50-200 字 第一人称 (用户视角) 概括今日 emotion/事件. 最后单独一行 strict format: "valence: brooding|calm|warmth|towardHer". 不返回其他.';
      const prompt = `今日 events:\n${summary || "(空)"}\n\n写今日 pulse.`;
      const text = await llmGenerate(prompt, system, {
        temperature: 0.8,
        maxTokens: 400,
      });
      // parse valence from last line
      const m = text.match(/valence:\s*(brooding|calm|warmth|towardHer)/i);
      const v = (m?.[1] ?? "calm") as ValenceTag;
      const note = text.replace(/valence:.*$/im, "").trim();
      const now = new Date();
      const pulse: PulseEntry = {
        id: `llm-${Date.now()}`,
        kind: "llm",
        at: now.toISOString(),
        hour: jstHour(now.toISOString()),
        valence: v,
        arousal: 0.6,
        note,
        isExtra: true,
      };
      savePulse(pulse);
      await onChange();
    } catch (e) {
      alert(`LLM err · ${(e as Error).message.slice(0, 100)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: "0 4px" }}>
      <Staff
        days={firstHalf}
        pulsesByDay={pulsesByDay}
        G={G}
        onSelect={setSelected}
      />
      <div style={{ height: 14 }} />
      <Staff
        days={secondHalf}
        pulsesByDay={pulsesByDay}
        G={G}
        onSelect={setSelected}
      />

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 28,
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={() => setAdding(true)}
          aria-label="rose · manual pulse"
          title="玫瑰 · manual pulse"
          style={iconBtn()}
        >
          {/* color via mask · calendar finance AlphaRose pattern · owner 0519 0412 */}
          <span
            style={{
              display: "inline-block",
              width: 32,
              height: 32,
              backgroundColor: VALENCE_COLORS.towardHer,
              WebkitMaskImage: "url(/icons/rose2.png)",
              maskImage: "url(/icons/rose2.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          />
        </button>
        <button
          type="button"
          onClick={() => void fireLLMPulse()}
          disabled={busy}
          aria-label="fox · ask LLM today"
          title="狐狸 · ask 今日"
          style={{ ...iconBtn(), opacity: busy ? 0.4 : 1 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/fox-bw-sit.png"
            alt=""
            width={32}
            height={32}
            style={{
              objectFit: "contain",
              display: "block",
              filter: G.ink.startsWith("#1") ? "none" : "invert(1)",
            }}
          />
        </button>
      </div>

      {/* Add modal */}
      {adding && (
        <PulseForm
          G={G}
          onClose={() => setAdding(false)}
          onSave={async (form) => {
            savePulse(form);
            setAdding(false);
            await onChange();
          }}
        />
      )}

      {/* Detail */}
      {selected && (
        <div
          style={{
            marginTop: 18,
            padding: "14px 16px",
            background: G.paper,
            border: `0.4px solid ${G.hair}`,
            borderRadius: 6,
            color: G.ink,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
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
              · {selected.kind} · {jstDayKey(selected.at)} {String(selected.hour).padStart(2, "0")}:00
              {selected.isExtra && (
                <span style={{ marginLeft: 6, color: VALENCE_COLORS.towardHer }}>
                  ♥
                </span>
              )}
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
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              fontStyle: "italic",
            }}
          >
            {selected.note}
          </div>
          {(selected.kind === "manual" || selected.kind === "llm") && (
            <button
              type="button"
              onClick={() => {
                deletePulse(selected.id);
                setSelected(null);
                void onChange();
              }}
              style={{
                marginTop: 10,
                fontSize: 9,
                color: G.mute,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontStyle: "italic",
                letterSpacing: 2,
              }}
            >
              删
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Staff({
  days,
  pulsesByDay,
  G,
  onSelect,
}: {
  days: string[];
  pulsesByDay: Map<string, PulseEntry[]>;
  G: typeof GOTHIC;
  onSelect: (p: PulseEntry) => void;
}) {
  const SVG_H = 38 + STAFF_H + 28 + STAFF_H + 18;
  const TREBLE_Y = 24;
  const BASS_Y = TREBLE_Y + STAFF_H + 28;
  const lcw = NOTE_W / days.length;
  const xFor = (i: number) => PAD_L + lcw * (i + 0.5);
  return (
    <svg
      viewBox={`0 0 ${W} ${SVG_H}`}
      width="100%"
      style={{ maxWidth: 480, display: "block" }}
    >
      {/* treble staff lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`t-${i}`}
          x1={PAD_L}
          y1={TREBLE_Y + i * GAP}
          x2={W - PAD_R}
          y2={TREBLE_Y + i * GAP}
          stroke={G.hair}
          strokeWidth={0.4}
        />
      ))}
      {/* bass staff lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`b-${i}`}
          x1={PAD_L}
          y1={BASS_Y + i * GAP}
          x2={W - PAD_R}
          y2={BASS_Y + i * GAP}
          stroke={G.hair}
          strokeWidth={0.4}
        />
      ))}
      {/* clef label */}
      <text
        x={PAD_L + 2}
        y={TREBLE_Y + STAFF_H + 2}
        fontSize={20}
        fill={G.accent}
        fontStyle="italic"
        opacity={0.7}
      >
        𝄞
      </text>
      <text
        x={PAD_L + 2}
        y={BASS_Y + STAFF_H - 6}
        fontSize={20}
        fill={G.accent}
        fontStyle="italic"
        opacity={0.7}
      >
        𝄢
      </text>
      {/* time sig 14/23 (canon flavor) */}
      <text
        x={PAD_L + 16}
        y={TREBLE_Y + GAP * 1.6}
        fontSize={9}
        fill={G.mute}
        fontStyle="italic"
        opacity={0.6}
      >
        14
      </text>
      <text
        x={PAD_L + 16}
        y={BASS_Y + GAP * 4}
        fontSize={9}
        fill={G.mute}
        fontStyle="italic"
        opacity={0.6}
      >
        23
      </text>

      {/* day barlines */}
      {days.map((_, i) => {
        if (i === 0 || i % 4 !== 0) return null;
        const x = PAD_L + lcw * i;
        return (
          <line
            key={`bar-${i}`}
            x1={x}
            y1={TREBLE_Y}
            x2={x}
            y2={BASS_Y + STAFF_H}
            stroke={G.hair}
            strokeWidth={0.3}
            opacity={0.5}
          />
        );
      })}

      {/* notes · proper notehead + stem · owner 0519 0412 catch "只生成一个点 没音符" */}
      {days.map((day, i) => {
        const pulses = pulsesByDay.get(day) ?? [];
        const x = xFor(i);
        return pulses.map((p, j) => {
          const isTreble = p.hour < 18;
          const top = isTreble ? TREBLE_Y : BASS_Y;
          const y = yForArousal(p.arousal, top);
          const color = valenceColor(p.valence);
          const isExtra = !!p.isExtra;
          const isManual = p.kind === "manual";
          // stem direction: up if y in lower half (notehead pushed down), else down
          const staffMid = top + STAFF_H / 2;
          const stemUp = y > staffMid;
          const stemLen = GAP * 2.8;
          const stemY1 = y;
          const stemY2 = stemUp ? y - stemLen : y + stemLen;
          const stemX = stemUp ? 2.6 : -2.6;
          return (
            <g
              key={`g-${i}-${j}`}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(p)}
            >
              {/* notehead — manual = open ring (diamond accent), chat/llm = filled ellipse */}
              {isManual ? (
                <ellipse
                  cx={x}
                  cy={y}
                  rx={3}
                  ry={2.4}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.1}
                  transform={`rotate(-22 ${x} ${y})`}
                />
              ) : (
                <ellipse
                  cx={x}
                  cy={y}
                  rx={3}
                  ry={2.4}
                  fill={color}
                  transform={`rotate(-22 ${x} ${y})`}
                />
              )}
              {/* stem */}
              <line
                x1={x + stemX}
                y1={stemY1}
                x2={x + stemX}
                y2={stemY2}
                stroke={color}
                strokeWidth={0.8}
              />
              {/* flag (heartbeat-extra · LLM-gen) */}
              {isExtra && (
                <>
                  <path
                    d={
                      stemUp
                        ? `M ${x + stemX} ${stemY2} Q ${x + stemX + 5} ${stemY2 + 3} ${x + stemX + 2} ${stemY2 + 8}`
                        : `M ${x + stemX} ${stemY2} Q ${x + stemX - 5} ${stemY2 - 3} ${x + stemX - 2} ${stemY2 - 8}`
                    }
                    stroke={color}
                    strokeWidth={1}
                    fill="none"
                  />
                  <text
                    x={x + (stemUp ? stemX + 6 : stemX - 12)}
                    y={stemY2 + (stemUp ? -2 : 4)}
                    fill={VALENCE_COLORS.towardHer}
                    fontSize={7}
                    fontStyle="italic"
                  >
                    ♥
                  </text>
                </>
              )}
            </g>
          );
        });
      })}

      {/* day labels (every 5 days) */}
      {days.map((day, i) => {
        if (i % 5 !== 0 && i !== days.length - 1) return null;
        const x = xFor(i);
        const label = day.slice(5); // MM-DD
        return (
          <text
            key={`d-${i}`}
            x={x}
            y={SVG_H - 4}
            fill={G.mute}
            fontSize={7}
            fontStyle="italic"
            textAnchor="middle"
            opacity={0.7}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function PulseForm({
  G,
  onClose,
  onSave,
}: {
  G: typeof GOTHIC;
  onClose: () => void;
  onSave: (p: PulseEntry) => Promise<void>;
}) {
  const [hour, setHour] = useState("14");
  const [arousal, setArousal] = useState("0.5");
  const [valence, setValence] = useState<ValenceTag>("calm");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (busy) return;
    setBusy(true);
    const h = Math.max(0, Math.min(23, parseInt(hour, 10) || 14));
    const a = Math.max(0, Math.min(1, parseFloat(arousal) || 0.5));
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 3600 * 1000);
    jst.setUTCHours(h, 0, 0, 0);
    const at = new Date(jst.getTime() - 9 * 3600 * 1000).toISOString();
    const pulse: PulseEntry = {
      id: `pulse-${Date.now()}`,
      kind: "manual",
      at,
      hour: h,
      valence,
      arousal: a,
      note: note.trim() || "(no note)",
    };
    await onSave(pulse);
  }

  return (
    <div
      role="dialog"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "20px 22px 26px",
          background: G.paper,
          color: G.ink,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: 4,
            color: G.accent,
            marginBottom: 14,
            fontStyle: "italic",
          }}
        >
          ✦ manual pulse
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 9, letterSpacing: 2, color: G.mute }}>hour (0-23)</span>
            <input
              type="number"
              value={hour}
              min={0}
              max={23}
              onChange={(e) => setHour(e.target.value)}
              style={fieldStyle(G)}
            />
          </label>
          <label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 9, letterSpacing: 2, color: G.mute }}>arousal (0-1)</span>
            <input
              type="number"
              value={arousal}
              min={0}
              max={1}
              step={0.1}
              onChange={(e) => setArousal(e.target.value)}
              style={fieldStyle(G)}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 9, letterSpacing: 2, color: G.mute }}>valence</span>
          <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
            {(Object.keys(VALENCE_COLORS) as ValenceTag[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setValence(v)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 99,
                  border: `0.5px solid ${valence === v ? VALENCE_COLORS[v] : G.hair}`,
                  background: valence === v ? `${VALENCE_COLORS[v]}1e` : "transparent",
                  color: valence === v ? VALENCE_COLORS[v] : G.mute,
                  fontSize: 10,
                  fontStyle: "italic",
                  cursor: "pointer",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <label style={{ display: "flex", flexDirection: "column", marginBottom: 14 }}>
          <span style={{ fontSize: 9, letterSpacing: 2, color: G.mute }}>note</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            style={{ ...fieldStyle(G), resize: "vertical" }}
          />
        </label>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onClose} style={ghostBtn(G)}>
            取消
          </button>
          <button type="button" onClick={submit} disabled={busy} style={primaryBtn(G)}>
            {busy ? "..." : "存"}
          </button>
        </div>
      </div>
    </div>
  );
}

function groupByDay(pulses: PulseEntry[]): Map<string, PulseEntry[]> {
  const m = new Map<string, PulseEntry[]>();
  for (const p of pulses) {
    const key = jstDayKey(p.at);
    const arr = m.get(key) ?? [];
    arr.push(p);
    m.set(key, arr);
  }
  return m;
}

function fieldStyle(G: typeof GOTHIC): React.CSSProperties {
  return {
    background: "transparent",
    border: "none",
    borderBottom: `0.5px solid ${G.hair}`,
    padding: "4px 2px",
    color: G.ink,
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
  };
}

function iconBtn(): React.CSSProperties {
  return {
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    width: 32,
    height: 32,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

function primaryBtn(G: typeof GOTHIC): React.CSSProperties {
  return {
    fontSize: 10,
    letterSpacing: 3,
    padding: "6px 14px",
    border: `0.5px solid ${G.accent}`,
    background: `${G.accent}1a`,
    color: G.accent,
    cursor: "pointer",
    fontFamily: "inherit",
    fontStyle: "italic",
  };
}

function ghostBtn(G: typeof GOTHIC): React.CSSProperties {
  return {
    fontSize: 10,
    letterSpacing: 3,
    padding: "6px 14px",
    border: `0.4px solid ${G.hair}`,
    background: "transparent",
    color: G.mute,
    cursor: "pointer",
    fontFamily: "inherit",
    fontStyle: "italic",
  };
}
