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

## 2026-07-27: Testimonial rotation — INTERPRETATION CALL

Home's testimonial section now shows **two quotes at once, with the second slot
rotating**. Requested by Sam; not a literal reading of the brief, so flagged
here rather than presented as spec compliance.

**DESIGN_BRIEF 5.1 was amended, not quietly deviated from.** It read "Two quotes
maximum," which the rotation contradicts on its face. The line now reads "two
quotes visible at once," with the fixed-anchor and rotating-slot behaviour
spelled out and the amendment dated. Two are on screen at any moment, which is
what the original constraint was protecting.

- **Top-left slot (Diane K.) is fixed and has no JS at all.** It is the anchor
  and the strongest quote.
- **Bottom-right slot** cross-dissolves on 6.1's exact timing (6.5s hold, 1.4s
  dissolve) — deliberately the **same device as the hero**, not a second motion
  idea, per 3.7's "everything else stays quiet so this can land. Do not add
  competing effects."

**The timer logic was extracted rather than duplicated.** `motion.js` gained
`startCrossDissolve(layers, cycleMs)`, lifted out of `initHeroGallery()`, and
both callers now share it. It carries all three lessons the hero learned the
hard way, so a third consumer gets them for free:
1. **Single-item guard** — under two layers, no interval is created. This is not
   an optimisation; a one-layer cycle re-running its own handoff forever was the
   cause of the hero's repeating-scale bug.
2. **Reduced motion** — returns before creating any timer.
3. **Caller-owned cleanup** — returns a teardown function instead of tracking
   the interval internally, so the leak the hero gallery had (one orphaned
   interval per soft navigation, driving detached layers) is hard to reintroduce.
   `stopHeroGallery` / `stopQuoteRotation` are both cleared on
   `astro:after-swap`.

**Accessibility: no `aria-live`, deliberately.** This is decorative rotation of
interchangeable social proof, not new information arriving. `aria-live` would
make a screen reader re-announce a quote every 7.9 seconds, interrupting
whatever the user was reading — worse than silence. Every quote is real text in
the DOM in document order, nothing is `display: none` or `aria-hidden`, so the
first reads normally once and all of them stay in the accessibility tree.

**Layout.** The layers are stacked with CSS grid (`grid-area: 1 / 1`) rather
than absolute positioning, specifically so the container keeps an intrinsic
height equal to the tallest quote. An absolute stack would collapse to zero and
need a magic-number height. Verified: height held at 181px across a full
rotation, no jump.

**Quotes in rotation, and the two that are missing.** Kelly G. and Lisa C., both
real and both verbatim. Lisa's is trimmed from a longer review and **her pink
heart emoji was removed** (3.2 bans emoji outright); "color came out perfect" is
left uncorrected because tidying a quote is still editing it. Kelly's is first
in the array on purpose — it is the trade-level one, so it is what shows at page
load and what reduced-motion users see.

**Heather L. and Jenny H. were left out.** Both are named in decision 4 as real
candidates, but **their review text does not exist anywhere in this repo, only
their names.** Writing words and attributing them to a named real customer would
be a fabricated endorsement, not a drafting shortcut. Each is a one-entry
addition to `rotatingQuotes` in `index.astro` once the actual wording is pasted
in — flagged in ASK-AMY.md. **Every quote in the rotation carries its own
permission-holding HTML comment**, not just the two that were live before.

**Verified in a real browser, not just in code.** Caught mid-dissolve with
opacities 0.448 / 0.552 summing to 1.0 (a true cross-fade, not a cut), and
sampled 45 times over 18 seconds: three clean handoffs, height stable
throughout. Reduced motion re-checked with Chrome's
`--force-prefers-reduced-motion`: opacities pinned at `1,0` across 12 seconds,
`activeIndex` never left 0, showing Kelly G. — one static quote, never a frozen
mid-fade. The same run without the flag advanced to Lisa C.

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
9. ~~**Ampersand usage in body copy.**~~ **Resolved 2026-07-28 by SITE-COPY-REWRITE.md:**
   ampersands are spelled out as "and" everywhere, including page titles, H1s, breadcrumbs, and
   `services.ts`'s service names — not just running text. Applied site-wide when the rewrite was
   merged (see the 2026-07-28 entry below). `services.ts`'s `'Blinds & Shades'` is now
   `'Blinds and Shades'`, and every title/H1/breadcrumb that named it is updated to match. Recorded
   in DESIGN_BRIEF.md's new Voice note (section 1).
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

20. **Sam wants Signature Pieces reachable from the nav — needs a decision, not
    a default.** DESIGN_BRIEF section 4 caps the main nav at six items and names
    them: Portfolio, Services, About, Process, Journal, Contact. All six are in
    use. Adding Signature Pieces means either **exceeding the cap** or
    **replacing one of the six**, and both are content/scope decisions that are
    Sam's and Amy's to make, not a styling fix. **Not resolved here.**

    What was done instead (2026-07-27) is the narrower thing that was actually
    wrong: the two existing entry points did not *look* like links. See the
    prose-link fix below. The page is reachable from the Portfolio index and
    from `/services/soft-furnishings`, and it is in the sitemap.

    Worth noting for whoever decides: Journal is the likeliest candidate to
    swap out if the cap holds, since it is three draft posts today, while
    Signature Pieces is the only page on the site showing finished objects
    that can be ordered again. That is an observation, not a recommendation.

