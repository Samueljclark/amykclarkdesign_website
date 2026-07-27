import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { journalImages } from './data/journalImages';

// Design Journal (DESIGN_BRIEF.md section 5.6). Markdown-driven, ships with
// three real posts. Every post must internally link to at least one service
// page; `relatedService` makes that link a required, checkable field.
//
// `heroImage` is a key into journalImages.ts rather than a path or an
// `image()` field: alt text and the pre-generated blur-up string (6.7) belong
// with the asset, not repeated in each post's frontmatter. The enum is derived
// from that file, so a typo fails the build instead of shipping a broken image.
const journalImageKeys = Object.keys(journalImages) as [string, ...string[]];

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    // The <title> tag, kept separate from the on-page H1: 8.1 caps titles at 60
    // characters and 5.6's post topics are full sentences that blow that budget
    // once the brand suffix every other page carries is added. Max is 60 here
    // so an over-long one fails the build instead of being silently truncated.
    seoTitle: z.string().max(60),
    description: z.string().max(155),
    publishDate: z.date(),
    relatedService: z.enum([
      '/services/drapery',
      '/services/blinds-shades',
      '/services/upholstery',
      '/services/soft-furnishings',
    ]),
    heroImage: z.enum(journalImageKeys),
  }),
});

export const collections = { journal };
