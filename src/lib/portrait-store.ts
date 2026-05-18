// V2 portrait store · settings 上传 → IDB blob → DualAvatars 渲染.
//
// owner 0525 ack p2: settings runtime upload (不是 README 指南 fork+redeploy path).
// V2 ship 0 portrait JPG · DualAvatars 默认 inline SVG ring placeholder, 用户
// 上传后 走 IDB · 跨 device 走 Notion/Supabase adapter sync.

import { blobStore } from "./stores";
import type { BlobEntry } from "./stores/types";

const SELF_ID = "portrait-self";
const OTHER_ID = "portrait-other";

function blobToDataURL(b: BlobEntry): string {
  return `data:${b.contentType};base64,${b.base64}`;
}

export async function getSelfPortraitDataURL(): Promise<string | null> {
  const b = await blobStore().get(SELF_ID);
  return b ? blobToDataURL(b) : null;
}

export async function getOtherPortraitDataURL(): Promise<string | null> {
  const b = await blobStore().get(OTHER_ID);
  return b ? blobToDataURL(b) : null;
}

export async function setSelfPortrait(
  base64: string,
  contentType: string,
): Promise<void> {
  await blobStore().put({
    id: SELF_ID,
    kind: "portrait-self",
    contentType,
    base64,
  });
}

export async function setOtherPortrait(
  base64: string,
  contentType: string,
): Promise<void> {
  await blobStore().put({
    id: OTHER_ID,
    kind: "portrait-other",
    contentType,
    base64,
  });
}

export async function clearSelfPortrait(): Promise<void> {
  await blobStore().delete(SELF_ID);
}

export async function clearOtherPortrait(): Promise<void> {
  await blobStore().delete(OTHER_ID);
}

// File picker → base64. Used in settings upload form.
export function fileToBase64(file: File): Promise<{ base64: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) return reject(new Error("invalid data url"));
      resolve({ contentType: match[1], base64: match[2] });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
