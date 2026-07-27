# Build Plan — Amy K Clark Design (Astro rebuild)

Authority: `DESIGN_BRIEF.md`. Where this plan interprets the brief, the interpretation
is called out. Nothing below `## Build order` has been built yet.

## Scaffold status (done)

- Astro 5.18.2, static output, sitemap integration, site `https://amykclarkdesign.com`
- `src/styles/tokens.css`: section 3 verbatim — palette, three Archivo roles +
  Newsreader quote role, 58ch measure, 96/160px rhythm, 2px radius cap, motion
  durations from sections 3.7 and 6, indigo restricted to focus rings and hover
  underlines, reduced-motion block verbatim from 6.8
- Fonts self-hosted in `public/fonts/`: `archivo-variable.woff2` (34 KB, weights used:
  400/500 only), `newsreader-300.woff2` (22 KB)
- `src/content.config.ts`: journal collection with required `relatedService` so every
  post links to a service page by construction
- `public/images/` populated with the six real files (see `IMAGE-MANIFEST.md`)
- v1 static site archived to `legacy-static/`, originals in `source-photos/`
- Environment note: this Mac had no Node.js; installed Node 26.5.0 via Homebrew

Two derived values in tokens.css, flagged per the "no values not in the brief" rule:
the clamp() middle terms (the brief gives endpoints 40-92px and 16-17px; the slopes
interpolate between the 375px and 1440px render targets) and the 768px breakpoint for
the 96px→160px section rhythm switch.

## Step 1: Foundation — done, pending your review

Built: `src/styles/global.css` (reset, link-underline device, shade-reveal CSS,
buttons, form control base), `src/scripts/motion.js` (nav scroll state, mobile
toggle, IntersectionObserver reveal — all reduced-motion gated), `SiteNav.astro`,
`SiteFooter.astro`, `Base.astro` (head/meta/canonical/OG per 8.1, font preload,
motion.js include), `src/pages/404.astro`, `public/favicon.svg`,
`src/data/business.ts`. Verified in-browser: clean build, no console errors, nav
toggle/close-on-link-click/Escape all work, transparent-over-hero and solid states
both render correctly, footer renders all real contact/social data, keyboard Tab
order reaches the skip link and first nav item.

**Two bugs found and fixed:**
- Skip-link bled ~4px into view at rest — `top: -3rem` didn't fully cover the box
  (padding + line-height taller than assumed). Fixed with `transform:
  translateY(-150%)`, which is size-independent.
- `<script type="module" src="../scripts/motion.js">` in Base.astro wasn't bundled by
  Astro (rendered as a literal path, browser 404'd, all interactivity silently
  broke). Fixed with Astro's local-script import pattern
  (`<script>import '../scripts/motion.js';</script>`). Worth remembering for any
  future local script tag.

**Interpretation calls, not explicit in the brief:**
- **Indigo-on-dark contrast fallback.** `--indigo` has near-zero contrast against
  `--ground` or dark hero photography. Focus rings and hover underlines fall back to
  `--paper` in dark contexts (`.bg-ground`/`.on-dark`); `--indigo` itself is untouched
  and still the only chromatic value in the system.
- **Nav wordmark + mobile hamburger toggle.** The brief specifies six nav items and
  "no dropdowns, no search icon, no phone number" but says nothing about the site
  name in nav or narrow-width collapse. Added a text wordmark (Label role, links
  home) and a custom-drawn SVG hamburger revealing a full-width panel.
- **OG image.** `public/images/og/og-default.jpg` didn't exist, and `ogImage` is a
  required prop with no fallback. Generated a real 1200x630 crop from the roman-shade
  living room photo as a stand-in until a deliberately art-directed OG image exists.
- **Photo orientation bug**, unrelated to the nav work: `photo-shoot-banded-roman-
  shade-living-room.jpg` and `photo-shoot-leaded-glass-entry-door.jpg` had no EXIF
  orientation tag but were shot with the phone physically rotated, so every viewer
  would render them sideways. Corrected in place via Pillow (`sips --rotate` proved
  unreliable chained with resize/crop). Originals in `/source-photos/` untouched.
  Logged in IMAGE-MANIFEST.md.

Not yet built, deliberately: the accordion and hero-gallery portions of motion.js
(land with the pages that use them), `RevealImage.astro` (step 2).

## Step 2: Home — done, pending your review

Built: `RevealImage.astro` (signature shade-reveal wrapper, `astro:assets` `Picture`
with AVIF/WebP + 5-width srcset, blur-up background layer), `HeroGallery.astro`
(full-screen, array-driven — a real one-item array today), `PortfolioStrip.astro`,
`ServiceList.astro`, `Quote.astro`, `src/data/projects.ts`. `motion.js` gained
`initHeroGallery()` (6.1's cross-dissolve timer + the opening line's once-per-session
timing). Verified with `npm run build` and by reading generated `dist/index.html`
(one `<h1>`, logical heading order, no banned words/pricing language, real alt text,
`--indigo` only in link-underline CSS); later checked in-browser at 375/768/1280,
which surfaced the two bugs below.

**Photo substitution problem.** The two "photo-shoot" images IMAGE-MANIFEST.md had
slotted in as hero/portfolio substitutes were unusable (photographer and equipment in
frame). Two new crops were cut from one of them to serve both slots instead. Full
story and exact crop regions: IMAGE-MANIFEST.md's "Correction" section.

**Hero/nav overlap bug.** `SiteNav` (`position: fixed`, 4.5rem tall) overlapped the
hero's location line at every width — `.hero__content`'s top padding never accounted
for the nav's height. Fixed with a shared `--nav-height` token, used by both
`SiteNav`'s `min-height` and the hero's top padding (`calc(var(--nav-height) +
1.5rem)`). Verified clean at 375/768/1280.

**Separate, unfixed:** at exactly 768px, the nav wordmark and "Portfolio" link touch
with no gap — nav spacing needs its own pass at some point.

**Interpretation calls, not explicit in the brief:**
- **The `<h1>`.** 5.1 bans a headline block in the hero, but 8.1 requires one `<h1>`
  per page and 8.3 wants the primary keyword in it. Resolved: on-screen "Amy K Clark
  Design" stays a styled paragraph, not a heading; a visually-hidden `<h1>` carries
  the keyword phrase, which also appears naturally in the differentiator paragraph
  (satisfies 8.3's four-surface rule: title, H1, first paragraph, meta description).
- **Services one-liners.** Brief names the four services and their order but not
  exact copy. Wrote one line each within the approved/banned word lists; used "the
  lines I represent" for Blinds & Shades rather than naming Lafayette (reserved for
  its own page, 5.3).
- **Testimonial attribution.** Resolved to "Diane K." — see decision 4 below.
- **Blur-up placeholders (6.7).** `astro:assets` doesn't reliably expose generated
  file bytes at render time, so a live blur-up pipeline inside `RevealImage.astro`
  would be fragile. Precomputed two ~200-byte base64 placeholders via a one-off
  `sharp` script instead, passed in as a `blurDataURL` prop. Re-run the same way if
  these two images are ever swapped for real photography.
- **Portfolio strip with one project.** Brief asks for "four to six projects,
  asymmetric." Only one real project exists. Shipped honestly at one item rather than
  padding with repeats of the same photo; asymmetric nth-child offsets are written and
  ready for when more land.
- **Hero → next-section scroll ease.** Not in the brief. First attempt used CSS
  `scroll-snap-type: y proximity`; replaced after it felt aggressive on trackpad
  (small scrolls got pulled back to the hero instead of easing forward — the opposite
  of forgiving for a less scroll-dexterous audience). Current implementation, in
  `motion.js`'s `initHeroScrollEase()` — **the full spec, kept in full since it's
  needed to rebuild this correctly if it ever breaks:**
  - Listens to the `scroll` event itself, not wheel/touch deltas, so wheel, trackpad,
    touch, keyboard, and scrollbar all trigger it identically.
  - Only arms on a fresh load at the very top (`window.scrollY <= 4` at init).
  - The moment `window.scrollY` crosses **40px**, eases the rest of the way to
    `.scroll-ease-target` (`.portfolio-strip`) via `scrollIntoView({behavior:
    'smooth', block: 'start'})`, then removes its own listener.
  - Fires **at most once per page view**; no code path ever scrolls backward, so
    scrolling up is always completely free.
  - `scroll-margin-top: var(--nav-height)` (global.css, on `.scroll-ease-target`)
    keeps the landing spot clear of the fixed nav.
  - Gated behind `prefers-reduced-motion` — function returns immediately, no listener
    attached, plain scroll only.

  Removed 2026-07-25 over a WCAG reflow/carousel-accessibility concern for visitors
  who scroll in small or imprecise motions; restored the same day at Amy/Sam's
  request, identical spec. Re-integrating it into the View Transitions
  `astro:page-load` structure (built after this first shipped) needed one real
  addition: a module-scope `cleanupHeroScrollEase` that tears down any listener from
  a page view a visitor navigated away from before it fired, so repeated soft
  navigations back to Home don't pile up dead listeners —
  `initHeroScrollEase()` now re-runs on every `astro:page-load`, not once. Verified
  at 375px with a real wheel scroll and a simulated touch-flick (synthetic
  `touchstart`/`touchmove`/`touchend` moving `scrollY`) both via a fresh load and via
  a real client-side navigation back to Home — both input types eased correctly both
  times; sub-threshold scrolls and scrolling up were unaffected.

## Step 3: Portfolio index + project template — done, pending your review

