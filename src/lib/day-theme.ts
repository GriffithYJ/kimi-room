// Server-side day/night theme reader.
// Client-safe palette tokens (ROSE_GOTHIC_DAY etc) and types live in
// day-theme-client.ts so client components can import them without
// pulling in next/headers.

import { cookies } from "next/headers";
import type { KimiTheme } from "./day-theme-client";

// Re-export palette + type from the client-safe module so server pages
// that imported `from "@/lib/day-theme"` keep working.
export {
  ROSE_GOTHIC_DAY,
  type RoseGothicPalette,
  type KimiTheme,
  getThemeFromCookieValue,
} from "./day-theme-client";

export async function getTheme(): Promise<KimiTheme> {
  const store = await cookies();
  const v = store.get("kimi-theme")?.value;
  if (v && v.trim().toLowerCase() === "day") return "day";
  return "night";
}
