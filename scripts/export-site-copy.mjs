#!/usr/bin/env node
// Regenerates docs/handoff/SITE-COPY-EXPORT.md from the built site (Phase 2 of the
// copy-bulk-swap work, BUILD-PLAN.md). Run `npm run build` first — this
// script reads compiled HTML out of `dist/`, not source files, because
// `dist/` is the one place that is guaranteed to reflect exactly what a
// visitor sees regardless of which of the three places (a `pages` content
// collection entry, the `journal` collection, or a handful of remaining
// hardcoded .astro pages) a given piece of copy actually lives in.
//
// Usage: npm run build && node scripts/export-site-copy.mjs
// (or: npm run export-copy, after a build)
//
// **Honest limits, not silently glossed over:**
// - This is a plain regex/tag-walker over known class names, not a real HTML
//   parser (no dependency in package.json does that job, and adding one for
//   a one-off script felt like the wrong tradeoff). It works because this
//   codebase's compiled markup is consistently simple — plain headings,
//   paragraphs, and a handful of well-known component classes. If a future
//   page introduces a genuinely new structure, this script's output for that
//   page will look wrong in an obvious way (a missing section, a stray
//   fragment), not silently corrupt — check the diff after running it.
// - It mirrors the ORIGINAL export's overall structure (page-by-page,
//   **H1:**/**H2:**/**BUTTON:**/**FIELD:** markers) closely enough that
//   editing copy is still a find-and-replace against one predictable
//   document. It is not guaranteed byte-identical to the hand-built
//   2026-07-27 original in every formatting choice (e.g. whether a repeated
//   list item's name and description share one bulleted line) — that
//   original was hand-curated, this is generated from real markup, and the
//   two conventions don't always agree on cosmetics.
// - The "Every testimonial on file" section at the end of the original export
//   (full, un-fragmented review text collected directly from Amy, most of it
//   never rendered on the site at all) CANNOT be regenerated from the build —
//   it isn't in the compiled HTML by definition. This script preserves that
//   section verbatim from the existing file rather than dropping it.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(rootDir, 'dist');
// Output moved out of the repo root 2026-08-03 with the docs reorganization.
// This path is load-bearing: leave it pointing at docs/handoff/ or the next
// `npm run export-copy` drops the file back at the root and undoes the tidy.
const outPath = path.join(rootDir, 'docs', 'handoff', 'SITE-COPY-EXPORT.md');

if (!existsSync(distDir)) {
  console.error('dist/ not found. Run `npm run build` first, then re-run this script.');
  process.exit(1);
}

const readDist = (relPath) => {
  const file = path.join(distDir, relPath, 'index.html');
  if (!existsSync(file)) {
    console.error(`Missing build output: dist/${relPath}/index.html`);
    process.exit(1);
  }
  return readFileSync(file, 'utf-8');
};

const readDistFile = (relPath) => {
  const file = path.join(distDir, relPath);
  if (!existsSync(file)) {
    console.error(`Missing build output: dist/${relPath}`);
    process.exit(1);
  }
  return readFileSync(file, 'utf-8');
};

// ---- Entity decoding + tag stripping ----

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  apos: "'",
  hellip: '…',
  mdash: '—',
  copy: '©',
  nbsp: ' ',
};

function decodeEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&(\w+);/g, (m, name) => (name in ENTITIES ? ENTITIES[name] : m));
}

function stripTags(str) {
  return decodeEntities(str.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function stripScriptsAndSvg(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '');
}

function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  return m ? m[1] : html;
}

// ---- Generic block extraction over a slice of HTML ----
// A single alternation, walked once with `exec` in a loop, so output stays
// in document order. (An earlier draft ran one independent global regex per
// tag type — that grouped all headings together, then all buttons, then all
// paragraphs, destroying reading order. Each branch below starts with a
// distinct literal tag name, so at any given position at most one branch can
// match, and a single `exec` loop walks the string left to right.)

