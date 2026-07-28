// Signature pieces — the finished pillows Amy has made and can make again.
// Powers /signature-pieces only. See that page's header for why it exists and
// what it deliberately is not.
//
// **These are the first two photographs on this site that are not
// placeholders.** Every other image is a real photo standing in for a better
// real photo (IMAGE-MANIFEST.md's standing rule); these two are the actual
// objects, shot against a plain ground.
//
// The `name` fields are descriptive of the weave, not Amy's own names for
// these pieces — she may well have her own, and if she does they should
// replace these. Flagged in BUILD-PLAN.md and ASK-AMY.md rather than
// presented as settled.
//
// Nothing here states a size, a fabric house, a price, or who a piece was
// made for. None of that is established, and rule 1 bans the price question
// outright.

import type { PhotoKey } from './photos';

export interface SignaturePiece {
  slug: string;
  name: string;
  photo: PhotoKey;
  description: string;
}

export const signaturePieces: SignaturePiece[] = [
  {
    slug: 'canal-houses',
    name: 'Canal Houses',
    photo: 'canal-house-pillow',
    description:
      'A whole street woven into one long pillow. Gabled fronts leaning on each other, every window picked out in thread rather than printed on. The navy piping is cut and set by hand around the edge, which is what keeps a busy fabric from looking loose.',
  },
  {
    slug: 'dot-weave',
    name: 'Dot Weave',
    photo: 'woven-dot-pillow',
    description:
      'A blue-grey ground with a small cream and ochre figure repeating across it, and enough texture in the weave that the pattern changes as the light moves. The ochre piping picks the quietest color in the cloth rather than the loudest, which is usually the right call.',
  },
];
