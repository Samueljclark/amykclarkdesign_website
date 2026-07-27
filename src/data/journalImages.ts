// Journal post hero images (DESIGN_BRIEF.md 5.6, IMAGE-MANIFEST.md's standing
// "real photos as placeholders" rule). Every post gets a real photograph, never
// a blank box.
//
// The three photographs themselves moved to `photos.ts` on 2026-07-26, when
// ServiceList's hover stage became the fourth surface drawing on the same
// files — alt text and blur-up strings (6.7) belong in exactly one copy. This
// file stays as the journal's name for them, so `content.config.ts`'s derived
// `heroImage` enum and every existing import keep working unchanged.

import { photos, type Photo, type PhotoKey } from './photos';

export type JournalImage = Photo;
export type JournalImageKey = PhotoKey;

export const journalImages = photos;
