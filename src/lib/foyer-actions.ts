"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { FOYER_COOKIE, parseFoyerComposition } from "./foyer-prefs";
import { setKimiTheme } from "./theme-actions";

// What the two seals do.
//
// Both take no argument: the server reads the current cookie and flips it. That
// way the seal component never has to pass "the next state" into an action — so
// it never has to declare one inline inside a client component (Next forbids
// that), and a stale page cannot flip it the wrong way.

export async function toggleFoyerComposition() {
  const store = await cookies();
  const current = parseFoyerComposition(store.get(FOYER_COOKIE)?.value);
  store.set(FOYER_COOKIE, current === "full" ? "tria" : "full", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  });
  revalidatePath("/", "layout");
}

export async function toggleKimiTheme() {
  const store = await cookies();
  const current = store.get("kimi-theme")?.value?.trim().toLowerCase() === "day" ? "day" : "night";
  await setKimiTheme(current === "day" ? "night" : "day");
}
