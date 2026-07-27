// Portfolio project records (DESIGN_BRIEF.md 5.2). One real project exists so
// far — see IMAGE-MANIFEST.md for how its two images were derived.
//
// `image`/`alt`/`blurDataURL` are the Home strip thumbnail. `lead` and
// `supporting` (step 3, BUILD-PLAN.md) are the detail page's gallery: a lead
// shot plus supporting images. The brief asks for three to eight supporting
// images (5.2); only one other real, usable photo of Amy's work exists today
// (the workroom ottoman shot — see IMAGE-MANIFEST.md), so `supporting` ships
// honestly at one image rather than repeating the same two crops to hit a
// count, flagged in BUILD-PLAN.md same as the strip's one-project shortfall
// in step 2.
//
// `spec` fields are left undefined, not guessed, where the real fact isn't
// known yet (lining, hardware) — same "don't invent it" pattern as
// `business.ts`'s opening hours. `SpecBlock.astro` only renders fields that
// are present.
//
// Names are evocative and non-geographic, no leading "The" (brief 5.2).

import type { ImageMetadata } from 'astro';
import collectedLivingRoomImage from '../assets/images/portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg';
import collectedLivingRoomLeadImage from '../assets/images/hero/pleated-drapery-living-room-french-doors-pool-view.jpg';
import ottomanStitchingImage from '../assets/images/about/amy-hand-stitching-check-fabric-ottoman-cutting-table.jpg';

export interface ProjectSpec {
  treatment?: string;
  fabricHouse?: string;
  lining?: string;
  hardware?: string;
  rooms?: string;
}

export interface ProjectImage {
  image: ImageMetadata;
  alt: string;
  blurDataURL: string;
}

export interface Project {
  slug: string;
  name: string;
  image: ImageMetadata;
  alt: string;
  blurDataURL: string;
  scope: string;
  lead: ProjectImage;
  supporting: ProjectImage[];
  spec: ProjectSpec;
}

export const projects: Project[] = [
  {
    slug: 'collected-living-room',
    name: 'Collected Living Room',
    image: collectedLivingRoomImage,
    alt: 'Banded roman shade and pleated drapery framing French doors, with a crystal chandelier overhead',
    blurDataURL:
      'data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAAAwBQCdASoYABUAPu1orlCppaQiqAqpMB2JZwAG0KCFeA8GvwPjvP6bHUT+YIQzyU7j0AD+FSHDV0ubeTAPHbf5413BYJW3pLc2ZHNK0MCBuh5vMwaNlvdw15DG9e1iBJcqwHR2FKUtXrkLqItBnK/DhKwBxjlP+OnZmgp6tjAHPHdy98FzAZDZkNeAJofae+wgRZ+DQT6E0ZUr/QTv/QAA',
    scope: 'Amy selected the fabric and made the drapery and banded roman shade for this living room.',
    lead: {
      image: collectedLivingRoomLeadImage,
      alt: 'Pleated linen drapery framing French doors to a pool patio, with a crystal chandelier above a curved sofa',
      blurDataURL:
        'data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAACQAwCdASoYAA4APu1orU6ppiSiMAgBMB2JZQAAJqLi3qVMQ9VAANjKqbeciNEkpMXDllsCpgoMYdl7ucLubhtqE1JLh7v3/75MyoCwt8lGS7+Oq0L5IIs0IK5IIrEHVgX8zHrArz/FAAAA',
    },
    supporting: [
      {
        image: ottomanStitchingImage,
        alt: "Amy's hands stitching a check-fabric ottoman on the workroom's gridded cutting table",
        blurDataURL:
          'data:image/webp;base64,UklGRrQAAABXRUJQVlA4IKgAAAAQBQCdASoUABsAPtFWpk2oJCOiMBgIAQAaCUAWI+0YM6xTv/HqJLEODA5eoh4khh+AAP6A1FH/ibcZQuuEMg5Bb9qgUg+8MTeydH5d/BbmERZiGbJsiLRQ2+PUcm+DG+P8NtdDhDZFf1313HfX7lH3WkmsrO1kjqlzEbGk6qNAbfKC94avLNB3OZpndDKKEQGcZKeQXRVS3MhjogZaVWt6+6UBmAAAAAA=',
      },
    ],
    spec: {
      treatment: 'Drapery, banded Roman shade',
      fabricHouse: 'the lines I represent',
      rooms: 'Living room',
    },
  },
];
