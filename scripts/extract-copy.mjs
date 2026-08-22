#!/usr/bin/env node
// Regenerates docs/handoff/CURRENT-SITE-COPY.md from the built site. Used
// twice already (2026-08-18 for the first-person rewrite, 2026-08-19 for the
// third-person reversion) from a session scratchpad each time and never
// committed until now. Commit history for CURRENT-SITE-COPY.md itself is the
// record of every previous run.
//
// PAGES below trimmed 2026-08-19 (post-Meeting-4 pass, Task 14): the four
// service sub-pages (Task 1) and the three Portfolio routes (Task 2, flag-
// disabled) no longer build, so this script would fail trying to read HTML
// that doesn't exist in dist/. Restore the Portfolio rows the day
// FLAGS.portfolioEnabled goes back to true; the service sub-page rows are
// gone for good along with the pages themselves.
//
// Usage: npm run build && node scripts/extract-copy.mjs
// (or: npm run extract-copy, after a build)
//
// Distinct from scripts/export-site-copy.mjs, which is an older, separate
// extractor writing to docs/handoff/SITE-COPY-EXPORT.md and has not been
// re-run since 2026-07-28 (it still lists the deleted /signature-pieces
// page). The two were never reconciled into one tool. Flagged, not fixed,
// here — deciding which one is canonical is Sam's call, not something to
// resolve as a side effect of a copy-voice pass.
//
// Reads compiled HTML out of dist/, not source files, because dist/ is the
// one place guaranteed to reflect exactly what a visitor sees regardless of
// which of the three places (a `pages` content collection entry, the
// `journal` collection, or a hardcoded .astro page) a given piece of copy
// actually lives in.
//
// A tag-walking, priority-pass extractor (not a real HTML parser — no
// dependency in package.json does that job and adding one for this felt like
// the wrong tradeoff). It captures every piece of visible, user-facing text
// in reading order: headings, paragraphs, links, buttons, form field labels
// and hints, dropdown options, list items, and stray spans — tagged with
// what kind of element each line came from. Also flags recognizable
// AI-generated-copy patterns ("it's not X, it's Y", "seamlessly", "journey",
// etc.) inline as [AI-TELL], as a prompt for a voice-pass reviewer, not an
// edit.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, 'dist');
const OUT_PATH = path.join(ROOT, 'docs', 'handoff', 'CURRENT-SITE-COPY.md');

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first, then re-run this script.');
  process.exit(1);
}

const PAGES = [
  ['Home (/)', 'index.html'],
  ['About (/about)', 'about/index.html'],
  ['Process (/process)', 'process/index.html'],
  ['Services overview (/services)', 'services/index.html'],
  ['Blinds landing page (/blinds)', 'blinds/index.html'],
  ['Cincinnati (/cincinnati)', 'cincinnati/index.html'],
  ['Northern Kentucky (/northern-kentucky)', 'northern-kentucky/index.html'],
  ['Design Journal index (/journal)', 'journal/index.html'],
  ['Journal: How to Read a Fabric (/journal/how-to-read-a-fabric)', 'journal/how-to-read-a-fabric/index.html'],
  ['Journal: Drapery, Shades, or Blinds (/journal/drapery-shades-or-blinds)', 'journal/drapery-shades-or-blinds/index.html'],
  ['Journal: What Makes a Window Treatment Look Expensive (/journal/what-makes-a-window-treatment-look-expensive)', 'journal/what-makes-a-window-treatment-look-expensive/index.html'],
  ['Contact (/contact)', 'contact/index.html'],
  ['Thank You (/contact/thank-you)', 'contact/thank-you/index.html'],
  ['404 (/404)', '404.html'],
];

