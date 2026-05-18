"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Server Action: set kimi-theme cookie + revalidate.
 * Toggle Link in /room (and elsewhere) submits to this. Cookie persists
 * across navigation so every server component picks up the choice.
 */
export async function setKimiTheme(theme: "day" | "night") {
  const store = await cookies();
  store.set("kimi-theme", theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false, // let JS read it for client-only pages too
  });
  revalidatePath("/", "layout");
}
