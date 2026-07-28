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

// Ivory House (2026-07-28) — the site's first real client-house shoot,
// photographer Kelsee Etmans. See IMAGE-MANIFEST.md for the full selection
// record: what was chosen from the ~27-frame set, what was disqualified and
// why, and the ownership determinations behind each one. Publication
// permission from both the photographer and the homeowner is still
// outstanding — see LAUNCH_CHECKLIST.md.
import ivoryHouseHeroImage from '../assets/images/portfolio/ivory-house/pinch-pleat-drapery-living-room-orb-chandelier.jpg';
import ivoryHouseLivingRoomImage from '../assets/images/portfolio/ivory-house/pinch-pleat-drapery-living-room-french-doors-detail.jpg';
import ivoryHouseHeaderDetail1Image from '../assets/images/portfolio/ivory-house/pinch-pleat-drapery-header-rings-crown-molding.jpg';
import ivoryHouseHeaderDetail2Image from '../assets/images/portfolio/ivory-house/pinch-pleat-drapery-header-second-window.jpg';
import ivoryHouseBayWindowImage from '../assets/images/portfolio/ivory-house/ivory-drapery-white-wood-blinds-bay-window-breakfast-room.jpg';
import ivoryHouseBlindsDetailImage from '../assets/images/portfolio/ivory-house/white-wood-blinds-drapery-bay-window-detail.jpg';
import ivoryHouseLumbarPillowsImage from '../assets/images/portfolio/ivory-house/sage-geometric-lumbar-pillows-cream-barrel-chairs.jpg';
import ivoryHouseKitchenCushionsImage from '../assets/images/portfolio/ivory-house/botanical-cushions-rattan-counter-stools-kitchen-island.jpg';
import ivoryHouseDiningChairImage from '../assets/images/portfolio/ivory-house/houndstooth-reupholstered-dining-chair-breakfast-table.jpg';
import ivoryHouseBallPillowImage from '../assets/images/portfolio/ivory-house/round-knit-pillow-navy-olive-armchair.jpg';

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
  // Ivory House (2026-07-28). Alt text describes what is actually visible in
  // frame, factually — per the site's standing convention, a scope CLAIM
  // (what Amy made vs. what merely furnishes the room) belongs in the
  // project's `scope` line and spec block, not in accessibility text. So a
  // pillow trio or a whole room can be described honestly without asserting
  // authorship of everything the alt text names.
  'ivory-house-hero': {
    image: ivoryHouseHeroImage,
    publicPath: '/images/portfolio/ivory-house/pinch-pleat-drapery-living-room-orb-chandelier.jpg',
    alt: 'Ivory pinch-pleat drapery on a brushed-nickel rod, framing French doors in a living room beneath a wire-orb crystal chandelier',
    blurDataURL:
      'data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAABwBACdASoYAA4APu1iqU2ppaOiMAgBMB2JYwCdABwtMe/7n4INVvcXTUk/AAD4wKYHlWAYX5JIBBQ6zjgEsa6/TLvALju2rAAdGzx5+y4sJVWhZTUNNO09C6Qe13z+SP2inM2ZAn/O5ccJ7ifbNj/f/onL9Hq/4Wt/gknShh1T4AAA',
  },
  'ivory-house-living-room': {
    image: ivoryHouseLivingRoomImage,
    publicPath:
      '/images/portfolio/ivory-house/pinch-pleat-drapery-living-room-french-doors-detail.jpg',
    alt: 'Ivory pinch-pleat drapery framing French doors in a living room, with a wire-orb chandelier and an abstract painting on the near wall',
    blurDataURL:
      'data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAAAwBACdASoYABAAPu1iqU2ppaQiMAgBMB2JYwCdMoAC48Xcfw5Dt7hpBYAA3Z/E6Wmch9lo4oA6uaknGVZo+sTfkFCfR3cuJSOGLEXchMucWq44/CkTJQZ9GVBflKAlKJYid9y3R/NS2Au84fMS2Xvvni2x9WskyncGtoDEYsjl4/DxUv9jOH+BTUAAAA==',
  },
  'ivory-house-header-detail-1': {
    image: ivoryHouseHeaderDetail1Image,
    publicPath: '/images/portfolio/ivory-house/pinch-pleat-drapery-header-rings-crown-molding.jpg',
    alt: 'Detail of ivory pinch-pleat drapery rings on a brushed-nickel rod, with crown molding above and the panel falling into a stacked pleat',
    blurDataURL:
      'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADQAwCdASoYABAAPu1mqk2ppaQiMAgBMB2JZQC7AFY5W5VmoJhCMMAAp34CPHXLdar4F07bJSstdMf+wTmEgiTXXDviHGNVkOvHF7n3b1m+1TsMSbup4AAA',
  },
  'ivory-house-header-detail-2': {
    image: ivoryHouseHeaderDetail2Image,
    publicPath: '/images/portfolio/ivory-house/pinch-pleat-drapery-header-second-window.jpg',
    alt: 'Ivory pinch-pleat drapery header at a second window, showing pleat spacing and rod-and-ring hardware against white trim',
    blurDataURL:
      'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoYAA0APu1yrU+pp6QiMAgBMB2JYwC7AGf8DekQfgpRogAAxw35I7C2wzAP0GpQtdTunN3uvdk7+CjORUOVJYWGFdIHnm1gAAA=',
  },
  'ivory-house-bay-window': {
    image: ivoryHouseBayWindowImage,
    publicPath:
      '/images/portfolio/ivory-house/ivory-drapery-white-wood-blinds-bay-window-breakfast-room.jpg',
    alt: 'Ivory pinch-pleat drapery and white wood blinds dressing three bay windows in a breakfast room, beneath a wire-orb chandelier and ceiling medallion',
    blurDataURL:
      'data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAACwAwCdASoYAA0APu1mqk4ppaOiMAgBMB2JZwAASoCp8hrW6UGTYAD+2VdvhChwGIZaDbuSL//1xS+vUAOEq+WcinP61dSsqS81mC02GLSbEVI3q3f0OyIxFPDmmdQ6qwHNN1HH92UDJJ/0gJK3ezj7T540AAAA',
  },
  'ivory-house-blinds-detail': {
    image: ivoryHouseBlindsDetailImage,
    publicPath: '/images/portfolio/ivory-house/white-wood-blinds-drapery-bay-window-detail.jpg',
    alt: 'White wood blinds beneath ivory pinch-pleat drapery in a bay-window breakfast room, with a wire-orb chandelier overhead',
    blurDataURL:
      'data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAACwAwCdASoYAA0APu1iqU2ppaOiMAgBMB2JZwAAQslIcb/1UfA7QAD+wiDk/8XDIwul6YMCeXX7dEEIxbgEQmdaswPWlSZJB04rSajdZeYl2NkLJ1EC3EgNoS2KAwJj54DVdZ23MJB1N0sSAhFo0MvSwx/2poOoEpiQwAAA',
  },
  'ivory-house-lumbar-pillows': {
    image: ivoryHouseLumbarPillowsImage,
    publicPath:
      '/images/portfolio/ivory-house/sage-geometric-lumbar-pillows-cream-barrel-chairs.jpg',
    alt: 'Two sage geometric-print lumbar pillows on a pair of cream barrel chairs, beside a console table',
    blurDataURL:
      'data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAAAQBACdASoYAA0APu1iqU2ppaQiMAgBMB2JZwCdACPfhNka66iuOY+UYADh6NibaLNAlWjY+C35+4iT0nOH6Vnb7qPj122kePVZhcmep/jtFbymrvaNuLW1Ly3Uhsrdol8/b9/Z0dajNYXHytFDjKTF+xL+fVeZfuzIoufpCKGl6eWudFFE/JyDr9ScjXka2mBVgAAA',
  },
  'ivory-house-kitchen-cushions': {
    image: ivoryHouseKitchenCushionsImage,
    publicPath:
      '/images/portfolio/ivory-house/botanical-cushions-rattan-counter-stools-kitchen-island.jpg',
    alt: 'Botanical-print seat cushions in peach and sage on cream, made for a row of rattan counter stools at a kitchen island',
    blurDataURL:
      'data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAABQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JQBdmUABCfEoMEwG52o0/ps9AAP5VknBiV667FmhPwHI/WtMvW61e4gxdE8+S6O2O0YLWFIg9/fgWw/oevdqIMezCWYINCSeeVBoUFG7hn/RY4xP04WCT3Y8vTGem2IAMhwYoP/QMBz0MOUJGRFY77nmgAAAA',
  },
  'ivory-house-dining-chair': {
    image: ivoryHouseDiningChairImage,
    publicPath:
      '/images/portfolio/ivory-house/houndstooth-reupholstered-dining-chair-breakfast-table.jpg',
    alt: 'A dining chair reupholstered in a rust-and-taupe houndstooth fabric, at a round table in a breakfast room',
    blurDataURL:
      'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAAAQBACdASoYAA0APu1iqU2ppaOiMAgBMB2JYwCdABbpqsmqMmyGBOYgAAD+rugkvjG1SKQbJHHSDn1mp0a0ZbnRWdUDkOGx8PumBpXi8NO0yzZEZaUWX47Mx9t8G7sEq0C1WQ14go4GLxkJeJPoHbEQf7CPCXkZ9MO7xfIzjvs31AyAAAA=',
  },
  'ivory-house-ball-pillow': {
    image: ivoryHouseBallPillowImage,
    publicPath: '/images/portfolio/ivory-house/round-knit-pillow-navy-olive-armchair.jpg',
    alt: 'A round knit pillow in navy and olive, resting on a shaggy cream armchair',
    blurDataURL:
      'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADwAwCdASoYABAAPu1iqk2ppaQiMAgBMB2JYwC7ABuSKER1+K6zdo+YAP6n88tNwk5kOzYrNWLQFizF36uZ9ECp0hDGtpTA7+QeSmhKcVhDYHYvplsSoHzfhYh8atm9TrF/8Lcnn89tXTH+Rx2AAA==',
  },
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
