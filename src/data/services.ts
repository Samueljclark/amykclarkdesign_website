// Home's ServiceList teaser and the /services overview page show the exact
// same four entries (DESIGN_BRIEF.md 5.1, 5.3) — shared here so the name/
// description/href triple isn't duplicated across two files. "The lines I
// represent" stays generic here (rule 8); Lafayette is named by name only on
// its own page, per 5.3.

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
    description: 'Blinds and shades from the lines I represent, chosen for privacy, light, and finish.',
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
