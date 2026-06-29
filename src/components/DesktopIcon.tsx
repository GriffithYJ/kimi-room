"use client";

import Link from "next/link";
import type { DesktopIconData } from "@/lib/desktop-icons";

/**
 * DesktopIcon — a single app icon on the iPhone-style grid.
 *
 * Renders:
 * - A rounded-square circle with the module's single letter inside,
 *   coloured per Mucha palette.
 * - The module name in small text below.
 * - Optional notification badge (reserved for future use).
 *
 * Tap navigates to `href` using Next.js <Link> (client-side routing).
 * Long-press / context-menu is reserved for future "edit" mode.
 */

export function DesktopIcon({ icon }: { icon: DesktopIconData }) {
  return (
    <Link
      href={icon.href}
      className="kimi-desktop-icon group"
      aria-label={`Open ${icon.name}`}
    >
      {/* —— icon circle —— */}
      <span
        className="kimi-desktop-icon-circle"
        style={{ background: icon.color }}
      >
        <span className="kimi-desktop-icon-letter">{icon.letter}</span>

        {/* badged (future) */}
        {icon.badge !== undefined && icon.badge > 0 && (
          <span className="kimi-desktop-icon-badge">
            {icon.badge > 99 ? "99+" : icon.badge}
          </span>
        )}
      </span>

      {/* —— label —— */}
      <span className="kimi-desktop-icon-label">
        {icon.label ?? icon.name}
      </span>
    </Link>
  );
}
