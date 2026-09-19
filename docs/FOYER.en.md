> 中文：./FOYER.md

# Foyer

`/` — the front door of the room. One screen, no scrolling, one way in: **INTRARE** → `/room`.

The count of days, today's date, tonight's moon, the panel that belongs to this season all sit on this one screen; the six rooms are behind it. If you would rather go straight inside, switch it off in settings.

---

## Four screens

Two axes, multiplied: **day/night** (`kimi-theme` cookie, shared with the whole site, so `/room` follows) × **composition** (`kimi-foyer` cookie, this page only).

| | Full · PLENA | Triptych · TRIA |
|---|---|---|
| **Day** | Side curtains: two floral panels printed into the cream paper from either edge, a drawn arch between them | Three niches carrying the Seasons: this season on the left, the next on the right, ROSA fixed in the middle |
| **Night** | One stained-glass window filling the screen, the light through it taking that window's colour, gold dust settling, gilt scrollwork at the corners | The same window cut into three pieces, one per lancet |

The two round seals at the bottom each turn one axis. A seal shows **where tapping it takes you**, not where you are: by day it shows a moon · NOX, by night a sun · DIES; on the full screen three arches · TRIA, on the triptych a single arch · PLENA.

## Gestures

- **Swipe left or right**: turns to another stained-glass window at night, another pair of flowers by day. Left alone, it changes once a day (local calendar day, turning at your midnight).
- **Tap either side**: on the day/full screen, tapping a flower column turns it too.
- This screen does not scroll, so pull-to-refresh is switched off here — otherwise a slightly downward swipe would reload the page mid-gesture.

## Settings

All under "门厅 / Foyer" in `/backstage/settings`, kept in your own browser (`localStorage`).

| Item | Key | Notes |
|---|---|---|
| Start date | `kimi-foyer-since` | The number on the foyer counts from this day; the day itself is 0. Left empty it becomes the day you first opened the foyer, recorded automatically |
| The line | `kimi-foyer-quote` | One line per newline — where it breaks is part of the typesetting |
| Door note | `kimi-foyer-note` | The small slip under AD ALTERUM · P.S. |
| Weather | `kimi-foyer-weather` | `{label, lat, lng}`. Open-Meteo, no key required; leave it empty and the row does not appear |
| Skip the foyer | `kimi-foyer-skip` cookie | Opening the site goes straight to `/room` |

The names come from "TA 的名字" / "你的名字" higher up the same page (the `{{char}}` / `{{user}}` pair); the portraits from the two uploads under "头像". With nothing uploaded you get two empty rings — the ring is the place.

Every derived time is computed from **this device's local clock**: the day count, the Latin greeting (NOX SERENA / AVE · AURORA / POST MERIDIEM / VESPER), the Latin date, the next hundred-day mark, the moon, which panel hangs today. The server only reads the cookies to decide which of the four screens to render; the content waits for the page to mount — so the first frame is a plain ground, never the wrong timezone.

## Using your own pictures

Assets live in `public/images/foyer/`, the registries in `src/lib/foyer.ts`:

```ts
// Day · full: the two flower columns, one turn per day. The arrays line up.
export const FLOWER_PANELS = ["/images/foyer/mucha-a1.webp", …];
export const FLOWER_NAMES  = ["CONVALLARIA", …];

// Day · triptych: the seasons on either side; whichever season it is, hangs.
export const SEASON_PANELS = [{ src: …, name: "VER" }, …];

// Night, both screens. `light` is the colour of the light through the glass,
// "R,G,B", taken from that window's dominant hue.
// `pieces` is for the triptych: three cut pieces [left, centre, right]; without
// them each lancet crops the one whole window.
// `bg` is the ground behind those pieces — the black out of the image, so the
// three of them meet the dark without a seam.
export const WINDOW_PANELS = [
  { src: …, name: "…", light: "240,190,90" },
  { src: …, name: "…", light: "119,108,216", pieces: [l, c, r], bg: "#000000" },
];
```

Flower columns are cut to 242×1008 — that ratio is the shape of the niche, not the shape of the painting, so tall ones are aligned to the top and lose their hem, wide ones are narrowed from the centre. Windows can be given whole. Add as many as you like; the rotation takes the length modulo.

### Whose pictures these are

- The flower columns and *Les Saisons* are decorative panels by **Alphonse Mucha (1860–1939)** from the 1890s, in the public domain.
- The many-panelled window at night is the one **Mucha designed for the New Archbishop's Chapel of St. Vitus Cathedral, Prague** — made 1930, installed 1931. The glass is in the public domain; the photographer of that particular photograph is unknown.
- The gold window is a work by **Marc Chagall (1887–1985)** and is **under copyright until roughly 2055**. It is bundled as a non-commercial default. **A fork deploying commercially must replace it** — or simply delete its entry from `WINDOW_PANELS`, which leaves the St. Vitus window rotating alone and requires no other change.

The full statement is in [NOTICE.md](../NOTICE.md).

## Known edges

- Seasons are split by northern-hemisphere months (3–5 is spring). In the south, change the `3` in `getSeasonIndex()` to `9`.
- The stage is drawn against 402×874. Narrower screens get it at a fixed width, centred, not scaled — so a short screen crowds at the bottom and a tall one leaves space there.
- U is written V throughout the Latin (VESTIBVLVM and its kin). That is deliberate.
