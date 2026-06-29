import { ROOM_BLOCKS, type RoomBlock } from "@/lib/room-blocks";

/**
 * DesktopIconData — shape of a single app icon on the iPhone-style desktop.
 *
 * Extends RoomBlock so existing addon registry drives the desktop layout.
 * Each icon has a letter (used for the empty icon fallback), a color
 * (Mucha palette), and optional custom routing / metadata.
 */
export interface DesktopIconData extends RoomBlock {
  /** Single uppercase letter displayed inside the circle icon. */
  letter: string;
  /** Background colour for the icon circle (Mucha gold/rose/charcoal). */
  color: string;
  /** Optional short label displayed below the icon (defaults to name). */
  label?: string;
  /** Optional notification badge count (future extensibility). */
  badge?: number;
}

/**
 * MUCHA_ICON_COLORS — curated set of Mucha-grade colours for icon circles.
 * Rotated across the grid so adjacent icons don't share a hue.
 */
const MUCHA_ICON_COLORS = [
  "#b8a070", // muted-gold
  "#9a7a7a", // muted-rose
  "#8b3a3a", // deep-red
  "#b8b0a8", // silver
  "#c4a060", // accent-warm
  "#6a5a52", // warm grey (day) / #8a8a8a (night)
  "#5a1820", // oxblood
  "#a89890", // silver-gold
] as const;

/**
 * LETTER_OVERRIDES — some module ids don't map cleanly to a single letter.
 * This map lets us pick a sensible display letter per module.
 */
const LETTER_OVERRIDES: Record<string, string> = {
  "memory-review": "M",
  heartbeat: "H",
  keepsakes: "K",
  study: "S",
  calendar: "C",
  disc: "D",
  atlas: "A",
  graph: "G",
};

/**
 * buildDesktopIcons — derives DesktopIconData[] from the room-block registry.
 *
 * Design rationale: instead of duplicating the module list, we read from
 * ROOM_BLOCKS (single source of truth).  Each block gets a letter and a
 * colour assigned deterministically so registrations are stable across
 * builds.
 *
 * Extensibility: callers can pass an optional filter/map function to
 * customise the desktop (e.g. show only the "tile" slots).
 */
export function buildDesktopIcons(
  filter?: (block: RoomBlock) => boolean,
): DesktopIconData[] {
  const list = filter ? ROOM_BLOCKS.filter(filter) : ROOM_BLOCKS;

  return list.map((block, i) => {
    const letter =
      LETTER_OVERRIDES[block.id] ??
      (block.name[0]?.toUpperCase() ?? "?");
    const color = MUCHA_ICON_COLORS[i % MUCHA_ICON_COLORS.length];
    return {
      ...block,
      letter,
      color,
      label: block.name,
    };
  });
}

/**
 * DEFAULT_DESKTOP_ICONS — the canonical set used by /room (the desktop).
 * Currently returns ALL registered blocks; the tile/link distinction is
 * handled by the grid layout (tiles get icons, links get a secondary area).
 */
export const DEFAULT_DESKTOP_ICONS = buildDesktopIcons();
