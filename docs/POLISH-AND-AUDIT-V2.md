# POLISH-AND-AUDIT-V2: service underline and fade, copy fixes, mission and Studio, new heading font, full site audit, ship

Instructions for Claude Code. This file is self-contained and lives at `docs/POLISH-AND-AUDIT-V2.md`. Work through the tasks in order. Each task has a verify block; do not commit a task until its verify block passes.

Task 6 ends with a hard STOP. Do not merge, deploy, or submit anything on the live site until Sam answers.

---

## Ground rules (binding for this session; they override CLAUDE.md where they conflict)

1. **Model.** Sam launched this session on Opus with ultracode on purpose, for this session only. Do not switch models and do not edit `.claude/settings.json` (it stays pinned to Sonnet for future sessions). This overrides CLAUDE.md's Sonnet rule for this session only.
2. **Browser testing is required.** This session is the acceptance pass that CLAUDE.md reserves browser testing for. Use Playwright in Chromium and WebKit (WebKit stands in for Safari). Code reasoning alone is not verification on this project.
3. **Branch.** Keep working on `copy-pass-v1` (pushed, not merged). Production is still on `89d4762`, and pushes to `main` now deploy production automatically. Do not touch `main` until Task 7, and only after Sam says yes. This overrides CLAUDE.md's commit-to-main rule until then.
4. **Commits.** Commit after each task with the message given, only on a clean `npm run build`. Push the branch after each commit.
5. **Off limits** unless a task below says otherwise: scroll behavior (the hero auto-advance stays exactly as it is), typefaces, palette, page structure, and any copy other than Task 2's and Task 3's listed changes. Task 4 replaces the display typeface on Amy's direct instruction, which outranks CLAUDE.md's settled typography note; follow Task 4 exactly and change nothing else about type. If something in these areas looks wrong, report it under "Needs Sam" and leave it.
6. **Copy markers.** Task 2's replacements (except item 7, which is Amy's) and Task 3's mission statement are Claude-written. Wrap each one in the `DRAFT COPY - NEEDS REWRITE` comment and list it in the report, per CLAUDE.md.
7. **Secrets.** Never print the value of an env var, API key, or token. Names only.
8. **Reduced motion.** macOS Reduce Motion is ON on Sam's Mac (found last session: `reduceMotion = 1`). Every interaction test runs twice: motion allowed, and `prefers-reduced-motion: reduce` emulated.
9. **Media.** Save screenshots and videos under `docs/notes/polish-audit-v2-media/` and keep them out of git, the same way `copy-pass-v1-screenshots/` was excluded.
10. **View transitions.** Any script you touch must initialize on `astro:page-load`, tear down on `astro:before-swap`, never stack listeners, and query the DOM fresh each time. `src/scripts/image-stage.js` already follows this pattern; match it.

---

## Task 0: Setup

1. `git fetch`, check out `copy-pass-v1`, pull, confirm a clean working tree. Report the HEAD hash (expect `48162dd` or later).
2. `npm ci`, then `npm run build`. It must pass before any changes.
3. Start the local preview for browser tests (the `akc-preview` entry in `.claude/launch.json`, or `npm run preview`).

Verify: clean build, preview running, HEAD reported.

---

## Task 1: Service list underline and crossfade (Home)

**Current state. Read these before changing anything:** `src/components/ServiceList.astro`, `src/scripts/image-stage.js`, `src/styles/tokens.css` (the 6.8 block), `src/styles/global.css` (`.link-underline`), `src/pages/services/index.astro` (its stage CSS).

The photo swap works now. Sam sees two problems:

- **No underline.** The `.link-underline` device was taken off the rows on 2026-08-19, when they stopped being links. Nothing underlines the active service now, on production or on this branch.
- **The photo hard-cuts on his Mac.** Two things cause it. ServiceList's `transition` sits inside `(prefers-reduced-motion: no-preference)`, and `tokens.css`'s global 6.8 rule forces every transition to `0.01ms !important` under reduce.

**Spec.**

1. **Active-row underline.** Draw an underline under the name of whichever row's photo is showing.
   - Look: match the site's 6.6 underline device. That means 2px, `var(--indigo)`, drawn left to right with `transform: scaleX(0)` going to `scaleX(1)`, and only as wide as the name's text (`.service-list__name` is already `inline-block`; keep it that way).
   - Do not add the `.link-underline` class itself. It carries hover-only behavior and reads as a link.
   - Position: just below the descenders. It must not collide with the p, y, or g in "Custom Drapery", "Upholstery", or "Soft Furnishings" at any width from 1024 to 2560.
