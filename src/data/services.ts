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
    description:
      "Drapery designed around the room's architecture and light, from fabric selection through installation.",
    href: '/services/drapery',
    photo: 'pleated-drapery',
  },
  {
    name: 'Blinds & Shades',
    description: 'Blinds and shades from the lines I represent, chosen for privacy, light, and finish.',
    href: '/services/blinds-shades',
    photo: 'banded-roman-shade',
  },
  {
    name: 'Upholstery',
    description: 'Upholstery and reupholstery that give well-made furniture a considered, finished life.',
    href: '/services/upholstery',
    photo: 'ottoman-stitching',
  },
  {
    name: 'Soft Furnishings',
    description: 'Pillows and cushions, the personal layer of detail that finishes a room.',
    href: '/services/soft-furnishings',
    // Shares the drapery photo. It is the only one of the three that shows
    // pillows and a cushioned seat at all; the two rows are non-adjacent, so
    // the repeat never reads as a stuck image.
    photo: 'pleated-drapery',
  },
];
