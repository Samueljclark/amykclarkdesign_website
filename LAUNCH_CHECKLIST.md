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

- [Amy] **Testimonial permissions.** Two quotes are live on Home: Diane K. and
  Kelly G. Kelly G.'s came off Amy's public Google Business profile, and a
  public review is not permission to feature it on her own site. Diane K.'s
  attribution is approved; permission to publish the quote itself is not.
  **Written permission from both before launch.** Three fallback candidates are
  on file (BUILD-PLAN decision 4). Marked in HTML comments beside each quote in
  `src/pages/index.astro`.
- [Amy] **Journal posts are drafts.** All three carry a `<!-- DRAFT -->` marker
  in their `.md` files. They are good and they are not in Amy's voice. She
  should read all three before they are public.
- [ ] **Journal `publishDate` values are placeholders** (2026-07-08 / 07-16 /
  07-24). They are the visible date on the index and on each post. **Reset to
  real dates at launch.**
- [Amy] **Vendor naming.** Schumacher and Lafayette are cleared to name. Stout
  and Pollack are not, and appear nowhere in public copy. The Lafayette
  *dealer* claim is also not confirmed and has been softened to "the one line I
  represent in this category." If Amy's rep calls clear any of these, the copy
  can be strengthened — see BUILD-PLAN decisions 11 and 12.
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
- [x] ~~**The footer's "since" year is a placeholder.**~~ **Resolved
  2026-08-01: 2021**, supplied by Sam. `business.ts`'s `servingSince` carries
  the real year and the footer reads `Serving Cincinnati and Northern Kentucky
  since 2021`. No bracket placeholder remains in source or in the build.
  Confirm with:

  ```bash
  grep -rn "ask Amy" src/ dist/
  ```
- [Amy][Sam] **Ivory House photography permissions — two separate people,
  both required.** The whole-house shoot added 2026-07-28 (drapery, blinds,
  reupholstered dining chair, cushions and pillows — see IMAGE-MANIFEST.md)
  is wired into the Home hero, the Portfolio, and all four ServiceList hover
  stages. **Neither the photographer's copyright permission nor the
  homeowner's permission to publish photos of their house has been
  obtained.** Same holding pattern as the testimonials: visible now for
  review, not cleared to publish. This is the single biggest visual
  commitment the site currently makes to real photography — get both
  permissions before the real domain goes live, not after.

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
  - Set up a notification email for new submissions.
- [ ] Confirm the file-upload field works on the deployed form (it needs
  `enctype="multipart/form-data"`, which is set).
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
