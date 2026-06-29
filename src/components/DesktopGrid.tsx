"use client";

import type { DesktopIconData } from "@/lib/desktop-icons";
import { DesktopIcon } from "@/components/DesktopIcon";

/**
 * DesktopGrid — iPhone-springboard-style icon grid.
 *
 * Layout:
 * - 3 columns on mobile (iOS Home Screen 比例).
 * - 4 columns on tablet (≥640px).
 * - Icon cells are evenly spaced with CSS Grid.
 *
 * Extensibility:
 * - `icons` prop is the full list — callers (e.g. /room) decide which
 *   subset of ROOM_BLOCKS to display.
 * - `extra` slot allows injecting non-icon content (links, toggles)
 *   below the grid while keeping the layout self-contained.
 */

export function DesktopGrid({
  icons,
  extra,
}: {
  icons: DesktopIconData[];
  extra?: React.ReactNode;
}) {
  return (
    <div className="kimi-desktop-grid-wrapper">
      {/* —— icon grid —— */}
      <div className="kimi-desktop-grid">
        {icons.map((icon) => (
          <DesktopIcon key={icon.id} icon={icon} />
        ))}
      </div>

      {/* —— optional extra row (addon links, theme toggle, backstage) —— */}
      {extra != null && <div className="kimi-desktop-extra">{extra}</div>}
    </div>
  );
}
