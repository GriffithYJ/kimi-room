import Link from "next/link";
import { FOYER_DAY, FOYER_NIGHT } from "./tokens";
import { FooterWhiplashDay, DoubleScrollNight } from "./Ornaments";

/**
 * INTRARE — the one way in. Through it is /room.
 *
 * No frame: the word, a whiplash under it (the gilt double volute at night),
 * and AD ATRIVM small beneath.
 */
export function FoyerFooter({
  night,
  marginTopAuto = true,
  paddingTop = 0,
}: {
  night: boolean;
  marginTopAuto?: boolean;
  paddingTop?: number;
}) {
  return (
    <Link
      href="/room"
      className="foyer-intrare"
      style={{
        marginTop: marginTopAuto ? "auto" : undefined,
        flex: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${paddingTop}px 0 22px`,
        textDecoration: "none",
        ["--foyer-intrare-hover" as string]: night ? FOYER_NIGHT.paper : FOYER_DAY.rose,
      }}
    >
      <span
        className="foyer-intrare-label"
        style={{
          fontSize: 11.5,
          letterSpacing: 6,
          color: night ? FOYER_NIGHT.goldBright : FOYER_DAY.muteWarm,
          paddingLeft: 6,
        }}
      >
        INTRARE
      </span>
      {night ? <DoubleScrollNight width={84} opacity={0.75} marginTop={3} /> : <FooterWhiplashDay />}
      <span
        style={{
          fontSize: 6.5,
          letterSpacing: 3.5,
          color: night ? FOYER_NIGHT.gold : FOYER_DAY.mute,
          marginTop: 3,
        }}
      >
        AD ATRIVM
      </span>
    </Link>
  );
}
