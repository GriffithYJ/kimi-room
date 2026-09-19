import type { KimiTheme } from "@/lib/day-theme-client";
import type { FoyerComposition, FoyerWeatherLocation } from "@/lib/foyer-prefs";

export type FoyerQuote = {
  /** One line per <br> — where it breaks is part of the typesetting, not
   *  something left to the width of the container. */
  lines: string[];
};

/** The one set of values the four screens share: they differ in composition,
 *  never in data. All of it comes from useFoyerClock, on the client. */
export type FoyerScreenProps = {
  /** Days since the start date, set in old-style figures. */
  dies: number;
  /** The same number, glossed in Roman. */
  diesRoman: string;
  /** The Latin greeting for this hour, local. */
  greet: string;
  /** AD CC · SUPERSUNT XCVIII DIES — on the mark itself, AD C · HODIE. */
  milestone: string;
  quote: FoyerQuote;
  note: string;
  sinceLine: string;
  theme: KimiTheme;
  composition: FoyerComposition;
  /** 0 spring, 1 summer, 2 autumn, 3 winter — which Seasons the triptych hangs. */
  seasonIndex: number;
  /** Where to ask about the weather; null means the row does not render. */
  weather: FoyerWeatherLocation | null;
};
