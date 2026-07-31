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
import { photos } from './photos';

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
  // First-person, the on-page voice everywhere else on the site (SITE-COPY-
  // REWRITE.md). `metaDescription` is the separate third-person sentence for
  // <meta name="description"> — search snippets read better naming the
  // business, matching the pattern every other page's meta tag already
  // follows even though its own on-page body copy is first person. Falls
  // back to `scope` if unset.
  scope: string;
  metaDescription?: string;
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
    scope: 'Amy chose the fabric and made the drapery and the banded roman shade for this room.',
    metaDescription:
      'Amy selected the fabric and made the drapery and banded roman shade for this living room.',
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
      fabricHouse: 'the lines she represents',
      rooms: 'Living room',
    },
  },
  {
    // Ivory House (2026-07-28). The site's first whole-house project and
    // first project shot by Kelsee, not a substitute crop. Confirmed scope
    // per Amy, via Sam: drapery throughout; the kitchen island's rattan
    // stool cushions; the reupholstered breakfast-room dining chairs; two
    // sage lumbar pillows on the living room's barrel chairs; the white wood
    // blinds in the bay-window breakfast room; one sage sofa pillow; and the
    // round navy "ball" pillow. Everything else visible in these photos —
    // the sofa, the barrel and rattan chairs themselves, the fur armchair,
    // any pillow not named above — is not hers, per the same standing rule
    // as `scope` on every project. Full selection record, what was
    // disqualified and why, and the ownership reasoning behind each frame:
    // IMAGE-MANIFEST.md.
    //
    // Two rooms in this shoot are described together in Amy's own account
    // (the reupholstered dining chairs and the bay-window blinds, "that same
    // room") but read as physically distinct spaces in the photographs —
    // different floors, different window treatment, family photos visible
    // in one that aren't in the other. Flagged as an open question in
    // ASK-AMY.md rather than resolved by assumption; nothing here depends on
    // the two rooms being the same space.
    slug: 'ivory-house',
    name: 'Ivory House',
    image: photos['ivory-house-bay-window'].image,
    alt: photos['ivory-house-bay-window'].alt,
    blurDataURL: photos['ivory-house-bay-window'].blurDataURL,
    scope:
      "Amy made the drapery throughout this house, reupholstered the breakfast room's dining chairs, made the kitchen island's rattan stool cushions, and made three of the pillows shown here. She did not design or supply the furniture itself.",
    metaDescription:
      'Amy made the drapery, reupholstered the dining chairs, and made the cushions and pillows shown in this whole-house project.',
    lead: {
      image: photos['ivory-house-bay-window'].image,
      alt: photos['ivory-house-bay-window'].alt,
      blurDataURL: photos['ivory-house-bay-window'].blurDataURL,
    },
    supporting: [
      {
        image: photos['ivory-house-living-room'].image,
        alt: photos['ivory-house-living-room'].alt,
        blurDataURL: photos['ivory-house-living-room'].blurDataURL,
      },
      {
        image: photos['ivory-house-header-detail-1'].image,
        alt: photos['ivory-house-header-detail-1'].alt,
        blurDataURL: photos['ivory-house-header-detail-1'].blurDataURL,
      },
      {
        image: photos['ivory-house-header-detail-2'].image,
        alt: photos['ivory-house-header-detail-2'].alt,
        blurDataURL: photos['ivory-house-header-detail-2'].blurDataURL,
      },
      {
        image: photos['ivory-house-blinds-detail'].image,
        alt: photos['ivory-house-blinds-detail'].alt,
        blurDataURL: photos['ivory-house-blinds-detail'].blurDataURL,
      },
      {
        image: photos['ivory-house-dining-chair'].image,
        alt: photos['ivory-house-dining-chair'].alt,
        blurDataURL: photos['ivory-house-dining-chair'].blurDataURL,
      },
      {
        image: photos['ivory-house-kitchen-cushions'].image,
        alt: photos['ivory-house-kitchen-cushions'].alt,
        blurDataURL: photos['ivory-house-kitchen-cushions'].blurDataURL,
      },
      {
        image: photos['ivory-house-lumbar-pillows'].image,
        alt: photos['ivory-house-lumbar-pillows'].alt,
        blurDataURL: photos['ivory-house-lumbar-pillows'].blurDataURL,
      },
      {
        image: photos['ivory-house-ball-pillow'].image,
        alt: photos['ivory-house-ball-pillow'].alt,
        blurDataURL: photos['ivory-house-ball-pillow'].blurDataURL,
      },
    ],
    spec: {
      treatment: 'Drapery, blinds, reupholstered dining chairs, cushions and pillows',
      fabricHouse: 'the lines she represents',
      rooms: 'Living room, breakfast room, kitchen',
    },
  },
];