2. **State.** Have `image-stage.js` mark the active trigger as well as the active layer (for example `.is-active` on `[data-stage-trigger]`).
   - Resting state: before the visitor first hovers, focuses, or taps a row, the first photo shows and no row is underlined.
   - From the first interaction on: exactly one row is underlined, always the one whose photo is showing. It stays underlined when the pointer leaves the list, just as the photo stays.
   - Use a flag on the section (for example `data-stage-engaged`) to tell resting from engaged.
3. **Timing.** The underline draw and the photo crossfade run together over `--hover-image-duration` (700ms), ease-out, so they finish at the same moment. The outgoing row's underline retracts over the same duration while the new one draws.
   - Sweep the pointer quickly across all four rows: there must be no stuck underlines and no flicker, and the line must not jump when the transform origin changes mid-transition.
4. **Scope.** The underline exists only where the stage is visible (1024px and up). Below that the section stays text-only, as now.
5. **Cursor.** Keep it as `default`. The rows are not links; the underline marks the selection.
6. **Reduced motion exception.** Opacity changes stay animated under reduce, but only for these three things:
   - the Home service stage layers
   - the Home active-row underline, which fades in (opacity 0 to 1 over the same 700ms) instead of drawing
   - the `/services` scroll-stage layers

   Why: WCAG does not count opacity changes as motion animation, and Apple's own Reduce Motion replaces slides with dissolves.

   Build it as a scoped rule inside `@media (prefers-reduced-motion: reduce)` that beats the global 6.8 rule. That rule uses `!important`, so the exception needs `!important` and higher specificity. Nothing else on the site changes under reduce.
7. **Docs.** Add a dated note to DESIGN_BRIEF 6.8 describing exactly this exception and why.

**Verify.** Run every check in Chromium and WebKit, with motion allowed and with reduce emulated, both on a direct load of `/` and after going `/process` → logo → `/`:
- Rest state: no underline on load. Exactly one after hovering a row. It stays after the pointer leaves the list.
- Mid-transition proof: hover row 2 and sample at about 350ms.
  - With motion allowed: the incoming layer's computed opacity and the underline's scaleX are both strictly between 0 and 1.
  - With reduce emulated: the incoming layer's opacity and the underline's opacity are both strictly between 0 and 1.
- Keyboard Tab and tap at 1180px still work, and the underline follows them.
- Rapid sweep across all four rows: never more than one underline fully drawn, and nothing stuck.
- The `/services` scroll stage now fades under reduce as well.
- Record two short videos of hovering all four rows (motion allowed, and reduce), plus screenshots at 1024, 1440, and 2560 showing the underline clear of descenders.

Commit: `Home service list: active-row underline synced with photo crossfade; opacity fades kept under reduced motion`

---

## Task 2: Copy fixes (rule problems from COPY-PASS-V1, plus plain Services ledes)

Make exactly these changes. Find each "before" string verbatim. If one is not there, report it and do not guess.

1. **Services, Blinds section** (`layers seamlessly`: "seamless" is banned)
   - Before: `The result is a solution that works beautifully on its own or layers seamlessly with custom drapery.`
   - After: `The result is a solution that works beautifully on its own or layered with custom drapery.`
2. **Services, Blinds section** (budget talk)
   - Before: `with options across a range of styles and price points`
   - After: `with options across a wide range of styles and materials`
3. **Contact FAQ, "Who designs, makes, and installs the work?"** ("partner" is barred as a relationship claim)
   - Before: `Blinds, shades, shutters, and woven woods are custom-produced through her trusted manufacturing partner.`
   - After: `Blinds, shades, shutters, and woven woods are made to order by a trusted American manufacturer.`
   - Update the FAQPage JSON-LD so it matches the visible text exactly.
4. **Process, step 02** (DESIGN_BRIEF 5.5 keeps "paid" on /contact only)
   - Before: `In a paid in-home design consultation, Amy visits your home`
   - After: `In an in-home design consultation, Amy visits your home`
5. **About intro** (DESIGN_BRIEF 5.4 requires the service area)
   - Add a new paragraph directly after the one ending `made specifically for the home.`:
   - `Amy works with clients throughout Cincinnati and Northern Kentucky.`
