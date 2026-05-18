import { redirect } from "next/navigation";

// V2 root · 直跳 /room. canon V1 landing (timeline + diary preview + owner/owner
// quote) is maintainer-personal, V2 不 ship root marketing page · 用户 fork 后
// 想加 own landing 自做.

export default function Home() {
  redirect("/room");
}
