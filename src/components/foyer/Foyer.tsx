"use client";

import type { KimiTheme } from "@/lib/day-theme-client";
import type { FoyerComposition } from "@/lib/foyer-prefs";
import { FOYER_DAY, FOYER_NIGHT } from "./tokens";
import { useFoyerClock } from "./useFoyerClock";
import { DayCurtain } from "./DayCurtain";
import { DayTriptych } from "./DayTriptych";
import { NightTriptychRotor } from "./NightTriptychRotor";
import { NightWindowRotor } from "./NightWindowRotor";
import type { FoyerScreenProps } from "./types";

/**
 * The four screens — two axes multiplied: day/night (kimi-theme, shared with the
 * whole site) × composition (kimi-foyer, this page alone).
 *
 *   full × day = side curtains      full × night = one window, filling it
 *   tria × day = three niches       tria × night = three lancets of glass
 *
 * Both axes arrive already read from cookies on the server, so the first frame
 * is the right screen. What is derived from time — the count, the greeting, the
 * moon, which painting hangs today — waits for the mount; see useFoyerClock.
 */
export function Foyer({
  theme,
  composition,
}: {
  theme: KimiTheme;
  composition: FoyerComposition;
}) {
  const clock = useFoyerClock();
  const night = theme === "night";

  // Not mounted yet: lay down a ground in the right colour. The foyer fades in
  // anyway, so this frame does not read as missing.
  if (!clock) {
    return (
      <div
        className="foyer-stage"
        style={{ background: night ? FOYER_NIGHT.bg : FOYER_DAY.bg }}
      />
    );
  }

  const shared: FoyerScreenProps = {
    dies: clock.dies,
    diesRoman: clock.diesRoman,
    greet: clock.greet,
    milestone: clock.milestone,
    quote: clock.quote,
    note: clock.note,
    sinceLine: clock.sinceLine,
    theme,
    composition,
    seasonIndex: clock.seasonIndex,
    weather: clock.weather,
  };

  if (night) {
    return composition === "tria" ? (
      <NightTriptychRotor {...shared} illumination={clock.moonIllum} initialIndex={clock.windowIndex} />
    ) : (
      <NightWindowRotor {...shared} initialIndex={clock.windowIndex} />
    );
  }

  return composition === "tria" ? (
    <DayTriptych {...shared} />
  ) : (
    <DayCurtain {...shared} todayLatin={clock.todayLatin} flowerIndex={clock.flowerIndex} />
  );
}
