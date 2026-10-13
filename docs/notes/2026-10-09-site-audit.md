# Site audit, 2026-10-09 (run 2026-10-12)

POLISH-AND-AUDIT-V2, Task 6. Branch `copy-pass-v1` at `11e8041`; production
still on `89d4762`. Local checks ran against the production build served by
`astro preview`. Browser checks used Playwright 1.64 (Chromium 156 and WebKit
27.2), plus Sam's installed Chrome 155 where noted. Production checks were
read-only. No secret values appear in this report.

## 1. Summary

| Severity | Count |
|---|---|
| Critical | 1 |
| High | 3 |
| Medium | 6 |
| Low | 10 |
| Fixed this session | 4 |

**The three things that most need Sam:**

1. **The two confirmation emails are not being sent in production, and the
   Resend key needs rotating.** Netlify has no `RESEND_API_KEY` variable.
   Instead, a team-level variable is *named* with what looks like the Resend
   key itself, so the key was pasted into the Key field. The function logs
   `RESEND_API_KEY is not set` and sends nothing. The sending domain also has
   no SPF, DKIM, or DMARC records, and `amykclarkdesign.com` has no MX record,
   so `hello@amykclarkdesign.com` cannot receive mail. Inquiries still reach
   someone only through Netlify's own form-notification email (to a gmail.com
   address).
2. **Permissions.** All five testimonials, and the Ivory House and Collected
   Living Room photography, are live on production without the written
   permissions ASK-AMY.md and LAUNCH_CHECKLIST.md say are required.
3. **Hosting ownership.** The site sits on Sam's free Netlify team ("Boston
   College"), where builds stop whenever the monthly credits run out (this
   happened 2026-08-22 to 08-24), and Amy has no access. The transfer plan is
   `docs/handoff/netlify-transfer-steps.md`.

## 2. Fixed this session

| Commit | Fix |
|---|---|
| `2809796` | `ProjectGallery.astro`: a JSX comment inside `<RevealImage>`'s attribute list was a parse error (`astro check`). It would have failed the build the moment the portfolio was re-enabled. |
| `4950c16` | JSON-LD BreadcrumbList and OfferCatalog URLs now use the trailing-slash form the canonicals use. They pointed at 301s (`/about` instead of `/about/`). |
| `6d15221` | The 404 page no longer declares `https://amykclarkdesign.com/404/` (itself a 404) as canonical and `og:url`. |
| `11e8041` | LCP images prioritized: `fetchpriority="high"` on About's headshot, Process's lead image, and Services' first stage layer. Services' first inline photo (the mobile LCP) was `loading="lazy"` and is now eager. Lighthouse LCP-discovery audit 0 to 1 on all six runs; local LCP unchanged within noise (no real network on localhost). Pages pixel-identical before and after. |

