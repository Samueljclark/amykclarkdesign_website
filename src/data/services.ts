// Home's ServiceList teaser and the /services overview page show the exact
// same four entries (DESIGN_BRIEF.md 5.1, 5.3) — shared here so the name/
// description/href triple isn't duplicated across two files. "The lines she
// represents" stays generic here (rule 8); Lafayette is named by name only on
// its own page, per 5.3. Copy is third person as of the 2026-07-31 review.
// DRAFT COPY - NEEDS REWRITE applies to all four `description` strings.

import type { PhotoKey } from './photos';

export interface Service {
  name: string;
  description: string;
  href: string;
  // The photograph ServiceList's hover stage shows for this row. A key into
  // photos.ts, so alt text and the blur-up string travel with the asset.
  // The site has three usable photographs, so one of them is shared by two
  // services — recorded in IMAGE-MANIFEST.md rather than hidden here.
  photo: PhotoKey;
  // Optional `object-position` for the hover stage's 4:5 crop. Only set it
  // where the default centre crop puts the wrong thing in frame — a wide
  // room photograph cropped to 4:5 keeps only its middle ~44%, which is not
  // always where the subject is. Leave unset otherwise.
  objectPosition?: string;
}

export const services: Service[] = [
  {
    name: 'Custom Drapery',
    description: 'Drapery designed around your room and your light, from choosing the fabric to hanging it.',
    href: '/services/drapery',
    // Ivory House (2026-07-28): real drapery-header detail, replacing the
    // substitute hero crop this row shared with Soft Furnishings.
    photo: 'ivory-house-header-detail-1',
  },
  {
    name: 'Blinds and Shades',
    description: 'Blinds and shades from the lines she represents, chosen for privacy, light, and finish.',
    href: '/services/blinds-shades',
    // Ivory House: the bay-window room's white wood blinds — the first
    // dedicated Blinds and Shades photography this site has had.
    photo: 'ivory-house-blinds-detail',
  },
  {
    name: 'Upholstery',
    description: 'Upholstery that gives furniture worth keeping another good life.',
    href: '/services/upholstery',
    // Ivory House: the reupholstered breakfast-room dining chair — the only
    // real finished-upholstery photography this site has had until now
    // (the ottoman-stitching photo elsewhere on the site is a workroom
    // process shot, not a finished piece).
    photo: 'ivory-house-dining-chair',
    // The source is 2000x1103 and the chair sits in its LEFT third; the table,
    // the bowls and the placemats fill the centre and right. A 4:5 crop keeps
    // only the middle ~44% of the width, so the default centred crop framed
    // the table setting and sliced the chair — on the one row whose entire
    // subject is the chair. Pulling the crop window left makes the
    // reupholstered piece the subject and leaves a sliver of table edge for
    // context. Vertical is untouched: a 4:5 crop of a 1.81:1 source uses the
    // full frame height, so only the horizontal term does any work here.
    //
    // 14% was picked by comparing renders at 1280px, not calculated: 24% put
    // the chair in frame but still left it fighting the table for the centre,
    // and below about 10% the chair's own left edge starts getting clipped.
    // At 14% the chair sits centrally and the table edge and window read as
    // context behind it, which is what an upholstery tile should say.
    objectPosition: '14% 50%',
  },
  {
    name: 'Soft Furnishings',
    description: 'Pillows and cushions, the last layer, and often the one that finishes the room.',
    href: '/services/soft-furnishings',
    // Ivory House: the kitchen island's rattan-stool cushions, all four rows
    // now carrying distinct photography instead of two sharing one crop.
    photo: 'ivory-house-kitchen-cushions',
  },
];
