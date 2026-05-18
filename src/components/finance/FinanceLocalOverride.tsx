"use client";

import { useEffect } from "react";
import {
  loadCats,
  loadEnvelopes,
  type EditableCat,
  type EditableEnvelope,
} from "./FinanceEditOverlay";

// V2 finance · owner 0518 ack: client 端 swap dayCats/nightCats + mockEnvelopes
// 用 localStorage override 数据 (FinanceEditOverlay 写). Server SSR 不知 user
// override, client mount 后 patch DOM 视觉 (轻 hack, future iter 直接 server
// 读 cookie / "use client" 整 page).
//
// 实现: mount 后 reads localStorage, 跟 server-rendered 标 `data-cat-i` /
// `data-env-i` 的 DOM 节点比对, 改 textContent + 关联 attr (style.background
// for rose).

function applyOverrides() {
  if (typeof window === "undefined") return;
  const cats = loadCats();
  const envs = loadEnvelopes();
  if (cats) {
    document.querySelectorAll("[data-cat-i]").forEach((el) => {
      const i = parseInt(el.getAttribute("data-cat-i") || "0", 10);
      const c = cats[i];
      if (!c) return;
      const tag = el.getAttribute("data-cat-field");
      if (tag === "name") {
        el.textContent = c.cat;
      } else if (tag === "amt") {
        el.textContent = `¥${c.amt}k`;
      } else if (tag === "color" && el instanceof HTMLElement) {
        el.style.backgroundColor = c.color;
      }
    });
  }
  if (envs) {
    document.querySelectorAll("[data-env-i]").forEach((el) => {
      const i = parseInt(el.getAttribute("data-env-i") || "0", 10);
      const e = envs[i];
      if (!e) return;
      const tag = el.getAttribute("data-env-field");
      if (tag === "label") {
        el.textContent = e.label;
      } else if (tag === "amount") {
        el.textContent = e.amount;
      } else if (tag === "kind") {
        el.textContent = e.kind === "bank" ? "BANK" : e.kind.toUpperCase();
      }
    });
  }
}

export function FinanceLocalOverride() {
  useEffect(() => {
    applyOverrides();
  }, []);
  return null;
}
