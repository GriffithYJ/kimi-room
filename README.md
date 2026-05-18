# kimi-web

Private companion room. Next.js 16 App Router + Tailwind v4.

## Dev

```bash
cd apps/kimi-web
npm run dev
# http://localhost:3000
```

or from repo root:

```bash
npx turbo dev --filter=kimi-web
```

## Structure

```
src/app/          routes (public + backstage + stubs)
src/components/   Hero / GrainOverlay / etc.
src/lib/          kimi client stub + stores (IDB) + utils
public/images/
├── portraits/   self single
├── mood/        ambient vibe
└── timeline/    anniversary imagery
```

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

## Not done yet

- `ask/` API (needs gateway public endpoint + intimate filter both layers)
- `guestbook/` backend (pre-approve flow)
- `ecg/` aggregation (weekly granularity only — privacy)
- `backstage/` password wall (middleware + HttpOnly cookie + timingSafeEqual)
- OG image generation
- Domain flip (DNS + cert + nginx)