21. **In-prose links had no resting affordance, site-wide.** Fixed 2026-07-27,
    recorded here because it changes a device the brief specifies. 6.6's scaleX
    underline is a *hover* effect — at rest `::after` is `scaleX(0)` — and the
    base `a` reset sets `color: inherit` with no text-decoration. So an inline
    link inside a paragraph was **pixel-identical to the prose around it** until
    a pointer happened to cross it. Sam reported not being able to tell the
    Portfolio page's "signature pieces" was a link, and he was right.

    Sixteen links across twelve pages were affected, so it was fixed at the root
    rather than on the two reported instances. Also a real WCAG 1.4.1 failure:
    no colour difference and no underline meant no distinguishing feature at all.

    **6.6's device is untouched.** A second pseudo-element does the work: a
    always-on 1px `currentColor` hairline on `::before`, with the 2px `--indigo`
    `::after` still drawing left-to-right over it on hover. Scoped to `p` (and
    the journal's `.prose a`, which reproduces 6.6 for markdown links and had
    the identical defect), so list-based navigation — the nav, the footer,
    ServiceList — keeps the clean hover-only treatment the brief describes.

## 2026-07-27: the oversized portfolio image — root cause was the grid, not the image

Reported as "the lead image on the Portfolio detail page renders roughly two
screen-widths tall." **It was not the lead image**, and checking before fixing
mattered here.

Measured at 1345px:
- **Lead image: 1345x757, ratio 1.78.** Exactly the `aspectRatio="16/9"`
  `ProjectGallery` asks for. Correct, and correct all along.
- **Supporting image: 1249x1561** — taller than the 1324px viewport, and on a
  short laptop screen genuinely about two screens tall. That is the one that
  looks wrong.

**Root cause: `grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem),
1fr))` with a single grid item.** Computed value was literally
`1249px 0px 0px` — `auto-fit` collapsed the two empty tracks to zero and the one
surviving track took the whole row, because its max is `1fr`. A 4:5 aspect on a
1249px-wide track is 1561px tall.

**A different mechanism from the two earlier height bugs, and worth
distinguishing.** The hero's ~58% bug was `<picture>` inheriting `height: auto`
from the image reset; the reveal's overflow bug was `scale(1.04)` contributing
to scrollable overflow. This one is grid track sizing, and unlike either of
those it is **content-count dependent** — it only appears while a collection
holds exactly one item, which is precisely the state the portfolio and this
gallery are in today. With three or more items the grid always looked right,
which is why it survived the step 8 acceptance pass: every render check measured
overflow and off-canvas elements, and a too-tall in-flow image is neither.

**Fixed at the root** by capping the track max at `32rem` instead of `1fr`, in
all four places the pattern appears — `PortfolioStrip`, `ProjectGallery`,
`journal/index`, `portfolio/index`. Three of the four had the same latent bug
waiting for the same conditions; only two were showing it.

Verified after the fix: supporting image 512x640 at 1345px and 1440px,
portfolio index card the same, lead unchanged at 16:9 full-bleed, zero
horizontal overflow. At 375px nothing changed — lead 375x211, supporting
335x419, single column — because the pathology needed a wide viewport and mobile
was never affected.


## 2026-07-28: Ivory House — the first real project photography, and its first whole-house project

Sam added a real client-house shoot (~27 rough-edit frames, photographer
Kelsee Etmans) to `source-photos/preeditstardustlnpics/`. Every image slot
that has run on crops of one substitute photo since step 2 draws on it now:
Home hero, Portfolio (a second project, "Ivory House"), and all four
ServiceList hover stages, each now carrying its own distinct real photo
instead of two rows sharing one.

**Ownership of what's in frame arrived in three passes over the session, each
one broader than the last — worth recording so the reasoning is auditable,
not just the conclusion.** Pass one: drapery plus one confirmed pillow. Pass
two: drapery plus two named pillows (the round navy "ball" pillow, and the
front pillow on the chair nearest the drapes). Pass three, the one actually
used: whole-house, covering all four services — drapery throughout; the
kitchen island's rattan-stool cushions; the reupholstered breakfast-room
dining chairs (the only real finished-upholstery photography this site has);
two sage lumbar pillows on the living-room barrel chairs; the bay-window
room's white wood blinds; one sage banquette pillow; and the ball pillow.
Confirmed NOT hers: the sheepskin armchair, the sofa, and the barrel/rattan
chairs themselves (only their cushions are hers). Full frame-by-frame
selection and disqualification record: IMAGE-MANIFEST.md.

**This is a genuine interpretation call, not a mechanical wiring job**,
flagged per the standing convention:
- **Alt text vs. scope are two different jobs.** Several selected frames
  necessarily show furniture Amy didn't make alongside work she did — a room
  photograph can't crop out the sofa. Alt text (rule 10, accessibility)
  describes what's actually in frame; the authorship claim lives in
  `projects.ts`'s `scope` line and spec block (5.2), same separation the site
  has always used. Nothing here is a new precedent, just the first time it's
  had to carry this much weight in one project record.
- **The fur-armchair frames were re-evaluated, not reused wholesale.** The
  chair itself is confirmed not Amy's; three crops of it exist (25/26/27).
  Only the tightest (27), where the ball pillow reads as sharp and central
  rather than a small accent against a large fur field, was judged clean
  enough to use. The other two were left out rather than stretched.
- **A room-relationship question is flagged, not resolved by assumption.**
  Amy's account puts the reupholstered dining chairs in the same room as the
  bay-window blinds; the photographs read as two different spaces (different
  floor, different window treatment, family photos visible in only one set of
  frames). Both frames are used for their own independently-confirmed scope
  regardless of the answer — see IMAGE-MANIFEST.md and ASK-AMY.md.

