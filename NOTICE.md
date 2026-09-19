# NOTICE

This repository ships a small set of third-party assets bundled for convenience.

## `public/images/mood/` — chat scene backgrounds (25 jpg)

| asset | use |
|---|---|
| `paris.jpg` / `vienna.jpg` / `ribbon.jpg` / `kintsugi-blossom.jpg` / `sakura-ink-1.jpg` / `lilies-stairs.jpg` / `peony-scroll.jpg` / `saturn-ink.jpg` / `starfield-tent.jpg` / `white-rose.jpg` etc | chat `/chat` scene backgrounds · canon V1 11 scene template |

**Source**: assembled from public web image sources during canon V1 dev. Original creators unknown; no commercial license obtained.

**Usage stance** (non-commercial fair-use leaning):
- This kimi-room / kimi-airp repository is shipped as a hobbyist open-source PWA shell, **not a commercial product**.
- These images are bundled as default visual options for non-commercial personal use only.
- Forks intending **commercial deployment** (paid hosted SaaS / app store listings / etc) should **replace these images with own-licensed assets** to avoid infringement risk.
- Forks for personal / non-commercial use accept the same fair-use leaning risk profile as upstream.

**To replace**: drop new jpgs into `apps/kimi-web/public/images/mood/`, update scene picker references in `/chat` if any rename, commit + redeploy.

If you are the original creator of any image in this set and want it removed, open an issue at the kimi-room / kimi-airp repo and we will strip it.

---

## `public/images/chat/send/` — the send key's artwork (7 files)

`star-day`, `star-night`, `crest-night`, `moon`, `heart`, `paw`, `bow` — small
glass-and-jelly ornaments used as the picture on the send key.

Collected from public web image sources during canon development. The originals
carry no author or licence metadata and no creator could be identified for any of
them; they appear to be stock or generated 3D renders of a kind that circulates
widely without attribution. Nothing here is claimed as original work.

Bundled as default visual options for non-commercial personal use, on the same
leaning as `public/images/mood/`. A fork deploying commercially should replace
them, which is a matter of dropping files into that folder and editing
`SEND_ART_PRESETS` in `src/components/chat/arcvs/tokens.ts` — or of choosing the
`drawn mark` preset, which uses no picture at all and is drawn in the palette's
own ink.

If you made one of these and want it removed, open an issue and it will be gone
the same day.

---

## `public/images/foyer/` — the foyer's paintings and windows (31 files)

Three groups, with three different copyright situations. Read this before
deploying commercially.

### 1. Alphonse Mucha's posters — public domain

`mucha-a1`–`a6`, `mucha-c1`–`c4`, `mucha-d1`–`d6`, `mucha-f1`–`f2` (the flower
columns) and `mucha-printemps` / `ete` / `automne` / `hiver` (*Les Saisons*,
1896) are decorative panels published by **Alphonse Mucha (1860–1939)** in the
1890s. Mucha died in 1939, so the works entered the public domain in 2009 in
life+70 jurisdictions. The digital files were collected from public web image
sources and individual scan provenance is unknown; a faithful photographic
reproduction of a two-dimensional public-domain work carries no new copyright in
the US (*Bridgeman v. Corel*) and in most of the EU under Art. 14 DSM.

### 2. The St. Vitus window — public-domain glass, photograph of unknown authorship

`baroque-window-2.jpg` and the three cuts `baroque-win2-l` / `-c` / `-r` show the
stained-glass window **designed by Alphonse Mucha for the New Archbishop's
Chapel of St. Vitus Cathedral, Prague** — made 1930, installed 1931, commissioned
by the Slavia bank. It shows the young St. Wenceslas with his grandmother St.
Ludmila at the centre, surrounded by scenes from the lives of SS Cyril and
Methodius.

The window itself is in the public domain (Mucha died 1939). The **photograph**
of it is not a flat reproduction, so the photographer may hold copyright in it;
that photographer is unknown, the file having been collected from a public web
image source.

### 3. `baroque-window.webp` — a work by Marc Chagall, still in copyright

This window is by **Marc Chagall (1887–1985)**. We have not been able to identify
which church it belongs to; Chagall glazed Metz Cathedral (1958–68), the
Fraumünster in Zurich (1970), Reims (1974), St. Stephan in Mainz (1978–85),
Chichester, Tudeley and Hadassah, and this is one of them. Naming a specific one
without evidence would be a worse credit than naming none.

**Chagall's work is under copyright until roughly 2055** in life+70
jurisdictions. This is not an old picture whose owner is untraceable — it is a
twentieth-century artwork with a living estate (ADAGP / ARS represent it), and
the photograph on top of it has an unknown photographer of its own.

It is bundled here knowingly, as a default visual option for non-commercial
personal use, on the same fair-use leaning as `public/images/mood/` above.
**Any fork intending commercial deployment must replace this file**, and a fork
that would rather not carry it at all can drop it today: it is one entry in the
`WINDOW_PANELS` array in `src/lib/foyer.ts`, and removing that entry leaves the
St. Vitus window as the only one in the rotation, with nothing else to change.
See [docs/FOYER.en.md](docs/FOYER.en.md).

If you are the Chagall estate, the photographer of either window, or anyone else
with a claim to these files, open an issue and they will be removed the same day.

### 4. Drawn for this project

`corner-gold-1`, `corner-gold-4`, `corner-rose-1` and `rose-outline` are
hand-drawn for the kimi-room visual system, © 2026 marikagura, licensed
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) like
`public/icons/` below.

---

## `public/fonts/` — Cormorant Garamond + Noto Serif SC / JP (359 woff2)

**Source**: Google Fonts (self-hosted woff2 subsets for offline / 大陆 build).

| family | license |
|---|---|
| Cormorant Garamond | SIL Open Font License 1.1 |
| Noto Serif SC | SIL Open Font License 1.1 |
| Noto Serif JP | SIL Open Font License 1.1 |
| Noto Sans JP | SIL Open Font License 1.1 |

OFL 1.1 permits redistribution; bundled here per `kimi-fonts.css` @font-face declarations.

---

## `public/icons/` — rose + fox SVG / PNG (41 file)

**Source**: hand-drawn for the kimi-room visual system, © 2026 marikagura.

**License**: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) (attribution + non-commercial) — licensed separately from the AGPL code. Free to use and adapt for non-commercial purposes with attribution; no commercial use. Exception: `entry-motion` / the icon brand marks (see below) are reserved.

---

## `public/entry-motion.png` + `public/icon-192.png` + `public/icon-512.png` + `public/apple-touch-icon.png`

**Source**: canon V1 brand visual (玫瑰狐狸 + Mucha). These are **kimi-room / kimi-airp brand markers** · forks are free to keep them as upstream identity or replace per `public/icon-*.png` README section (apple-touch-icon + icon-192 + icon-512 are user-replaceable for instance branding; entry-motion is the upstream brand identity and is not documented as user-replaceable).
