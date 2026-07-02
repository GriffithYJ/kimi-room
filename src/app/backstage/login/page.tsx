"use client";

// Owner sign-in · the browser face of POST /api/auth.
//
// The three gated server routes (/api/store, /api/core, /api/tts) require the
// owner session cookie; before this page the only way to mint one was a manual
// fetch in the console. Flow: GET /api/auth on mount → three states —
// not configured (KIMI_OWNER_PASSWORD unset: routes stay locked, say so),
// signed in (offer sign-out), or the password form. Cookie lives 30 days.

import { useEffect, useState } from "react";
import Link from "next/link";

type AuthState = { configured: boolean; authed: boolean } | null;

export default function LoginPage() {
  const [state, setState] = useState<AuthState>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    void refresh();
  }, []);

  async function refresh() {
    try {
      const r = await fetch("/api/auth");
      setState((await r.json()) as AuthState);
    } catch {
      setState({ configured: false, authed: false });
    }
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (r.ok) {
        setPassword("");
        await refresh();
      } else {
        const d = (await r.json().catch(() => ({}))) as { error?: string };
        setErr(r.status === 401 ? "密码不对" : d.error || `登录失败 (${r.status})`);
      }
    } catch {
      setErr("网络错误，稍后再试");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
      await refresh();
    } finally {
      setBusy(false);
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
      <h1 className="font-serif text-5xl tracking-widest text-center">登录</h1>
      <p className={`mt-6 text-center ${helpCls}`}>
        owner session · /api/store · /api/core · /api/tts 的闸 · cookie 30 天
      </p>

      <div className="mt-16 max-w-md mx-auto flex flex-col gap-10">
        {state === null ? (
          <p className={`text-center ${helpCls}`}>…</p>
        ) : !state.configured ? (
          <p className={helpCls}>
            未设 <code>KIMI_OWNER_PASSWORD</code> —— 三条 server 路由保持锁死（fail-closed），
            纯本地模式不受影响。要开 core / prisma / tts，在部署环境里设好密码再来。
            见 <code>docs/SELF-HOST.md</code>。
          </p>
        ) : state.authed ? (
          <div className="flex flex-col gap-6 items-center">
            <p className={helpCls}>已登录。同步与 TTS 走通了。</p>
            <div className="flex gap-4">
              <Link href="/room" className={buttonCls}>
                回房间
              </Link>
              <button type="button" onClick={signOut} disabled={busy} className={`${buttonCls} text-current/60`}>
                退出
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={signIn} className="flex flex-col gap-10">
            <label className="flex flex-col gap-2">
              <span className={labelCls}>密码</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="KIMI_OWNER_PASSWORD"
                autoComplete="current-password"
                autoFocus
                className={`${inputCls} font-mono text-sm`}
              />
              <span className={helpCls}>
                对上 <code>KIMI_OWNER_PASSWORD</code> 就发 cookie · 只在这台浏览器。
              </span>
            </label>
            {err && <p className="text-xs text-red-400/80">{err}</p>}
            <button type="submit" disabled={busy || !password} className={`${buttonCls} self-start disabled:opacity-40`}>
              登录
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
