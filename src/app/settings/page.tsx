"use client";

// V2 settings · runtime config + portrait upload + IDB JSON export/import/empty.
//
// Phase 1 stub (Day 1): app_title + LLM api key
// Phase 2 (Day 2 owner 0525 ack): + LLM endpoint/model + portrait upload (p2) +
//          IDB export/import/empty buttons + adapter picker stub
// Phase 3 (later): adapter picker real wire (Notion / Supabase form), 6 finance
//          category editor, NSFW level, 21+ self-attest

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { KIMI_MODE } from "@/lib/kimi-mode";
import { APP_TITLE_DEFAULT, getAppTitle, setAppTitle } from "@/lib/app-title";
import {
  getLLMConfig,
  setLLMConfig,
  type LLMConfig,
} from "@/lib/llm-client";
import {
  clearOtherPortrait,
  clearSelfPortrait,
  fileToBase64,
  getOtherPortraitDataURL,
  getSelfPortraitDataURL,
  setOtherPortrait,
  setSelfPortrait,
} from "@/lib/portrait-store";
import { getAdapter } from "@/lib/stores";
import {
  CHAR_NAME_DEFAULT,
  getCharName,
  getUserName,
  setCharName,
  setUserName,
} from "@/lib/template";

type Toast = { msg: string; tone: "ok" | "err" } | null;

type MedButton = { key: string; label: string };

const MED_BUTTONS_KEY = "kimi-med-buttons";