Found during Task 1 rather than the audit, and fixed in `98b0efb`: in Chromium
(including Sam's Chrome 155), the `/services` scroll stage sometimes started
no CSS transition when the swap landed mid-scroll, so the photo cut instead of
fading (7 of 20 wheel-scroll runs in Chrome 155). `image-stage.js` now checks
one frame later and runs the same fade through the Web Animations API. Result:
0 of 20 cuts in Chrome 155, Chromium, and WebKit, with and without reduced
motion.

## 3. Broken, needs Sam (ranked, with the exact fix)

1. **[Critical] Confirmation emails do not send; the API key is exposed as a
   variable name.**
   - In Resend: revoke the current key (it is visible to anyone with team
     access in Netlify, and it appeared in this audit's tool output) and create
     a new one.
   - In Netlify: delete the team-level variable whose *name* is the key. Add
     `RESEND_API_KEY` with the new key as its value, scoped to the site
     (site-level variables travel with the site if it moves to Amy's team).
   - In Resend: add the sending domain (`send.amykclarkdesign.com` or the
     apex), then add the SPF and DKIM records it gives you at GoDaddy, plus a
     DMARC record (`_dmarc` TXT, e.g. `v=DMARC1; p=none`). Wait for
     "Verified".
   - Set `RESEND_FROM_EMAIL` to an address on that verified domain.
   - Either create a real mailbox for `hello@` (it needs an MX record at
     GoDaddy) or set `AMY_NOTIFICATION_EMAIL` to the inbox Amy actually reads.
   - Delete the unused `NETLIFY_EMAILS_DIRECTORY` and `NETLIFY_EMAILS_SECRET`
     variables (leftovers; the function does not read them).
   - Redeploy, then run Task 7's live test.
2. **[High] Testimonial permissions.** Diane K., Heather L., Jenny H., Kelly
   G., and Lisa C. are all live on production, and ASK-AMY.md (§ "Written
   permission for every testimonial") records none as permitted. Fix: Amy gets
   written permission from each, or the unpermitted quotes come off the page
   until she does.
3. **[High] Photography permissions.** Ivory House (photographer and
   homeowner), Collected Living Room (homeowner), and Kelsee's work generally
   are live on production while LAUNCH_CHECKLIST.md §1 marks all three as
   outstanding. Fix: written permissions on file, or hide the affected images.
4. **[High] Move hosting to Amy.** Follow `docs/handoff/netlify-transfer-steps.md`.
   Re-create the env vars on the site after the move: today all three are
   team-level and will not travel with it.
5. **[Medium] Testimonial attribution contrast fails WCAG AA** (4.21:1, needs
   4.5:1): `--ink-muted` (#6E6E68) at 11px on the testimonial band
   (#E9E9E6). Home only, both engines, both widths. It is the only axe
   violation on the site. Fix (a color change, so yours to approve): in
   `Quote.astro`, `.testimonial-anchor .quote__attribution { color: var(--ink); }`.
6. **[Medium] Images render below 2x on retina screens.** Landscape photos
   cropped into 4:5 boxes need a source about 1.8x wider than the box, but
   `sizes` describes only the box, so the browser picks too small a file. The
   worst is 45% of 2x.
   - On `/services` mobile, change the inline images to
     `sizes="(min-width: 900px) 1px, 160vw"`.
   - On the Home service stage and `/services` stage, double the `sizes`
     values.
   - Add 1600 and 2000 to the `widths` arrays.
   - Two are source limits that need bigger originals instead: Kelsee's
     headshot is 399px, and the hero source is 1507px wide.
7. **[Medium] Security headers.** Only `strict-transport-security` is set. Add
   to `netlify.toml`:
   ```toml
   [[headers]]
     for = "/*"
     [headers.values]
       X-Content-Type-Options = "nosniff"
       Referrer-Policy = "strict-origin-when-cross-origin"
       X-Frame-Options = "DENY"
       Permissions-Policy = "camera=(), microphone=(), geolocation=()"
   ```
   A Content-Security-Policy is worth adding later, but it needs testing
   against the inline JSON-LD and Astro's scripts.
8. **[Medium] Mobile menu.** The page scrolls behind the open menu (no scroll
   lock), and Tab walks out of the open menu into the page underneath while
   the menu stays open.
   - Lock scroll while open: `html { overflow: hidden }` via a class that
     `setPanelOpen()` toggles.
   - Close the panel on `focusout` when focus leaves `[data-nav]`.
9. **[Medium] The consultation fee figure is in the public repo outside its
   one constant.** It appears in `legacy-static/contact.html`,
   `legacy-static/process.html`, and `legacy-static/LAUNCH-CHECKLIST.md`
   (archived v1 files, not built). Fix: remove the figure from those three
   files, or stop tracking `legacy-static/` in the public repo.
10. **[Medium] `npm audit`: 1 critical, 8 high, 1 low.** The critical is in Astro
    itself (`define:vars` script sanitization, server-island parameters). This
    site uses neither feature (0 uses in `src/`) and is static, so it is not
    exploitable here. The rest are transitive build-time dependencies. The fix
    is a major upgrade (Astro 5.18 to 7.x); schedule it after launch and
    retest everything.

## 4. Risks and should-fix (ranked)

1. **Redirects take two hops.** `/services/drapery`, `/blinds`, and friends
   go to `/services`, which Netlify then 301s to `/services/`. Fix: change the
   four service redirects and the two blinds redirects to `to = "/services/"`.
2. **`http://www` takes two hops** (to `https://www`, then to the apex).
   This is Netlify's default behavior; harmless, and optional to change.
3. **No double-submit protection.** The form has no submit handler, so the
   button never disables. Fix: disable the button and swap its label on the
   `submit` event, after the browser's own validation passes.
4. **Upload type filtering relies on `accept="image/*"` alone.** A non-image
   added programmatically is kept. Low risk, since the OS picker enforces it.
   Optional: skip non-`image/` MIME types in the picker's `change` handler.
5. **Node version.** `netlify.toml` pins 24.18.0, but this machine now runs
   26.5.0, and CLAUDE.md says the pin "matches local". Decide which one is
   right and update the other.
6. **npm's new install-script approval** held back the `sharp` and `esbuild`
   install scripts during `npm ci`. The build still works. Run
   `npm approve-scripts` once so that stays true.

## 5. Nice-to-have

- An apple-touch-icon (180x180 PNG; needs a background color decision).
- `astro check` reports 11 type errors, all type-only:
  - untyped `querySelector` results in ConsultationForm's script
  - zod inferring optional fields because `tsconfig` is not strict

  Typing them would make the check useful as a gate.
- Unused weight and dead code:
  - `public/images/about/photo-shoot-*.jpg` (7.6 MB) is published with the
    site but referenced nowhere
  - `@fontsource-variable/archivo` and `@fontsource-variable/bodoni-moda` are
    unused dependencies (the font files are copied into `public/fonts/`)
  - dead CSS: `.text-page__body`, `.btn-outline`
- `DRAFT COPY` markers written as HTML comments ship in the page source:
  privacy, terms, 404, thank-you, and both location pages.
- Testimonials in Jost Light read as large statements, less obviously as
  quotes than they did in Bodoni. Adding curly quotation marks would fix that
  without a new style, but it is a copy change, so it needs Amy.
- The location pages are in the sitemap but linked from nowhere. This is
  intentional (DESIGN_BRIEF 5.8 removed them from the footer); they pass the
  copy rules.

## 6. Results by area

**A. Build and code health.**
- Build: clean, no warnings.
- `astro check`: 13 errors before the fix, 11 after, all type-only (§5).
- Dead components: `ProjectGallery` and `SpecBlock` are used only by the
  flag-disabled portfolio, which is by design.
- `console.*` appears only in the email function's server-side logging,
  which is intentional.
- TODOs, all known open items:
  - Google Voice number (`business.ts`)
  - booking tool (ContactBand, HeroGallery)
  - mailboxes (email function)
- `npm audit` and Node pin: see §3.10 and §4.5.
- The lockfile is in sync (`npm ci` succeeded).

**B. Every page, Chromium and WebKit, 390 to 1920.**
- 132 loads in all: 11 pages × 6 widths × 2 engines.
- No horizontal overflow, clipped text, or broken images.
- CLS 0 in Chromium; WebKit does not report layout shift.
- Nav and footer show Services, About, Process, Contact everywhere.
- The only console error is the expected 404 response on the 404 page.
- Two flags were false positives:
  - the quote rotator's stacked layers (hidden by parent opacity)
  - `form.name` returning the input named "name"
- Sharpness at 2x: see §3.6.

**C. Interactions**, each on direct load and after view-transition
navigation, with motion allowed and with reduce emulated, in both engines.
- Pass:
  - hamburger open, close, Esc (Esc returns focus to the toggle)
  - Home hover stage and underline (52 of 52 checks)
  - hero auto-advance (fires and lands with motion, skipped under reduce, as
    designed)
  - `/services` scroll stage
  - FAQ accordion
  - quote rotator (rotates with motion, static under reduce)
  - hero gallery and opening line
  - back and forward navigation
  - skip link
  - closing CTA anchors to the form with no reload
- Contact form passes:
  - Netlify attributes, `form-name`, and honeypot are present
  - empty submit is blocked, with native messages plus "Choose at least one
    project type."
  - all seven budget options present
  - every control is labelled
  - photo upload: 1 kept, 5 trimmed to 4 with a message, 3×4 MB trimmed by
    the size cap with a message
- Findings: scroll lock and focus escape (§3.8), double submit (§4.3),
  upload types (§4.4).
- WebKit not tabbing to links or focusing buttons on click is macOS default
  behavior, not a site bug.

**D. Accessibility.**
- axe-core (WCAG 2.0–2.2 A/AA plus best practice) on 11 pages × 2 widths × 2
  engines: one violation, the attribution contrast (§3.5).
- Keyboard walkthrough of every page at 1440 and 390: every stop has a
  visible focus ring, is on screen, and none is inside `aria-hidden`.
- Every page has `lang="en"`, exactly one H1, no skipped heading levels,
  header/nav/main/footer landmarks, and alt text on all images.

**E. SEO and metadata.**
- Titles (28–56 chars) and descriptions (64–155 chars) are unique and within
  the caps.
- Canonicals are consistent with Netlify's trailing-slash URLs. The 404
  canonical is fixed.
- OG and Twitter image `og-default.jpg` is 1200×630 and resolves.
- `sitemap-0.xml` lists exactly the seven indexable live pages, with none of
  blinds, journal, portfolio, `_disabled`, thank-you, 404, privacy, or terms.
- `robots.txt` allows everything and references the sitemap index.
- JSON-LD is valid on every page; the FAQPage matches the visible text;
  breadcrumb URLs are fixed.
- No internal links to hidden pages.
- The favicon is present; the apple-touch-icon is missing (§5).
- Location pages: see §5.

**F. Performance** (Lighthouse 13.5, local production build).

| Page | Mobile | Desktop | LCP mobile / desktop | Weight (mobile) | LCP element |
|---|---|---|---|---|---|
| Home | 100 | 100 | 1.6 s / 0.6 s | 117 KB | hero image |
| Services | 100 | 100 | 1.6 s / 0.4 s | 155 KB | first drapery image |
| About | 100 | 100 | 1.6 s / 0.4 s | 100 KB | Amy's headshot |
| Process | 100 | 100 | 1.5 s / 0.4 s | 81 KB | bay-window image |
| Contact | 100 | 100 | 1.5 s / 0.4 s | 67 KB | H1 / lead paragraph |

- CLS 0 and TBT 0 ms everywhere. Accessibility scores 100, except Home at
  95/96 (the contrast item).
- Five largest images, Home desktop: hero 135 KB, then the four service-stage
  layers at 29, 24, 23, and 11 KB.
- Safe wins applied: §2, `11e8041`.

**G. Redirects and hosting** (read-only).
- 9 rules parse, with no loops and none shadowing a real page. Two-hop
  targets: §4.1.
- `http://` to `https://` and www to apex each take one 301; `http://www`
  takes two (§4.2).
- Certificate: Let's Encrypt, covers apex and www, expires 2026-11-23
  (auto-renews).
- Headers: HSTS only (§3.7).
- The 404 page is served with status 404.

**H. Netlify account** (read-only).
- Team "Boston College" (slug `samueljclark`), free credit plan: 300 credits a
  month, currently 0 used, builds blocked when exceeded. One owner (Sam).
- Not an account Amy owns, so `docs/handoff/netlify-transfer-steps.md` is
  written.
- Last 10 deploys:
  - this branch's draft deploy
  - production `89d4762`, `ef8c8a9`, `d22a6c1`, `398204c`, and two CLI
    deploys, all ready
  - three production deploys 2026-08-22 to 08-24 skipped for credit usage

**I. Contact form to email.**
- The function reads `RESEND_API_KEY` (required), plus `RESEND_FROM_EMAIL` and
  `AMY_NOTIFICATION_EMAIL` (optional, with defaults in code).
- In Netlify, `RESEND_API_KEY` is absent (§3.1).
- `CONSULTATION_FEE` is defined only in the function; other files mention the
  constant by name. The figure itself appears in `legacy-static/` (§3.9) and
  not in `dist/`.
- Netlify Forms detected `consultation` (17 fields, 3 submissions). Honeypot
  `bot-field` and `form-name` are present in the built HTML.
- DNS: no SPF, DKIM, or DMARC for `send.amykclarkdesign.com` or the apex, and
  no MX. Nameservers are GoDaddy (`domaincontrol.com`).
- Each send has its own try/catch inside one outer try/catch; with the key
  missing it logs and returns early.
- A Netlify form-notification email (to a gmail.com address) is the only
  delivery path working today.

**J. Repo hygiene** (public repo).
- A key-pattern scan of all history (Resend, AWS, Stripe, GitHub, Slack,
  Google, Netlify, private keys, bearer tokens) found no matches.
- `.env` and `.env.*` are ignored; no env files are tracked.
- `.git` is 44 MB. The largest tracked files are `source-photos/` originals
  (up to 5.1 MB, 22 MB total) and the two unused `public/images/about/` shots
  (§5).
- Neither `legacy-static/` nor `source-photos/` reaches `dist/`.
- `DRAFT COPY - NEEDS REWRITE` markers (live files):
  - `netlify/functions/submission-created.js:80, 113`
  - `src/components/ConsultationForm.astro:281`
  - `src/content/pages/about.md:15, 18`
  - `src/content/pages/cincinnati.md:13`
  - `src/content/pages/contact.md:56`
  - `src/content/pages/northern-kentucky.md:13`
  - `src/content/pages/privacy.md:10`
  - `src/content/pages/process.md:3, 18`
  - `src/content/pages/services.md:19, 27, 32, 34, 37, 45`
  - `src/content/pages/terms.md:10`
  - `src/data/services.ts:39`
  - `src/pages/404.astro:6`
  - `src/pages/contact/thank-you.astro:18`
- Stale docs: LAUNCH_CHECKLIST.md §3 ("Git repo does not exist yet", "Connect
  the GitHub repo") and §2 (the deleted preview theme), its journal and
  portfolio items, and DESIGN_BRIEF 5.1 (still describes the hero word links,
  the portfolio section, and a portrait placeholder). Not updated this session
  (Task 5's scope was 4, 5.3, 5.4, 5.5).

**K. Content and permissions** (report only).
- Testimonials live on production and on this branch: Diane K. (fixed slot),
  Heather L., Jenny H., Kelly G., Lisa C. All five are without documented
  written permission (ASK-AMY.md; LAUNCH_CHECKLIST.md §1).
- Photography: IMAGE-MANIFEST.md and LAUNCH_CHECKLIST.md §1 record written
  permission as outstanding and blocking for the Ivory House shoot
  (photographer and homeowner), the Collected Living Room homeowner, and
  Kelsee's photography generally.
- Other open LAUNCH_CHECKLIST items:
  - Google Voice number
  - business hours
  - `hello@` and Amy's mailboxes
  - the four form-backend blockers in §3a
  - Google Calendar booking setup
  - server-side validation
  - apex vs www decision
  - Search Console and Bing
  - Google Business Profile check
  - real-device, VoiceOver, and real-network Lighthouse runs
  - a legal read of `/privacy` and `/terms`
  - Amy's final copy review, including the new Mission statement
  - Amy's sign-off on the display font

## 7. Screenshots and videos

All under `docs/notes/polish-audit-v2-media/` (kept out of git).

**Task 1:**
- `t1-hover-all-rows-motion.webm`, `t1-hover-all-rows-reduce.webm`
- `t1-underline-{1024,1280,1440,1920,2560}-custom-drapery.png`
- `t1-underline-{1024,1440,2560}-soft-furnishings.png`
- `t4-after-underline-{1024,1440,2560}.png` (the underline under Jost)

**Task 2:**
- `t2-services-full-{1440,390}.png`, `t2-services-top-{1440,390}.png`
- `t2-services-blinds-section-*`, `t2-contact-h1-*`, `t2-contact-faq-who-*`
- `t2-process-step-02-*`, `t2-about-intro-*`

**Task 3:**
- `t3-mission-{1440,390}.png`
- `t3-studio-2cards-*`, `t3-studio-3cards-TEMP-*`

**Task 4:**
- `t4-font-options-{contact,home-services,services-headings}-{1440,390}.png`
- `t4-before-*` and `t4-after-*` for contact, home, services, and about at
  1440, 1024, and 390
- `t4-after-testimonials-1440.png`

**Audit area B:** `audit-pages/{chromium,webkit}-{390,768,1024,1280,1440,1920}-{page}.png` (132 full-page screenshots).
