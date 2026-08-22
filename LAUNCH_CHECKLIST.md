# Launch Checklist — amykclarkdesign.com

Created 2026-07-26 in build step 7. `DESIGN_BRIEF.md` is the authority for
what the site must be; this file is the authority for **what has to happen
between "the build is finished" and "the site is live and correct."**

Nothing here is a design decision. Anything that turns out to be one belongs
in `BUILD-PLAN.md`'s decision log or `ASK-AMY.md`, not here.

Status key: `[ ]` not done · `[x]` done · `[Amy]` blocked on Amy ·
`[Sam]` needs Sam personally (an account, a password, a card, his own eyes).

---

## 1. Content that must not ship as-is

These are the things that are **wrong on a live site**, not merely unfinished.

- [Amy] **Testimonial permissions — FIVE quotes are live, not two.** Corrected
  2026-08-06: this entry previously said two (Diane K. and Kelly G.), which
  was accurate on 2026-07-26 but went stale the next day, when the 2026-07-27
  testimonial rotation shipped. **All five need written permission before
  launch, and all five are confirmed traceable to a real customer** (verified
  2026-08-06 against the sourcing comment beside each quote in
  `src/pages/index.astro` — none is generic or invented):
  - **Diane K.** — fixed slot. Attribution format approved by Amy; the quote
    itself is not yet cleared.
  - **Kelly G., Heather L., Jenny H., Lisa C.** — the rotating slot. All four
    are cut from real customer reviews on Amy's **public** Google Business
    profile. A public review is not permission to republish it on her own
    site, which is why all four sit in the same holding pattern as Diane K.'s.
    Lisa C.'s had a pink heart emoji removed on republish (3.2 bans emoji);
    the words are otherwise verbatim.
  **Written permission from all five before launch.** Three fallback
  candidates are on file (BUILD-PLAN decision 4) in case any do not clear.
- [Amy] **Journal posts are drafts.** All three carry a `<!-- DRAFT -->` marker
  in their `.md` files. **Updated 2026-08-18: voice is fixed** — the
  2026-08-17 rewrite (SITE-COPY-REWRITE.md) put all three in Amy's own first
  person, same as the rest of the site. What is still open is the underlying
  material, not the voice: the posts are drafted from DESIGN_BRIEF's topics
  and general trade knowledge, not from Amy's own recorded expertise. She
  should still read all three before they are public.
- [ ] **Journal `publishDate` values are placeholders** (2026-07-08 / 07-16 /
  07-24). They are the visible date on the index and on each post. **Reset to
  real dates at launch.**