**New project: "Ivory House."** Named by Sam after three rounds of naming
proposals — the first two assumed a single-room scope that whole-house
ownership then outgrew. Rejected along the way: "Pleated Light" (too
abstract against the plainer "Collected Living Room"), "Orb & Ivory" (names
the chandeliers, which aren't Amy's work, and the ampersand question is still
open per decision 9), "Considered Rooms" ("considered" is already load-bearing
site copy elsewhere). "Ivory House" names the drapery colour running
throughout the house — real, Amy-made, and the shoot's unifying visual
thread — and "House" signals whole-house scope plainly against the existing
single-room project name.

**Spec block, populated more completely than the first project's** — this is
a real multi-service project, and 3.6 asks for exactly this once the facts
exist: `treatment: "Drapery, blinds, reupholstered dining chairs, cushions and
pillows"`, `rooms: "Living room, breakfast room, kitchen"`. `lining` and
`hardware` stay unset — not established, not guessed, same pattern as the
first project and as `business.ts`'s opening hours.

**8 supporting images** (5.2's stated maximum), one lead. Not 9: an early
draft included both living-room crops (01 and 02) as separate supporting
images alongside the hero; since 01 is already the Home hero, its near-
duplicate 02 covers the same room and was kept instead, keeping the count at
the brief's ceiling rather than over by one.

**OG image regenerated** from the new hero crop, replacing the file at the
same path (`public/images/og/og-default.jpg`) — no code changes needed
elsewhere, since every page's `ogImage` prop is already that literal string.

**Repo weight, handled per Sam's explicit instruction.** The full ~27-frame
rough-edit set is **not tracked in git** — `.gitignore` now excludes
`source-photos/preeditstardustlnpics/` specifically, with the reasoning
recorded there and in IMAGE-MANIFEST.md. The photographer's own Drive folder
is the real archive for the full shoot; this repo tracks the ten selected,
processed, renamed files only. Nothing was deleted from disk — the standing
rule against deleting real photography holds; this is a git-tracking
decision, not a retention one.

**Filenames stripped of the street name throughout**, per rule 4 and 8.1 —
source files were `stardust_ln_rough_edit-NN.jpg`; every selected file is
renamed to describe what's actually in frame (e.g.
`pinch-pleat-drapery-header-rings-crown-molding.jpg`,
`houndstooth-reupholstered-dining-chair-breakfast-table.jpg`).

**Verified in a real browser, both widths.** At 1440px: Home hero renders the
real photo with the wordmark legible over it (the location line sits close to
the chandelier at this crop — legible, but visually busier than the original
substitute's clearer sky/wall area; flagged as a minor polish item, not fixed,
since correcting it is a crop/composition judgment call rather than a bug).
ServiceList's four hover-stage images confirmed distinct by inspecting the
rendered `<img>` sources directly; hovering "Blinds & Shades" swapped in the
real bay-window photo cleanly. Portfolio index shows both projects,
asymmetric, no overflow. The Ivory House detail page renders 9 real image
frames (1 lead + 8 supporting) with real alt text, scope line, and spec
block. At 375px: zero horizontal overflow anywhere, including the detail
page's supporting-image grid (the exact grid the step-3 auto-fit bug lived
in) — confirmed it doesn't recur with 8 items, only ever showed with 1.
Console clean on both pages at both widths.

**Permission is still outstanding and blocking**, tracked in
`LAUNCH_CHECKLIST.md` §1 on the identical holding pattern already used for
the testimonials: written permission from both the photographer (copyright)
and the homeowner (their house) has not been obtained. Wired in and visible
for review; not cleared to publish.

## 2026-07-28: SITE-COPY-REWRITE.md merged — the site is now first person

`SITE-COPY-REWRITE.md` had sat in the project root, untracked, since a session before Ivory
House — a full rewrite of every page's copy in Amy's own voice, first person throughout, roughly
half the prior word count, written before Ivory House existed. Merged in, not overwritten: Ivory
House's project record, images, scope line, and spec block are untouched, and both testimonial
slots, the Diane K./rotation structure, and every quote's own permission-holding comment are
unchanged. **This copy has not been reviewed by Amy** — same holding pattern as the Journal drafts
and the testimonials, and worth remembering the next time this file is touched.

**What changed.** Every page's body copy, first-person throughout ("I design," "I make," "the
lines I represent" stays as-is since it was already first person). Ampersands spelled out as
"and" everywhere the rewrite touched, resolving decision 9 above — `services.ts`'s
`'Blinds & Shades'` is now `'Blinds and Shades'`, and every title/H1/breadcrumb/JsonLd entry that
named it now matches. "Two-storey" on `/cincinnati` fixed to "two-story" (the rewrite doc itself
still had this British spelling even though its own intro claims "British spellings corrected" —
worth knowing if a future pass trusts that claim at face value). "Colour" in
`signaturePieces.ts`'s Dot Weave description fixed to "color" for the same reason. Swept the rest
of the visible copy for other British spellings; none survived. DESIGN_BRIEF.md gained a Voice
note (section 1) stating first person as the standard going forward, so voice doesn't drift back
to third person on the next edit.

