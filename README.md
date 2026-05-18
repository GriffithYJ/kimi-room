# kimi-room

A Mucha-aesthetic companion PWA shell. Client-side only — data lives in
IndexedDB, your LLM key lives in your browser, no backend required.
AGPL v3.

## Dev

```bash
npm install
npm run dev
# http://localhost:3000
```

## Build

```bash
npm run build
npm run build:kimi-room   # explicit mode flag (default)
```

## Configure

After first launch, open `/settings` to set:

- LLM endpoint + model + API key (OpenAI-format chat completion)
- Your name + companion name (used in {{user}} / {{char}} templates)
- Portrait images (one self, one companion)
- App title (default "kimi")

All settings + chat history + memories live in browser IndexedDB.

## Structure

```
src/app/          routes (/room/* + /chat + /backstage + /playlist + /settings)
src/components/   UI (mucha / heartbeat / calendar / study / disc / ...)
src/lib/          stores (IDB) + LLM client + palettes + utils
public/icons/     41 SVG icons (rose / fox / etc.)
public/fonts/     Cormorant Garamond + Noto Serif SC/JP
public/images/
├── mood/         ambient vibe (ships with ~30 default JPGs · NOTICE.md)
├── portraits/    drop your own (self + companion JPG)
├── scenes/       drop your own (chat scene backgrounds)
└── timeline/     drop your own (anniversary imagery)
```

## Modules

- **I · Heartbeat** sky (50-slot memory map) + score (30-day pulse staff)
- **II · Keepsakes** one-line keepsake notes (60-char cap)
- **III · Study** books + custom categories (per-category 共读 LLM toggle)
- **IV · Calendar** + finance overlay
- **V · Memory** review + import md/txt auto-split
- **VI · Disc** conversation scrap garden (screenshot vision OCR optional)

## Images

- Drop compressed JPG/PNG into the right subdir.
- Each file **<500KB**. Use [squoosh.app](https://squoosh.app) or ImageOptim.
- Filenames: lowercase + hyphens only. `mood-vienna-piano.jpg`, no spaces / CJK / caps.
- MJ originals live elsewhere (iCloud / Dropbox); commit the compressed web-size copy only.
- Commit in batches: `add: mood images batch 1 (vienna + ocean)`.

## Design system

Colors (see `src/app/globals.css` `@theme`):

- `base` `#0c0c0c` · `deep-charcoal` `#1a1a1a` · `text` `#d8d0c8`
- `muted-gold` `#b8a070` · `accent-warm` `#c4a060`
- `muted-rose` `#9a7a7a` · `deep-red` `#8b3a3a` · `silver` `#b8b0a8`

Fonts: Cormorant Garamond (serif) / Noto Serif JP / Noto Sans JP (body).

Global treatment: `filter: saturate(0.85) brightness(0.92)` on all `<img>`, SVG grain overlay at ~4% opacity `mixBlendMode: overlay`.

## Deploy

```bash
vercel login
vercel           # .vercel.app preview URL
```

Set `NEXT_PUBLIC_KIMI_GATEWAY` env var to your own MCP/backend URL if wiring beyond client-side IDB + LLM proxy. Custom domain optional — point any owned domain at the Vercel project.
