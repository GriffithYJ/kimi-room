// Composition — the second axis, orthogonal to day/night. Multiplied out:
//   full × day = side curtains      full × night = one window, filling it
//   tria × day = three niches       tria × night = three lancets of glass
//
// The names follow the seals: PLENA (full) / TRIA (triptych).
//
// Day and night ride the site-wide kimi-theme cookie (see day-theme.ts); the
// composition rides kimi-foyer, which governs this page alone. Both are read on
// the server, so the first frame is already the right screen — nothing flips.

import { cookies } from "next/headers";
import { FOYER_COOKIE, FOYER_SKIP_COOKIE, parseFoyerComposition } from "./foyer-prefs";

export type { FoyerComposition } from "./foyer-prefs";
export { FOYER_COOKIE, parseFoyerComposition } from "./foyer-prefs";

export async function getFoyerComposition() {
  const store = await cookies();
  return parseFoyerComposition(store.get(FOYER_COOKIE)?.value);
}

/** Ticked "skip the foyer" in /backstage/settings: the home page goes straight
 *  to /room. */
export async function getFoyerSkip(): Promise<boolean> {
  const store = await cookies();
  return store.get(FOYER_SKIP_COOKIE)?.value === "1";
}
