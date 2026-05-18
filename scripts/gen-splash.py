"""
gen-splash.py — generate iOS PWA splash PNG from one source image.

Source
- icon-app.png (fox + rose + Mucha frame illustration). Processing:
  crop 6% margin (去 outer frame 圆角), alpha-cut black bg (RGB < 20 →
  transparent), centered 65% width on portrait canvas with `#0c0c0c`
  bg (matches /room night Obsidian).

Why crop 6% — source image has thin gold rounded-rectangle frame at ~5%
margin. Cropping 6% removes frame cleanly; cost is upper corner vine
flourish (smaller of two ornament pairs). Side vines kept.

Sizes (9 portrait + 1 ipad fallback):
- iPhone X / 11 Pro                 (375×812 @3)   → 1125×2436
- iPhone 12-15 / 13 / 14            (390×844 @3)   → 1170×2532
- iPhone 14 Pro / 15 Pro            (393×852 @3)   → 1179×2556
- iPhone 16 Pro                     (402×874 @3)   → 1206×2622
- iPhone XS Max / 11 Pro Max        (414×896 @3)   → 1242×2688
- iPhone 12-15 Pro Max / 14 Plus    (428×926 @3)   → 1284×2778
- iPhone 14/15 Pro Max              (430×932 @3)   → 1290×2796
- iPhone 16 Pro Max                 (440×956 @3)   → 1320×2868
- iPad fallback                     (1024×1366 @2) → 2048×2732
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image


SOURCE = Path(__file__).resolve().parent.parent / "assets" / "splash-source" / "icon-app.png"
OUT_DIR = Path(__file__).resolve().parent.parent / "public"
BG = "#0c0c0c"
CROP_PCT = 0.06
IMG_OCCUPY_PCT = 0.65

SPLASH_SIZES: list[tuple[str, int, int]] = [
    ("apple-splash-1125x2436.png", 1125, 2436),
    ("apple-splash-1170x2532.png", 1170, 2532),
    ("apple-splash-1179x2556.png", 1179, 2556),
    ("apple-splash-1206x2622.png", 1206, 2622),
    ("apple-splash-1242x2688.png", 1242, 2688),
    ("apple-splash-1284x2778.png", 1284, 2778),
    ("apple-splash-1290x2796.png", 1290, 2796),
    ("apple-splash-1320x2868.png", 1320, 2868),
    ("apple-splash-2048x2732-ipad.png", 2048, 2732),
]


def prepare_image(src_path: Path) -> Image.Image:
    src = Image.open(src_path).convert("RGBA")
    W, H = src.size
    crop_px = int(min(W, H) * CROP_PCT)
    cropped = src.crop((crop_px, crop_px, W - crop_px, H - crop_px))
    arr = np.array(cropped)
    bg_mask = (arr[:, :, :3] < 20).all(axis=2)
    arr[bg_mask] = [0, 0, 0, 0]
    return Image.fromarray(arr)


def gen_splash(image: Image.Image, w: int, h: int, out: Path) -> None:
    img_size = int(w * IMG_OCCUPY_PCT)
    resized = image.resize((img_size, img_size), Image.LANCZOS)
    canvas = Image.new("RGBA", (w, h), BG)
    x = (w - img_size) // 2
    y = (h - img_size) // 2
    canvas.paste(resized, (x, y), resized)
    canvas.convert("RGB").save(out)


def main() -> int:
    if not SOURCE.exists():
        print(f"source missing: {SOURCE}")
        return 1
    image = prepare_image(SOURCE)
    print(f"source: {SOURCE.name} ({image.size}, alpha cropped + bg cut)")
    for name, w, h in SPLASH_SIZES:
        out = OUT_DIR / name
        gen_splash(image, w, h, out)
        print(f"  {name} ({w}×{h}) → {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
