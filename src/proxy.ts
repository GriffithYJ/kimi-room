import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next 16: this file is named proxy.ts (was middleware.ts, file convention
 * renamed). On any URL with ?theme=day or ?theme=night, set the kimi-theme
 * cookie and redirect to the same URL without the theme param. Persists
 * choice across navigation so every page reads it via cookies() and swaps
 * palettes server-side.
 */
export function proxy(req: NextRequest) {
  const theme = req.nextUrl.searchParams.get("theme");
  if (theme !== "day" && theme !== "night") {
    return NextResponse.next();
  }
  const cleaned = new URL(req.nextUrl.toString());
  cleaned.searchParams.delete("theme");
  const res = NextResponse.redirect(cleaned);
  res.cookies.set("kimi-theme", theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icons|images|favicon).*)"],
};