Built: `src/pages/portfolio/index.astro` (asymmetric image list, real visible `<h1>`,
project name only, no teaser copy per 5.2 — not sharing a component with Home's
`PortfolioStrip`, since this page needs its own heading and no "View Full Portfolio"
CTA), `src/pages/portfolio/[slug].astro` (`getStaticPaths` over `projects.ts`; real
`<h1>` is the project name), `ProjectGallery.astro` (lead image full-bleed +
supporting images in a quiet, non-asymmetric grid), `SpecBlock.astro` (renders only
spec fields that are present — same "don't guess it" pattern as `business.ts`'s
`openingHours: null`). Extended `projects.ts`'s `Project` type with `lead`,
`supporting[]`, `spec`. Verified with `npm run build` and by reading generated
`dist/portfolio/` HTML: one `<h1>` per page, titles/descriptions within limits, real
alt text, spec block renders exactly the three known fields and omits the rest
rather than inventing them, no banned words/pricing/unapproved vendor names, both
URLs in the sitemap.

**Placeholders per the IMAGE-MANIFEST.md standing rule:** detail page's lead image
reuses the Home hero crop; supporting image is the workroom ottoman shot, newly wired
into `astro:assets` (`src/assets/images/about/`). Nothing is a blank box.

**Flagged shortfall:** brief asks for three to eight supporting images per project
(5.2); this project ships with one, since only one other real, usable photo exists.
`ProjectGallery.astro` already supports any array length — a content gap, not a
template limitation.

**Interpretation calls, not explicit in the brief:**
- **Spec block content.** Only `treatment`, `fabricHouse` ("the lines I represent,"
  no vendor name), and `rooms` are filled in — `lining`/`hardware` are real facts not
  yet known, not invented.
- **Detail page's "what the room needed" paragraph.** 5.2 asks for "what the room
  needed and what Amy did"; only the "what Amy did" half exists yet (see ASK-AMY.md's
  project-stories item). Used the existing scope line alone.
- **No CTA on the detail page.** 5.2 doesn't ask for one, and every page already
  carries the nav's Contact link.

**Bug: nav invisible on Portfolio pages.** `transparentNav` defaults to `true` and
the new pages never overrode it — same white-on-white bug `404.astro` already
avoided. Fixed with `transparentNav={false}`.

**Bug: detail-page image reported disappearing after a hard refresh.** Not
reproducible — every reload returned clean 200s, and a deliberately engineered
version of the likely trigger recovered on the next request without a server
restart. Structurally can't happen in production regardless: the `/_image?href=...`
endpoint involved is dev-only; `npm run build` pre-generates permanent hashed files.
Restarted the dev server as a precaution; no code bug found, so no code change.

**Reveal system extended to also settle out on leaving the viewport**, not just on
entering. Reuses `initReveal()`'s existing observer pattern (a second, ongoing
observer alongside the one-shot enter-observer) and the exact same tokens
(`--reveal-transform-duration`/`--ease-reveal`) rather than new ones —
`.reveal.is-revealed.is-leaving-view` settles to `opacity: 0.85` /
`translateY(1.5%) scale(0.98)`, deliberately smaller than the entrance's own
`-6%`/`1.04` so it reads as the same restraint in reverse, not a second, competing
effect (3.7 bans anything competing with the signature reveal). Sound on code review;
not independently confirmed live due to a known Browser-pane scroll/paint rendering
quirk unrelated to this code (see memory).

**Site-wide View Transitions**, Astro's native `<ClientRouter />`
(`astro:transitions`), added to `Base.astro`. Default fade between every page, no
extra config. Confirmed from Astro's own shipped
`viewtransitions.css` that it respects `prefers-reduced-motion`. `SiteNav` and
`SiteFooter` carry `transition:persist` so neither crossfades or remounts.
**This is what caused the nav bug above to resurface in a second form:** persisting
`SiteNav` means the same DOM node survives navigation instead of the new page's
server-rendered nav replacing it, so its transparent/solid state and current-link
highlighting would otherwise go stale the instant a visitor navigated client-side.
Fixed by moving `transparentNav` onto a fresh (non-persisted) `data-transparent-nav`
attribute on `<body>`, and rewriting `initNav()` to re-sync the persisted nav's
transparency, scroll-driven solid state, and current-link highlighting from that
attribute plus `location.pathname` on `astro:after-swap`. Also closes the mobile
panel on every navigation, not just clicks inside the panel. `initReveal()` /
`initHeroGallery()` / `initHeroScrollEase()` (all target `<main>`, swapped every
navigation) now re-run on `astro:page-load` instead of a one-time top-level call.
Verified with real clicks (not direct URL loads): nav renders solid and legible
immediately on arrival, correct link underlined, mobile menu closes on navigation, no
console errors.

**Shared-element morph on project photos.** Portfolio index cards and each project's
detail-page lead image share a `transition:name` (`project-photo-${slug}`), so
clicking a project morphs the photo into place. Threaded explicitly as a new
`transitionName` prop through `RevealImage.astro` rather than assuming Astro forwards
a bare `transition:name` from a component tag to its rendered root (same lesson as
`class` passthrough on this component, step 2). Verified at 375px with a real click —
image carries both `data-astro-transition-scope` and a matching computed
`view-transition-name`. Graceful degradation confirmed by how the mechanism works
(unsupporting browsers just ignore the CSS property; every link is a real `href`),
not tested in an actual old browser.

**Bug: permanent underline on Services (and, latently, elsewhere).** `global.css`'s
base `a` reset never set `text-decoration: none`, and a child's
`text-decoration: none` can't override a parent's browser-default underline.
`ServiceList`'s whole-card link wraps a plain span/paragraph with no reset of its
own, so the browser default showed through unconditionally. Same latent bug existed
in `PortfolioStrip` and the Portfolio index captions, just less visible against
images than against Services' bare text. Fixed at the root: base `a` now sets
`text-decoration: none` itself; `.link-underline`/`.btn`'s own resets are now
redundant but harmless.

**Color.** Added "whether to expand beyond the single restrained accent color, or
keep photography as the only source of color" as decision 10 below, per the brand
research on file — not resolving it. Separately fixed what was actually making
Services read flat within the *current* system: alternating rows get a faint wash
mixed from existing tokens (`color-mix(in srgb, var(--rule) 30%, var(--paper))` — not
a card, no border/shadow/radius), and row rhythm was tightened (padding-block
1.5rem/2.5rem → 1.25rem/2rem, name-to-description gap 0.75rem → 0.5rem). No new
colors.

**2026-07-25, copy from Amy — location line changed everywhere shown to visitors.**
Hero and footer now read "Cincinnati/NKY Based" (primary) / "Serving all areas"
(secondary, quieter opacity), replacing "Cincinnati, Northern Kentucky, plus select
travel projects" verbatim, in Amy's exact phrasing. **Not** changed, deliberately:
page titles, meta descriptions, the visually-hidden `<h1>`, the differentiator
section's first-paragraph keyword placement (8.3), `business.ts`'s `areaServed`
(JSON-LD data), and the footer's "Cincinnati"/"Northern Kentucky" *location-page nav
links* (a different element doing a different job: site navigation, not brand-voice
copy). All confirmed unchanged in the compiled `dist/` output.

`motion.js` is 228 lines. DESIGN_BRIEF's 200-line ceiling on this file was removed by
Sam's decision (2026-07-25) — no longer flagged as an overage.

**2026-07-25, two more fixes.**

- **Underline device too thin.** `.link-underline::after` was `height: 1px`, thin
  enough against jumbo Display-role text (ServiceList) to read inconsistently.
  Not a per-entry bug — all four ServiceList items and every other `.link-underline`
  use share the identical rule. Fixed at the token/CSS level: `height: 2px`. Confirmed
  in compiled CSS as the single site-wide rule (nav, footer, ServiceList all consume
  it identically).

