// The site's real photographs, in one place: the `ImageMetadata` handle, the
// descriptive alt text (rule 10), and the pre-generated blur-up string (6.7).
//
// This file exists because the same three photographs now serve four surfaces —
// the Journal, the Portfolio, the service pages, and (as of 2026-07-26)
// ServiceList's hover stage — and the alt text and blur strings must not be
// pasted around. Anything that needs one of these photos imports it from here.
//
// `journalImages.ts` is a thin alias over this file, kept so the journal
// collection's derived enum and every existing import keep working.
//
// All three are the standing-rule placeholders described in IMAGE-MANIFEST.md:
// real photographs standing in for better real photographs. Swap when Kelsee's
// shoot lands.

import type { ImageMetadata } from 'astro';
import canalHousePillowImage from '../assets/images/portfolio/signature-pieces/tapestry-canal-house-lumbar-pillow-navy-piping.jpg';
import wovenDotPillowImage from '../assets/images/portfolio/signature-pieces/woven-dot-lumbar-pillow-blue-ochre-piping.jpg';
import ottomanStitchingImage from '../assets/images/about/amy-hand-stitching-check-fabric-ottoman-cutting-table.jpg';
import bandedRomanShadeImage from '../assets/images/portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg';
import pleatedDraperyImage from '../assets/images/hero/pleated-drapery-living-room-french-doors-pool-view.jpg';

export interface Photo {
  image: ImageMetadata;
  alt: string;
  blurDataURL: string;
  // The verbatim-served master under /public/images/, per section 9. Needed
  // where a schema.org field wants a plain absolute URL rather than an
  // astro:assets-processed, hash-named variant — Article's `image` field.
  // Same bytes as the src/assets copy (BUILD-PLAN's image-serving note).
  publicPath: string;
}

export const photos = {
  // The two pillows added 2026-07-26 are the first photographs on the site
  // that are NOT placeholders: they are the actual finished objects, shot
  // against a plain ground, and they are what /signature-pieces shows.
  'canal-house-pillow': {
    image: canalHousePillowImage,
    publicPath:
      '/images/portfolio/signature-pieces/tapestry-canal-house-lumbar-pillow-navy-piping.jpg',
    alt: 'Lumbar pillow in a woven tapestry of European canal-house facades, finished with navy contrast piping',
    blurDataURL:
      'data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAABQBACdASoYAA4APu1iqU2ppaOiMAgBMB2JZQC2yywBtATxTtsSmrnE8VvgAP7XlCkpRjRKWx5bq+XzGZPUaIwDJ+J7JWSOo5Qtrp2GjqKu+8Tego17f2MvnBYCQw1uGdhBnAEWJPv0EES77XOoZGwMzC/BHiS6vtgy6teLgJsGwPyN92oqcVRdMN0uCJwQAAA=',
  },
  'woven-dot-pillow': {
    image: wovenDotPillowImage,
    publicPath: '/images/portfolio/signature-pieces/woven-dot-lumbar-pillow-blue-ochre-piping.jpg',
    alt: 'Lumbar pillow in a blue-grey textured weave with a small cream and ochre dot motif, finished with ochre contrast piping',
    blurDataURL:
      'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACQAwCdASoYAA8APu1iqU2ppaOiMAgBMB2JZwC7ACIA3qvi3vUAAP5b746SPHIaltkFx/tsuof+YG3rOxdujkzrBavse5qd18G2vr62P8lPqgAA',
  },
  'ottoman-stitching': {
    image: ottomanStitchingImage,
    publicPath: '/images/about/amy-hand-stitching-check-fabric-ottoman-cutting-table.jpg',
    alt: "Amy's hands stitching a check-fabric ottoman on the workroom's gridded cutting table",
    blurDataURL:
      'data:image/webp;base64,UklGRrQAAABXRUJQVlA4IKgAAAAQBQCdASoUABsAPtFWpk2oJCOiMBgIAQAaCUAWI+0YM6xTv/HqJLEODA5eoh4khh+AAP6A1FH/ibcZQuuEMg5Bb9qgUg+8MTeydH5d/BbmERZiGbJsiLRQ2+PUcm+DG+P8NtdDhDZFf1313HfX7lH3WkmsrO1kjqlzEbGk6qNAbfKC94avLNB3OZpndDKKEQGcZKeQXRVS3MhjogZaVWt6+6UBmAAAAAA=',
  },
  'banded-roman-shade': {
    image: bandedRomanShadeImage,
    publicPath: '/images/portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg',
    alt: 'Banded roman shade and pleated drapery framing French doors, with a crystal chandelier overhead',
    blurDataURL:
      'data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAAAwBQCdASoYABUAPu1orlCppaQiqAqpMB2JZwAG0KCFeA8GvwPjvP6bHUT+YIQzyU7j0AD+FSHDV0ubeTAPHbf5413BYJW3pLc2ZHNK0MCBuh5vMwaNlvdw15DG9e1iBJcqwHR2FKUtXrkLqItBnK/DhKwBxjlP+OnZmgp6tjAHPHdy98FzAZDZkNeAJofae+wgRZ+DQT6E0ZUr/QTv/QAA',
  },
  'pleated-drapery': {
    image: pleatedDraperyImage,
    publicPath: '/images/hero/pleated-drapery-living-room-french-doors-pool-view.jpg',
    alt: 'Pleated linen drapery framing French doors to a pool patio, with a crystal chandelier above a curved sofa',
    blurDataURL:
      'data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAACQAwCdASoYAA4APu1orU6ppiSiMAgBMB2JZQAAJqLi3qVMQ9VAANjKqbeciNEkpMXDllsCpgoMYdl7ucLubhtqE1JLh7v3/75MyoCwt8lGS7+Oq0L5IIs0IK5IIrEHVgX8zHrArz/FAAAA',
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
