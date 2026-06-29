import Link from "next/link";
import { cookies } from "next/headers";
import { getTheme, ROSE_GOTHIC_DAY } from "@/lib/day-theme";
import { MUCHA_COLORWAYS } from "@/lib/mucha-tokens";
import { resolveRoom, ROOM_LAYOUT_COOKIE } from "@/lib/room-blocks";
import { DEFAULT_DESKTOP_ICONS } from "@/lib/desktop-icons";
import { getMoonPhase } from "@/lib/moon-phase";
import { MoonPhaseSvg } from "@/components/MoonPhaseSvg";
import { RoseBloomDial } from "@/components/RoseBloomDial";
import { ThemeToggleLink } from "@/components/ThemeToggle";
import { DesktopGrid } from "@/components/DesktopGrid";

// Force server-render every visit — moon phase is always current.
export const dynamic = "force-dynamic";

const NIGHT_PALETTE = MUCHA_COLORWAYS.ivory.dark;

const DAY_PALETTE = {
  bg: ROSE_GOTHIC_DAY.bg,
  paper: ROSE_GOTHIC_DAY.paper,
  ink: ROSE_GOTHIC_DAY.ink,
  accent: ROSE_GOTHIC_DAY.rose,
  accent2: ROSE_GOTHIC_DAY.roseDeep,
  mute: ROSE_GOTHIC_DAY.inkMute,
  hair: ROSE_GOTHIC_DAY.hair,
} as const;

export default async function RoomPage({
  searchParams,
}: {
  searchParams?: Promise<{ day?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const dayOverride = params.day;
  const refDate = dayOverride
    ? new Date(`${dayOverride}T12:00:00+09:00`)
    : new Date();

  const theme = await getTheme();
  const isDay = theme === "day";
  const p = isDay ? DAY_PALETTE : NIGHT_PALETTE;
  const moon = getMoonPhase();

  // Layout cookie drives tile/link split for secondary links row.
  const layoutCookie = (await cookies()).get(ROOM_LAYOUT_COOKIE)?.value;
  const { tiles, links } = resolveRoom(
    layoutCookie ? decodeURIComponent(layoutCookie) : null,
  );

  // Desktop icons — only the 6 "tile" rooms show as iPhone-style icons.
  const desktopIcons = DEFAULT_DESKTOP_ICONS.filter((icon) =>
    tiles.some((t) => t.id === icon.id),
  );

  // Day-of-month for rose dial.
  const jst = new Date(refDate.getTime() + 9 * 3600 * 1000);
  const dayOfMonth = jst.getUTCDate();

  return (
    <main
      className="kimi-room-desktop"
      style={{
        background: p.bg,
        color: p.ink,
        fontFamily: '"Cormorant Garamond","Noto Serif JP",serif',
      }}
    >
      {/* —— hero / clock area —— */}
      <div className="kimi-desktop-hero">
        <Link
          href="/chat"
          aria-label={
            isDay
              ? `open chat — rose day ${dayOfMonth}`
              : `open chat — ${moon.name}`
          }
          title={isDay ? `day ${dayOfMonth}` : moon.name}
          className="kimi-desktop-hero-link"
        >
          {isDay ? (
            <RoseBloomDial
              day={dayOfMonth}
              size={56}
              accentMain={DAY_PALETTE.accent2}
              accentDeep={DAY_PALETTE.accent}
              hairline={DAY_PALETTE.accent}
            />
          ) : (
            <MoonPhaseSvg phase={moon.fraction} size={56} />
          )}
        </Link>
      </div>

      {/* —— icon grid (iPhone springboard) —— */}
      <DesktopGrid
        icons={desktopIcons}
        extra={
          <div className="kimi-desktop-links">
            <ThemeToggleLink current={theme} color={p.mute} />
            {links.map((b) => (
              <Link
                key={b.id}
                href={b.href}
                className="kimi-desktop-link"
              >
                {b.name.toLowerCase()}
              </Link>
            ))}
            <Link
              href="/backstage"
              className="kimi-desktop-link kimi-desktop-link--strong"
            >
              backstage
            </Link>
          </div>
        }
      />
    </main>
  );
}