const ENTITIES = [
  [/&amp;/g, '&'], [/&#39;/g, "'"], [/&apos;/g, "'"], [/&quot;/g, '"'],
  [/&nbsp;/g, ' '], [/&copy;/g, '©'], [/&mdash;/g, '—'],
  [/&ndash;/g, '–'], [/&hellip;/g, '…'], [/&rsquo;/g, '’'],
  [/&lsquo;/g, '‘'], [/&rdquo;/g, '”'], [/&ldquo;/g, '“'],
];
function decodeEntities(s) {
  for (const [re, rep] of ENTITIES) s = s.replace(re, rep);
  return s;
}
function plainText(inner) {
  return decodeEntities(inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '))
    // An inline <a>word</a>, immediately followed by punctuation leaves a
    // stray space when the tags are blanked out ("upholstery ," instead of
    // "upholstery,"). Cosmetic only -- the words themselves are untouched.
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

function extract(file) {
  let html = fs.readFileSync(path.join(DIST, file), 'utf8');

  const title = decodeEntities((html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1].trim());
  const desc = decodeEntities((html.match(/<meta name="description" content="([^"]*)"/i) || [, ''])[1]);

  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : html;

  const consumed = [];
  const isConsumed = (s, e) => consumed.some(([cs, ce]) => s >= cs && e <= ce);
  const overlaps = (s, e) => consumed.some(([cs, ce]) => s < ce && e > cs);

  const out = [];

  // PASS 0: <select name="..."> ... </select> — grouped as one line, options joined.
  // Remove from body afterward so its <option> text never gets picked up elsewhere.
  const selectRe = /<select\b[^>]*name="([^"]*)"[^>]*>([\s\S]*?)<\/select>/gi;
  let sm;
  const selectRanges = [];
  while ((sm = selectRe.exec(body))) {
    const [full, name, inner] = sm;
    const start = sm.index, end = start + full.length;
    const opts = [...inner.matchAll(/<option[^>]*>([^<]*)<\/option>/gi)]
      .map(o => decodeEntities(o[1]).trim())
      .filter(Boolean);
    out.push({ start, tag: `DROPDOWN OPTIONS (${name})`, text: opts.join(' | ') });
    selectRanges.push([start, end]);
  }
  for (const [s, e] of selectRanges) consumed.push([s, e]);

  // PASS 1: highest-priority leaf/semantic tags — these win over any wrapping <li> or <a>.
  const priorityTags = ['blockquote', 'figcaption', 'button', 'legend', 'summary', 'th', 'td',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'label', 'textarea'];
  const priRe = new RegExp(`<(${priorityTags.join('|')})\\b([^>]*)>([\\s\\S]*?)<\\/\\1>`, 'gi');
  let pm;
  while ((pm = priRe.exec(body))) {
    const [full, tag, attrs, inner] = pm;
    const start = pm.index, end = start + full.length;
    if (isConsumed(start, end)) continue;
    // A <p class="field..."> wraps its <select>'s full markup, and stripping
    // tags alone leaves every <option>'s text behind as if it were running
    // prose ("Budget Select one Under $2,500 $2,500 to $7,500 ..."). A closed
    // dropdown only ever shows its one selected value, so that is not really
    // "visible reading-order text" the way a paragraph is. Blank out any
    // select range nested inside this element before flattening to text --
    // the options themselves are still fully captured by their own dedicated
    // DROPDOWN OPTIONS line.
    let innerForText = inner;
    const innerStart = start + full.indexOf(inner);
    for (const [ss, se] of selectRanges) {
      if (ss >= innerStart && se <= innerStart + inner.length) {
        const ls = ss - innerStart, le = se - innerStart;
        innerForText = innerForText.slice(0, ls) + innerForText.slice(le);
      }
    }
    // A <p> that wraps nothing but bare links (e.g. 404's "View Portfolio" /
    // "Return home" CTA row) is a link group, not a sentence -- flattening it
    // loses the fact that it's two separate, clickable, differently-targeted
    // labels. Detected by: strip every <a>...</a> out and see if anything
    // real is left. A p with prose AROUND an inline link (a journal post
    // linking mid-sentence to a service page) still merges normally, since
    // that case reads correctly as one flowing sentence.
    const withoutAnchors = innerForText.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, '');
    if (tag === 'p' && plainText(withoutAnchors) === '' && /<a\b/i.test(innerForText)) {
      continue; // leave the whole range unconsumed; Pass 2 captures each <a>
    }
    const text = plainText(innerForText);
    consumed.push([start, end]);
    if (!text) continue;
    let label = tag.toUpperCase();
    if (tag === 'button') label = 'BUTTON';
    if (tag === 'label') label = 'FIELD LABEL';
    if (tag === 'legend') label = 'FIELDSET LEGEND';
    if (tag === 'th' || tag === 'td') label = 'TABLE CELL';
    if (tag === 'textarea') label = 'TEXTAREA (empty, no default text)';
    out.push({ start, tag: label, text });
  }

  // PASS 2: anchors <a>...</a>. Skipped (like compound <li>s below) when they
  // overlap something already captured -- e.g. ServiceList's whole-card link,
  // which wraps a name span AND a separate <p> description; both were already
  // captured individually in Pass 1, so re-emitting the anchor's merged text
  // would just duplicate the paragraph line.
  const aRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let am;
  while ((am = aRe.exec(body))) {
    const [full, attrs, inner] = am;
    const start = am.index, end = start + full.length;
    if (isConsumed(start, end)) continue;
    // Overlap means part of this anchor was already captured by something more
    // specific (Pass 1). Skip emitting the anchor itself, but deliberately do
    // NOT mark its full range consumed -- anything still uncaptured inside it
    // (e.g. a bare name span sitting beside the already-captured paragraph)
    // must remain available for Pass 4.
    if (overlaps(start, end)) continue;
    const text = plainText(inner);
    consumed.push([start, end]);
    if (!text) continue;
    out.push({ start, tag: 'LINK', text });
  }

  // PASS 3: <li> — only when it has no overlap with anything already captured
  // (i.e. a true leaf list item, like a nav entry). Compound <li>s (testimonial
  // rotator items wrapping a blockquote+figcaption) are skipped here because
  // their children were already captured individually in Pass 1/2.
  const liRe = /<li\b([^>]*)>([\s\S]*?)<\/li>/gi;
  let lm;
  while ((lm = liRe.exec(body))) {
    const [full, attrs, inner] = lm;
    const start = lm.index, end = start + full.length;
    if (isConsumed(start, end)) continue;
    // Same reasoning as the anchor pass above: a compound <li> (e.g. the
    // testimonial rotator's wrapper) already had its real content captured by
    // Pass 1/2, so skip it here without over-consuming the range.
    if (overlaps(start, end)) continue;
    const text = plainText(inner);
    consumed.push([start, end]);
    if (!text) continue;
    out.push({ start, tag: 'LIST ITEM', text });
  }

  // PASS 4: bare <span>/<strong> not already consumed and not aria-hidden — inline
  // callouts that sit outside any p/label (e.g. a standalone eyebrow span).
  const spanRe = /<(span|strong)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let spm;
  while ((spm = spanRe.exec(body))) {
    const [full, tag, attrs, inner] = spm;
    const start = spm.index, end = start + full.length;
    if (isConsumed(start, end)) continue;
    if (/aria-hidden="true"/.test(attrs)) continue;
    const text = plainText(inner);
    consumed.push([start, end]);
    if (!text) continue;
    out.push({ start, tag: tag.toUpperCase(), text });
  }

  out.sort((a, b) => a.start - b.start);

  const dedup = [];
  for (const item of out) {
    const prev = dedup[dedup.length - 1];
    if (prev && prev.text === item.text && prev.tag === item.tag) continue;
    dedup.push(item);
  }
  return { title, desc, lines: dedup };
}

function wordCount(str) {
  return (str.match(/[A-Za-z0-9''-]+/g) || []).length;
}

// Recognizable AI-copy tell patterns, checked against each captured line's text.
const AI_TELL_PATTERNS = [
  /\bis not just\b/i, /\bisn't just\b/i, /\bnot just\b.*\bbut\b/i,
  /\bit's not\b.{0,60}\bit's\b/i, /\bit is not\b.{0,60}\bit is\b/i,
  /\bmore than just\b/i, /\bwhether you'?re\b/i, /\bat the end of the day\b/i,
  /\bin today'?s\b/i, /\belevate(s|d)?\b/i, /\bunlock(s|ing)?\b/i,
  /\bseamless(ly)?\b/i, /\bjourney\b/i, /\bdive into\b/i, /\bgame[- ]changer\b/i,
];
function findAiTell(text) {
  return AI_TELL_PATTERNS.some((re) => re.test(text));
}

let md = [];
let totalWords = 0;
const perPage = [];
let aiTellCount = 0;

for (const [label, file] of PAGES) {
  const { title, desc, lines } = extract(file);
  let pageText = [title, desc, ...lines.map(l => l.text)].join(' ');
  const wc = wordCount(pageText);
  totalWords += wc;
  perPage.push({ label, wc });

  md.push(`\n## ${label}\n`);
  md.push(`**Word count:** ${wc}\n`);
  md.push(`**Meta title:** ${title}`);
  md.push(`**Meta description:** ${desc}\n`);
  for (const l of lines) {
    const isTell = findAiTell(l.text);
    if (isTell) aiTellCount++;
    const flag = isTell ? '[AI-TELL] ' : '';
    md.push(`- **[${l.tag}]** ${flag}${l.text}`);
  }
}

const today = new Date().toISOString().slice(0, 10);
const aiTellLine = aiTellCount === 0
  ? '**Zero `[AI-TELL]` flags were found anywhere on the site.**'
  : `**${aiTellCount} \`[AI-TELL]\` flag(s) found** — see the pages above for which lines.`;

const header = [
  '# Current Site Copy — Amy K Clark Design',
  '',
  `Extracted verbatim from the production build (\`npm run build\` -> \`dist/\`) on ${today} by`,
  '`scripts/extract-copy.mjs`. Regenerate any time the copy changes: `npm run build && npm run',
  'extract-copy` (or `npm run extract-copy`, after a build — see package.json).',
  '',
  'This file is self-contained: every page\'s copy is below in full, in reading order, with no',
  'references back to the repository. It is a record of what is actually live, not input for a',
  'rewrite pass. Paste it into a separate conversation if a rewrite pass is ever needed.',
  '',
  `**Total word count across all ${PAGES.length} pages: ${totalWords}**`,
  '',
  '## Word count per page',
  '',
  ...perPage.map(p => `- ${p.label}: ${p.wc}`),
  '',
  '## How to read this file',
  '',
  'Each page section lists every piece of visible, user-facing text in the order it appears on',
  'the rendered page: headings, subheads, body paragraphs, links, buttons, nav labels, form field',
  'labels and helper text, dropdown options, and footer copy. The bracketed tag before each line',
  '(e.g. `[H1]`, `[BUTTON]`, `[FIELD LABEL]`) describes what kind of element it is, not a',
  'formatting instruction.',
  '',
  'Where a sentence is built on an "it\'s not X, it\'s Y" construction or another recognizable',
  'AI-generated-copy pattern, it is marked inline with `[AI-TELL]` immediately before the line.',
  'This is a flag for a voice-pass reviewer, not an edit -- the text itself is untouched. The',
  'flags come from an automated pattern scan (listed patterns: "not just... but", "it\'s not...',
  'it\'s", "more than just", "whether you\'re", "at the end of the day", "in today\'s", "elevate(s)",',
  '"unlock(s)", "seamless(ly)", "journey", "dive into", "game-changer") — it is not a substitute',
  'for a manual read.',
  '',
  aiTellLine,
  '',
  '---',
].join('\n');

fs.writeFileSync(OUT_PATH, header + md.join('\n') + '\n', 'utf-8');
console.log(`Wrote ${OUT_PATH}`);
console.log('Total words:', totalWords);
console.log('Pages:', PAGES.length);
