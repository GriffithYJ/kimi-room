"""
rose-erode.py — calibrated PIL erosion for rose silhouette PNG family.

History
- 260515 e5baba6: alpha-fix (white bg → transparent), silhouette solid, no 镂空
- 260515 681251e: threshold 235→175 + scipy 2-iter binary_erosion → 镂空 prominent
- 260516 (this script): dial back via threshold/iter args; per-set tuning

Inputs
  --input PATH         alpha-fixed silhouette PNG (e5baba6 state)
  --output PATH        output PNG
  --threshold INT      RGB > threshold → transparent (highlight cutoff)
                       235 = none, 200 = light only, 175 = mid-tone (681251e)
  --iter INT           scipy binary_erosion iterations
                       0 = no edge shrink, 1 = subtle, 2 = aggressive (681251e)

Usage
  uv run scripts/rose-erode.py --input /tmp/rose-source/rose.png \\
      --output public/icons/rose-cal-b.png --threshold 200 --iter 1
"""
from __future__ import annotations

import argparse
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import binary_erosion


def erode_rose(input_path: str, output_path: str, threshold: int, iterations: int) -> None:
    im = Image.open(input_path).convert("RGBA")
    arr = np.array(im)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

    light_mask = (r > threshold) & (g > threshold) & (b > threshold) & (a > 0)
    light_count = int(light_mask.sum())
    arr[light_mask] = [0, 0, 0, 0]

    if iterations > 0:
        opaque = arr[:, :, 3] > 0
        eroded = binary_erosion(opaque, iterations=iterations)
        edge_lost = opaque & ~eroded
        edge_count = int(edge_lost.sum())
        arr[edge_lost] = [0, 0, 0, 0]
    else:
        edge_count = 0

    Image.fromarray(arr).save(output_path)
    print(
        f"{input_path} → {output_path} | threshold={threshold} light={light_count}px"
        f" | iter={iterations} edge={edge_count}px"
    )


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--threshold", type=int, default=200)
    p.add_argument("--iter", dest="iterations", type=int, default=1)
    args = p.parse_args()
    erode_rose(args.input, args.output, args.threshold, args.iterations)
    return 0


if __name__ == "__main__":
    sys.exit(main())