- **Bug: hero photo invisible for 5-7 seconds on a true first load.** Real bug,
  reproduced in an actual Chrome browser (not just the preview pane) with hard
  timestamps, not a testing artifact. Root cause: this session's View Transitions
  work moved `initReveal()`/`initHeroGallery()`/`initHeroScrollEase()` onto
  `astro:page-load`, and for the *true first* page load that event is wired to the
  native `window.load` (confirmed from Astro's router source) — which waits for
  every image on the page to finish downloading before firing at all. Until then,
  `.reveal`'s resting state (`clip-path: inset(0 0 100% 0)`, per 3.7) kept the hero
  photo clipped to 0% height — structurally loaded, verifiably real photo data, just
  invisible. Confirmed via `performance.now()` in-browser: reveal wasn't firing until
  ~6.8s in. Soft navigations were never affected (their `astro:page-load` fires
  promptly, not gated on image loads), which is why this wasn't caught testing the
  nav-persistence fix earlier. Fixed by running those three functions immediately at
  top-level (covers the true first load, same as before View Transitions existed)
  and moving the *re-run* hook to `astro:after-swap` (fires promptly on soft
  navigations, never fires on the first load, so nothing double-runs). Reveal now
  fires at ~1.6s, matching the CSS transition's own designed duration. Verified with
  real timestamps in an actual Chrome browser, not just computed styles.

- **The flagged `InvalidStateError` console error is fixed.** Root cause found in
  Astro's own shipped source (`node_modules/astro/dist/transitions/router.js`):
  the sibling `updateCallbackDone` promise is caught gracefully (`console.log`, not
  thrown), but `viewTransition.finished` is chained with `.finally()` and no
  trailing `.catch()` — so whenever the native `ViewTransition.finished` promise
  rejects, it surfaces as an unhandled rejection on every navigation. Astro 5.18.2
  is already the latest 5.x patch, so no upstream fix to pull, and patching
  `node_modules` directly isn't viable. Fixed at the application level: a scoped
  `window.addEventListener('unhandledrejection', ...)` in `motion.js` that matches
  only `DOMException` + `name === 'InvalidStateError'` + this exact message and
  calls `event.preventDefault()` — the same graceful-catch pattern Astro's own code
  already uses for the sibling promise, just applied where Astro missed it.
  Verified clean across three distinct real-click page pairs (Home→Portfolio,
  Portfolio→Detail, Detail→Home) plus a plain URL navigation, all with zero console
  errors; separately confirmed the handler doesn't over-suppress by dispatching an
  unrelated rejection and seeing it still surface normally.

## Step 4: Services overview + four child pages — done, pending your review

Built: `src/pages/services/index.astro` (overview, reusing `ServiceList`),
`services/drapery.astro`, `services/blinds-shades.astro`, `services/upholstery.astro`,
`services/soft-furnishings.astro`, `Accordion.astro`, and `src/data/services.ts`.
`motion.js` gained `initAccordion()`. Verified with `npm run build` (9 pages, clean)
and by reading the generated HTML: one `<h1>` per page, all titles under 60 and
descriptions under 155 chars, real alt text on every image, all five URLs in the
sitemap, Home and both Portfolio pages unregressed.

**Word counts** (5.3 asks 400-700 per child page): drapery 566, blinds-shades 674,
upholstery 453, soft-furnishings 445.

**Blinds & Shades accordion** (5.3 / 6.5): five decision categories — light and glare
control, privacy, motorization, child and pet safety, room by room. Verified in
compiled CSS as `grid-template-rows: 0fr → 1fr`, 420ms,
`cubic-bezier(0.4, 0, 0.2, 1)`, chevron `rotate(180deg)` on the same duration, content
opacity fading over the final 200ms via `transition-delay`. Never `height: auto`, per
5.3's own warning. Full `aria-expanded`/`aria-controls`/`aria-labelledby` wiring, 5
matched pairs. No reduced-motion special-casing needed — global.css's 6.8 rule already
collapses every transition site-wide.

**Rule compliance checks run against the compiled output**, not just source: zero
banned words (rule 5), zero pricing or budget language (rule 1), no William Morris
(rule 7), Amy never called an interior designer (rule 3), and Lafayette named on its
own page only (7 mentions there, 0 everywhere else) with Home and the overview still
using "the lines I represent" (rule 8).

**Three real rule-1 violations caught and fixed during that check**, worth noting
since they're easy to write without noticing: "the least expensive way," "an
inexpensive fabric," and "whichever supplier is cheapest." None named a dollar figure,
but rule 1 bans "budget talk of any kind," and cost framing is still cost framing.
Rewritten to say the same thing without it ("the easiest way to bring in a fabric worth
using," "a lighter fabric," "whichever supplier happens to be convenient"). Two meta
lengths also overshot 8.1's limits on first pass (a 163-char description, a 61-char
title) and were trimmed.

**Real photos as placeholders, per the IMAGE-MANIFEST.md standing rule.** Every service
page carries a real photo, no blank boxes: overview and drapery use the hero crop;
blinds-shades and soft-furnishings use the living-room detail crop; upholstery uses the
workroom ottoman-stitching shot (the closest real upholstery-adjacent photo that
exists — it is literally a check-fabric ottoman on the cutting table). All flagged in
each file's header comment to swap when Kelsee's shoot lands.

**Interpretation calls, not explicit in the brief:**
- **Shared `services.ts`.** Home's teaser and the overview page show the same four
  entries; extracted to one data file rather than duplicating the name/description/href
  triple. Home's inline array is gone.
- **Service-page shell CSS moved to global.css.** Four pages share one layout, so
  `.service-page__*` and `.contact-band` live in global.css rather than being repeated
  in four scoped `<style>` blocks. Home's own duplicate `.contact-band` rules removed.
- **Subhead size.** 3.4 defines exactly three type roles and these pages need a level
  between Display and Body for section headings. Used the Display role at a smaller
  clamp range rather than inventing a fourth role — same family, same weight, no new
  token.
- **Accordion items open independently**, not exclusively. The brief doesn't ask these
  five categories to behave like radio buttons, and someone comparing "privacy" against
  "light and glare control" shouldn't have to reopen one after checking the other.
- **Roman shades routing (5.3).** The brief says roman shades stay as a searchable term
  but route to manufactured product, not Amy's workroom. Said so explicitly in the copy
  rather than leaving it ambiguous — the page names them as a Lafayette product and
  notes that a made-to-order fabric Roman shade is handled as custom drapery workroom
  work instead.
- **Copy is written, not sourced from Amy.** All four pages are drafted from the
  brief's own material and general trade knowledge. It stays inside the approved/banned
  word lists and makes no factual claim about Amy's specific practices beyond what the
  brief already establishes — but it is not yet in her words, and the Blinds & Shades
  claims in particular (what Lafayette's catalog covers, motorization options) are the
  kind ASK-AMY.md already flags for her confirmation before launch.

## 2026-07-26: two visual bugs, and a voice-polish pass on the step 4 copy

### ServiceList: underline scope and row layout

Two separate problems in one component, fixed in the one shared place —
`ServiceList.astro` is used by both Home (section 4) and `/services`, so both
pages pick this up.

- **Underline ran nearly the full row width instead of sitting under the service
  name.** The name span already had `display: inline-block`, which looks like it
  should shrink-wrap. It didn't, because the row was a `grid-template-columns:
  2fr 1fr` grid and the span was a grid item — **grid blockifies
  `display: inline-block`**, so the span filled its whole 2fr column and
  `.link-underline::after`'s `width: 100%` drew across all of it. Worth
  remembering generally: `.link-underline` cannot be applied to a grid or flex
  item and still track its text.
- **Two-column layout left a dead gap.** Name far left, description far right,
  nothing between them, so each row read as two unrelated pieces of content.

Both fixed by dropping the grid for a single stacked column: name in its
existing Display role, description directly beneath at a 0.5rem gap, both
left-aligned, description capped at `var(--measure)` (58ch). Alternating row
wash and row padding rhythm are unchanged. The name now sits inside a
block-level `.service-list__name-row` wrapper, so the underline element
shrink-wraps to its own text regardless of what layout the row ever takes
again. Measured in the built output at 1280px: underline width equals the name
text exactly (Upholstery 402px, 32% of the 1249px row; previously ~66%).

### Hero photo: three real bugs, none of them the gallery timer

Reported as the hero photo appearing and disappearing in a loop. The leading
hypothesis going in was the 6.1 cross-dissolve timer not special-casing a
one-item array — **that was not it**; `initHeroGallery()` already returns early
at `layers.length < 2`, so the JS timer never ran. What was actually wrong:

1. **The shade reveal could never fire, on any image on the site.** Root cause:
   `initReveal()` observed the same element that carries 3.7's resting
   `clip-path: inset(0 0 100% 0)`, and **a browser applies an element's own
   clip-path when it computes the `intersectionRect` it reports**. Clipped to
   zero height, the element's `intersectionRatio` was pinned at exactly 0
   forever, so 6.2's `threshold: 0.15` was never met and `.is-revealed` was
   never added. Measured directly in-browser on the same element with the same
   observer options: ratio **0** clipped, **0.67** with `clip-path: none`.
   Reproduced identically in dev and in a production build, and on the
   portfolio image as well as the hero — every content photo on the site was
   structurally present and completely invisible. Fixed by separating the
   observed box from the clipped box: `RevealImage.astro` now renders an
   unclipped `.reveal-frame` wrapper carrying the layout (size, aspect ratio,
   any consumer class), with `.reveal` and its clip-path nested inside, and
   `initReveal()` observes the frame while applying the class to the reveal.
   3.7's and 6.2's values are all unchanged. Sibling stagger now groups by the
   frame's parent, since each `.reveal` is an only child of its own frame.
   **Do not put a clip-path on `.reveal-frame`** or this comes straight back.
2. **The hero image filled ~58% of its box.** Long-standing and invisible until
   the reveal above started working. `<Picture>` wraps the `<img>` in a
   `<picture>`, and global.css's image reset (`img, picture { height: auto }`)
   applies to that wrapper too — so the img's `height: 100%` resolved against an
   auto-height parent and fell back to the photo's intrinsic height, with the
   blur-up layer showing through underneath the rest. Against 5.1's "the image
   fills the entire screen." Fixed with an explicit `height: 100%` on the
   `<picture>` wrapper, which is what makes `object-fit: cover` on the img mean
   anything.
3. **The one genuine repeating loop: 6.1's continuous scale, ungated.**
   `hero-slow-scale` (1.0 → 1.055, `linear infinite`) runs on every
   `.hero__layer` regardless of how many there are. The brief scopes it to
   "across its full cycle," a cycle being one hold plus one dissolve ending in a
   handoff to the next layer. With a one-item array there is no handoff, so it
   ran 7.9s and then **snapped back to 1.0, over and over, for as long as the
   page stayed open**. This is the single-image case not being special-cased —
   just in the CSS half of 6.1 rather than the JS half. Gated on
   `.hero__gallery[data-single-image]`, driven by the real `images.length`, so
   it returns on its own the moment a second photo lands.

Verified against a production build (`astro preview`), not dev: sampled the
hero's class list, clip-path, opacity, layer opacity, layer transform, and
rendered image height every 50ms for 22 seconds — **440 samples, exactly one
distinct state**, image height 1324px against a 1324px viewport, top 0. Zero
flicker, zero disappearance, full-bleed. Also confirmed after the fix: the
aspect-ratio path still renders a true 16/9 with the image filling it
(`/services/drapery`), the shared-element morph still carries
`data-astro-transition-scope` and a matching `view-transition-name`, both
reveals on a project detail page fire correctly through a real client-side
navigation, and zero console errors.

### Brand-voice pass on the four service pages

The step 4 copy was drafted from the brief and general trade knowledge, not from
Amy, and read as competent but generic. Rewritten against her own confirmed
words — the design/fabrication/installation differentiator, "they are not there
to read," the "a little playful and non-stuffy" tone reference, and the
fashion-lookbook framing rather than home-decor marketing convention.

Removed specifically: the "it is not X, it is Y" construction (drapery's old
opener was that plus a rule-of-three in one sentence), four-part balanced lists,
uniformly parallel paragraph rhythm, hedge-padding, and every `&mdash;` in
visible body copy (9 → 0). The concrete trade details that were already the most
credible thing in the draft were kept and moved closer together: eight-way
hand-tied springs, double rubs, railroading, openness factor,
top-down/bottom-up, interlining, stack-back, dressing and training panels on
installation day.

Also caught and removed **two more rule-1 violations** of the same kind as the
three found during step 4 — "worth investing in almost regardless of age" and
"worth doing properly even when the arithmetic says otherwise." Neither names a
figure; both are cost framing.

Re-verified against the compiled `dist/` output, not just source: word counts
482 / 592 / 428 / 455 (all inside 5.3's 400-700), zero banned words, zero
pricing or budget language, one `<h1>` per page, titles under 60 and
descriptions under 155, each keyword phrase still in its page's first paragraph,
Lafayette on its own page only (0 mentions on Home, the overview, and the other
three child pages, which still say "the lines I represent"), five matched
accordion pairs covering the same five mandated categories, the roman-shades
routing point intact, no William Morris, and Amy never called an interior
designer. `titles`/`descriptions`/`<h1>`s and all component props, image paths,
and alt text are untouched.

**This is a voice-polish pass, not a substitute for Amy's own review.** It is
still not her words — it is the same material in a less generic voice. Two
things specifically want her eyes: the Blinds & Shades factual claims (what
Lafayette's catalog covers, motorization options), which ASK-AMY.md already
flags for her confirmation and which this pass does not change the status of;
and the new drapery subhead **"A decorator does not make anything,"** derived
from her own verbatim differentiator but noticeably more combative as a heading
than as a line in conversation. The blinds-shades accordion entries are the
weakest of the four pages — the accordion format pushes toward five uniform
blocks of well-formed exposition, which is exactly the tell that is hardest to
remove without making one entry feel undercooked.

## ServiceList: variant B adopted, plus a hover image stage — 2026-07-26

Sam picked **variant B (asymmetry)** off the comparison page. Its markup and CSS
were lifted verbatim out of `dev-service-list-variants.astro`'s `.vb__*` rules
into `ServiceList.astro`, replacing the stacked/hairline/alternating-wash
treatment. Both consumers (Home section 4 and `/services`) pick it up from the
one component. **The comparison page and its temporary `astro.config.mjs`
sitemap filter are both deleted** — one of the two TEMPORARY items is now
genuinely gone, not just documented.

What B is, since the reference page no longer exists to look at: per-row
`margin-left` of 0 / 26% / 9% / 38% and per-row Display-clamp font sizes
(5.25 / 3.75 / 6 / 3.5rem at the top end), 4.5rem between rows, no hairlines
and no wash. Flush and uniform below 768px — asymmetry needs width to read as
intent rather than as broken alignment. The verified underline fix survives
intact: the name sits in a block-level `.service-list__name-row` and
`.link-underline` is on an inline-block element inside it, never on a grid or
flex item.

### The hover stage — interpretation call, not a brief requirement

DESIGN_BRIEF has no spec for this. **The closest precedent is 6.4's portfolio
hover**, which is a scale-and-caption move on an image that is already on
screen; this is a different thing and is recorded as an interpretation rather
than a literal match. What it does: hovering or keyboard-focusing a service row
shows that service's photograph in the right-hand space.

Because B's whole point is that rows sit at varied indents, the image cannot be
inline per row. It is **one fixed stage** — a single 4:5 box in a second grid
column — that swaps which of four stacked layers is opaque.

- **Pure CSS, via `:has()` on the section.** No JS, so there is nothing to
  re-init on a soft navigation and no listener that can leak. Confirmed in the
  compiled CSS that Astro's scoping rewrites `:has()` correctly.
- **Three gates, all three load-bearing:**
  1. `(hover: hover)` — touch devices get no stage at all. `display: none`, so
     the four images are not in the accessibility tree and are not fetched.
  2. `(min-width: 1200px)` — below that, the rows' indents plus their jumbo
     names consume the width the stage needs.
  3. `(prefers-reduced-motion: no-preference)` **on the swap rules only.** Under
     reduce those rules do not exist at all, so the stage renders the first
     service's photo statically and never changes: no hard cut, no partial
     crossfade, nothing to interrupt. This is stronger than relying on 6.8's
     global duration collapse, which would have left an instant hard cut on
     every hover.
- **Resting state is the first service's photo**, not an empty box, so nothing
  pops into or out of existence on the first hover.
- **Crossfade** is opacity over `--hover-image-duration` (700ms, `ease-out`) —
  6.4's existing token, the closest thing in the brief to a spec for this. No
  new token.
- **Keyboard parity** is `:focus-visible` beside every `:hover` selector, the
  same pattern variant C used.
- **No card, border, shadow, or radius.** A photograph in space (3.2).
- The stage is wrapped in the standard `.reveal-frame` / `.reveal` pair, so it
  enters with 3.7's shade reveal like every other image on the site; the layer
  crossfade happens inside it.
- **DOM order is list first, stage second**, placed into column 2 by the grid,
  so a screen reader meets the four service links before the photographs.

**Photos, and which services share one.** Three usable photographs exist, four
services need one:

| Service | Photo | Distinct? |
|---|---|---|
| Custom Drapery | `hero/pleated-drapery-living-room-french-doors-pool-view.jpg` | shared |
| Blinds & Shades | `portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg` | distinct |
| Upholstery | `about/amy-hand-stitching-check-fabric-ottoman-cutting-table.jpg` | distinct |
| Soft Furnishings | `hero/pleated-drapery-living-room-french-doors-pool-view.jpg` | **shares with Drapery** |

Soft Furnishings shares the drapery photo because it is the only one of the
three showing pillows and a cushioned seat at all. The two rows are
**non-adjacent** (1 and 4), so the repeat never reads as a stuck image the way
sharing between neighbours would. Swap when Kelsee's shoot lands.

**New file `src/data/photos.ts`.** The same three photographs now serve the
Journal, the Portfolio, the service pages, and this stage, and the alt text and
blur-up strings must exist in one copy. `journalImages.ts` is now a thin alias
over it, so `content.config.ts`'s derived `heroImage` enum and every existing
import keep working untouched. `services.ts` gained a `photo: PhotoKey` field.

**Alt text is real, not empty-and-aria-hidden.** Rule 10 is absolute and these
are real photographs of real work that image search should see. The cost is
that a desktop screen-reader user meets four image descriptions after the four
links; the mitigation is DOM order, and on touch they are not present at all.

**Verified in a real browser at 1345px**, against the running site rather than
by reading CSS: the section computes as a two-column grid (724px / 462px), the
stage sits at x=835 while the widest row ends at x=730 — 105px clear, no
collision. Hovering "Upholstery" flipped layer opacities to `0,0,1,0` and the
rendered photo visibly changed to the ottoman shot. Then, with the pointer
moved off every row (`anyHover: false`), a **real Tab keypress** onto "Soft
Furnishings" gave `focus-visible` on row 4 and opacities `0,0,0,1` — keyboard
parity confirmed by actual keyboard input, not by reading the selector. The
stage's `.reveal` reaches `is-revealed` with `clip-path: inset(0px)` on scroll,
so the signature reveal fires on it like every other image.

## Step 5: About + Process — done, pending your review

Built: `src/pages/about.astro`, `src/pages/process.astro`, `StepList.astro`. The
three team headshots were copied into `src/assets/images/team/` (first real use of
any of them) with precomputed blur-up placeholders, same one-off `sharp` approach
as step 2. Verified with `npm run build` (12 pages, clean) and against the
generated HTML: one `<h1>` per page, logical heading order, titles 36 and 28
chars, descriptions 134 and 136, real alt text on all six images, both URLs in the
sitemap, zero banned words, zero pricing language, Amy never called an interior
designer, and no vendor name on either page.

**Shared page shell generalised.** About and Process are the same shape as the
four service child pages, so global.css's `.service-page__*` block gained
`.text-page__*` as the general name on the same rules. `.service-page__*` stays as
an alias rather than churning four already-reviewed pages. Use `.text-page__*` for
anything new.

**Numbering discipline held.** 3.6 permits numbered steps on Process and nowhere
else, so `StepList.astro` is deliberately single-use rather than a general
numbered-list component. Numerals are `01`–`04` in the Label role, `aria-hidden`
on an `<ol>` that carries the ordering semantically.

**Interpretation calls, not explicit in the brief:**
- **The About story is deliberately thin, and that is the honest state.** 5.4.1
  asks for "actual detail about what she made and for whom" and 5.4.2 wants the
  attic section specific. Those facts exist only in Amy's head — ASK-AMY.md's
  first item is the recorded conversation that produces them. The copy is written
  at exactly the level that is actually established (the attic, the trunks, taking
  things apart to see the construction) and stops there. **No first object, no
  first client, no childhood scene was invented to fill the space.** This section
  should roughly double in length from her own words; it should not be
  embellished. Flagged in the page's own header comment too.
- **Fabric-line phrasing is inconsistent across the site, and this is now worth a
  decision.** About uses "the lines I represent" per 5.4.4 and rule 8.
  `/services/drapery` names Schumacher, Stout, and Pollack outright, which is what
  rule 7 permits and predates this step. Both readings are defensible; having both
  live is not. Tracking as decision 11 below rather than silently changing a page
  you have already reviewed.
- **No consultation-fee language on Process.** 5.7 requires the "paid in-home
  visit" paragraph on Contact and sets strict rules around it. The brief does not
  ask for it on Process, and rule 1 treats cost framing strictly (five violations
  caught across steps 4 and the voice pass), so step 1 describes what the visit is
  without touching what it costs. Contact, step 6, is where that lands.
- **Contact band on both pages.** Not required by 5.4 or 5.5, but it is the
  established foot of Home and all five service pages, and it serves the site's
  stated single job.
- **Studio row is square, not the 4:5 used everywhere else.** Asset-driven, not a
  design preference — Amy's and Kelsee's headshots are circle-cropped avatars on a
  near-black square ground and a 4:5 crop slices both circles; Sam's is a real
  888x1120 portrait that a centred square crop decapitates, hence
  `object-position: 50% 15%`. Both marked revert-on-arrival in `about.astro`.
  **The row will not look right until real rectangular headshots arrive**
  (IMAGE-MANIFEST.md asset request 2): two dark-ground circle avatars beside one
  blue-backdrop studio portrait is three photographic treatments in a row, and CSS
  cannot fix that. Confirmed in-browser — the layout is correct, the source
  material is the problem.

## 2026-07-27: Amy's real Studio headshot, and a hack removed because the asset improved

`source-photos/Amyheadshot.JPG` is a real professional headshot (1941x1300, white
brick wall, natural light), replacing the 426x408 circle-cropped avatar that had
been standing in since step 5. Processed to 1600x1072, new blur-up, alt text
rewritten to describe the actual frame. Details in IMAGE-MANIFEST.md.

**Worth remembering: the file did not look new.** Sam replaced it in place and
macOS is case-insensitive, so the old `amyheadshot.png` was overwritten by a
`.JPG` carrying the same modification date as other week-old files. A directory
listing showed nothing unusual and the first scan for "a new photo" missed it
entirely. **Check dimensions, not filenames or timestamps.**

**The square-crop workaround was scoped down, not removed, and the reason is the
asset — not a change of rule.** Step 5 introduced two related hacks: a 1:1 crop
(because a 4:5 crop sliced the circle avatars) and `object-position: 50% 15%`
applied to all three figures (because a centred square crop shaves the top of
Sam's head). With Amy's real photo in place:

- **The lifted `object-position` is now scoped to Sam's figure alone**, via a
  per-person `lift` flag rather than a blanket rule on `.studio__figure`. It only
  ever did real work on his 888x1120 portrait — the two near-square avatars had
  almost no vertical overflow for it to act on, and Amy's new landscape frame has
  none at all, since `cover` fills the square's height exactly and the Y term is a
  no-op. Verified in a real browser: Sam computes `50% 15%`, Amy and Kelsee
  compute `50% 50%`.
- **The 1:1 crop stays**, because Kelsee's headshot is still a ~400px circle
  avatar and 4:5 would slice it. Half the original justification is gone; the
  other half is not.

So this is a hack removed because the underlying asset got better, and a hack
retained because the remaining asset has not. Revert the row to 4:5 the moment
Kelsee's real headshot arrives (IMAGE-MANIFEST.md asset request 2).

Verified at 1345px and 375px: Amy's crop lands her full head and shoulders with
no clipping, all three frames render square, zero horizontal overflow at 375.

## Step 6: Journal + Contact — done, pending your review

Built: `src/content/journal/` (three posts), `src/pages/journal/index.astro`,
`src/pages/journal/[slug].astro`, `src/pages/contact.astro`,
`src/pages/contact/thank-you.astro`, `ConsultationForm.astro`, `Faq.astro`,
`src/data/journalImages.ts`. `content.config.ts` gained `seoTitle` and swapped
`heroImage`/`heroAlt` for a single key into `journalImages.ts`. Verified with
`npm run build` (18 pages, clean, no warnings) and a scripted audit of all 18
built pages: one `<h1>` each, titles 28–58 chars, descriptions 56–145, canonical
and og:image on every page, alt text on all 22 images, no heading-level skips,
zero banned words, zero emoji, one `border-radius` value site-wide
(`var(--radius)` = 2px), Newsreader confined to the two testimonial quotes.

**Journal.** Three posts on 5.6's three listed topics, 800–850 words each,
drafted from the brief and flagged `<!-- DRAFT -->` in each `.md` file pending
Amy's review. 5.6's "each post internally links to at least one service page" is
enforced structurally: `relatedService` is a required enum and renders as a real
link below the body, so a post cannot ship without one even if the inline links
are later edited out. Each post also links inline (two of the three link to two
service pages). `publishDate` values are placeholders — **reset them to real
dates at launch.**

**Contact form.** All eleven 5.7 fields in 5.7's order, wired to Netlify Forms:
`data-netlify="true"`, `netlify-honeypot="bot-field"`,
`enctype="multipart/form-data"` (required by Netlify for the file input), and
`action="/contact/thank-you"`. Verified against the built HTML — budget carries
decision 2's six ranges verbatim, attribution decision 3's eight sources
verbatim, project type 5.7's six options. Seven fields block submission
(name, email, location, room, project-type, budget, referral), confirmed in
browser via `checkValidity()`.

**`data-astro-reload` on the form is load-bearing.** Astro's ClientRouter
intercepts POST submissions and replays them through its own fetch navigation,
which never reaches Netlify's form handler — the submission would appear to
succeed and no entry would ever arrive. Do not remove that attribute while
ClientRouter is enabled in `Base.astro`.

**Interpretation calls, not explicit in the brief:**
- **Project type is a checkbox group, not `<select multiple>`.** 5.7 says
  "multi-select" and requires it. A native multiple-select is hostile to an
  audience the brief puts at 40 to 85, and native `required` cannot express
  "at least one of this group" — so a ~10-line script sets `setCustomValidity`
  on the group's first input, letting the browser's own validation bubble and
  focus handling do the work. Confirmed working in both directions in browser.
- **No lead image and no phone number on `/contact`.** 5.7 asks for neither, the
  site has three usable photographs each already doing three or four jobs, and
  contact details beside the form would give a reader a way around the filter
  5.7 says the page exists to be. Both flagged in the page's header comment.
- **`/contact/thank-you` is an addition.** Netlify's alternative is its own
  generic branded success page, which would be the only screen on the site that
  is not this site. Carries `noindex` and is excluded from the sitemap.
- **FAQPage JSON-LD ships with `Faq.astro`, not step 7.** It has to be generated
  from the same question and answer strings the accordion renders; splitting them
  across two files guarantees drift. The component table already assigned it
  here. `Article` and `BreadcrumbList` stay in step 7 as planned.
- **The FAQ reuses `Accordion.astro`** rather than introducing a second
  expansion pattern. 6.5 authorises one and this is it.

## Step 6 follow-up: cross-page regression pass

First pass over all six built steps at once, rather than page by page. Two real
defects found and fixed, one latent one found and fixed.

- **`/contact/thank-you` was in `sitemap.xml` while carrying `noindex`.** A
  contradictory signal that Search Console reports as an error ("Submitted URL
  marked noindex"). `astro.config.mjs`'s sitemap `filter` now excludes it, and
  that clause is marked PERMANENT to distinguish it from the temporary
  dev-page clause beside it. Sitemap is 15 URLs; `/404`,
  `/dev-service-list-variants`, and `/contact/thank-you` are all correctly out.
- **`motion.js` leaked one hero-gallery interval per soft navigation.**
  `initHeroGallery()` re-runs on every `astro:after-swap` and never cleared the
  previous `setInterval`, so a home → about → home round trip left an extra timer
  running against layers the DOM swap had already detached. Latent today (the
  hero array holds one image and the `layers.length < 2` guard returns first) and
  **it activates the moment a second hero image is added**, which is what happens
  when Kelsee's photography lands. Fixed with a module-level `heroGalleryTimer`
  cleared at the top of the function, mirroring the existing
  `cleanupHeroScrollEase` pattern. Proven both ways by executing the real file
  against a DOM shim: three soft navigations created 3 timers / cleared 0 before,
  3 created / 2 cleared after.
- **`robots.txt` confirmed absent.** Required by 8.1, correctly a step 7 item
  (that step already lists "sitemap/robots verification") — recorded here so it
  is not discovered during the acceptance pass.

**Reduced motion (6.8), verified as far as the tooling allowed at the time.**
The CSS half was confirmed in a real browser and the JS half by executing the
real `motion.js` against a DOM shim with the media query forced both ways: under
reduce it creates 0 IntersectionObservers (2 normally), 0 intervals (1), 0
timeouts (3), removes the opening line outright, and applies `.is-revealed` to
every target immediately. The one scroll listener that remains under reduce is
6.3's nav state, which is correct — going solid past 80vh is a state change, not
motion.

*Superseded 2026-07-26.* This step recorded the OS-level toggle as something
"only a human can do." **Step 8 found a way and did it**: Chrome's
`--force-prefers-reduced-motion` flag flips the media feature for real, and all
20 pages were measured in both modes. See step 8. The notes above stand as
history, not as the current state of the evidence.

**Temporary-hack containment.** *Superseded 2026-07-26* — the service-list
variants page and its sitemap filter are deleted, and only the cream-and-green
palette preview remains. See the TEMPORARY section below for the current state.
The point that paragraph made is still the right one and still applies to the
one survivor: nothing mechanically prevents it reaching production. It is a
`Base.astro` import, so the cream-and-green palette is in the CSS bundle of
every page of the current production build, and the only thing standing between
it and a live site is remembering to delete it.

## Step 3.5: Signature Pieces — done, pending your review

**Interpretation call, requested by Sam 2026-07-26. Not in DESIGN_BRIEF.md and
deliberately not added to it** — the brief's site architecture (section 4) does
not list this page.

`src/pages/signature-pieces.astro`, `src/data/signaturePieces.ts`. Two real
finished pillows, each with its photograph, a short description in the
established voice, and one **"Inquire About This"** link into the existing
`/contact` qualification form.

**It is a placeholder for eventual real e-commerce. It is not e-commerce, and
Amy is fine with that framing.** No cart, no quantity, no stock, no checkout,
no price, no "Add to Cart." Verified against the whole built site: zero matches
for cart/buy/shop/stock/checkout/purchase language, and `/contact` remains the
only page on the site carrying any dollar figure. Do not let this drift toward
a shop without deciding, deliberately, that it should become one.

- **Nav untouched.** DESIGN_BRIEF 4 caps the main nav at six items and it is
  full. Reached from two places only: a line under the Portfolio index list and
  a "Pieces already made" section on `/services/soft-furnishings`. In the
  sitemap, indexable, with a three-level BreadcrumbList (Home → Portfolio →
  Signature Pieces).
- **The inquire links go to `/contact` plainly, with no query parameter.**
  Pre-selecting the Soft Furnishings checkbox from a query string needs a
  client-side script inside `ConsultationForm.astro`, which already carries
  hand-written `setCustomValidity` logic for that same checkbox group — real
  plumbing on a verified form, not a free win. Left as a deliberate option
  rather than a gap; each link carries a visually-hidden piece name so the
  accessible name is unique per row.
- **Layout is a sequence of objects, not a product grid**: photograph large on
  one side, name and copy on the other, sides alternating (3.5's asymmetry
  preference). No card, border, shadow, or radius.
- **Piece names ("Canal Houses," "Dot Weave") are descriptive of the weave, not
  Amy's own names.** If she has her own, they replace these — added to
  ASK-AMY.md. No size, fabric house, provenance, or client is stated anywhere,
  because none of it is established.
- Both photographs go through `RevealImage`, so 3.7's shade reveal applies as
  everywhere else.

## Step 7: SEO layer — done, pending your review

Built: `src/pages/cincinnati.astro`, `src/pages/northern-kentucky.astro`,
`src/components/JsonLd.astro`, `public/robots.txt`, and a real
`LAUNCH_CHECKLIST.md` (flagged missing since step 6 — it exists now and is not a
placeholder). `Base.astro` gained `localBusiness` / `breadcrumbs` / `article`
props so `<head>` assembly stays in one place and no page can quietly ship
without a breadcrumb.

**Location pages.** `/cincinnati` targets "window treatments Cincinnati OH,"
`/northern-kentucky` targets "custom drapery Northern Kentucky," each in title,
H1, first paragraph, and meta description once. 8.4's neighbourhood list is
**split between them** — Ohio-side names on one page, Kentucky-side on the
other — so they are genuinely different documents rather than the thin
near-duplicates 8.4 warns against. Both are in the footer, neither is in the
main nav (section 4).

**They do not break the no-geography project-naming rule, and were written so
that stays true:** neither page names a project, a client, or an address, and
neither claims a finished job on a named street. The brief establishes these
areas as where Amy's clients are concentrated, which supports naming them as
ground she covers and nothing further. Fort Wright is named on
`/northern-kentucky` because it is `business.ts`'s `baseCity` — the one
geographic fact about the business itself.

**JSON-LD.** One component, three types, each emitted only when asked for:
`HomeAndConstructionBusiness` on Home, `BreadcrumbList` on all 18 other
indexable pages, `Article` on the three journal posts. `FAQPage` stays in
`Faq.astro` for the reason recorded in step 6. Validated **structurally against
the built HTML, not by eye**: every block parses, every `@type` present, every
breadcrumb position sequential with absolute URLs, Article carries
headline/image/datePublished/author/publisher with an absolute image URL, and
LocalBusiness carries `@id`, address, `areaServed`, `sameAs`, and a four-item
`hasOfferCatalog`.

Two fields are **omitted on purpose, not forgotten**: `priceRange` (8.2 says
omit; rule 1 bans price signals) and `openingHoursSpecification`
(`business.openingHours` is still `null` — Google surfaces hours to people
deciding whether to call, so a guess is worse than nothing). `geo` is omitted
too: no coordinates on file, and a service-area business with no published
street address should not carry a pin. Article's author/publisher are stated as
the **organization, not a Person** — the launch posts are drafts pending Amy's
review, so naming her as author would assert something not yet true.

**robots.txt** allows everything and points at `sitemap-index.xml` (what
`@astrojs/sitemap` actually generates). `/404` and `/contact/thank-you` are kept
out of the index by their `noindex` meta tag rather than a `Disallow` — a
disallowed URL is never crawled, so Google would never see the noindex.

**Sitemap: 18 URLs**, including both location pages and Signature Pieces.
`/404` and `/contact/thank-you` correctly excluded.

**Per-page meta audit, scripted over all 20 built pages:** every title under 60
and description under 155, **no duplicate title or description anywhere**,
canonical + `og:image` (absolute) + `og:type` + `twitter:card` on every page,
exactly one `<h1>` each, no heading-level skips, and every `<img>` carrying
non-empty alt text and explicit `width`+`height`.

**New file `src/data/photos.ts`.** The site's real photographs in one place —
`ImageMetadata`, alt text, blur-up string, and the `/public` master path.
`journalImages.ts` is now a thin alias so the journal's derived enum and every
existing import keep working.

## Step 8: Acceptance pass — done

Every item in DESIGN_BRIEF section 10, run against the **production build**
(`astro preview`) across all 20 pages. Three real defects were found and fixed;
they are recorded under "Defects found and fixed" below.

**Reduced motion (6.8) — genuinely toggled this time, not simulated.** Earlier
sessions could only reason about the CSS and run `motion.js` against a DOM
shim, because neither the Browser pane nor the host OS could flip the media
feature. **Chrome's `--force-prefers-reduced-motion` flag does flip it at the
media-query level**, proven first on a probe page that reported
`reduce=true / nopref=false` under the flag and the reverse without it. With
that established, a harness walked all 20 pages in both modes and measured:
- Every `.reveal` element on every page carries `is-revealed` immediately under
  reduce, computed `clip-path: inset(0px)` — 6.8's "shade reveals render fully
  visible on load," confirmed rather than assumed.
- **Longest surviving transition or animation on any page under reduce: 0ms.**
  The same pages measure 420–2200ms in normal mode, so the audit is measuring
  something real. 6.8's `*` + `!important` rule beats everything in the system.
- The hero opening line is removed outright under reduce.
- ServiceList's hover stage sits on `1,0,0,0` — the resting default photo, with
  every swap rule gated inside `(prefers-reduced-motion: no-preference)` so
  those rules do not exist at all under reduce. No hard cut, no partial
  crossfade.
- Only the reduce-gated blocks in the whole bundle are 6.8's global rule, the
  hero layer animations, and the portfolio hover scale — enumerated from the
  compiled CSS, not from memory.

**This is the one item BUILD-PLAN previously said "needs a human."** It no
longer does. A macOS System Settings toggle would still be a useful
belt-and-braces check, and it stays in LAUNCH_CHECKLIST §7, but it is no longer
the only available evidence.

**Keyboard, with real key presses.** Full tab walk of Home recorded 30 stops in
order: skip link → wordmark → six nav items → the three hero word links → both
hero CTAs → portfolio → all four ServiceList rows → contact CTA → footer.
**Every stop had `:focus-visible` true and a 2px outline**, with the colour
correctly switching between `--indigo` on paper and `--paper` on dark contexts.
No stop was off-screen and none was skipped. The hover stage's four images sit
after the list in the DOM and are not focusable, so tab order is untouched.
Mobile nav: real Escape keypress closes the panel, resets `aria-expanded`, and
returns focus to the toggle. Contact form: 18 fields, all labelled, honeypot at
`tabindex="-1"`, seven required fields blocking submission.

*Harness limitation, stated plainly:* injected Enter/Space keydown events reach
the focused element but do not trigger a native button's default activation in
this environment, so opening the mobile nav and the accordion by keypress could
not be exercised directly. Both are real `<button>` elements with accessible
names, so that activation is the browser's own behaviour and needs no site
code — but it is inference, not measurement, and belongs on Sam's list.

**Render checks, 72 page/width combinations** (18 pages × 375 / 768 / 1440 /
2560). After the overflow fix below: **zero horizontal document overflow, zero
elements off-canvas, zero text under 10px** at any width.

**Console sweep via real navigation, not URL loads.** A 12-hop walk clicking
real anchors through Portfolio → Signature Pieces → Contact → Services → Soft
Furnishings → Signature Pieces → Journal → About → Process → Cincinnati →
Northern Kentucky → Home. Every hop landed on the right URL with exactly one
`<h1>` and **zero broken images**. **The console was completely clean** — the
known Astro `InvalidStateError` fires 12 times and is suppressed by
`motion.js`'s handler every time, so nothing reaches it. Every network request
across the walk returned 200 or 304; no 404s.

**Design-rule checks against the compiled output:** two font families only
(Archivo, Newsreader) in the three defined roles; `border-radius` resolves to
`var(--radius)` = 2px and nothing else, site-wide; `--indigo` appears in exactly
three places, all of them focus rings or the hover underline; zero emoji, zero
icon libraries (all 32 SVGs are custom-drawn); zero box-shadows; **exactly one
gradient in the whole bundle — the hero scrim, which 5.1 explicitly asks for**;
no project name contains a city, state, client, or leading "The."

**What still needs a human**, all in LAUNCH_CHECKLIST §7: a real scored
Lighthouse run, LCP on throttled 4G, real device testing, a VoiceOver
spot-check, keyboard *activation* of the two buttons noted above, and Sam's own
eyes on the whole site.

**One acceptance criterion deliberately fails right now:** §10's "no cream, no
terracotta." That is the preview theme below, re-enabled at Sam's instruction
after the measurements were taken — see that section.

### Defects found and fixed during the acceptance pass

1. **Horizontal document overflow on every page with an unrevealed image.**
   3.7's resting `transform: scale(1.04)` contributes to scrollable overflow
   even though `clip-path` hides the element, so any not-yet-revealed image
   made the whole document scrollable sideways by about 2% of the viewport —
   measured at **8px / 15px / 29px / 51px** at the four render targets. On a
   phone that is a sideways rubber-band on nearly every page. Fixed with
   `overflow: hidden` on `.reveal-frame` (and the equivalent on ServiceList's
   stage). **`overflow` is safe where `clip-path` is not**: it clips
   descendants only and does not alter the element's own box, so the
   IntersectionObserver that measures the frame is unaffected. The standing
   warning still holds — never put a `clip-path` on `.reveal-frame`.
2. **Collapsed accordion panels stayed in the accessibility tree.** Every
   trigger said `aria-expanded="false"` while a screen reader still announced
   all five answers, on both the blinds accordion and the contact FAQ. Fixed
   with `visibility: hidden` on the panel plus
   `transition: visibility 0s linear var(--accordion-duration)`, so visibility
   flips instantly on open and waits the full 420ms on close — 6.5's animation
   is unchanged, verified by sampling the panel through a full open and close
   cycle (0px → 235px → 0px, visibility hidden → visible → hidden). Also closes
   a latent tab-order trap if any panel ever gains a link.
3. **Stale sitemap filter and dev page** — see the ServiceList section above;
   both deleted.

## TEMPORARY — one throwaway thing that must be deleted before launch

### Cream-and-green palette preview — LIVE RIGHT NOW

`src/styles/sam-preview-theme.css`, imported by one clearly-marked line in
`Base.astro`. Custom-property overrides only — nothing in `tokens.css` or
`global.css` was edited, and no component markup was touched. **Delete that one
import line and the file, and the whole site reverts instantly.** `--indigo` is
re-pointed to the green rather than a second accent being introduced, so the
colour stays inside the single channel 3.3 reserves for a chromatic value.

**2026-07-26, and this matters for reading step 8:** the import was switched off
for the acceptance pass and **switched back on afterwards at Sam's instruction**,
so the site is as he left it. Every measurement in step 8 therefore describes the
**real 3.3 palette**, not this preview. With the line in place, §10's "no cream,
no terracotta" criterion fails site-wide — that is the one acceptance criterion
currently failing, and it fails by choice. **It must be disabled for real before
launch**, tracked in LAUNCH_CHECKLIST.md §2.

Recording the objection where it will be found later, because Sam asked for this
knowing it and the reasoning should not get lost: **DESIGN_BRIEF 3.2 names this
exact look as the number-one failure mode for this brief**, by name and by hex
("warm cream background near `#F4F1EA`... the single most likely failure mode...
Do not go near it"). 3.3's photography-only colour rule is a reasoned decision,
not a placeholder — Amy sells colour and pattern, so a brand colour competes with
the product. Decision 10 below tracks the accent question as genuinely open, citing
brand research that in the premium sites Amy responded to "the photography carries
all the color."

The stated reason for wanting it is that the site feels bare. That is still most
likely a **photography** gap rather than a palette gap — though less so than it
was: two real pillow photographs arrived 2026-07-26 and are the first
non-placeholder images on the site. The portfolio still has one project against
the brief's four to six, and that project one supporting image against the
brief's three to eight. Weigh the preview against what the site looks like once
Kelsee's shoot lands.

### ~~Service-list variants comparison page~~ — GONE

`src/pages/dev-service-list-variants.astro` and its temporary `astro.config.mjs`
sitemap filter were **both deleted 2026-07-26**, once Sam picked variant B and it
was adopted into `ServiceList.astro`. Nothing to remember here any more; the
variant descriptions that used to live in this section were moved into that
component's header so they survive the page. `grep -rn TEMPORARY src/
astro.config.mjs` now finds the palette preview only.

## Target file tree

```
/
  astro.config.mjs  package.json  tsconfig.json
  DESIGN_BRIEF.md   IMAGE-MANIFEST.md   BUILD-PLAN.md   ASK-AMY.md
  LAUNCH_CHECKLIST.md
  source-photos/          untouched originals
  legacy-static/          archived v1 site
  public/
    fonts/                archivo-variable.woff2, newsreader-300.woff2
    images/               hero/ portfolio/ team/ about/ og/
    robots.txt   favicon.svg
  src/
    content.config.ts
    content/journal/      three .md posts
    data/projects.ts      project records: slug, name, scope line, spec block, images
    data/services.ts      the four services + each one's hover-stage photo key
    data/photos.ts        every real photograph: handle, alt, blur-up, public path
    data/journalImages.ts thin alias over photos.ts, kept for the journal enum
    data/signaturePieces.ts  the two finished pillows on /signature-pieces
    styles/tokens.css     done
    styles/global.css     reset, hairlines, form controls, link underline device
    scripts/motion.js     reveal, nav, gallery, scroll-ease, accordion
    layouts/Base.astro
    components/           (list below)
    pages/
      index.astro
      portfolio/index.astro      portfolio/[slug].astro
      services/index.astro       services/drapery.astro
      services/blinds-shades.astro  services/upholstery.astro
      services/soft-furnishings.astro
      about.astro   process.astro   contact.astro
      contact/thank-you.astro
      journal/index.astro   journal/[slug].astro
      signature-pieces.astro
      cincinnati.astro   northern-kentucky.astro
      404.astro
```

Note on image serving: brief section 9 puts assets in `public/images/` (kept, it is
the manifest home and Amy-visible), but `astro:assets` only processes files under
`src/`. During the build, page-referenced photos move to `src/assets/images/` with the
same substructure so they get AVIF/WebP + srcset per section 7; `public/images/` keeps
verbatim-served files (og image). The manifest tracks both.

## Components

| Component | Responsibility |
|---|---|
| `Base.astro` | head, per-page title/description/canonical/OG, font preloads (2 files), tokens+global CSS, nav, footer, JSON-LD slot |
| `SiteNav.astro` | thin line, 6 items, transparent over hero → `--paper` + hairline + blur past 80vh |
| `SiteFooter.astro` | nav, location page links, Instagram/Facebook, service area line |
| `HeroGallery.astro` | array-driven; 1 item = static hero; cross-dissolve 6.5s/1.4s with brightness lift + slow scale; opening line once per session (sessionStorage) |
| `RevealImage.astro` | the signature: astro:assets image wrapped in shade-reveal clip; blur-up placeholder; explicit dimensions; every content image goes through this |
| `PortfolioStrip.astro` | home section 2: 4-6 projects, asymmetric scales and offsets |
| `ProjectGallery.astro` | detail page image flow, lead + supporting |
| `SpecBlock.astro` | Label-style: treatment, fabric house, lining, hardware, rooms |
| `Quote.astro` | Newsreader 300, first name + last initial, no stars/cards/avatars |
| `ServiceList.astro` | four entries, variant B asymmetry (per-row indent + point size); desktop-only hover/focus image stage, pure CSS `:has()` |
| `Accordion.astro` | grid-template-rows 0fr→1fr, 420ms; blinds decision categories |
| `StepList.astro` | numbered steps, Process page only |
| `ConsultationForm.astro` | full qualification form per 5.7, honeypot, required budget + attribution |
| `Faq.astro` | contact FAQ + FAQPage JSON-LD |
| `JsonLd.astro` | LocalBusiness (home), BreadcrumbList (every other indexable page), Article (journal). FAQPage lives in `Faq.astro`, deliberately |

`motion.js` is the only script: IntersectionObserver reveal (6.2), nav state (6.3),
gallery timer (6.1), hero scroll-ease, accordion (6.5). All gated on
`prefers-reduced-motion`.

## Build order

1. **Foundation.** `global.css`, `Base.astro`, `SiteNav`, `SiteFooter`, `motion.js`
   core (reveal + nav), 404. Everything else composes these.
2. **Home.** The two signature moves (full-screen hero gallery + shade reveal) carry
   the whole design thesis. Built second so you can judge the direction on one page
   before it propagates.
3. **Portfolio index + project template.** Establishes RevealImage, SpecBlock, and the
   scope-honest project record shape. Ships with the one substitute demo project until
   Kelsee's photography lands.
4. **Services overview + four child pages.** Each 400-700 words targeting its keyword
   cluster; Lafayette accordion on blinds-shades.
5. **About + Process.** Story, origin, invention framing, Studio row; numbered steps.
6. **Journal + Contact.** Three posts drafted from the brief's titles (flagged for
   Amy's review before launch); qualification form wired to the chosen form backend.
7. **SEO layer.** Location pages, all JSON-LD, robots.txt, sitemap verification,
   per-page meta audit, and a real `LAUNCH_CHECKLIST.md`. **Done 2026-07-26** —
   the checklist exists and is not a placeholder.
8. **Acceptance pass.** Every checkbox in brief section 10. **Done 2026-07-26**,
   with three defects found and fixed. Lighthouse's scored run is the one target
   still outstanding and needs Sam.

Also built, out of the numbered order: **step 3.5, Signature Pieces** (Sam's
request, 2026-07-26) and the **ServiceList variant B + hover stage** work. Both
are interpretation calls with their own sections above.

## Decisions needed from Sam (all eight build steps done; none block launch prep)

1. ~~**Hosting: Cloudflare Pages or Netlify?**~~ **Resolved: Netlify.** `netlify.toml`
   is in place (build command, publish dir, Node pinned to 24.18.0 matching this
   machine and Netlify's build-image default). Contact form is on Netlify Forms as
   of step 6. GitHub repo still open: init and first commit now, or wait?
2. ~~**Budget select ranges**~~ **Resolved, and now implemented** verbatim in
   `ConsultationForm.astro` (step 6). Under $2,500 / $2,500–$7,500 /
   $7,500–$20,000 / $20,000–$50,000 / $50,000+ / I'd like Amy's guidance on this.
   These predate this rebuild (not found verbatim in the transfer brief on this
   machine, but confirmed by Sam directly). Added to DESIGN_BRIEF.md §5.7.
3. ~~**"How did you hear about us?" options.**~~ **Resolved, and now implemented**
   verbatim in `ConsultationForm.astro` (step 6). Google search /
   Instagram / Facebook / Referred by a friend or family member / Referred by a
   designer or builder / Saw my work in a home / Houzz / Other. Same as above — added
   to DESIGN_BRIEF.md §5.7.
4. **Two testimonials** with first name + last initial. ~~**Format resolved for
   both**~~ as of 2026-07-26; 5.1's maximum of two is now filled and Home renders
   both. **Publishing permission is still open for both, and that is the whole
   remaining question.**
   - **"…made my house into a home." — Diane K.** Attribution approved by Amy
     2026-07-25.
   - **"She even matches complicated designs on the seams." — Kelly G.** Cut from
     a review on Amy's public Google Business profile. Chosen from four real
     candidates (Heather L., Jenny H., Lisa C., Kelly G.) because it is the only
     trade-level proof in the set — matching a pattern across a seam is exactly
     the kind of detail 3.6 says persuades a reader who knows the words — and
     because it sits in a different register from Diane K.'s: one quote is what
     the room felt like afterward, the other is how the work was built.
     Lisa C.'s was the weakest and carried an emoji (banned by 3.2) besides.
   - **A public Google review is not permission to feature it on Amy's own site.**
     Both quotes need written permission before launch. Same holding pattern for
     both, flagged in HTML comments beside each in `index.astro`.
5. ~~**LocalBusiness JSON-LD facts**~~ **Resolved 2026-07-24**, captured in
   `src/data/business.ts`: phone 859-640-5814, service-area business (base city Fort
   Wright KY for schema purposes, no published street address), Instagram, Facebook,
   and Google Business Profile URLs all live. Opening hours still TBD — flagged as
   `null` in that file, do not publish a guess. JsonLd component (step 7) will read
   from this file.
6. ~~**src/assets vs public** image-serving call above.~~ **Resolved by implementation:**
   the hybrid approach (both directories, per the note above) is already live across
   steps 1-3.
7. ~~Journal posts: draft from Amy's material in the brief, or wait for her notes?~~
   **Resolved — and it was resolved at the original project handoff, then never
   marked.** The decision was to draft all three launch posts now from the brief's
   topics, with Amy reviewing before launch, rather than waiting on her notes
   first. Implemented in step 6; each post carries a `<!-- DRAFT -->` marker.
   ASK-AMY.md item 1 still asks for ten minutes of her riffing per topic, which is
   what turns these from good drafts into her voice.
8. **Final tagline.** Unresolved since the first meeting. Not proposing an answer here —
   tracking it as open.
9. **Ampersand usage in body copy.** Whether/where "&" vs "and" is used in running text
   (nav and page titles already use "&", e.g. "Blinds & Shades"). Open, not resolved.
10. **Whether to expand beyond the single restrained accent color, or keep photography as
    the only source of color**, per the brand research on file (Meeting 03 notes, section
    11): in the premium sites Amy responded to, "the photography carries all the color"
    and backgrounds stay near-white or near-black, and a bold brand color would compete
    with what she actually sells, since fabric and color are the product. `--indigo` in
    tokens.css reflects that finding. Not proposing an answer — tracking it as open, same
    as tagline and ampersand above. (Note: I couldn't locate a "Meeting 03 notes" file
    anywhere in this repo to cite directly — flagging in case it's worth adding here for
    reference, not disputing the finding itself.)
11. ~~**Fabric-line naming, site-wide consistency.**~~ **Resolved 2026-07-26 by
    Amy, via Sam: Schumacher only.** Stout and Pollack are real lines she carries
    but are **not cleared for public naming**, pending her rep calls. Applied:
    `/services/drapery` now reads "Fabric comes from Schumacher and the other
    lines I represent"; Stout and Pollack appear nowhere in public copy on any
    page (audited — they survive only in two explaining comments inside Astro
    frontmatter, which never reach the HTML). Home, `/services`, `/about`, and
    `projects.ts`'s spec block were already on "the lines I represent" and are
    unchanged. Revisit `/services/drapery` and `about.astro`'s Fabric section
    when the other two reps clear.

    ~~**The three stale statements this created in DESIGN_BRIEF.md**~~
    **Corrected in DESIGN_BRIEF.md 2026-07-26, on Sam's instruction.** All three
    locations now state the clearance-gated rule rather than the flat fact:
    - **Rule 7** keeps the three fabric houses and Lafayette as the source list,
      and adds the gate — Schumacher cleared and named; Stout and Pollack under
      "the lines I represent" until individually cleared; Lafayette nameable as a
      source but no relationship claim until confirmed (see decision 12).
    - **§5.4.4** now says Schumacher may be named and the other two use the
      holding phrasing.
    - **The acceptance criterion** now reads "names only vendors cleared for
      public naming (currently Schumacher and Lafayette), covers the rest under
      'the lines I represent,' makes no unconfirmed relationship claim such as
      'dealer,' and never names William Morris."

    Step 8 can now pass this criterion on the code as it actually stands. No
    site copy changed for this — the code was already correct; the spec was the
    thing that was stale.

12. ~~**Lafayette is named publicly while its permission is still open.**~~
    **Resolved 2026-07-26 on Sam's instruction: naming stays, the dealer claim
    softens.** `/services/blinds-shades` said outright that "Amy is a Lafayette
    Interior Fashions dealer" — a factual public claim about a business
    relationship, with the same pending status as Stout and Pollack. Naming
    Lafayette as the source is what rule 7 and 8.3 ask for and is unchanged in
    the `<title>`, meta description, first paragraph, and body. The first
    paragraph now reads "Lafayette Interior Fashions is the one line I represent
    in this category, so every Lafayette blind and shade here comes from a single
    catalog," putting it under the same holding pattern as the two uncleared
    fabric houses. The keyword phrase "Lafayette blinds" survives in the
    sentence, so 8.3 is unaffected. Reason recorded in the page's own header
    comment. **Restore the dealer wording once Amy confirms the relationship** —
    same round of rep calls as Stout and Pollack, and now a narrower question in
    ASK-AMY.md.

13. **Timeline select options are invented.** 5.7 requires a Timeline field and is
    silent on its values; no source in this repo lists them. `ConsultationForm.astro`
    ships deliberately plain ones (As soon as possible / Within one to three months
    / Within three to six months / Six months or more out / Still planning) and
    flags them in place. Amy may well have real language for how she talks about
    lead times.

14. **Server-side validation does not exist.** DESIGN_BRIEF §7 requires "a honeypot
    field and server-side validation." The honeypot is in place; validation is
    browser-side only, because Netlify Forms accepts whatever is POSTed. Closing
    it properly means a Netlify Function, which is a step 7 decision about scope,
    not something to fake in the component. Flagged in
    `ConsultationForm.astro`'s header.

15. **Journal `publishDate` values are placeholders** (2026-07-08 / 07-16 / 07-24),
    chosen to stagger sensibly. They need resetting to real dates at launch, and
    they are the visible date on both the index and each post.

16. **"Zero pricing language anywhere in the codebase" (acceptance line 454)
    conflicts with 5.7's required budget field.** `/contact` contains five
    dollar ranges because 5.7's table and decision 2 require them. **Confirmed
    again in step 8's site-wide sweep: `/contact` is the only page on the site
    carrying any dollar figure**, and the `/signature-pieces` page added the
    same day introduces none. Rule 1's actual subject is public copy about her
    services rather than a qualification field, so 5.7 is being read as the
    specific instruction that beats the general one — the acceptance pass
    passes on that reading. **The criterion itself should still be amended to
    say so explicitly** rather than being failed on a technicality. Left for
    Sam, since DESIGN_BRIEF is his to change and this one was not on the list
    he gave.

17. **Signature-piece names are placeholders.** "Canal Houses" and "Dot Weave"
    describe the weave; they are not Amy's own names for these two pillows. If
    she has her own, they replace these — `src/data/signaturePieces.ts`. Also
    in ASK-AMY.md.

18. **`/signature-pieces` is a placeholder for e-commerce, not e-commerce.**
    Sam's framing and Amy is fine with it. Each piece links into the existing
    consultation form; there is no cart, price, stock, or checkout anywhere.
    Two live questions when this is revisited: whether it should ever become a
    real shop, and whether the "Inquire About This" links should pre-select
    Soft Furnishings on the contact form (needs a client-side script inside
    `ConsultationForm.astro`, which already carries hand-written validation
    logic — deliberately not done rather than overlooked).

19. **Photography is no longer entirely placeholder.** The two pillow photos
    added 2026-07-26 are the first real, non-substitute images on the site. The
    other three photographs still carry roughly twenty jobs between them.
    Asset request 1 in IMAGE-MANIFEST.md remains the highest-leverage thing
    outstanding.