- [x] ~~**Vendor naming.** Schumacher and Lafayette are cleared to name.~~
  **Reversed 2026-08-19 (post-Meeting-4 pass, Task 4): Amy confirmed she
  cannot represent herself as a dealer for any line.** This is no longer
  pending clarification — it is resolved, and resolved against naming.
  Lafayette Interior Fashions may not be named at all until she confirms
  otherwise in writing (CLAUDE.md's standing rule). Schumacher is the one
  exception, and only as a fabric *source* — "Amy works with Schumacher
  fabrics," never a dealer/stockist/representative claim — named once, in
  About's "Fabric" section. Stout and Pollack remain uncleared and unnamed;
  the vendor-naming Schumacher sentence itself is flagged for Sam's read in
  this session's report, not confidently passed.
- [Amy] **Business hours.** `src/data/business.ts` has `openingHours: null` and
  the LocalBusiness JSON-LD omits `openingHoursSpecification` entirely rather
  than guessing. Google surfaces hours to people deciding whether to call, so a
  guess is worse than nothing. Fill in and the schema picks it up.
- [Sam] **Google Voice business number — does not exist yet, and the site is
  waiting on it.** Per the 2026-07-31 review, Amy's real mobile is not
  published. `business.ts` carries a clearly-marked placeholder, the footer
  renders no dialable number, and the LocalBusiness JSON-LD omits `telephone`
  entirely rather than publishing a fake one. **Obtain the Google Voice number,
  put it in `business.ts`, and the footer and the schema both pick it up.**
  Until then the site has no phone contact route at all, which is a real gap on
  a business whose audience skews toward calling.
- [Sam] **Email addresses — `hello@` and `Amy@`.** Both need to be set up once
  domain hosting is live; neither exists today. `business.ts` has
  `hello@amykclarkdesign.com` marked as a placeholder and it is currently the
  only contact route the footer offers. **Confirm it exists and is monitored
  before launch**, and decide which of the two the site publishes (the footer
  shows one address, not both).
- [ ] **`/signature-pieces` must be gone.** Deleted in step 9a per the
  2026-07-31 review, along with `signaturePieces.ts` and its inbound links from
  `/portfolio` and `/services/soft-furnishings`. Already done — this line is
  the pre-launch confirmation, not a task. Verify with:

  ```bash
  grep -rn "signature-pieces\|signaturePieces" src/ dist/
  ```

  Photo imports in `photos.ts` legitimately still reference the
  `portfolio/signature-pieces/` **directory** on disk; that is a folder name,
  not a route, and is fine. What must not appear is a page, a link, or a
  sitemap entry.
- [ ] **The two placeholder portfolio entries must be removed.** Added
  2026-08-01 (step 10f) purely so the uniform four-card, two-row grid could be
  reviewed with only two real projects on file. They render on **both** Home's
  portfolio strip and the `/portfolio` index as tinted grey blocks captioned
  "Placeholder Project 01" and "Placeholder Project 02". They are not links,
  they have no detail pages, and they are not in the sitemap — they are not
  `Project` records, which is what keeps them out of `getStaticPaths`. **They
  are still visible to anyone who loads either page, so this is a hard
  blocker, not a tidy-up.** To remove: delete the `placeholderProjects` array
  in `src/data/projects.ts`, its two imports, the two render blocks in
  `src/components/PortfolioStrip.astro` and `src/pages/portfolio/index.astro`,
  and the `.portfolio-grid__placeholder` rule in `src/styles/global.css`.
  Verify with:

  ```bash
  grep -rn "placeholderProjects\|Placeholder Project" src/ dist/
  ```
- [ ] **Replace Amy's portrait with a new headshot when Kelsee delivers one.**
  **Not a blocker.** Home's About section and the `/about` Studio row both run
  Amy's real professional headshot
  (`src/assets/images/team/amy-clark.jpg`, 1600x1072, white-painted brick).
  It is a real photograph of the real person and the site can ship on it — it
  is simply a few years old, and a frame from the same shoot as the rest of
  the site's photography would sit better beside it.

  When a new one arrives it is a **swap in one place**: replace the file, or
  repoint the `amy-portrait` entry in `src/data/photos.ts` and regenerate its
  blur-up string. Both surfaces pick it up, since they read from that one
  entry. Nothing needs restructuring and there is no placeholder markup left
  to remove.
- [Amy] **Consultation fee.** Deliberately not stated anywhere, and the
  2026-07-31 review hardened this: the amount is for Amy's internal reference
  and a future automated confirmation email **only**, and does not go on the
  site at all. `/contact` says the in-home visit is paid and what it buys, and
  never that the fee credits toward the project (it does not). Publishing the
  amount would now be a new decision *against* a standing one — DESIGN_BRIEF
  §5.9 and §10 both encode it. Confirmation from Amy is tracked in ASK-AMY.md.
  **Restated more directly 2026-08-19 (post-Meeting-4 pass, Task 7):** a
  second, closer statement of the same fact — "The initial in-home
  consultation is a paid appointment. Amy will confirm the details and
  scheduling after reviewing your inquiry." — now sits as helper text
  directly above the form, in addition to the existing lead-paragraph
  mention. Still no amount anywhere. Only the fact's prominence changed.
- [x] ~~**The footer's "since" year is a placeholder / needs confirming.**~~
  **Resolved 2026-08-19: 2020, Amy confirmed directly** (post-Meeting-4 pass,
  Task 3), superseding the 2026-08-01 figure of 2021 (Sam's guess, never
  confirmed in Amy's own words, reopened as a question 2026-08-18).
  `business.ts`'s `servingSince` carries the real year, the footer reads
  "Serving Cincinnati and Northern Kentucky since 2020," and the same value
  now also feeds `foundingDate` in `JsonLd.astro`'s LocalBusiness node. No
  bracket placeholder and no stale year remain in source or in the build.
  Confirm with:

  ```bash
  grep -rn "ask Amy\|since 2021" src/ dist/
  ```
- [Amy][Sam] **Ivory House photography permissions — two separate people,
  both required.** The whole-house shoot added 2026-07-28 (drapery, blinds,
  reupholstered dining chair, cushions and pillows — see IMAGE-MANIFEST.md)
  is wired into the four ServiceList hover stages, `/blinds`, the Cincinnati
  and Northern Kentucky location pages, and all three Journal post heroes.
  **Corrected 2026-08-19: not the Home hero** — that photograph is from the
  separate Collected Living Room / Stardust Lane shoot below, not Ivory
  House. Also not currently the Portfolio (flag-disabled, Task 2), though the
  images remain wired for the moment it re-enables. **Neither the
  photographer's copyright permission nor the homeowner's permission to
  publish photos of their house has been obtained.** Same holding pattern as
  the testimonials: visible now for review, not cleared to publish. Get both
  permissions before the real domain goes live, not after.
- [Amy][Sam] **Collected Living Room / Stardust Lane homeowner permission —
  separate from Ivory House, added 2026-08-19 (post-Meeting-4 pass, Task
  14).** This is the earlier, visibly phone-camera shoot (a different house
  from Ivory House) that supplies the Home hero — **the single most-seen
  photograph on the entire site** — plus About's lead image. See
  `docs/handoff/PHOTO-EDIT-REQUESTS.md` Group B for the frame-by-frame
  detail; the original files are named `stardust_ln_rough_edit-NN.jpg`,
  which is where the address comes from — **internal tracking only, never
  publish this address anywhere on the site** (DESIGN_BRIEF's no-addresses
  rule). Homeowner's permission to publish photos of their house has not
  been obtained. Not yet confirmed whether this is the same photographer as
  Ivory House or a different one — resolve that before assuming Kelsee's
  permission (below) covers it too.
- [Amy][Sam] **Kelsee's photography, permission broadly — added 2026-08-19
  (post-Meeting-4 pass, Task 14), separate from the two house-specific items
  above.** Covers her copyright permission for whatever of her work appears
  on the site now or later, plus the standing note from this session's photo
  audit (`docs/handoff/PHOTO-EDIT-REQUESTS.md`): **her existing Instagram
  photography is approved for site use**, but whatever gets pulled in from
  it needs a consistency pass against the Ivory House shoot so the full set
  reads as one photographic treatment rather than several different hands.

## 2. The temporary thing

- [ ] **`src/styles/sam-preview-theme.css`** — the cream-and-green palette
  preview. **It is LIVE right now**, imported by one clearly-marked line in
  `Base.astro`, at Sam's instruction. It was switched off only long enough to
  run the acceptance pass and switched straight back on, so the site is as he
  left it and every measurement in §6 describes the **real** 3.3 palette.
  **Before launch: delete the file and that import line.** DESIGN_BRIEF 3.2
  names this exact look as the number-one failure mode for this brief, and §10
  requires "no cream, no terracotta" — this is the one acceptance criterion
  currently failing, and it fails by choice, not by oversight.
- [x] **`src/pages/dev-service-list-variants.astro`** and its temporary sitemap
  filter — both deleted 2026-07-26 when variant B was adopted into
  `ServiceList.astro`.

Verify before every deploy:

```bash
grep -rn "TEMPORARY" src/ astro.config.mjs
```

## 3. Repo and deploy

- [Sam] **Git repo does not exist yet.** `git init`, first commit, push to
  GitHub. `.gitignore` is already correct (`node_modules/`, `dist/`, `.astro/`,
  `.DS_Store`).
- [Sam] Connect the GitHub repo to Netlify, deploy from `main`.
- [x] `netlify.toml` in place: build `npm run build`, publish `dist`, Node
  pinned to 24.18.0 (matches this machine and Netlify's build-image default).
- [ ] Confirm the first Netlify build succeeds and the deploy preview renders.
- [ ] **Netlify Forms:** confirm the consultation form actually registers.
  Netlify detects forms by parsing the *deployed* HTML, so this cannot be
  tested locally. After the first deploy, submit a real test entry and confirm
  it appears in the Netlify dashboard.
  - `data-astro-reload` on the form is load-bearing — Astro's ClientRouter
    would otherwise replay the POST through its own fetch and Netlify's form
    handler would never see it. **Do not remove that attribute.**
  - The hidden `<input name="form-name" value="consultation">` is equally
    load-bearing and was missing until 2026-08-05. **Do not remove it.**

### 3a. The form backend — three hard blockers, all in the Netlify UI

Added 2026-08-05. The code side of the form was audited and is correct; every
item below is a dashboard setting **only Sam can do**, and the form silently
drops submissions until all three are done. Nothing in the repo can prove any
of them.

- [Sam] **1. Form detection must be enabled.**
  **Netlify → Site configuration → Forms → Form detection → Enable.**
  Off by default on newer Netlify sites. With it off, the deploy succeeds, the
  form renders perfectly, the visitor reaches the thank-you page, and the
  submission goes nowhere. Confirm the form appears by name (`consultation`)
  under **Forms** after the first deploy that follows enabling it — detection
  happens at deploy time, so **enabling it does not retroactively register the
  form; you must redeploy afterwards.**

- [Sam] **2. A notification email address must be configured.**
  **Netlify → Site configuration → Forms → Form notifications → Add
  notification → Email notification.** Without this, submissions are stored but
  nobody is told. Point it at the mailbox Amy actually reads.
  This is separate from, and a deliberate backstop for, the richer notification
  the function sends — if Resend ever fails, Netlify's own email still arrives.

- [Sam] **3. A real end-to-end test submission must be received.**
  Submit the live form with a real address, then confirm **all three** landed:
  the entry under **Netlify → Forms → consultation**; Netlify's own
  notification email; and both function emails (the client confirmation and
  Amy's one-click reply). Then open Amy's mailto link and check it opens a
  populated draft. **Nothing is proven until this is done on the real domain.**

- [Sam] **4. `RESEND_API_KEY` must be set, or no function email sends at all.**
  **Netlify → Site configuration → Environment variables → Add a variable →
  Key `RESEND_API_KEY`.** Get it from resend.com. The sending domain must be
  verified inside Resend or Resend rejects the send.
  The function logs `RESEND_API_KEY is not set` and returns success when it is
  missing, so **a missing key looks like silence, not like an error**. Check
  **Netlify → Logs → Functions → submission-created** if emails stop.
  - Optional overrides, both with working defaults in the function:
    `RESEND_FROM_EMAIL` and `AMY_NOTIFICATION_EMAIL`.
  - **The key pasted into chat on 2026-08-05 should be rotated in Resend
    before launch** — a chat transcript is not a secret store. It was never
    written to this repo.
- [ ] Confirm the file-upload field works on the deployed form (it needs
  `enctype="multipart/form-data"`, which is set).
### 3b. Booking — stage two, and deliberately not on the website

Added 2026-08-05. The public CTA leads to the qualification form, never to a
calendar (Meeting 3 §12.1): Amy needs leads filtered before they can take a
slot. Booking happens **after** she has read a submission and decided she wants
to see that person, via the link merged into her one-click reply.

- [Sam][Amy] **Create a Google Calendar appointment schedule under Amy's own
  Google account**, then paste the URL into `bookingUrl` in
  `src/data/business.ts`. Until it is set, the booking line is omitted from her
  reply draft entirely and nothing looks broken.

  Google was chosen over Calendly and the rest for one reason: **Amy already
  uses Google every day.** It writes to her real calendar, and she can change
  her own availability in an interface she already knows, without touching code
  and without another login. That matters more than any feature comparison,
  because this has to keep working after Sam leaves for college.

  - ⚠️ **Confirm which Google account first.** Appointment scheduling differs
    between free personal Google accounts and Workspace accounts — the feature
    set, and historically whether it exists at all, are not the same. **Verify
    on Amy's actual account before relying on it**, not on a description of it.
  - **Her stated windows are Thursday, Friday, Saturday 2-6pm — pending her
    confirmation.** Do not build anything that assumes these until she confirms.
  - Once live, this is the only place availability lives. That is the point:
    it removes stale availability from every message and every page.

- [ ] **`bookingUrl` must stay off the public site.** It is not imported by any
  page. Verify with:

  ```bash
  npm run build && grep -rn "calendar.app.google\|bookingUrl" dist/
  ```

  Confirmed zero occurrences in `dist/` on 2026-08-05.

- [ ] **Server-side validation does not exist** (BUILD-PLAN decision 14).
  DESIGN_BRIEF §7 asks for it; Netlify Forms accepts whatever is POSTed. The
  honeypot is in place. Closing this properly means a Netlify Function —
  decide before or shortly after launch, and record which.

## 4. DNS and domain

- [Sam] Domain stays at **GoDaddy**; DNS points at Netlify. **Not GoDaddy
  hosting** (DESIGN_BRIEF §7).
- [ ] Decide apex vs `www` as the canonical host, then make it match
  `astro.config.mjs`'s `site` value (`https://amykclarkdesign.com`, i.e. apex).
  Redirect the other to it.
- [ ] HTTPS certificate provisioned and forced.
- [ ] Confirm the live canonical tags, `sitemap-index.xml`, and `robots.txt`
  all resolve on the real domain.

## 5. Search setup (after DNS resolves)

- [ ] Google Search Console: verify the property, submit
  `https://amykclarkdesign.com/sitemap-index.xml`.
- [ ] Run the two location pages and Home through Google's **Rich Results
  Test** on the live URLs. The JSON-LD validates structurally in the build
  (see below), but only Google's own tool confirms eligibility.
- [ ] Bing Webmaster Tools (optional, cheap).
- [Amy] **Google Business Profile:** confirm the listing's name, category,
  service area, phone, and hours match the site exactly. The profile URL is
  already in `business.ts` and in the LocalBusiness `sameAs`.
- [ ] Confirm Instagram and Facebook links resolve to the right accounts.

## 6. Verified in the build (re-run if anything changes)

These were checked against the compiled `dist/` output on 2026-07-26 and are
scripted enough to repeat.

**Current live route count, 2026-08-19 (post-Meeting-4 pass, Tasks 1 and 2):
16 pages build, 12 in the sitemap.** Every page-count figure below and
throughout this file (18, 20, 21, 23 — including in section 9's checks and
BUILD-PLAN.md's own history) describes the site's structure at whatever
stage of the build it was written, not a running total — none of those
numbers are wrong for when they were recorded, and none are edited here.
This note is the one place to look for the number that is true *today*: down
from 23 pages / 19 sitemap URLs (the count immediately before this session)
because the four service sub-pages (Task 1) and the three Portfolio routes
(Task 2, flag-disabled) no longer build at all. Confirm with:

```bash
npm run build && find dist -name "index.html" -o -name "404.html" | wc -l
grep -o "<loc>" dist/sitemap-0.xml | wc -l
```

- [x] 20 pages build clean, no warnings.
- [x] One `<h1>` per page, no heading-level skips, on all 20.
- [x] Every `<title>` under 60 chars, every description under 155, **no
  duplicates of either across the site**.
- [x] Canonical, `og:image` (absolute), `og:type`, and `twitter:card` on every
  page.
- [x] Every `<img>` has alt text (none empty) and explicit `width` + `height`.
- [x] JSON-LD parses and is structurally complete on every page:
  `HomeAndConstructionBusiness` on Home (with `@id`, address, `areaServed`,
  `sameAs`, and a 4-item `hasOfferCatalog`; `priceRange` correctly omitted),
  `BreadcrumbList` on all 18 non-home indexable pages with sequential
  positions and absolute URLs, `Article` on all three journal posts,
  `FAQPage` on `/contact`.
- [x] `sitemap-index.xml` → `sitemap-0.xml` with **18 URLs**. `/404` and
  `/contact/thank-you` correctly excluded (both carry `noindex`).
- [x] `robots.txt` exists and references the sitemap by absolute URL.
- [x] Zero banned words (rule 5) and zero emoji anywhere in rendered copy.
- [x] No vendor name outside its cleared page: Lafayette on
  `/services/blinds-shades` only, Schumacher on `/services/drapery` only,
  **zero** occurrences of Stout, Pollack, or William Morris.
- [x] Amy is never called an interior designer.
- [x] The only dollar figures on the site are `/contact`'s required budget
  ranges (5.7 and BUILD-PLAN decision 2). `/signature-pieces` carries no price
  and no e-commerce language of any kind — swept site-wide for cart / buy /
  shop / stock / checkout / purchase, zero matches.
- [x] **Reduced motion genuinely toggled** (Chrome `--force-prefers-reduced-motion`),
  all 20 pages, both modes: longest surviving transition or animation under
  reduce is 0ms, every shade reveal renders fully visible on load, the hero
  opening line is removed, and ServiceList's hover stage holds its static
  default photo.
- [x] **72 page/width render checks** (18 pages x 375/768/1440/2560): zero
  horizontal overflow, zero off-canvas elements, zero sub-10px text.
- [x] **Console clean across a 12-hop real-navigation walk**, every request 200
  or 304, zero broken images.
- [x] Full keyboard tab walk of Home: 30 stops in logical order, every one with
  a visible focus ring.

## 7. Needs a human, cannot be scripted

- [Sam] **Lighthouse mobile, real scored run** on the deployed URL. Targets
  (8.1): Performance 95+, Accessibility 100, Best Practices 100, SEO 100.
  Nothing in this repo has produced a real Lighthouse score.
- [Sam] **LCP under 1.8s on 4G.** The hero image is the LCP element. Measure on
  the live site, throttled.
- [Sam] **Real device testing.** At minimum one iPhone and one Android, in
  Safari and Chrome. The 375px render target is checked in an emulator, which
  is not the same thing.
- [Sam] **`prefers-reduced-motion` at the OS level** — now a belt-and-braces
  check rather than the only evidence. It **was** genuinely toggled during the
  acceptance pass using Chrome's `--force-prefers-reduced-motion` flag, across
  all 20 pages in both modes (see BUILD-PLAN step 8). A macOS System Settings →
  Accessibility → Display → Reduce motion pass would confirm it end to end on
  real hardware.
- [Sam] **Keyboard *activation* of the mobile nav toggle and the accordion
  triggers.** Tab order, focus rings, and Escape-to-close were all verified with
  real key presses; Enter/Space activation could not be, because injected key
  events do not trigger a native button's default activation in the test
  environment. Both are real `<button>` elements with accessible names, so this
  is browser behaviour rather than site code — but it is inference, not
  measurement. Ten seconds each to confirm by hand.
- [Sam] **Screen reader spot-check.** VoiceOver on the contact form and the
  blinds accordion, which are the two most interactive things on the site.
- [Sam] **Print/read the whole site once on a phone**, as Amy's actual audience
  would.
- [Amy] **Final copy review, sitewide — added 2026-08-19 (post-Meeting-4
  pass, Task 14).** Every page has been through multiple voice and content
  passes by Claude Code, but none of it is Amy's own words end to end — see
  `docs/handoff/CURRENT-SITE-COPY.md` for the complete extracted text of
  every page in one document, meant to be read without needing repo access.
  This is the one remaining full read-through before launch.
- [Amy] **Display font selection — added 2026-08-19 (post-Meeting-4 pass,
  Task 11).** Amy cannot comfortably read the current thin Bodoni Moda
  display strokes. Three self-hosted alternatives (Fraunces, Newsreader,
  Libre Caslon Display) are mocked up as screenshots in
  `docs/font-options/`, six images (three fonts x 1440px/390px), against the
  Services page with body text held constant at Archivo. **The live font has
  not changed** — this is Amy's pick to make, then a one-line swap of
  `--font-display` in `src/styles/tokens.css` once she has.

## 9. 2026-08-06 quality pass — copy extraction, AI-tell audit, legal pages

Session goal: "would a stranger mistake this for expensive, hand-crafted
work." Full report in that session's summary; the actionable items are here.

### Fixed

- [x] **Real bug, found and fixed: a leaked code comment was rendering as
  visible text on the live Contact page.** `ConsultationForm.astro`'s own
  explanatory comment (added 2026-08-05, documenting the `form-name` hidden
  input) contained the literal string `{/* */}` as example text inside itself.
  That string is *also* how a JSX comment ends, so the parser closed the
  comment early at the embedded copy and rendered the rest of the sentence as
  a visible text node, sitting in the middle of the form. Confirmed present in
  the built HTML, confirmed fixed, and confirmed no second instance exists
  anywhere in `src/` (searched for the exact pattern site-wide). Worth
  remembering: never write literal comment-delimiter syntax as prose inside a
  comment meant to explain that same syntax.
- [x] **Two real em dashes shipped in the new Privacy/Terms copy** (this
  session's own draft, task 3 below) and were caught by the same sweep that
  audited the rest of the site. Fixed before commit; the standing no-em-dash
  rule now holds across all 23 pages, verified against the compiled `dist/`
  output.

### Flagged for Sam's judgment — not fixed, code inspected and reported only

- [ ] **`/blinds`'s "Why it lands right" section is three equal-width text
  columns (H3 + one sentence each).** No icons, no cards, no border, no
  shadow, no radius, no colored accent — none of the generic-SaaS visual
  tells are present, and the button/hover treatment elsewhere on the site is
  equally restrained (verified: zero `box-shadow` anywhere in the codebase).
  But structurally it is still three equal items in a row, which is the
  pattern DESIGN_BRIEF's asymmetry preference warns against. Sam's call
  whether the restrained execution is enough or whether it should become two
  items, or an asymmetric layout instead.
- [ ] **Dead CSS, not a visual defect:** `SiteNav.astro`'s solid nav state
  (`background: var(--paper)`, fully opaque) also carries
  `backdrop-filter: blur(12px)`, which has no visible effect on a background
  with zero transparency. Not glassmorphism (no translucency exists), just an
  inert rule. Low priority; mention if a CSS cleanup pass ever touches
  `SiteNav.astro`.

### Confirmed clean, no action needed

- [x] Zero em dashes site-wide (23 pages).
- [x] Zero fallback fonts leaking — `document.fonts` reports exactly Archivo
  and Bodoni Moda everywhere.
- [x] Zero dollar amounts outside `/contact`'s budget `<option>` values.
- [x] Zero gradients except the one documented hero scrim; zero box-shadow
  anywhere; exactly one border-radius token (`--radius: 2px`) used in exactly
  two places; zero bento-grid patterns (portfolio is a uniform 2-column grid);
  zero dot-grid backgrounds; zero glassmorphism; zero pastel palette (real
  hex values: `#F1F1EF` / `#191917` / `#6E6E68` / `#D6D6D1` / `#181816`, plus
  `#22303F` restricted to focus rings and hover underlines).
- [x] Real project photography confirmed on Portfolio and hero (not
  stock/placeholder) — the two placeholder cards render an explicit
  "Placeholder. No image." label and are the pre-launch blocker already
  tracked in section 1, not a defect newly found here.

### Added — two new pages, both need a human legal read before launch

- [Sam][Amy] **`/privacy` and `/terms` did not exist and now do.** Drafted as
  a lightweight starting template for a small local service business
  collecting name, email, and photos through a contact form, using Netlify
  Forms and Resend as processors. Every fact in both pages traces to
  `business.ts` or to what the codebase actually does; nothing is invented.
  **Both are marked `DRAFT COPY - NEEDS REWRITE AND NEEDS REVIEW` in the
  source and explicitly say, in that same comment, that this is a starting
  template, not legal advice, and needs a human read before launch.**
  - Both carry `noindex` and are excluded from the sitemap (still fully real,
    fully reachable pages — just not indexed; boilerplate legal pages add
    nothing to search relevance).
  - Linked from the footer bottom bar, next to the copyright line. Not in the
    main nav.
  - **Two things inside them are explicitly flagged and unresolved:** the
    `[DATE, set at launch]` placeholder in both, and the governing-law
    section in both, which deliberately does not name a state (none is
    established anywhere in this repo) and needs Amy's input or an
    attorney's judgment.

### Reference

- [x] **`docs/handoff/CURRENT-SITE-COPY.md`** — every word of visible copy,
  extracted verbatim from the compiled build, organized by page. Regenerated
  three times since this line was first written (8,382 words / 21 pages
  originally) — see sections 10, 11, and the page-count note in section 6
  below for each pass. **Current: 6,103 words across 14 pages** (down from
  8,524 / 21 — the four service sub-pages and the three Portfolio routes no
  longer build; not a copy trim, a page-count drop). The generating script,
  `scripts/extract-copy.mjs`, is committed to the repo (`npm run
  extract-copy`, after a build) and was itself updated 2026-08-19 to stop
  listing the seven now-dead routes.

## 10. 2026-08-18 first-person voice rewrite — SITE-COPY-REWRITE.md implemented

Session goal: implement SITE-COPY-REWRITE.md's 2026-08-17 voice rewrite
(third person → Amy's first person) as a straight content swap, sitewide.
Copy voice itself was explicitly out of scope to edit further — this session
inserted what that document specified, not a fresh copy pass. Full report in
that session's summary; the actionable items are here.

- [x] **New copy is live sitewide.** Every page SITE-COPY-REWRITE.md covers —
  Home, About, Process, Services overview, all four service child pages, the
  Blinds landing page, both portfolio projects, both location pages, all
  three Journal posts, Contact (including every form field label, helper
  text, and the FAQ), Thank You, and 404 — now reads in Amy's first person.
  Verified against the compiled `dist/` output, not just source.
- [x] **`docs/handoff/CURRENT-SITE-COPY.md` refreshed.** Re-extracted from the
  post-rewrite build with the same script and format as the 2026-08-06
  version. 8,535 words across the same 21 pages (up from 8,382 — first-person
  phrasing runs slightly longer in places, e.g. "I choose the fabric with
  you, sew the panels, and hang them" vs. the old "designed around your room
  and your light"). Zero `[AI-TELL]` flags, same as before the rewrite.
  **Note:** the extraction script (`extract-copy.mjs`) that produces this
  file lives only in a Claude Code session's scratchpad, not in this repo —
  it was never committed. Ask if you want it committed so it can be re-run
  without Claude Code re-writing it from scratch each time.
- [x] **Zero occurrences of "Lafayette" anywhere in `dist/`.** Verified by
  sweeping the compiled build. Every place the live site named it — the
  `/services/blinds-shades` meta title, meta description, and body, plus the
  `/blinds` landing page — now reads "the one line I represent" instead,
  per SITE-COPY-REWRITE.md pending Amy's rep call.
- [x] **Zero em dashes anywhere in rendered `dist/` output**, including every
  Contact form field. The rewrite document uses a dash as its own shorthand
  for "label — helper text" (e.g. "Location — Your city or neighborhood...");
  implemented as separate label and hint elements with no literal dash
  character, which is how the form was already structured before this
  session (a `<label>` plus a separately styled `<span class="field__hint">`)
  — no new mechanism needed, only new text in the existing one.
- [x] **Full brand-rule sweep re-run against the new copy**, since none of it
  had been checked before this session. Zero banned words, zero ampersands,
  zero star ratings/badges, zero "Fort Loramie," zero "Fort Wright" outside
  `business.ts`/JSON-LD, zero William Morris, zero emoji. The only "interior
  design" hits are the site's own disclaimers ("I am not a full-service
  interior design firm," plus the new Terms of Use page's identical
  disclaimer) — correctly denying the claim, not making it. The only `$`
  hits are `/contact`'s budget dropdown, exactly as before.
- [ ] **One explicit cut made:** Collected Living Room's portfolio detail
  page no longer has a second paragraph — it repeated the blurb's own last
  sentence. Required making the `scope` field genuinely optional
  (`src/data/projects.ts`, `src/pages/portfolio/[slug].astro`) rather than
  always-rendered, the same "don't render what isn't there" pattern
  `SpecBlock.astro` already uses. Ivory House keeps both paragraphs — its
  second one does real scope-of-work disclosure, not repetition.
- [x] ~~**Lafayette naming** — open, pending Amy's rep call.~~ **Resolved
  2026-08-19, and resolved "no," not "yes" (post-Meeting-4 pass, Task 4):**
  Amy confirmed she cannot represent herself as a dealer for any line at
  all — not just Lafayette, not just pending a call. This is now a standing
  rule (CLAUDE.md) rather than an open question: Lafayette Interior Fashions
  may not be named on the public site at all until she confirms otherwise in
  writing, and no other vendor may be described as a line the studio
  carries, represents, or deals either. `/services/blinds-shades` (the page
  the old "restore the meta title first" note pointed at) was itself removed
  the same day (Task 1), folded into the Services overview.
- [x] ~~**The footer's founding year ("since 2021")** — needs Amy's answer.~~
  **Resolved 2026-08-19: 2020, confirmed directly** — see section 1 above.
- [x] ~~**The Studio section's personal line** — needs Amy's yes/no on
  "Amy taught Sam to sew."~~ **Resolved 2026-08-19 (post-Meeting-4 pass,
  Task 14): cut, not added.** Sam's direct instruction closes this rather
  than waiting on Amy's separate confirmation — the credits-not-staff,
  name-and-role-only shape of the Studio row stands as originally built,
  with no personal line under it.
- [ ] **One thing SITE-COPY-REWRITE.md left as an open judgment call, still
  unresolved:** the service-card grid order on Home and `/services` stays
  Drapery / Blinds and Shades / Upholstery / Soft Furnishings. Whether the
  Upholstery / Drapery / Shades ordering rule from the hero should also
  govern this grid is Sam's call, unrelated to voice and untouched by
  section 11's reversion.
- [x] ~~"I'd like Amy's guidance on this" (the last budget option) and "Saw
  her work in a home" (a referral option) both still read third-person-ish
  against the rest of the first-person form.~~ **Resolved by the section 11
  reversion, not edited to fix it.** Both phrases were always third person;
  it was the surrounding first-person form that made them read oddly. Now
  that the form is third person again, both read naturally — confirmed in
  SITE-COPY-THIRD-PERSON.md's own note and in the compiled build.
- [ ] **One inconsistency in the source document itself, flagged rather than
  silently resolved — carried forward from SITE-COPY-REWRITE.md, still true
  of SITE-COPY-THIRD-PERSON.md:** the "Drapery, Shades, or Blinds" Journal
  post gives two different sentences for the same idea — the labeled "Meta
  description" keeps "between drapery, shades, and blinds," but the
  document's own on-page standfirst paragraph drops that phrase. Every other
  page in the document keeps these two identical. Implemented at the longer,
  explicitly-labeled meta text for both uses (matching the current
  one-field-serves-both-purposes template and every other page's pattern)
  rather than adding a new field to split them. Documented in the post's own
  `.md` file too.
- [x] ~~Spec block vendor field left third person, not covered by the
  rewrite.~~ **Resolved by the section 11 reversion, not edited to fix it.**
  `fabricHouse: 'the lines she represents'` in `src/data/projects.ts` (both
  projects) was flagged 2026-08-18 as reading oddly against first-person
  prose. The prose is third person again now, so the field reads correctly
  with zero changes — confirmed against the compiled build, not just source.

## 11. 2026-08-19 third-person voice reversion — SITE-COPY-THIRD-PERSON.md implemented

Session goal: implement SITE-COPY-THIRD-PERSON.md's 2026-08-18 voice pass
(Amy's first person → third person, "Amy"/"she") as a straight content swap,
sitewide — the mirror image of section 10's session, one day later. Amy
reversed her own earlier decision; copy voice itself was again out of scope
to edit further beyond what the source document specified. Full report in
that session's summary; the actionable items are here.

- [x] **New copy is live sitewide.** Every page SITE-COPY-THIRD-PERSON.md
  covers — Home, About, Process, Services overview, all four service child
  pages, the Blinds landing page, both portfolio projects, both location
  pages, all three Journal posts, Contact (including every form field label,
  helper text, and the FAQ), Thank You, and 404 — reads in third person
  again. Verified against the compiled `dist/` output, not just source. The
  "In Their Words" heading and the testimonial quotes were never part of
  either conversion and are untouched.
- [x] **One deviation from verbatim source, flagged rather than silent:**
  About's meta description as written in SITE-COPY-THIRD-PERSON.md ("Amy
  Clark designs...") is 159 characters, over 8.1's 155-char cap and the
  `pages` content schema's own limit — the build fails on it as written.
  Trimmed to "Amy designs..." (153 characters), the smallest possible
  change (one name shortened to first-name-only) rather than cutting a
  clause. Documented in `src/content/pages/about.md`'s own frontmatter
  comment. Nothing else in the source document needed a deviation.
- [x] **`docs/handoff/CURRENT-SITE-COPY.md` refreshed.** Re-extracted from
  the post-reversion build. 8,524 words across the same 21 pages (down from
  8,535 in the first-person version, up from the original 8,382 — third
  person runs slightly shorter than first person but not identical to the
  pre-rewrite baseline, since the 2026-08-18 tone pass also tightened some
  phrasing along the way). Zero `[AI-TELL]` flags, consistent with both
  prior extractions.
- [x] **`scripts/extract-copy.mjs` committed to the repo**, in `scripts/`
  alongside the older `export-site-copy.mjs`, and wired to `npm run
  extract-copy`. It had been used twice (2026-08-18 and 2026-08-19) from a
  session scratchpad each time and never committed before now. **Flagged,
  not resolved:** this makes two separate, uncoordinated extraction scripts
  in the repo — `export-site-copy.mjs` → `SITE-COPY-EXPORT.md` (last run
  2026-07-28, still lists the deleted `/signature-pieces` page, now stale)
  and `extract-copy.mjs` → `CURRENT-SITE-COPY.md` (the one actually kept
  current). Deciding which is canonical, or merging them, is Sam's call.
- [x] **Confirmed unedited: the portfolio spec block's `fabricHouse` field
  reads correctly with zero changes.** `'the lines she represents'` in
  `src/data/projects.ts` was flagged 2026-08-18 as reading oddly next to
  first-person prose. The page around it is third person again now, so the
  field agrees with it automatically — checked against the compiled build,
  not just source.
- [x] **Figcaption comma checked against production, not the source
  document.** SITE-COPY-THIRD-PERSON.md writes figcaptions as "Amy Clark,
  Founder" with a comma; production has never used a literal comma —
  `index.astro` and `about.astro` both render name and role as two separate
  `<p>` elements inside the `<figcaption>`. Matched what the site actually
  does; no comma introduced anywhere.
- [x] **Zero occurrences of "Lafayette" anywhere in `dist/`.** Unchanged
  holding pattern — still pending Amy's rep call, unrelated to voice.
- [x] **Full brand-rule sweep re-run against the new copy.** Zero banned
  words, zero ampersands (outside `&copy;`), zero star ratings/badges, zero
  "Fort Loramie," zero emoji, zero em dashes in rendered text (24 files have
  em dashes in **HTML comments** — dev notes, never rendered to a visitor,
  confirmed by stripping comments before checking). The only "interior
  design" hits are the site's own disclaimers, correctly denying the claim.
  The only `$` hits are `/contact`'s budget dropdown.
- [x] **`SITE-COPY-REWRITE.md` archived to
  `docs/archive/2026-08-19-SITE-COPY-REWRITE.md`**, alongside the earlier
  `docs/archive/2026-07-28-SITE-COPY-REWRITE.md` — two first-person passes
  and two reversions now, and both source documents are findable rather than
  something to reconstruct later. `SITE-COPY-THIRD-PERSON.md` is archived
  the same way, dated the same day, once this session's own copy has been
  verified live (CLAUDE.md's "no loose markdown at the repo root" rule).
- [Amy] **Lafayette naming, the footer's founding year ("since 2021"), and
  the Studio section's personal line** — all three carried forward
  unchanged from section 10, none touched by this session. See section 1
  above for the founding-year and Studio items.
- [Amy] **"A paid visit" on Contact — two softer alternatives are on file if
  Amy wants it gentler, added here 2026-08-19 so the option isn't lost.**
  The phrase appears twice on `/contact` (the intro and the FAQ). It is
  honest and it filters, but SITE-COPY-THIRD-PERSON.md's own open-questions
  list flags it as the bluntest line on the page and offers two
  alternatives, neither implemented: "a working visit, billed as design
  time," or leading with what the visit delivers and stating the fee status
  second. Kept as-is pending Amy's call, same holding pattern as before.
- [ ] **The service-card grid order judgment call carries forward unchanged**
  — see the entry under section 10 above. Untouched by this session, since
  it is a layout question, not a voice one.
- [ ] **The Journal-post meta/standfirst inconsistency carries forward
  unchanged** — see the entry under section 10 above, now updated to
  reference SITE-COPY-THIRD-PERSON.md, since it is still true of the new
  source document.

## 8. Post-launch, first week

- [ ] Watch Search Console for coverage errors and for the "Submitted URL
  marked noindex" class of problem.
- [ ] Confirm at least one real form submission arrives end to end.
- [ ] Set journal dates forward as new posts land; the three launch posts are
  the floor, not the ceiling (5.6).
- [ ] Swap placeholder photography as Kelsee's shoot lands. Every stand-in is
  tracked in `IMAGE-MANIFEST.md` — three photographs are currently doing
  roughly twenty jobs, and that is the single most visible thing about the
  site.
