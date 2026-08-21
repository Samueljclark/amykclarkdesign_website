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
    // Was a path to one of the four service sub-pages; those pages were
    // removed 2026-08-19 (post-Meeting-4 pass, Task 1) and consolidated into
    // one Services overview. Every post still names which service category
    // it belongs to (5.6's "internally links to at least one service page"
    // requirement) — the link just always resolves to `/services` now,
    // built in journal/[slug].astro rather than looked up from this value.
    relatedService: z.enum(['Custom Drapery', 'Blinds and Shades', 'Upholstery', 'Soft Furnishings']),
    heroImage: z.enum(journalImageKeys),
  }),
});

// Long-form pages (Phase 2, "make copy bulk-swappable"): About, Process, both
// location pages, and Contact's intro + FAQ. Same mechanism as `journal`
// above — one markdown file per page, frontmatter for the fixed fields
// (title, meta, lead paragraphs), body markdown for the flowing H2 prose
// sections. Not every page has body prose (Process's content is its numbered
// `steps`, not free text; Contact's is its `faqs`), so `body` is allowed to
// be empty rather than forcing every page into the same shape.
//
// `faqs` and `steps` are structured list fields, not markdown, because each
// one also feeds something besides prose: the accordion component (`steps`
// doesn't, but `faqs` does) and FAQPage JSON-LD (`faqs`) — Faq.astro
// generates that schema straight from these strings, so they have to stay
// real, typed data rather than something parsed back out of freeform markdown.
//
// `decisionCategoriesHeading`/`decisionCategoriesIntro`/`decisionCategories`
// were here for the Blinds and Shades service sub-page's accordion. Removed
// 2026-08-19 (post-Meeting-4 pass, Task 1) along with that page — the four
// service sub-pages are gone and no other page in this collection ever used
// these fields.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    seoTitle: z.string().max(60),
    description: z.string().max(155),
    // Label-style text above the H1 (e.g. "Services", "Service area"). Not
    // every page has one visually, but all the ones this collection covers
    // do.
    eyebrow: z.string(),
    title: z.string(),
    // One entry per paragraph, rendered above the lead image (or, on
    // Contact, above the form). An array rather than one long string so a
    // multi-paragraph lead (Contact) doesn't need hand-rolled markdown just
    // to get a paragraph break.
    lead: z.array(z.string()),
    faqs: z.array(z.object({ title: z.string(), content: z.string() })).optional(),
    steps: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
  }),
});

export const collections = { journal, pages };