function loadMedButtons(): MedButton[] {
  try {
    const raw = localStorage.getItem(MED_BUTTONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((m): m is MedButton => !!m?.key && !!m?.label)
      : [];
  } catch {
    return [];
  }
}

function saveMedButtons(list: MedButton[]) {
  try {
    localStorage.setItem(MED_BUTTONS_KEY, JSON.stringify(list));
  } catch {}
}

export default function SettingsPage() {
  const [title, setTitle] = useState(APP_TITLE_DEFAULT);
  const [charName, setCharNameState] = useState(CHAR_NAME_DEFAULT);
  const [userName, setUserNameState] = useState("you");
  const [llm, setLLM] = useState<LLMConfig>({ apiKey: "", endpoint: "", model: "" });
  const [selfPreview, setSelfPreview] = useState<string | null>(null);
  const [otherPreview, setOtherPreview] = useState<string | null>(null);
  const [meds, setMeds] = useState<MedButton[]>([]);
  const [medDraft, setMedDraft] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  const importInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(getAppTitle());
    setCharNameState(getCharName());
    setUserNameState(getUserName());
    setLLM(getLLMConfig());
    setMeds(loadMedButtons());
    refreshPortraits();
  }, []);

  function addMed() {
    const label = medDraft.trim();
    if (!label) return;
    const key = label.toLowerCase();
    if (meds.some((m) => m.key === key)) {
      flash(`「${label}」已存在`, "err");
      return;
    }
    const next = [...meds, { key, label }];
    setMeds(next);
    saveMedButtons(next);
    setMedDraft("");
  }

  function removeMed(key: string) {
    const next = meds.filter((m) => m.key !== key);
    setMeds(next);
    saveMedButtons(next);
  }

  function flash(msg: string, tone: "ok" | "err" = "ok") {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2400);
  }

  async function refreshPortraits() {
    const [s, o] = await Promise.all([
      getSelfPortraitDataURL(),
      getOtherPortraitDataURL(),
    ]);
    setSelfPreview(s);
    setOtherPreview(o);
  }

  function onSaveGeneral(e: React.FormEvent) {
    e.preventDefault();
    setAppTitle(title);
    setCharName(charName);
    setUserName(userName);
    setLLMConfig(llm);
    flash("saved");
  }

  async function onPickPortrait(
    e: React.ChangeEvent<HTMLInputElement>,
    target: "self" | "other",
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const { base64, contentType } = await fileToBase64(file);
      if (target === "self") await setSelfPortrait(base64, contentType);
      else await setOtherPortrait(base64, contentType);
      await refreshPortraits();
      flash(`${target} portrait saved`);
    } catch (err) {
      flash(`upload failed: ${(err as Error).message}`, "err");
    }
  }

  async function onClearPortrait(target: "self" | "other") {
    if (!confirm(`Remove ${target} portrait?`)) return;
    if (target === "self") await clearSelfPortrait();
    else await clearOtherPortrait();
    await refreshPortraits();
    flash(`${target} portrait removed`);
  }

  async function onExport() {
    try {
      const json = await getAdapter().exportJSON();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kimi-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      flash("exported");
    } catch (err) {
      flash(`export failed: ${(err as Error).message}`, "err");
    }
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const r = await getAdapter().importJSON(text);
      flash(`imported · ${r.added} entries`);
    } catch (err) {
      flash(`import failed: ${(err as Error).message}`, "err");
    }
  }

  async function onEmpty() {
    if (
      !confirm(
        "Empty all local data? 此操作清空 IDB · 所有 keepsakes / memory / calendar / 等 删. 不影响 settings.",
      )
    )
      return;
    try {
      await getAdapter().empty();
      flash("emptied");
    } catch (err) {
      flash(`empty failed: ${(err as Error).message}`, "err");
    }
  }

  const inputCls =
    "bg-transparent border-b border-current/30 px-1 py-2 focus:outline-none focus:border-current";
  const labelCls = "text-xs tracking-widest uppercase text-muted-grey";
  const helpCls = "text-xs text-muted-grey";
  const buttonCls =
    "px-4 py-1.5 border border-current/40 text-[11px] tracking-widest uppercase hover:border-current";

  return (
    <main className="flex-1 px-6 md:px-16 py-32">
      <h1 className="font-serif text-5xl tracking-widest text-center">settings</h1>
      <p className={`mt-6 text-center ${helpCls}`}>
        instance config · {KIMI_MODE} build
      </p>

      <form
        onSubmit={onSaveGeneral}
        className="mt-16 max-w-md mx-auto flex flex-col gap-10"
      >
        {/* ── App title ─────────────────────────────────── */}
        <label className="flex flex-col gap-2">
          <span className={labelCls}>app title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={APP_TITLE_DEFAULT}
            className={`${inputCls} font-serif text-lg`}
          />
          <span className={helpCls}>
            top nav display name · localStorage only. PWA home screen name 仍 走{" "}
            <code>manifest.webmanifest</code> file ({"name"} / {"short_name"}).
          </span>
        </label>

        {/* ── Char name (template sub) ──────────────────── */}
        <label className="flex flex-col gap-2">
          <span className={labelCls}>char name</span>
          <input
            type="text"
            value={charName}
            onChange={(e) => setCharNameState(e.target.value)}
            placeholder={CHAR_NAME_DEFAULT}
            className={`${inputCls} font-serif text-lg`}
          />
          <span className={helpCls}>
            substituted in <code>{"{{char}}"}</code> / <code>{"{{char name}}"}</code>{" "}
            placeholders · used in keepsake note placeholder, chat persona, LLM prompts.
          </span>
        </label>

        {/* ── User name ─────────────────────────────────── */}
        <label className="flex flex-col gap-2">
          <span className={labelCls}>your name</span>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserNameState(e.target.value)}
            placeholder="you"
            className={`${inputCls} font-serif text-lg`}
          />
          <span className={helpCls}>
            substituted in <code>{"{{user}}"}</code> placeholders · used when LLM
            addresses you in scenarios / RP context.
          </span>
        </label>

        {/* ── LLM ───────────────────────────────────────── */}
        <fieldset className="flex flex-col gap-4">
          <legend className={labelCls}>llm api</legend>
          <label className="flex flex-col gap-1">
            <span className={helpCls}>endpoint (OpenAI-format chat completion)</span>
            <input
              type="url"
              value={llm.endpoint}
              onChange={(e) => setLLM({ ...llm, endpoint: e.target.value })}
              placeholder="https://api.openai.com/v1/chat/completions"
              className={`${inputCls} font-mono text-sm`}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={helpCls}>model</span>
            <input
              type="text"
              value={llm.model}
              onChange={(e) => setLLM({ ...llm, model: e.target.value })}
              placeholder="gpt-4o-mini"
              className={`${inputCls} font-mono text-sm`}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={helpCls}>api key (stored in browser only)</span>
            <input
              type="password"
              value={llm.apiKey}
              onChange={(e) => setLLM({ ...llm, apiKey: e.target.value })}
              placeholder="sk-…"
              autoComplete="off"
              className={`${inputCls} font-mono text-sm`}
            />
          </label>
        </fieldset>

        <button type="submit" className={`${buttonCls} self-start`}>
          save settings
        </button>
      </form>

      {/* ── Portraits ───────────────────────────────── */}
      <section className="mt-24 max-w-md mx-auto flex flex-col gap-4">
        <h2 className={labelCls}>portraits</h2>
        <p className={helpCls}>
          /room landing 头像 · 走 IDB blob, 跨 device sync 走 future Notion/Supabase
          adapter. V2 ship 0 portrait, 默认 inline SVG ring placeholder.
        </p>
        <div className="grid grid-cols-2 gap-6 mt-2">
          {(["self", "other"] as const).map((kind) => {
            const preview = kind === "self" ? selfPreview : otherPreview;
            return (
              <div key={kind} className="flex flex-col items-center gap-2">
                <span className={helpCls}>{kind}</span>
                <div
                  className="w-24 h-24 rounded-full overflow-hidden border border-current/30"
                  style={{
                    backgroundImage: preview ? `url(${preview})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <label className={`${buttonCls} cursor-pointer`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickPortrait(e, kind)}
                    className="hidden"
                  />
                  upload
                </label>
                {preview && (
                  <button
                    type="button"
                    onClick={() => onClearPortrait(kind)}
                    className={`${buttonCls} text-current/60`}
                  >
                    remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Calendar meds preset ──────────────────── */}
      <section className="mt-24 max-w-md mx-auto flex flex-col gap-4">
        <h2 className={labelCls}>calendar · 用药 preset</h2>
        <div className="flex flex-col gap-2">
          {meds.map((m) => (
            <div
              key={m.key}
              className="flex items-center justify-between border-b border-current/10 py-1.5"
            >
              <span className="font-serif text-sm">{m.label}</span>
              <button
                type="button"
                onClick={() => removeMed(m.key)}
                className="text-[10px] tracking-widest uppercase text-current/40 hover:text-current"
              >
                remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={medDraft}
            onChange={(e) => setMedDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addMed();
              }
            }}
            placeholder="加一个"
            className={`${inputCls} flex-1 font-serif text-sm`}
          />
          <button
            type="button"
            onClick={addMed}
            disabled={!medDraft.trim()}
            className={buttonCls}
            style={{ opacity: medDraft.trim() ? 1 : 0.4 }}
          >
            ＋ add
          </button>
        </div>
      </section>

      {/* ── Data ─────────────────────────────────────── */}
      <section className="mt-24 max-w-md mx-auto flex flex-col gap-4">
        <h2 className={labelCls}>data · export / import / empty</h2>
        <p className={helpCls}>
          local IDB store (taste / memo / calendar / memory / 等). export JSON 跨
          device migrate / backup. import 增量合并 (id 冲突 overwrite). empty
          清空 IDB 不影响 settings.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onExport} className={buttonCls}>
            export JSON
          </button>
          <label className={`${buttonCls} cursor-pointer`}>
            <input
              ref={importInput}
              type="file"
              accept="application/json"
              onChange={onImport}
              className="hidden"
            />
            import JSON
          </label>
          <button type="button" onClick={onEmpty} className={buttonCls}>
            empty all
          </button>
        </div>
      </section>

      {/* ── Adapter picker (stub) ─────────────────────── */}
      <section className="mt-24 max-w-md mx-auto flex flex-col gap-4">
        <h2 className={labelCls}>memory backend</h2>
        <p className={helpCls}>
          现 IndexedDB (local, 0 config). NotionAdapter / SupabaseAdapter
          coming · settings 切到 cloud sync.
        </p>
        <div className="text-xs text-current/40 italic">
          Notion · Supabase · custom adapter · TBD
        </div>
      </section>

      {/* ── footer ────────────────────────────── */}
      <p className={`mt-24 text-center ${helpCls}`}>
        <Link href="/" className="underline-offset-4 hover:underline">
          ← home
        </Link>
      </p>

      {toast && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-2 text-xs tracking-widest uppercase border ${
            toast.tone === "ok"
              ? "border-current/40"
              : "border-red-500/60 text-red-500"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </main>
  );
}
