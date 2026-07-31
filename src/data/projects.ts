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
  // The problem/solution blurb (5.2, added in the 2026-07-31 review): what the
  // room needed and what Amy did about it, two or three sentences, sitting
  // above `scope` on the detail page.
  //
  // **WARNING — the blurbs currently in this file are written strictly from
  // what is already established in IMAGE-MANIFEST.md and Amy's own confirmed
  // scope, and no further.** They describe what the work IS. They do not
  // describe what was wrong with the room beforehand, what the client wanted,
  // or why a fabric was chosen, because none of that is on file for either
  // project. That is exactly the material ASK-AMY.md §1 is trying to get out
  // of one recorded conversation. Do not fill the gap by inventing a
  // narrative — an invented "the room was dark and cold" is worse than a
  // short blurb, and 5.2's whole point is that these are real projects.
  blurb: string;
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
    // DRAFT COPY - NEEDS REWRITE. Two layered treatments on one opening, which
    // is the only thing here established by the photographs and the confirmed
    // scope. What the room needed BEFORE, and why this fabric, are not on file.
    blurb:
      'A wall of French doors carrying two treatments at once: pleated drapery for the frame and softness, and a banded roman shade behind it for the light. Amy chose the fabric and made both.',
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
    // DRAFT COPY - NEEDS REWRITE. Strictly the confirmed scope, restated as
    // prose. This is a whole-house project and the one place a real
    // problem/solution story would earn the most — it is the first thing to
    // replace once Amy has been recorded (ASK-AMY.md §1).
    blurb:
      'One house, four categories, one person. Drapery throughout, white wood blinds in the bay-window breakfast room, the breakfast room chairs reupholstered, and cushions and pillows to finish. Amy made all of it and installed all of it.',
    lead: {
      image: photos['ivory-house-bay-window'].image,
      alt: photos['ivory-house-bay-window'].alt,
      blurDataURL: photos['ivory-house-bay-window'].blurDataURL,
    },
    // Trimmed from eight supporting frames to four, 2026-07-31 (5.2: "a tight,
    // small collage — not a long photo scroll"). Eight full-width frames made
    // the reader scroll a gallery to reach the point of the page.
    //
    // The four kept are one per category of work, so the set still proves the
    // whole-house claim without repeating itself:
    //   living-room       — the wide room shot, drapery in context
    //   header-detail-1   — drapery construction, close
    //   dining-chair      — the upholstery
    //   kitchen-cushions  — the soft furnishings
    // The blinds are already the lead image (the bay window), so a second
    // blinds frame would be the one duplicate in the set.
    //
    // Dropped, and why: `header-detail-2` is near-identical framing to
    // detail-1; `blinds-detail` duplicates the lead; `lumbar-pillows` and
    // `ball-pillow` are two more soft-furnishings frames where
    // kitchen-cushions already carries the category. All four remain in
    // photos.ts and IMAGE-MANIFEST.md — they are cut from this page, not from
    // the site's asset record.
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
        image: photos['ivory-house-dining-chair'].image,
        alt: photos['ivory-house-dining-chair'].alt,
        blurDataURL: photos['ivory-house-dining-chair'].blurDataURL,
      },
      {
        image: photos['ivory-house-kitchen-cushions'].image,
        alt: photos['ivory-house-kitchen-cushions'].alt,
        blurDataURL: photos['ivory-house-kitchen-cushions'].blurDataURL,
      },
    ],
    spec: {
      treatment: 'Drapery, blinds, reupholstered dining chairs, cushions and pillows',
      fabricHouse: 'the lines she represents',
      rooms: 'Living room, breakfast room, kitchen',
    },
  },
];
