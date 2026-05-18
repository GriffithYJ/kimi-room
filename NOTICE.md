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

**Source**: canon V1 design assets · hand-traced / rendered for kimi-room visual system. Released here under the repository's AGPL v3 license alongside the source code.

---

## `public/entry-motion.png` + `public/icon-192.png` + `public/icon-512.png` + `public/apple-touch-icon.png`

**Source**: canon V1 brand visual (玫瑰狐狸 + Mucha). These are **kimi-room / kimi-airp brand markers** · forks are free to keep them as upstream identity or replace per `public/icon-*.png` README section (apple-touch-icon + icon-192 + icon-512 are user-replaceable for instance branding; entry-motion is the upstream brand identity and is not documented as user-replaceable).