**Two deliberate non-applications, not oversights:**
- **The hero and footer location lines were NOT reverted.** SITE-COPY-REWRITE.md's Home and
  footer sections both show "Cincinnati, Northern Kentucky, plus select travel projects" /
  "Cincinnati and Northern Kentucky" / "Plus select travel projects" — the wording Amy explicitly
  asked to replace with "Cincinnati/NKY Based" / "Serving all areas" on 2026-07-25 (see that
  step's entry above). The rewrite doc predates that correction and was never updated to reflect
  it. Applying it here would have reverted a dated, sourced instruction from Amy with older copy
  from a document that doesn't know about it — so it was left alone. Everywhere else the rewrite's
  copy is newer than what it replaced; this one spot is the exception, and it's flagged here so it
  doesn't get "corrected" back to the rewrite's wording by mistake later.
- **Meta descriptions stayed third person** ("Amy Clark designs, makes, and installs...") even
  though on-page body copy became first person. This isn't a gap — the rewrite doc itself does
  this consistently: every page's on-page voice is "I," but every meta description names "Amy" or
  "Amy K Clark Design." Third person reads better as a search-result snippet with the business
  name in it. Followed that pattern throughout rather than making metas first person too.

**Projects.ts gained a `metaDescription` field**, separate from `scope`. The rewrite gives two
different sentences for Collected Living Room — a first-person on-page paragraph ("I chose the
fabric...") and a third-person meta description ("Amy selected the fabric...") — and the existing
code fed one `scope` field to both the visible paragraph and `<meta name="description">`. Rather
than pick one voice and lose the other, `Project` gained an optional `metaDescription`, falling
back to `scope` if unset. Both projects now carry one. Ivory House's original scope text (written
before this rewrite, third person) became its `metaDescription` verbatim, shortened from 228 to
123 characters to clear 8.1's 155-character limit — it was already over budget before this pass;
nobody had audited it since it shipped two sessions ago. Its `scope` is now first person, matching
the rest of the site.

**Blinds and Shades accordion:** category titles shortened to match the rewrite's button labels
("Light and glare," "Children and pets," "Room by room" stays) rather than DESIGN_BRIEF 5.3's
longer phrasing ("light and glare control," "child safety"). Same five categories, shorter labels
— a wording nuance, not a scope change. The "One line, on purpose" section (Lafayette-catalog
framing, "whichever supplier happens to be convenient") is gone; the rewrite folds that content
into the page's opening paragraph instead, including the roman-shades routing note that used to
live under that heading.

**Process's step 3 keeps its DESIGN_BRIEF name.** 5.5 lists the four step names explicitly,
including "Fabrication and coordination"; SITE-COPY-REWRITE.md's process page shortens this one
step to just "Fabrication." Since 5.5's four names are a structural requirement or 5.5 wouldn't
list all four in full, the step title stayed put — only the body text under it was replaced with
the rewrite's first-person version.

**Word counts on all four service pages are now well under 5.3's 400-700 minimum**, and this is
the direct, known cost of applying the rewrite: drapery 373 words, blinds-shades 415, upholstery
315, soft-furnishings 410 (measured against the compiled `dist/` output). This is the same tension
decision 16 already named for pricing language — one instruction (SITE-COPY-REWRITE.md, "roughly
half the current word count," which is Amy's own stated rule that visitors are here for visuals
"with a little bit of words") conflicts with an older, more specific one (5.3's 400-700 count). Not
resolved here — reading the rewrite as the newer, more specific instruction and letting it win, the
same way 5.7 already beat the general no-pricing rule on Contact. **Flagged for Sam:** either 5.3's
word-count floor should come down, or the service pages need Amy's own material added back in to
clear it — padding them with generic sentences to hit a number would be the wrong fix.

**New flag, Contact FAQ's "Where do you work?" answer.** The neighborhood list here (and on
`/cincinnati`) asserts specific places Amy actually works. 8.4 permits naming them "where
accurate," and this list predates this rewrite — it isn't new copy, just carried forward — but it
has never been explicitly confirmed with Amy as accurate. Flagged in an HTML comment in
`Faq.astro` and in ASK-AMY.md.

**Verified:** `npm run build` clean, 21 pages. Scripted audit of the compiled `dist/` output: every
title ≤60 chars, every meta description ≤155 (after the Ivory House fix above), exactly one `<h1>`
per page, no heading-level skips, zero banned words (rule 5), zero em dash in visible body copy
(the few that remain are inside HTML developer comments, not rendered text — checked directly),
no "William Morris," no unconfirmed "dealer" claim, no "two-storey" or "colour," and testimonial
quotes correctly left in the clients' own third-person words rather than converted to Amy's first
person (they're quotes from someone else, not her copy).

## 2026-07-28/29: Copy made bulk-swappable — where Sam edits what

Goal: change site copy by editing one obvious file instead of hunting through
`.astro` templates. **Read this plainly first, because it's the honest
framing for everything below:** a markdown file cannot be the literal live
source without a fragile parsing layer sitting between it and the page. What
actually got built is a copy layer that mirrors SITE-COPY-REWRITE.md's
structure closely enough that changing a page's copy is a find-and-replace in
one predictable file, not a rewrite of how the site works.

### The split, and where it deviated from the brief

**Long-form prose → a new `pages` content collection**, same mechanism as
`journal` (glob loader, one markdown file per page, Zod schema in
`content.config.ts`). Nine files in `src/content/pages/`: `drapery.md`,
`blinds-shades.md`, `upholstery.md`, `soft-furnishings.md`, `about.md`,
`process.md`, `cincinnati.md`, `northern-kentucky.md`, `contact.md`. Each
carries frontmatter for the fixed fields (`seoTitle`, `description`,
`eyebrow`, `title`, `lead` — an array of paragraph strings, not one string,
so a multi-paragraph lead like Blinds and Shades' or Contact's doesn't need
hand-rolled markdown just for a paragraph break) plus a markdown body for the
flowing `##` prose sections.

**Not every page's collection entry has body prose, and that's deliberate,
not a gap:**
- **Process** has no free text at all — its content is four numbered steps
  (`steps: [{title, body}]` in frontmatter), which is structured data, not
  prose that flows.
- **Blinds and Shades** keeps its five accordion categories
  (`decisionCategories`) and the one heading + sentence directly above them
  (`decisionCategoriesHeading` / `decisionCategoriesIntro`) as frontmatter,
  not markdown body — a plain paragraph can't become five independent
  accordion panels without a parsing layer, and the heading/intro sits
  between two pieces of an interactive component, which markdown's single
  linear document can't cleanly interleave either.
- **Contact** keeps its seven FAQ question/answer pairs (`faqs`) as
  frontmatter for the same reason as the accordion, plus a second one:
  `Faq.astro` generates FAQPage JSON-LD (8.2) straight from those exact
  strings, so they have to stay real, typed data rather than something parsed
  back out of freeform prose — splitting the copy from the schema
  guarantees drift.

`Faq.astro` changed from a hardcoded `const faqs` to a required `faqs` prop,
fed by `contact.astro` from the collection entry. `Accordion.astro` itself
was untouched — both consumers (blinds-shades, the FAQ) already passed it an
`items` array; only where that array comes from changed.

**About is the one page where the brief's own plan (one markdown file, images
untouched) ran into a real interleaving problem, flagged rather than forced.**
The pre-rewrite page put the origin/workroom photo *between* two prose
sections ("Where it started" and "Every one of them is invented"). A single
markdown document can't cleanly interleave a `<RevealImage>` mid-flow without
a fragile parsing layer — so `about.md`'s body is all four `##` sections in
one continuous document, and **the origin image moved** to sit after all of
them, immediately before Studio. Workroom photo leading into the people who
work in it reads fine as a sequence, but it is a real, visible reordering,
not just a refactor — flagged in `about.astro`'s own header comment and
worth Sam's or Amy's eyes if either would rather see it back in the middle
badly enough to justify hand-splitting the page instead.

**Short strings → mostly already fine where they already lived, deduplicated
where they weren't.** The brief's list was nav labels, button text, footer
lines, meta titles/descriptions, ServiceList one-liners, and form
labels/select options. Checked each:
- **ServiceList one-liners** (`src/data/services.ts`) and **form labels/select
  options** (`ConsultationForm.astro`) were *already* single, well-organized
  files holding exactly that copy and nothing else — four objects, thirty
  lines. Moving them into a second file wouldn't have made them more
  editable, just relocated. Left alone; noted here so it reads as a checked
  box, not a skipped one.
- **Nav labels were genuinely scattered** — `SiteNav.astro` and
  `SiteFooter.astro` each hardcoded their own separate six-item array, so
  changing a label meant remembering to edit both. New `src/data/nav.ts`
  (`navItems`, `locationPages`), imported by both. One array now.
- **The "Ready to start your project?" contact-band** wasn't in the brief's
  list by name, but it was the single worst offender found: the exact same
  three-line block, byte-for-byte identical, hardcoded into **eleven**
  separate `.astro` files. New `ContactBand.astro` component replaces all
  eleven. Not "short strings" in the brief's sense, but squarely inside its
  goal — this is the line most likely to actually get edited (the site's one
  CTA), and it used to require eleven coordinated edits to change once.
- **Meta titles/descriptions** for the nine `pages`-collection pages moved
  there with everything else. The remaining pages (Home, Portfolio index and
  detail, Journal index, Signature Pieces, 404, Contact thank-you) keep theirs
  inline — each is a single-purpose page with no duplication problem to
  solve, so centralizing further would have been motion without a point.

**`.prose` styling promoted from a page-scoped block to `global.css`.** The
Journal already had exactly the h2/paragraph/list/link treatment every new
markdown-driven page needed, written as a scoped style block in
`journal/[slug].astro` using `:global()` on the elements `<Content />`
renders (Astro can't scope markdown output the normal way). Moved verbatim
into `global.css` as plain unscoped rules — `.prose h2` uses the identical
clamp as `.text-page__subhead` on purpose, so a markdown `##` looks pixel-
identical to a hand-written `<h2 class="text-page__subhead">`. Journal's own
style block now holds only what's actually journal-specific
(`.journal-post__heading`, `.journal-post__date`, `.journal-post__related*`).

### `projects.ts` gained a `metaDescription` field, found during this pass

Not part of the plan going in — found while wiring the collection. Every
`<meta name="description">` on the site reads in **third person** ("Amy Clark
designs, makes, and installs…") even on pages whose on-page body is first
person; SITE-COPY-REWRITE.md does this consistently throughout (a search
snippet reads better with the business name in it). But `portfolio/
[slug].astro` fed one `scope` field to *both* the visible paragraph and the
meta description, and the rewrite gives Collected Living Room two different
sentences for those two jobs ("I chose the fabric…" on-page vs. "Amy selected
the fabric…" for search). Rather than lose one voice or the other, `Project`
gained an optional `metaDescription`, falling back to `scope` if unset. Both
projects now carry one — Ivory House's pre-existing third-person `scope` text
became its `metaDescription` verbatim, **shortened from 228 to 123
characters** in the process, since it had been over 8.1's 155-character limit
since the day it shipped and nobody had audited it until this pass.

### `SITE-COPY-EXPORT.md` is now regenerable

`scripts/export-site-copy.mjs` (`npm run export-copy`, after `npm run
build`) rebuilds the export from the compiled `dist/` HTML, not from source —
deliberately, since `dist/` is the one place guaranteed to reflect exactly
what a visitor sees regardless of which of the three places (a `pages` entry,
the `journal` collection, or one of the remaining hardcoded pages) a given
line of copy actually lives in. It's a plain regex tag-walker over this
codebase's known class names, not a real HTML parser — no dependency in
`package.json` does that job, and adding one for a one-off script felt like
the wrong tradeoff for a site this size.

**One real bug caught and fixed while testing it, worth remembering:** the
first version's `<p>` pattern (`<p[^>]*>`) also matched `<picture ...>` tags,
since both start with the letter "p" — it silently swallowed an entire
`<picture><source><img>` block as if it were paragraph text, which merged
the testimonial section's heading into the first quote with no `**H2:**`
marker and no visible symptom beyond "that one line reads oddly." Fixed with
a lookahead requiring "p" to be followed by whitespace or `>`
(`<p(?=[\s>])[^>]*>`), applied to the `<a class="btn">` pattern too as the
same class of bug waiting to happen. A second bug — two of the regexes
matching a `<section class="...">` opening tag required that exact literal
class string with nothing else after it, which broke the moment Astro's
`data-astro-cid-*` scoping attribute got appended — silently produced an
empty Contact intro (H1 and all three lead paragraphs missing, no error).
Both are the kind of failure the script's own header comment warns about:
"wrong in an obvious way, not silently corrupt" — true here in hindsight, but
only because the output was actually read line by line rather than just
diffed for line count.

**What it can't regenerate, and doesn't try to:** the "Every testimonial on
file" section at the end (full, un-fragmented review text collected directly
from Amy, most of it never rendered on the site at all) isn't in the compiled
HTML by definition. The script detects and carries that section forward
verbatim from whatever `SITE-COPY-EXPORT.md` already exists rather than
dropping it.

**What it doesn't guarantee:** byte-identical output to the original
2026-07-27 hand-curated file in every cosmetic choice (e.g., whether a
repeated list item's name and description share one bulleted line). That
original was hand-built; this one is generated from real markup, and the two
conventions don't always agree on formatting a given repeated block. The
structure — page-by-page sections, `**H1:**`/`**H2:**`/`**BUTTON:**`/
`**FIELD:**` markers — matches, which is what makes it still useful as a
single skimmable reference and a diff target after a copy change.

### Verification

Built and manually checked incrementally — services first, then About and
Process, then the two location pages, then Contact — rather than one large
rewrite, per the brief's own instruction. `npm run build` clean at every
stage (21 pages). After the full set landed: scripted sweep of the compiled
`dist/` output for meta title/description length, `<h1>` count, heading-level
skips, banned words, em dash in visible copy (found only inside HTML
developer comments, not rendered text), "William Morris," the unconfirmed
"dealer" claim, "two-storey," and "colour" — all clean, none reintroduced by
this pass. Real-browser checks via the dev server, not just `dist/`: console-
error sweep across ten navigated pages (zero errors on every one), 375px and
desktop screenshots confirming the Blinds and Shades accordion still opens
with its five categories in order, `document.documentElement.scrollWidth -
clientWidth === 0` (no horizontal overflow) at 375px on About (the page with
the moved image) and Contact (the page with the restructured form/FAQ pass).

### Left alone, as instructed

`journal` collection and its three posts, testimonials (`index.astro`'s
`rotatingQuotes` plus the fixed Diane K. quote), `projects.ts`, `services.ts`,
`business.ts`, `photos.ts`, `signaturePieces.ts`. None of these needed the
copy-bulk-swap treatment — they're already either small, well-organized data
files or, for the journal, already on the exact mechanism this phase gave
everything else.

### Where Sam edits what, in plain language

- **A service page, About, Process, a location page, or the Contact intro
  and FAQ:** edit the matching file in `src/content/pages/`. Title, meta
  description, the label above the H1, the H1 itself, the intro
  paragraph(s), and the body prose are all frontmatter or markdown in that
  one file.
- **The nav or footer link labels:** `src/data/nav.ts`.
- **The "Ready to start your project?" line or its button:**
  `src/components/ContactBand.astro` — one edit, all eleven pages update.
- **A service's one-line description on Home/Services, or which photo its
  hover state shows:** `src/data/services.ts`.
- **The consultation form's labels, hints, or select options:**
  `src/components/ConsultationForm.astro`.
- **A Journal post, a testimonial, project details, or the signature
  pieces:** unchanged from before this phase — still `src/content/journal/`,
  `index.astro`'s testimonial arrays, `src/data/projects.ts`,
  `src/data/signaturePieces.ts`.
- **To check what actually changed after an edit:** `npm run build && npm run
  export-copy`, then read or diff `SITE-COPY-EXPORT.md`.

## 2026-07-29: Phase 3 — five more Ivory House frames, closing the substitute-photo gap

Full selection record, the frame-by-frame reasoning, and the disqualified-group
writeups live in IMAGE-MANIFEST.md's new Phase 3 section — not duplicated here.
Summary of what changed and why it's recorded this way:

**Five slots moved off substitute photography:** the three Journal post
heroes and both location-page leads. All five now show real Ivory House
work instead of crops of the original placeholder photo. `src/data/photos.ts`
gained five new entries (`ivory-house-fabric-detail`,
`ivory-house-bay-window-table`, `ivory-house-drapery-length`,
`ivory-house-reading-nook`, `ivory-house-archway`); the three journal `.md`
files' `heroImage` field and `cincinnati.astro`/`northern-kentucky.astro`'s
`lead` lookup were repointed at them.

**One frame needed a real crop, not just a resize, and the first pass got
that wrong before it got fixed.** The initial script resized all five
selected frames to 2000px-long-side without any region cropping, on the
theory that `object-fit: cover` at render time would handle framing the
same way it already does for other non-16:9 sources on this site. That
held for four of the five. It did not hold for frame 23 (destined for the
"How to Read a Fabric" hero): the resized frame is a wide dining-table
shot, and at that hero's 16:9 aspect ratio almost none of it gets cropped
away, so what rendered was a table setting, not the fabric-texture close-up
the post needed. Caught by actually looking at the output before treating
the job as done, not by the build succeeding (a wrong-but-valid image is
invisible to `npm run build`). Fixed with a real `sharp().extract()` crop
of the houndstooth chair fabric specifically, re-resized and re-blurred
from that crop. The other four frames' plain resize-only treatment was
correct and is unchanged.

**Dev-server verification hit a caching dead end, and it's worth recording
so a future session doesn't lose time on it again.** After the crop fix,
the Browser pane kept rendering the old (wrong) image on `/journal/
how-to-read-a-fabric` — across a hard reload, a full dev-server restart,
and even a `node_modules/.astro/assets` cache wipe, in both the original
tab and a freshly opened one. Isolated with `curl` directly against the
exact request URL the page issues (`/_image?href=...houndstooth-fabric-
detail-dining-chair.jpg...`): the **server** returned the correct cropped
image every time, confirmed by converting the AVIF response and reading
the actual pixels. The Browser pane's own rendering was stale by a
mechanism that didn't respond to any of the normal cache-busting moves
tried — a tooling artifact on the automated browser's side, not a bug in
the site. Verification for this phase leaned on `curl` + reading the
source files directly + grepping the compiled `dist/` output instead,
which is what actually confirmed correctness. Worth trying a full new
`preview_start` (not just a new tab) first if this recurs.

**The hero composition issue flagged last session (location line and
wordmark sitting on top of the chandelier) was investigated properly, not
skipped.** Measured the real rendered composition at 1440×816 and 375×812,
worked through why `object-fit: cover` behaves the way it does against the
source's actual 2000×1143 dimensions at each breakpoint, and checked
whether any other candidate frame has better chandelier headroom (none
does — frame 01 was already the best of the set, confirmed against the
step-2 selection notes). Conclusion: this can't be fixed by a crop or an
object-position tweak, because the site's centered text and the
photograph's centered chandelier are structurally in tension, and there
isn't crop margin at desktop width to redistribute even if that weren't
true. Left as-is; flagged as the top item in `PHOTO-EDIT-REQUEST.md` since
a human recompose during Kelsee's final edit is the only real lever.

**Fourteen of the seventeen previously-unused frames were reconsidered and
stayed unused**, most for the same reasons the step-8 portfolio pass
already found (family photograph visible, ownership-ambiguous pillow
combinations, near-duplicate framing) — those reasons don't expire just
because the destination page changed. Full breakdown in
IMAGE-MANIFEST.md.

**About/Studio: confirmed no eligible frame exists**, rather than assumed.
Every one of the ~27 frames is residential-room photography; none shows
Amy at work. The workroom substitute stays exactly where it is on
`/about` and `/process`.

**Verified:** `npm run build` clean (21 pages). Scripted sweep of the
compiled `dist/` output: meta title/description lengths, single `<h1>` per
page, no heading-level skips, zero banned words, no "William Morris,"
no "two-storey," no "colour" — all clean. `alt` text for all five new
images confirmed correct via the compiled HTML directly (not the Browser
pane, per the caching issue above).

---

## 2026-07-31: Kristen Hitch website review — decision log

Present: Kristen Hitch, Amy Clark, Sam Clark. First outside review of the
built site. Everything below is a decision taken in that meeting, not a
proposal. `DESIGN_BRIEF.md` has been updated to match — where this log and
the brief say the same thing, the brief is the authority and this entry is
the record of *when and why*.

**Next meeting: Thursday 2026-08-20, 2:00pm, Kenton County Public Library,
Erlanger Branch.**

### The decisions

1. **Voice moves from first person to third person, site-wide.** "Amy
   designs," "she makes," not "I design." This reverses the 2026-07-28
   SITE-COPY-REWRITE.md pass, which moved the whole site the other way.
   Reasoning: third person reads as an established studio rather than a
   personal account, and it survives being lifted into ad copy, directory
   listings, and referral contexts where a first-person "I" has no visible
   speaker. Testimonials stay in the client's own voice.

2. **Homepage section order: Portfolio → Services → About.** Lead with the
   work, not with who made it. The differentiator block moves below Services.

3. **One CTA button per section, maximum.** The duplicate `View Portfolio`
   buttons go; the single portfolio link lives in the Portfolio card slot.
   Two buttons competing in one viewport split the click.

4. **A visible section header on every homepage card** — Portfolio,
   Services, About, and the client-quote section. Several of these were
   `visually-hidden` headings that existed only for screen readers, which
   left sighted readers scrolling into unlabelled walls of images.

5. **The client-quote section heading is `What Our Clients Say About Working
   With Us`, and it is visible.** **Do not use the word "testimonials" as a
   visible label** — it names the marketing device rather than the thing, and
   it reads as permission to skip.

6. **All service names render at identical font size and weight.** The
   staggered *positions* are fine and stay — that is 3.5's asymmetry. Size
   hierarchy is not fine: rendering one service bigger than another says one
   matters more, which is not the message. (Kristen raised this against three
   names specifically; applied to all four, since the objection is identical
   for the fourth.)

7. **"Cincinnati" comes out of the homepage hero.** It was the only text
   competing with the photograph. Geography moves to one footer line:
   `Serving Cincinnati and Northern Kentucky since [DATE — ask Amy]`.

8. **Cincinnati / Northern Kentucky gets named on the Services page, the
   About page, and as a note on the contact form** — where someone is
   actually deciding whether Amy covers them.

9. **Booking becomes a two-step funnel.** Step 1: **Complimentary Discovery
   Call** (free, phone). Step 2: **In-Home Design Consultation** (paid, in
   person, roughly 3 hours). The primary site-wide CTA is **"Schedule your
   complimentary discovery call."** The site's job is step one.

10. **Footer CTA changes from "Ready to start your project" to "Let's Get
    Started."**

11. **Portfolio entries get a short evocative non-identifying name plus a
    brief problem/solution blurb, and each entry is trimmed to a tight small
    collage rather than a long photo scroll.** The names already followed the
    rule; the blurb is new, and the collage supersedes 5.2's previous "three
    to eight supporting images" stacked full-width.

12. **A new standalone `/blinds` landing page**, which may be hidden from the
    main nav, to receive future targeted ad traffic. Blinds and shades is the
    growth category and the one most likely to get ad spend.

13. **Reduce the vertical white space between homepage sections.** Measured
    on the real page, 3.5's spacing put a full empty screen between sections,
    and readers took that as the end of the page and stopped scrolling.

14. **Amy's real phone number does not go on the site.** A Google Voice
    business number will be obtained; until it exists, the site carries a
    placeholder and no dialable number anywhere, JSON-LD included.

15. **`/signature-pieces` is removed, and full e-commerce is logged as
    "revisit later," not active scope.** A placeholder shop showing two
    pillows with no way to buy anything reads as an unfinished store rather
    than as portfolio work. See the deferred item below.

### The consultation fee — internal only, do not publish

A consultation fee figure was discussed in this meeting. **It does not go on
the website.** It is for Amy's internal reference and for a future automated
confirmation email only. It must not appear in visible copy, in a meta tag,
or in a comment anywhere in this repo. If it ever turns up in the build, that
is a defect — flag it to Sam rather than shipping it. DESIGN_BRIEF §5.9
carries the same instruction and §10 now has an acceptance checkbox for it.

### Deferred — revisit later, not active scope

- **Full e-commerce.** A Shopify-style backend with stock fabric and pillow
  ordering. Real scope, real money, real ongoing operational load (stock,
  fulfilment, returns, tax). Not now. `/signature-pieces` was a placeholder
  gesturing at this and has been deleted rather than left to rot.
- **The calendar booking tool** for the discovery call. Calendly vs. Google
  Calendar is an open question with Amy (ASK-AMY.md). CTAs route to
  `/contact` until it is answered.
- **The automated confirmation email** after a discovery call is booked.
  Backend decision, pending, and coupled to the calendar choice.

---

## Step 9: Implement the 2026-07-31 review decisions

Everything in the decision log above, in code. Ordered so the destructive and
structural work lands before the copy pass, and the copy pass runs once
rather than twice over the same files.

**9a. Remove Signature Pieces.** Delete `src/pages/signature-pieces.astro`
and `src/data/signaturePieces.ts`. Remove the inbound links from
`src/pages/portfolio/index.astro` and `src/content/pages/soft-furnishings.md`.
The two pillow photographs stay in `photos.ts` and IMAGE-MANIFEST.md — they
are real, they are Amy's, and they are the only studio-lit product frames the
site has. Decision 15.

**9b. Homepage restructure.** Section order Portfolio → Services → About.
Visible headings on every section. Hero drops the location block and the
`View Portfolio` button. Client-quote heading becomes visible and reads
"What Our Clients Say About Working With Us." Home-scoped section spacing
reduced. Decisions 2, 3, 4, 5, 7, 13.

**9c. Booking funnel.** Every booking CTA becomes "Schedule your
complimentary discovery call." ContactBand's line becomes "Let's Get
Started." `/contact` describes the discovery call and the in-home
consultation as two steps. Marked TODOs where the calendar tool and the
confirmation email will attach. No fee amount. Decisions 9, 10.

**9d. Third-person copy pass.** Every visible string on the site, across the
`pages` and `journal` content collections, `services.ts`, `projects.ts`, and
the components that still hold inline copy. Testimonials excluded. Decision 1.

**9e. Service name sizing and geography.** Uniform size and weight on all
service names, indents retained. Cincinnati / Northern Kentucky named on
Services, About, and the contact form. Decisions 6, 8.

**9f. Portfolio blurbs and collage.** A `blurb` field on each project, and
detail-page galleries trimmed from a long stacked scroll to a compact
collage. Decision 11.

**9g. `/blinds` landing page, footer line, phone placeholder.** New unlinked
landing page. Footer gains the "Serving Cincinnati and Northern Kentucky
since [DATE]" line. Phone replaced with a Google Voice placeholder in
`business.ts`, and `telephone` dropped from the LocalBusiness JSON-LD until a
real number exists. Decisions 12, 7, 14.
