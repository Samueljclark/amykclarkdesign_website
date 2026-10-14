// `sizes` for images shown with `object-fit: cover` (2026-10-14, audit fix).
//
// A browser picks a srcset candidate from `sizes`, which describes the width
// of the box. When the photograph is wider (relative to its height) than the
// box, `cover` scales it up until the box's HEIGHT is filled and crops the
// sides, so the visible part needs a source that many times wider than the
// box. Stating only the box width made the browser fetch a file too small for
// the crop: measured down to 45% of retina density on landscape photos shown
// in 4:5 portrait boxes. Multiplying the stated sizes by the crop factor asks
// for the file that is actually needed; photos that already fit the box are
// left unchanged (factor 1).

import type { ImageMetadata } from 'astro';

/** How much wider than the box the source must be, given the box's
 *  width/height ratio. Never less than 1. */
export function coverScale(image: ImageMetadata, boxAspect: number): number {
  return Math.max(1, image.width / image.height / boxAspect);
}

/** Multiplies every length in a `sizes` string by `factor`, keeping media
 *  conditions and units: "(min-width: 900px) 24rem, 90vw" x1.5 becomes
 *  "(min-width: 900px) 36rem, 135vw". */
export function scaleSizes(sizes: string, factor: number): string {
  if (factor === 1) return sizes;
  return sizes
    .split(',')
    .map((entry) =>
      entry.replace(/([\d.]+)(vw|rem|em|px)\s*$/, (_, n: string, unit: string) => {
        const scaled = Math.round(parseFloat(n) * factor * 100) / 100;
        return `${scaled}${unit}`;
      })
    )
    .join(',');
}

/** Convenience: scaled sizes for `image` shown in a box of `boxAspect`. */
export function coverSizes(image: ImageMetadata, boxAspect: number, sizes: string): string {
  return scaleSizes(sizes, coverScale(image, boxAspect));
}