6. **Services page ledes.** Sam rejected the tagline-style line under each heading on `/services` because it reads as AI-written. They are the `lede:` fields in `src/content/pages/services.md`. Replace them as follows. Keep all the body copy under them.
   - Intro, under the "Services" H1: remove `Beautifully considered. Personally created. Made to work in your home.` entirely. Nothing renders between the H1 and the first paragraph. Make the template handle a missing lede without leaving an empty gap.
   - Custom Drapery: `Designed for your windows and everything around them.` → `Designed, sewn, and installed by Amy.`
   - Blinds, Shades, and Shutters: `Privacy, light control, and style: all working together.` → `For privacy and light, on their own or under drapery.`
   - Upholstery: `A new life for the pieces worth keeping.` → `New fabric for the chairs, benches, and ottomans worth keeping.`
   - Soft Furnishings: `The finishing details that make a room feel complete.` → `Custom pillows and cushions that pull a room together.`
   - These render in the uppercase label style. Drop the trailing period on each, since a period reads oddly at the end of an uppercase kicker line.
   - Leave the About page's `A designer's eye. A maker's understanding.` as it is. Sam approved the About page, and that line comes from a heading Amy already approved.

7. **Contact H1** (Amy's own words, 2026-10-09; not Claude-written, so no marker)
   - Before: `Let's Talk About Your Home`
   - After: `Let's Talk About Your Project`
   - Leave the page `<title>` and meta description as they are.

Then rerun the full copy-rule sweep from COPY-PASS-V1 Task 9, plus the banned-word list in CLAUDE.md and DESIGN_BRIEF. List every remaining hit.

Verify: screenshots of each changed spot at 1440 and 390, including the full `/services` page with the new ledes and no gap under the H1; JSON-LD matches the visible FAQ text; sweep results reported.

Commit: `Copy fixes: seamless, price points, partner, paid on Process, About service area, plain Services ledes, Contact H1`

---

## Task 3: About page: mission statement and Studio section

Sam approved the About structure: Amy's headshot and copy lead, then the Studio section, then "Let's Get Started". Keep that structure, with one addition: a mission statement, which Amy asked for on 2026-10-09.

**Mission statement.**
- Place it between Amy's intro copy and the Studio section, as its own short section with the heading `Mission`.
- Text, verbatim:

  > Amy has one goal for every room she works on: that it finally feels finished. She designs around how you actually live, and nothing is done until the little details are right.

- Put the copy in `src/content/pages/about.md`, not inline. Wrap it in the `DRAFT COPY - NEEDS REWRITE` comment and list it in the report as "needs Amy's OK before ship".
- Style: the section heading uses the same heading style as the other About sections. The statement uses the site's largest existing body or lede style, so it reads as a statement rather than one more paragraph. Add no new styles.

**Studio cards.** Change only the Studio cards, in `src/pages/about.astro`.

1. **Order:** Sam, Kelsee, Reaghan. It is currently Sam, Reaghan, Kelsee; update the order and the comment above `studio`.
2. **Cards.** Each card keeps the existing name and role lines, and gets one new short credential line beneath the role:

   | Name | Role | Credential line |
   |---|---|---|
   | Sam Clark | Website and Digital Strategy | Boston College |
   | Kelsee Etmans | Photographer | BFA, University of Cincinnati CCM |
   | Reaghan Connelly | Social Media | University of Cincinnati, Film and Media Studies |

   - Sam's role changes from "Web Development and Digital Strategy" to "Website and Digital Strategy". Update his alt text to match.
   - Set `REAGHAN_CONNELLY_TITLE` to `Social Media`. Her card still renders only once `src/assets/images/team/reaghan-connelly.jpg` exists; Sam adds the photo in a day or two. Keep that gate.
3. **Credential line style.** Use the same style as the role line, or one step quieter (smaller, or `--ink-muted` if the role line is not already muted). It must not compete with the name. Add no new type styles. No biography paragraphs; DESIGN_BRIEF 5.4.5 still applies.
4. **Data.** Keep names, roles, and credential lines together as plain data at the top of the Studio code, so any of them is a one-line edit. These are factual credentials, not marketing prose, so they need no `DRAFT COPY` marker.
5. **Layout.** The grid must look right with two cards (now) and three (once Reaghan's photo lands). Test three cards with a temporary placeholder photo, then remove it before committing.

Verify: screenshots at 1440 and 390 of the mission section, the two-card Studio state, and the temporary three-card state.

Commit: `About: mission statement; Studio order Sam, Kelsee, Reaghan; credential lines; Reaghan's title set`

---

## Task 4: Replace the display font (Amy's direction)

**Decision history, all 2026-10-09.**
- Amy rejected four Bodoni Moda variants and asked for "Lato or Helvetica."
- She then rejected Archivo in mixed case ("does nothing for me").
- She pointed to core-consultinggroup.com's hero ("POWERING POTENTIAL"): a light-weight sans, all caps, widely letterspaced. She said: "I like the simplicity of this font but don't use the exact one."

The reference font looks like Barlow or Roboto Condensed (we could not load that site to confirm). **Do not use Barlow, Roboto, or Roboto Condensed.**

This is direct Amy input that postdates Meeting 4 and her earlier Didot screenshot. It outranks them under the project's decision precedence, and it overrides CLAUDE.md's settled "Bodoni Moda for the Display role" note. The site keeps two faces: the new heading face plus Archivo for body.

**The treatment Sam has shown Amy:** headings in a light weight, uppercase, widely tracked.
- **1 (recommended): Lato Light (300).** Amy suggested Lato herself.
- **2: Jost Light (300).** Rounder, more fashion-house.
- **3: Archivo Light (300).** One family sitewide, but it reads heavier.

1. **Ask Sam first: "Heading font: 1 Lato, 2 Jost, or 3 Archivo?"** Show screenshots of the real `/contact` H1, the Home service list, and the `/services` headings in each, at 1440 and 390. If he has already told you in this session, use his answer.
2. **Font files.**
   - Self-host the chosen face's OFL woff2, latin subset, weight 300, in `public/fonts/`. Load it with `@font-face` and `font-display: swap`, matching how Archivo is loaded, and preload it if Archivo is preloaded. (`npm` package `@fontsource/<name>` is an easy source for the files; copy the woff2 in and do not add a runtime dependency.)
   - For option 3, no new file is needed.
   - Remove Bodoni Moda's `@font-face` and any preload. Keep `bodoni-moda-variable.woff2` in the repo, and note in `tokens.css` that it is retired, not deleted.
3. **The display role, through tokens in `tokens.css`, not per page.**
   - `--font-display` set to the new face.
   - `--weight-display: 300`. Never lighter: readability of thin strokes is the reason this whole change started.
   - `text-transform: uppercase` on `.type-display`, done in CSS. The source text stays in normal case so screen readers and search read it normally.
   - Tracking around `0.12em` (the reference uses wide tracking). Tune it by eye in the browser and report the value.
   - Line-height around 1.15.
4. **Size.** All-caps with wide tracking runs much wider and longer than the old Didone.
   - Reduce `--text-display` so page H1s like "Let's Talk About Your Project" break into at most two lines at 1440 and at most four at 390, and so no single word overflows at 360.
   - The Home service names must still fit their column beside the hover stage at 1024.
   - Report the new clamp.
5. **What changes.** Everything that used Bodoni Moda switches face:
   - `.type-display`: every page H1, the Home service names, "Studio", the About and Services section headings, and the Mission heading.
   - Grep for `Bodoni`, `--font-display`, and `opsz` to catch stragglers.
6. **Testimonials (`.type-quote`)** switch to the new face at weight 300, but in normal sentence case, **not** uppercase. Long sentences in spaced capitals are hard to read. They must still read as quotes; if they don't, report it and propose a size.
7. **Task 1's underline:** recheck its position and width under the new uppercase service names.
8. **Docs.**
   - Update DESIGN_BRIEF 3.4 and CLAUDE.md's typography rule with a dated entry (2026-10-09) recording the sequence above, the reference site, the "not the exact one" instruction, the face chosen, and the treatment values.
   - Add the same to BUILD-PLAN.md.
   - Leave the old reasoning in place, marked superseded.

Verify: before and after screenshots of `/contact`, Home (hero through the service list and testimonials), `/services`, and About (Mission, Studio) at 1440, 1024, and 390. Confirm no request for `bodoni-moda-variable.woff2` in the network log.

Commit: `Headings: switch from Bodoni Moda to <font> Light, uppercase, tracked, per Amy 2026-10-09`

---

## Task 5: Bring the governing docs up to date

DESIGN_BRIEF sections 4, 5.3, 5.4, and 5.5 no longer match the site. Update them to describe the site as it now is, each with the note "(updated 2026-10-09, POLISH-AND-AUDIT-V2)":
- Nav: Services, About, Process, Contact. Blinds and Journal are flagged off with 301s.
- About: headshot plus the new copy, then a Mission section, then a Studio section with Sam, Kelsee, and Reaghan (once her photo exists), each with a credential line.
- Process: four steps.

Also add a BUILD-PLAN.md entry covering COPY-PASS-V1 and this session. Docs only; no code.

Commit: `docs: bring DESIGN_BRIEF 4, 5.3, 5.4, 5.5 and BUILD-PLAN up to date`

---

## Task 6: Full audit

**Goal:** find everything broken on the site and in the repo. Fix only objective, contained defects (fix policy below). Everything else goes in the report. Split the areas across parallel workers where that helps. Each area ends with a written result: what was checked, what was found, the severity, and whether it was fixed.

**A. Build and code health**
- Build warnings, and `npx astro check` (type errors).
- Dead components and CSS, stray `console.log` calls, and every TODO and FIXME.
- `npm audit`: report only. Never run `npm audit fix --force`.
- The Node pin in `netlify.toml` vs. the local version, and whether the lockfile is in sync.

**B. Every page, in Chromium and WebKit, at 390, 768, 1024, 1280, 1440, and 1920**
- Pages: everything in `dist/`, plus the 404 page and `/contact/thank-you`.
- Check for:
  - console errors and warnings, and failed requests
  - horizontal overflow (`scrollWidth > clientWidth`)
  - clipped or overlapping text
  - images that fail to load, or render blurry (natural width smaller than rendered width × 2)
  - layout shift on load
  - a correct nav and footer
- Take a full-page screenshot of every page at every width.

**C. Interactions**
Test each one on a direct load and after view-transition navigation, with motion allowed and with reduce emulated:
- Hamburger: open, close, Esc, focus handling, scroll lock.
- Home hover stage and underline.
- Home auto-advance: report only if it is broken. Do not change it.
- `/services` scroll stage.
- FAQ accordion, quote rotator, hero gallery.
- Contact form:
  - required-field validation and error messages
  - honeypot present
  - photo upload accepts and rejects the right file types and sizes
  - budget select
  - submit button states
  - the closing CTA anchors to the form
- Back and forward navigation, and the skip link.

**D. Accessibility**
- axe-core (`@axe-core/playwright` as a dev dependency is fine) on every page at 390 and 1440.
- A keyboard-only walkthrough of every page.
- Heading order, alt text, form labels and error association, color contrast, landmarks, `lang`, and a visible focus state on every interactive element.

**E. SEO and metadata**
- A unique title and meta description per page, within the build's length caps.
- Canonical URLs, with trailing slashes consistent with how Netlify serves the pages.
- OG and Twitter images resolve and are the right size.
- `sitemap.xml` lists exactly the live pages: no blinds, journal, portfolio, `_disabled`, thank-you, or 404. Also check `robots.txt`.
- JSON-LD is valid and matches the visible text.
- No internal links to hidden pages. Favicon and apple-touch-icon are present.
- `/cincinnati` and `/northern-kentucky`: are they linked from anywhere, are they in the sitemap, and do they pass the copy rules?

**F. Performance**
- Run Lighthouse, mobile and desktop, on Home, Services, About, Process, and Contact against the local production build.
- Report the scores, the LCP element and time, CLS, total page weight, and the five largest images.
- Fix only safe wins that change nothing visible: missing width or height, a below-the-fold image not lazy-loaded, the LCP image not prioritized, a font not preloaded. Give before and after numbers for anything you fix.

**G. Redirects and hosting** (read-only against production)
- Validate every `[[redirects]]` rule in `netlify.toml`: syntax, no loops, and no shadowing of real pages.
- Apex and www both resolve, and one redirects to the other with a single 301.
- HTTPS is valid; report the certificate expiry date.
- Report which security headers are set.
- The 404 page is served with a 404 status.

**H. Netlify account and deploys** (read-only)
- Using `netlify status` and the Netlify API, report:
  - which team owns the site
  - whether it is still on the Boston College team account
  - build credit or minutes status, if visible
  - the last 10 deploys and their status
- If the site is not on an account Amy owns, write `docs/handoff/netlify-transfer-steps.md`. Cover, in plain English, the steps to move it to her account, what Amy has to do herself, and what breaks if nobody does. Do not transfer anything.

**I. Contact form to email pipeline** (read-only here; the live test is in Task 7)
- Read `netlify/functions/submission-created.js`. List every env var it reads and confirm each one exists in Netlify (names only).
- Confirm `CONSULTATION_FEE` exists nowhere else.
- Netlify Forms detects the form at build: form name, the Netlify attribute, and the honeypot.
- `send.amykclarkdesign.com` DNS (SPF, DKIM, DMARC, MX via `dig`) matches what Resend expects.
- The per-send try/catch is present.

**J. Repo hygiene** (the repo is public on GitHub, so this matters)
- Secrets anywhere in git history. Use gitleaks or a key-pattern grep, and report the file and commit, never the value.
- `.env` is ignored.
- Repo size and the biggest tracked files.
- Whether `legacy-static/` or `source-photos/` end up in `dist/`.
- An inventory of every `DRAFT COPY - NEEDS REWRITE` marker, by file and line.
- Docs that are stale or contradict each other.

**K. Content and permissions** (report only; this cannot be fixed in code)
- Every testimonial live on production and on this branch, and whether ASK-AMY.md or LAUNCH_CHECKLIST.md documents permission for it. Diane K. is the known open one.
- Photo credit and permission status for every photo in IMAGE-MANIFEST.md.
- Everything LAUNCH_CHECKLIST.md still marks open.

**Fix policy.**
- **Fix this session:** console errors, broken links or assets, axe violations with an unambiguous fix, overflow or clipping bugs, invalid structured data, wrong canonicals, wrong sitemap contents, missing alt text or labels, and the safe performance wins in F. Make one commit per fix, prefixed `fix(audit):`, and re-verify each fix in the browser.
- **Do not fix; report under "Needs Sam":** anything that changes copy, layout, design, type, color, scroll behavior, page structure, or a governing decision. The same goes for anything touching Netlify settings, DNS, or env vars, and anything in the email function beyond an obvious crash bug.

**Report.** Write it to `docs/notes/2026-10-09-site-audit.md`, in this order:
1. Summary: counts by severity, and the three things that most need Sam.
2. Fixed this session: one line each, with the commit hash.
3. Broken, needs Sam: ranked, each with the exact fix you propose.
4. Risks and should-fix: ranked.
5. Nice-to-have.
6. Results for each area, A to K.
7. Paths to the screenshots and videos.

Commit: `docs(audit): full site audit 2026-10-09`

**STOP.** Print the summary and the "Needs Sam" list in chat, then ask exactly: "Merge copy-pass-v1 into main and deploy to production?" Do not continue until Sam answers.

---

## Task 7: Ship and live test (only after Sam says yes)

1. **Merge and deploy.**
   - Merge `copy-pass-v1` into `main` with a regular merge (no squash), build, and push `main`. The push triggers the production deploy.
   - Watch the deploy until it succeeds.
   - If the Git deploy fails for credits or any other reason, deploy with `npm run build && netlify deploy --prod --dir=dist` and report why.
2. **Production smoke test** (Chromium and WebKit):
   - The nav has four items.
   - `/blinds`, `/blinds/`, `/journal`, and `/journal/anything` each 301 to the right place.
   - The Home hover stage, underline, and fade work.
   - `/services` scroll stage, FAQ, and mobile menu work.
   - `sitemap.xml` is correct, every page returns 200, and the 404 page returns 404.
3. **Live email test.** Before submitting anything, ask Sam in one message for three things:
   - (a) the email address to use for the test
   - (b) confirmation that his mom knows a test inquiry is coming, since she will get the notification
   - (c) a go-ahead

   Then submit one inquiry on production:
   - name `TEST, please ignore (Sam)`
   - the email from (a)
   - minimum required fields
   - one small JPG attached, to test photo delivery

   Confirm all of the following:
   - Netlify Forms received the submission.
   - The function logs show both emails sent with no errors.
   - Sam confirms the client confirmation arrived and was not in spam.

   Delete the test submission from Netlify Forms afterward.
4. Leave the `copy-pass-v1` branch in place. Delete nothing else.
5. **Final message:**
   - production deploy ID and URL
   - smoke test results as a table
   - email test result
   - anything still open