const BLOCK_SOURCES = [
  /<h1[^>]*>([\s\S]*?)<\/h1>/,
  /<h2[^>]*>([\s\S]*?)<\/h2>/,
  /<button[^>]*class="[^"]*accordion__trigger[^"]*"[^>]*>([\s\S]*?)<\/button>/,
  // Same tag-boundary guard as `<p>` below — "a" alone would also open on
  // `<article>`, `<aside>`, `<audio>` if any ever appear inside <main>.
  /<a(?=[\s>])[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*>([\s\S]*?)<\/a>/,
  /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/,
  /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/,
  /<li[^>]*>([\s\S]*?)<\/li>/,
  // `(?=[\s>])` requires "p" to be immediately followed by whitespace or the
  // tag's closing `>` — without it, `<p[^>]*>` also matches `<picture ...>`
  // (both start with "p"), swallowing the entire <picture><source><img>
  // block as if it were paragraph text. Real bug, caught by a testimonial
  // heading and quote silently merging into one unmarked line during testing.
  /<p(?=[\s>])[^>]*>([\s\S]*?)<\/p>/,
];

const BLOCK_FORMATTERS = [
  (t) => `**H1:** ${t}`,
  (t) => `**H2:** ${t}`,
  (t) => `**BUTTON:** ${t}`,
  (t) => `**BUTTON:** ${t}`,
  (t) => `*${t}*`,
  (t) => t,
  (t) => `- ${t}`,
  (t) => t,
];

const BLOCK_PATTERN = new RegExp(BLOCK_SOURCES.map((r) => r.source).join('|'), 'g');

function extractBlocks(html) {
  const src = stripScriptsAndSvg(html);
  const lines = [];
  let match;
  BLOCK_PATTERN.lastIndex = 0;
  while ((match = BLOCK_PATTERN.exec(src))) {
    const groupIndex = match.slice(1).findIndex((g) => g !== undefined);
    const text = stripTags(match[groupIndex + 1] ?? '');
    if (text) lines.push(BLOCK_FORMATTERS[groupIndex](text));
  }
  return lines;
}

function pageMeta(html) {
  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  const description = decodeEntities(
    html.match(/<meta name="description" content="([\s\S]*?)"/)?.[1] ?? ''
  );
  return { title, description };
}

function renderPage(label, html) {
  const { title, description } = pageMeta(html);
  const mainHtml = extractMain(html);
  const out = [];
  out.push(`## ${label}`, '');
  out.push(`**Page title:** ${title}`, '');
  if (description) out.push(`**Meta description:** ${description}`, '');
  for (const line of extractBlocks(mainHtml)) {
    out.push(line, '');
  }
  return out;
}

// ---- Site-wide: nav + footer, extracted once from Home ----

function renderSiteWide(homeHtml) {
  const navMatch = homeHtml.match(/<header class="site-nav[\s\S]*?<\/header>/);
  const footerMatch = homeHtml.match(/<footer class="site-footer[\s\S]*?<\/footer>/);

  // The wordmark link ("Amy K Clark Design", site-nav__mark) is the logo,
  // not a nav item — excluded the same way the original export excluded it.
  const navList = navMatch ? navMatch[0].match(/<ul class="site-nav__list"[\s\S]*?<\/ul>/)?.[0] ?? '' : '';
  const navItems = [...navList.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/g)].map((m) => stripTags(m[1])).filter(Boolean);

  const footerItems = footerMatch
    ? [...footerMatch[0].matchAll(/<(?:p|a)[^>]*>([\s\S]*?)<\/(?:p|a)>/g)]
        .map((m) => stripTags(m[1]))
        .filter(Boolean)
    : [];

  const out = ['## Site-wide', '', '### Main navigation', ''];
  for (const item of navItems) out.push(`- ${item}`);
  out.push('', '### Footer', '');
  for (const item of footerItems) out.push(`- ${item}`);
  out.push('');
  return out;
}

// ---- Contact page: form fields need their own pass (labels + options) ----

function renderContactForm(html) {
  const formMatch = html.match(/<form[\s\S]*?<\/form>/);
  if (!formMatch) return [];
  const form = formMatch[0];
  const lines = [];

  // Honeypot is deliberately excluded (never shown to a visitor) — dropped
  // before the general field pass so it doesn't leak in.
  const withoutHoneypot = form.replace(/<p class="consultation-form__honeypot"[\s\S]*?<\/p>/, '');

  const fieldRe = /<(label|legend)[^>]*>([\s\S]*?)<\/\1>([\s\S]*?)(?=<label[^>]*>|<legend[^>]*>|<div class="consultation-form__submit"|$)/g;
  let m;
  while ((m = fieldRe.exec(withoutHoneypot))) {
    const [, tag, labelHtml, rest] = m;
    const labelText = stripTags(labelHtml);
    lines.push(`**${tag === 'legend' ? 'FIELD GROUP' : 'FIELD'}:** ${labelText}`, '');

    const checks = [...rest.matchAll(/<span>([\s\S]*?)<\/span>/g)].map((c) => stripTags(c[1]));
    for (const c of checks) lines.push(`**FIELD:** ${c}`, '');

    const options = [...rest.matchAll(/<option[^>]*>([\s\S]*?)<\/option>/g)]
      .map((o) => stripTags(o[1]))
      .filter(Boolean);
    for (const o of options) lines.push(`    - ${o}`, '');
  }

  const submitMatch = form.match(/<button type="submit"[^>]*>([\s\S]*?)<\/button>/);
  if (submitMatch) lines.push(`**BUTTON:** ${stripTags(submitMatch[1])}`, '');

  return lines;
}

// ---- Build the document ----

const homeHtml = readDist('.');
const sections = [];

sections.push(
  '# Amy K Clark Design — Site Copy Export',
  '',
  'Every piece of human-readable copy on amykclarkdesign.com, regenerated from the ' +
    `built site on ${new Date().toISOString().slice(0, 10)} by \`scripts/export-site-copy.mjs\`. ` +
    '**Extraction only — nothing here is rewritten, summarised, shortened, or edited.** ' +
    'Where copy reads oddly out of context, that is how it reads on the page.',
  '',
  "Excluded deliberately: markup, CSS, code comments, image alt text, file paths, " +
    "and the form's hidden honeypot field (never shown to a visitor).",
  '',
  'Pages are in nav order, then the two footer-only location pages, then 404. ' +
    'Site-wide navigation and footer copy appears once, at the top, rather than ' +
    'repeated on every page.',
  '',
  '---',
  ''
);

sections.push(...renderSiteWide(homeHtml));
sections.push('---', '');

sections.push(...renderPage('Home', homeHtml));
sections.push('---', '');

sections.push(...renderPage('Portfolio', readDist('portfolio')));
sections.push('---', '');

sections.push(...renderPage('Portfolio — Collected Living Room', readDist('portfolio/collected-living-room')));
sections.push('---', '');

sections.push(...renderPage('Portfolio — Ivory House', readDist('portfolio/ivory-house')));
sections.push('---', '');

sections.push(...renderPage('Signature Pieces', readDist('signature-pieces')));
sections.push('---', '');

sections.push(...renderPage('Services', readDist('services')));
sections.push('---', '');

sections.push(...renderPage('Services — Custom Drapery', readDist('services/drapery')));
sections.push('---', '');

sections.push(...renderPage('Services — Blinds and Shades', readDist('services/blinds-shades')));
sections.push('---', '');

sections.push(...renderPage('Services — Upholstery', readDist('services/upholstery')));
sections.push('---', '');

sections.push(...renderPage('Services — Soft Furnishings', readDist('services/soft-furnishings')));
sections.push('---', '');

sections.push(...renderPage('About', readDist('about')));
sections.push('---', '');

sections.push(...renderPage('Process', readDist('process')));
sections.push('---', '');

sections.push(...renderPage('Journal', readDist('journal')));
sections.push('---', '');

for (const [slug, label] of [
  ['how-to-read-a-fabric', 'Journal — How to Read a Fabric'],
  ['drapery-shades-or-blinds', 'Journal — Drapery, Shades, or Blinds'],
  ['what-makes-a-window-treatment-look-expensive', 'Journal — What Makes a Window Treatment Look Expensive'],
]) {
  sections.push(...renderPage(label, readDist(`journal/${slug}`)));
  sections.push('---', '');
}

// Contact needs the specialised form pass in place of the generic <p>/<li>
// walk for everything between the intro and the FAQ accordion.
{
  const html = readDist('contact');
  const { title, description } = pageMeta(html);
  const mainHtml = extractMain(html);
  const introSection = mainHtml.match(/<section class="[^"]*text-page__intro[^"]*"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
  const faqSection = mainHtml.match(/<section class="[^"]*\bfaq\b[^"]*"[\s\S]*?<\/section>/)?.[0] ?? '';

  sections.push('## Contact', '');
  sections.push(`**Page title:** ${title}`, '');
  sections.push(`**Meta description:** ${description}`, '');
  for (const line of extractBlocks(introSection)) sections.push(line, '');
  for (const line of renderContactForm(html)) sections.push(line);
  for (const line of extractBlocks(faqSection)) sections.push(line, '');
  sections.push('---', '');
}

sections.push(...renderPage('Contact — Thank You', readDist('contact/thank-you')));
sections.push('---', '');

sections.push(...renderPage('Cincinnati', readDist('cincinnati')));
sections.push('---', '');

sections.push(...renderPage('Northern Kentucky', readDist('northern-kentucky')));
sections.push('---', '');

sections.push(...renderPage('404 — Page Not Found', readDistFile('404.html')));

// ---- Preserve the hand-collected testimonial archive verbatim ----
// Not derivable from the build (see header comment). If the existing export
// doesn't have this section yet, there's nothing to carry forward.
if (existsSync(outPath)) {
  const existing = readFileSync(outPath, 'utf-8');
  const archiveMatch = existing.match(/## Every testimonial on file[\s\S]*$/);
  if (archiveMatch) {
    sections.push('---', '');
    sections.push(archiveMatch[0]);
  }
}

const finalOutput = sections.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
writeFileSync(outPath, finalOutput, 'utf-8');
console.log(`Wrote ${outPath} (${finalOutput.split('\n').length} lines).`);
