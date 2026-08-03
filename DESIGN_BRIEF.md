# Amy K Clark Design
## Website Build Brief

**Domain:** amykclarkdesign.com (registered at GoDaddy)
**Client:** Amy Clark, founder, Amy K Clark Design
**Market:** Cincinnati, Northern Kentucky, plus select travel projects
**Build owner:** Sam Clark

**How to use this file:** this is the authority for the build. When something is ambiguous, this file wins over instinct. Read section 3 before writing a single line of CSS.

---

# 1. What the business is

Amy K Clark Design is a one-woman boutique studio making custom drapery, blinds and shades, upholstery, and soft furnishings.

Her actual differentiator, in her own words:

> She does design, fabrication, and installation, and merges all three specialties together. An interior decorator does not make anything.

She is not a full-service interior designer and the site must never say she is. She owns the textile layer of a room: windows, upholstery, pillows, cushions, trim.

**Audience:** affluent homeowners, mostly women, roughly 40 to 85, who have confidence in their own taste and want expertise and partnership rather than a full interior design process. Also a small number of designers and project managers who delegate the textile category to her.

**The site's single job:** make that person trust Amy enough to complete the consultation form.

**The rule that governs everything:** Amy's own words, and they are not negotiable.

> They are not there to read. They are there to take in visuals with a little bit of words.

**Voice (REVISED 2026-07-31, Kristen/Amy/Sam review — supersedes the 2026-07-28 first-person
standard):** the site speaks about Amy in the **third person** ("Amy designs," "she makes," "the
lines she represents"), not as Amy in the first person. The 2026-07-28 SITE-COPY-REWRITE.md pass
moved the whole site into first person; this decision reverses that and is now the standard.
Rationale from the review: third person reads as an established studio rather than a personal
account, and it keeps the copy usable in contexts (ads, directory listings, referrals) where a
first-person "I" has no visible speaker. Client testimonials are the one exception: they stay in
the client's own words and voice, since they are quotes from someone else describing Amy's work.
Ampersands are spelled out as "and" in all display copy and page titles (nav labels, H1s, meta
titles, service names) — this resolves the ampersand question BUILD-PLAN.md previously tracked as
open, and it stands unless Amy asks otherwise.

---

# 2. Non-negotiables

1. **No pricing.** No prices, no ranges, no "starting at," no "affordable," no budget talk of any kind in public copy.
2. **No claim that the consultation fee credits toward the project.** It does not.
3. **Never call Amy an interior designer or a full-service design firm.**
4. **No client names, no addresses, no cities in project names.**
5. **Banned words: calm, bespoke, elevated, curated, luxurious, transform, seamless, effortless, unlock, journey, passion for.**
6. **Approved words: tailored, considered, exclusive, personal, precise, finished.**
7. **Fabric lines are Schumacher, Stout, and Pollack. Blinds and shades are Lafayette Interior Fashions, sole source. Do not mention William Morris.** Naming in public copy is gated on clearance, per rule 8: **Schumacher is cleared and is named by name.** Stout and Pollack are real lines Amy carries but are **not cleared**, and are covered by "the lines she represents" until each is individually cleared. Lafayette may be named as the source for blinds and shades (8.3 makes it a keyword target), but **no formal relationship claim — "dealer," "authorized," "partner" — until Amy confirms it.**
8. **Do not use any vendor logo or trademark.** Use the phrase "the lines she represents" until permissions are confirmed.
9. Reduced motion must be respected everywhere. Every animation in section 6 has a `prefers-reduced-motion` off-switch.
10. Every image needs real, descriptive alt text. This is both accessibility and image search, and image search matters enormously in this category.

---

# 3. Design direction

## 3.1 The thesis

**Build this like a fashion house lookbook, not like an interior design portfolio.**

Amy is very inspired by fashion. That is the unlock. It is also the thing that solves her hardest problem: she rarely owns a whole room, so a conventional interior portfolio makes her look like she is claiming credit she does not have. A lookbook is allowed to show a fragment, a detail, a hand on a fabric, a single window. It sells taste rather than square footage.

No competitor in her market is doing this.

## 3.2 What we are deliberately not doing

This brief is being handed to an AI and AI-generated design currently clusters around three looks. All three are banned here:

1. **Warm cream background near `#F4F1EA`, high-contrast serif display, terracotta accent near `#D97757`.** This is the single most likely failure mode for an interior design brief. Do not go near it.
2. **Near-black background with one bright acid accent.**
3. **Broadsheet layout: hairline rules everywhere, zero radius, dense newspaper columns.**

Additional bans, all of which read as generic and will get the build rejected:

- Gradient text, glassmorphism, glows, drop shadows on cards
- Any border-radius above 2px
- Emoji anywhere
- Any icon library. Lucide, Feather, Font Awesome, Heroicons. If an icon is genuinely required it is a custom SVG drawn for this project.
- Stock illustration of any kind
- Three-column feature grids with an icon, a heading, and two lines of text
- Testimonial cards with five gold stars
- Animated counters, "trusted by" logo strips, trust badges
- Centered body paragraphs
- Buttons that say "Get Started" or "Learn More"
- Tailwind's default color palette values
- Copy like "Elevate your space," "Where luxury meets comfort," "Transform your home"

## 3.3 Palette

There is **no brand accent color.** All color on this site comes from the photographs.

This is the one real risk in the direction and it is justified: Amy sells color and pattern for a living. Any brand color competes with the product she is trying to show you. The fashion houses she admires do exactly this.

```
--paper       #F1F1EF   cool near-white, gallery wall, deliberately not cream
--ink         #191917   near-black with a trace of warmth, never pure #000
--ink-muted   #6E6E68   captions, roles, meta
--rule        #D6D6D1   hairlines, form borders
--ground      #181816   full-bleed dark sections and footer
--indigo      #22303F   the only chromatic value in the system
```

`--indigo` is the oldest dye in the textile world. It appears **only** on focus rings and link hover underlines. Nowhere else. If it shows up as a background or a button fill, the palette has been broken.

## 3.4 Typography

Amy asked for Helvetica, a maximum of three faces, minimal and uniform and premium.

**Use one family in three roles, plus one second family for a single narrow purpose.** Restraint reads as more expensive than variety, and single-grotesque discipline is the actual signature of the fashion houses she likes.

**Primary: Archivo**, self-hosted variable, weights 400 and 500 only.

Archivo is chosen because it has a real grotesque skeleton with a variable width axis, and because Inter, Poppins, and Montserrat are the tells of a template build. If budget appears later, Söhne or Neue Haas Grotesk are the paid upgrades and swap in cleanly.

Three roles, and nothing outside them:

| Role | Spec |
|---|---|
| **Display** | 400 weight, clamp 40px to 92px, letter-spacing -0.025em, line-height 1.02 |
| **Label** | 500 weight, 11px, uppercase, letter-spacing 0.18em, used for nav, eyebrows, section markers, spec blocks, form labels |
| **Body** | 400 weight, 16 to 17px, line-height 1.65, letter-spacing 0, max-width 58ch |

**Secondary: Newsreader**, light weight, used **only** for testimonial quotes. Not Playfair, not Cormorant, not Lora. Nowhere else on the site.

Body copy is always left-aligned. Never centered, never justified.

## 3.5 Layout

- Full-bleed by default. Images break the container; text does not.
- Text columns are narrow. 58ch maximum, and often much less.
- Vertical rhythm is generous to the point of feeling almost empty. Section spacing at 160px desktop, 96px mobile. If it feels too sparse, it is close to right. **Exception, added 2026-07-31: the homepage runs tighter than this.** Measured on the real page, these values put a full empty screen between homepage sections, and readers took that as the end of the page and stopped scrolling. Home gets its own reduced section spacing (5.1); long-form text pages keep the full measure.
- Asymmetry over grids, **with two named exceptions added 2026-08-01.** The preference stands as the default and still governs the services list, the project-detail collage, and the journal index's single centre offset. It does **not** govern the portfolio any more: the portfolio grid on Home and on `/portfolio` is a **uniform grid** — equal boxes, one aspect ratio, one baseline, aligned captions (5.1, 5.2). Varied offsets need four to six items before they read as intent; below that they read as scattered, which is what two projects at two different heights actually looked like. Revisit if the portfolio ever carries six real projects.
- **No page may present only a photograph above the fold (added 2026-08-01, standing requirement).** At 1280px wide, the first viewport of every page must contain something other than an image: a heading, a line of text, a partially visible next element, or an explicit scroll cue. This is Kristen Hitch's overarching structural note from the July 31 review — the site assumes people will scroll and they will not — and it is a rule, not a one-off fix. It applies to every page that exists now and every page added later. The homepage hero is the one deliberate near-exception and it satisfies the rule anyway: the wordmark, the three word links, the CTA, and the scroll cue are all in the first viewport over the image.
- Navigation is a thin horizontal line. Transparent over the hero, solid on scroll. No dropdowns, no search icon, no phone number in the header.

## 3.6 Structural devices

Only use structure that encodes something true.

- **Numbered steps appear on the Process page and nowhere else,** because that is a real ordered sequence.
- **Spec blocks appear on project detail pages.** Treatment type, fabric house, lining, hardware, rooms. Set in the Label style. This is the vernacular of her trade and it proves expertise to a reader who knows what those words mean.
- No decorative eyebrows. If a label does not name something real, delete it.

## 3.7 The signature element

**Every image on this site reveals the way a window treatment reveals a room.**

Images enter the viewport with a `clip-path: inset()` animation. The top edge stays fixed and the bottom edge descends, exactly like a roller shade being lowered or a drape opening. The image itself starts slightly raised and scaled and settles as the clip completes, so it reads as a room being revealed rather than a picture sliding in.

```css
/* resting state */
clip-path: inset(0 0 100% 0);
transform: translateY(-6%) scale(1.04);

/* revealed */
clip-path: inset(0 0 0 0);
transform: translateY(0) scale(1);
transition: clip-path 1100ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 1400ms cubic-bezier(0.22, 1, 0.36, 1);
```

This is the one memorable thing about the site. Everything else stays quiet so this can land. Do not add competing effects.

---

# 4. Site architecture

```
/                      Home
/portfolio             Portfolio index
/portfolio/[slug]      Project detail
/services              Services overview
/services/drapery      Custom Drapery
/services/blinds-shades  Blinds and Shades
/services/upholstery   Upholstery
/services/soft-furnishings  Pillows, Cushions, and Soft Furnishings
/about                 About, origin story, Studio
/process               Process
/journal               Design Journal index
/journal/[slug]        Journal post
/contact               Consultation form
/cincinnati            Location page
/northern-kentucky     Location page
/blinds                Standalone blinds landing page (unlinked, ad traffic)
/404
```

Location pages exist for search only and live in the footer, not the main nav. **They do not conflict with the no-geography project naming rule.** Project names are placeless for brand reasons. The site still has to be findable.

**`/blinds` is a standalone landing page for paid traffic (added 2026-07-31).** Blinds and shades is the growth category (5.3) and the one most likely to get targeted ad spend. This page is a single-purpose destination for that traffic and it carries one job — take an ad click to the discovery call. It is not a doorway page in 8.4's sense: it targets a product category rather than a place, and there is exactly one of it.

**`/blinds` is now IN the main nav (revised 2026-08-01, Sam's instruction).** This reverses the line above, which said the page "does not appear in the main nav or the footer" and that being unlinked "is intentional, not an oversight." It is linked from both now, as `Blinds`, positioned directly after `Services` so the two "what she does" entries sit together. The label is deliberately not "Blinds and Shades": a seven-item row cannot afford a three-word label. Its job as an ad landing page is unchanged — it is simply no longer unlinked.

**`/signature-pieces` is removed (2026-07-31).** It was never a brief requirement — an interpretation call added 2026-07-26 as a placeholder for eventual e-commerce. The review cut it: a placeholder shop showing two pillows with no way to buy anything reads as an unfinished store rather than as portfolio work. Full e-commerce (a Shopify-style backend, stock fabric and pillow ordering) is logged as **revisit later, not active scope** — see BUILD-PLAN.md's decision log. Do not rebuild this page unless that decision gets made deliberately.

Main nav, **seven items as of 2026-08-01**: Portfolio, Services, Blinds, About, Process, Journal, Contact. This raises the previous hard cap of six, on Sam's instruction, to admit `/blinds`. Treat seven as the new ceiling — the row was already the tightest thing in the site chrome, and adding the seventh item required moving the horizontal nav's breakpoint from 768px to 900px (below that it is the hamburger panel) because the seven-item row overflowed a 768px viewport by 61px. An eighth item does not fit at any width worth supporting.

The footer's "Site" column mirrors this list exactly and is fed by the same array (`src/data/nav.ts`).

---

# 5. Page specifications

## 5.1 Home

**Section order (REVISED 2026-07-31, Kristen/Amy/Sam review):** hero, then
**Portfolio → Services → About**, then testimonials, then contact. The site
leads with the work, not with who made it. The differentiator block ("A
Designer's Eye, A Workroom's Understanding") is the About section and now sits
*after* Services rather than between Portfolio and Services.

**Two rules that apply to every homepage section, added in the same review:**

1. **A visible section header on every card.** Portfolio, Services, About,
   and the testimonial section each get a real, visible heading so a reader
   scrolling always knows which section they are in. Several of these were
   previously `visually-hidden` headings that existed only for screen readers
   and heading order — that failed sighted readers, who hit an unlabelled wall
   of images.

   **Sized up 2026-08-01.** Label style at its literal 11px in `--ink-muted`
   did not accomplish what these were added for — at that size they read as
   captions, and a caption is something a reader skips. They now render at
   **14px at 375px, 18px at 1280px and up, in `--ink`**, still uppercase, still
   0.18em tracked, still weight 500: the Label role at a larger size, not a
   different treatment and not a fourth type role. They must stay clearly
   subordinate to the display headings beneath them (36–92px), which they are
   by size alone. Every homepage section label uses the identical treatment;
   `/blinds`' one section marker shares it, being the same element doing the
   same job.
2. **One CTA button per section, maximum.** Duplicate `View Portfolio`
   buttons are removed; the single portfolio link lives in the Portfolio card
   slot and nowhere else. Two competing buttons in one viewport split the
   click rather than doubling it.

**Section 1: Hero.**

- Full viewport height. The image fills the entire screen.
- The only thing above it is the navigation line. No headline block, no descriptor paragraph, no stacked copy. Amy was explicit and repeated it.
- **No location line in the hero (REVISED 2026-07-31).** The `Cincinnati/NKY Based` / `Serving all areas` block is removed. Geography belongs at the foot of the page, not stamped over the first photograph — it was the only text competing with the image, and the hero's whole job is the image. The service area now reads as one footer line: `Serving Cincinnati and Northern Kentucky since [DATE — ask Amy]`. See 5.8.
- **The hero photograph is the wide room frame with drapery and a banded roman shade on a wall of French doors opening onto the pool and patio** — `portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg` (changed 2026-08-01, replacing the Ivory House living-room frame). That photograph was the full-bleed lead image on `/about` until this change; `/about` now deliberately has no lead image rather than an arbitrary substitute, and is the one page on the site without one.
- **`Amy K Clark Design` is anchored to the bottom of the frame, not centred in it (revised 2026-08-01).** It was centred, white, and set in the Display role at up to 92px, and it was nearly invisible: the vertical centre of a room photograph is the wall, the wall is the brightest thing in the picture, and the middle of the wordmark disappeared into it while the ends stayed readable. The treatment is now **Amy's own stated direction from the July 31 review, which had never been written down here**: all caps, wide letter-spacing, thinner, anchored to the top or bottom of the frame rather than floating in the dead centre.

  In practice that is the **Label role (3.4) scaled up** — uppercase with the tracking opened to 0.26em, at weight 400 rather than Label's 500, which is the lighter of the two weights 3.4 permits. It is deliberately far below the Display clamp: a mark that has to survive an arbitrary photograph behind it wants to be small, wide, and dense rather than large and open. Going below weight 400 was considered and rejected on the merits, not on the rule — sub-400 strokes in light type over a busy image are exactly what disappears, which is the defect being fixed.

  Use a subtle scrim gradient rather than a hard overlay so the image stays clean. There is exactly one gradient in the whole bundle and this is it; its lower ramp is deepened to cover the band the wordmark, the word links, and the CTA now occupy. Measured against the composited image, the worst pixel across the full glyph band gives 4.73:1 at 375px and 4.90:1 at 1280px.

  **None of this is the final wordmark.** Amy is still choosing between three candidate typefaces and that decision is logged as blocking in ASK-AMY.md. This is a legibility fix using the existing typeface.
- Three plain word links along the bottom: **Upholstery, Drapery, Shades**. Label style.
- **One CTA only (REVISED 2026-07-31):** the primary booking CTA (5.9). The secondary `View Portfolio` button is removed from the hero — the Portfolio section is the very next thing on the page and carries its own link.
- A small quiet scroll cue at the very bottom.

**The gallery.** Build it as a component that accepts an array. A one-item array gives a static hero for free, which keeps the static-versus-gallery question reversible.

- One image on screen at a time. Never two. Amy was explicit.
- Cross-fade only. No sliding, no horizontal movement, no swipe.
- 6.5s hold, 1.4s dissolve.
- See section 6.1 for the dissolve treatment.

**The opening line.** `The little details make all the difference.` appears over the first frame, fades in at 400ms, holds 2.5s, fades out over 900ms as the second image arrives. Once per session, stored in sessionStorage. Amy's own idea and the best one in the meeting.

**Section 2: Portfolio.** Visible heading. Four to six projects, shade-reveal on scroll. Project name in Label style beneath each. **One** link to the full portfolio — this is the site's only `View Portfolio`-style button.

**Uniform grid, not asymmetric (revised 2026-08-01).** Equal-size boxes on a shared baseline, one 4:5 aspect ratio, captions aligned; two columns from 700px up, capped so a two-up grid does not turn each card into a 580px-wide billboard. This supersedes "asymmetric" here and the same treatment applies to `/portfolio` (5.2), defined once so the two pages cannot drift. Reasoning is in 3.5: the offsets need four to six items to read as intent and the site has two.

**Two placeholder cards are live on both pages and must not ship.** "Placeholder Project 01" and "Placeholder Project 02" — tinted grey blocks, no photograph, no invented room or fabric or client, no detail pages, not in the sitemap. They exist only so the four-card two-row layout can be reviewed before real projects three and four arrive. LAUNCH_CHECKLIST.md §1.

**Section 3: Services.** Visible heading. Four entries in this order: Custom Drapery, Blinds and Shades, Upholstery, Soft Furnishings. Name and one line each. Not a card grid with icons. (Moved ahead of the differentiator 2026-07-31.)

**Section 4: About / the differentiator.** Visible heading. Heading: `A Designer's Eye, A Workroom's Understanding`. Body underneath uses Amy's own framing about designing, fabricating, and installing, and the line that a decorator does not make anything. Short. Two sentences. (Moved below Services 2026-07-31 — the page leads with work, not with who made it.)

**Two columns: copy left, portrait of Amy right (added 2026-08-01).** The section label spans the full width; beneath it the heading and body sit in the left column and a 4:5 portrait sits in the right, capped at 24rem and pushed to the right edge. Her name and role sit beneath the portrait in the Studio row's existing pattern. It collapses to one column below 900px, copy above portrait — DOM order is copy first, so a screen reader meets the section's actual content before the image.

**The portrait is currently a clearly-marked placeholder slot**, sized and positioned exactly as the real photo will be. It is replaced, not deleted, when a headshot lands. Note that a real professional headshot of Amy already exists in the repo and is live in the `/about` Studio row — see IMAGE-MANIFEST.md and LAUNCH_CHECKLIST.md §1.

**Scroll behaviour on Home is settled and there is no scroll snapping.** The hero's one-time auto-scroll is the whole of it. See 6.9 — that section is now a closed decision, not a specification.

**Section 5: Testimonials.** **Two quotes visible at once**, Newsreader light, large, attributed by first name and last initial only. No stars, no cards, no avatars. The first slot is fixed and never changes — it is the anchor. The second slot rotates through more than two real quotes over time, cross-dissolving on section 6.1's timing, so the section shows two at a time but draws on a larger pool. (Amended 2026-07-27; this line previously read "Two quotes maximum," which the rotation would otherwise contradict.)

**The section heading is `What Our Clients Say About Working With Us`, and it is visible** (2026-07-31). It was previously a `visually-hidden` "What Clients Say." **Never use the word "testimonials" as a visible label** — it names the marketing device rather than the thing itself, and it reads as an invitation to skip.

**Section 6: Contact.** One line and one button to the booking funnel (5.9).

**Footer.** Navigation, Instagram and Facebook links, contact, service area line (5.8).

**Vertical rhythm on Home (REVISED 2026-07-31).** 3.5's generous section spacing was measured on the page and judged too generous *between homepage sections specifically*: the gaps were large enough that a reader hit an empty screen and read it as the end of the page rather than as a pause. **Reduce the vertical space between homepage sections** so each section's top edge is visible while the previous one is still in view. This is a Home-specific override of 3.5's 160px/96px, not a change to the token everywhere — long-form text pages still want the full measure.

## 5.2 Portfolio

Index is a **uniform grid** — equal boxes, one 4:5 ratio, one baseline, aligned captions, identical to Home's portfolio section (5.1) and defined once so the two pages cannot drift. Project name only. No teaser copy. **This replaces "an asymmetric image list" (revised 2026-08-01); the reasoning is in 3.5.** The two placeholder cards named in 5.1 render here too, so the two pages match in content as well as layout, and must be removed before launch.

**Detail pages (REVISED 2026-07-31).** Each project gets:

- A **short evocative, non-identifying name** — Ivory House, Collected Living Room. This rule already existed and is reaffirmed: no client name, no street, no city.
- A **brief problem/solution blurb**: what the room needed, and what Amy did about it. Two or three sentences. This is new — the previous detail page had scope and a spec block but never said what problem the work solved.
- **A tight, small collage of images — not a long photo scroll.** This is the substantive change. Detail pages were running eight-plus supporting images in a full-width vertical stack, which asks the reader to scroll through a gallery to reach the point. Trim each project to a small set of frames arranged as a compact collage. The previous "three to eight supporting images" instruction is superseded; fewer, tighter, and arranged rather than stacked.
- The spec block, unchanged.
- **State Amy's scope explicitly on every project** so the site never implies she designed the whole house. Unchanged and still non-negotiable.
- **The title block sits ABOVE the lead image (added 2026-08-01):** a `Portfolio` eyebrow that links back to the index, then the H1, then the full-bleed photograph. The page previously opened on the photograph with the H1 below both it and the collage, which put zero words in the first viewport at 1280x800 — a direct failure of 3.5's scroll-affordance rule. This is the same shape the journal post template uses, deliberately, so the site has one pattern for article-shaped pages rather than two.

Names are evocative and non-geographic. No leading "The." Garden Room, Blue Study, Collected Living Room.

## 5.3 Services

Overview page plus four child pages. Each child page targets its own keyword cluster and gets its own title, meta description, H1, and 400 to 700 words of real copy.

**Service names are all the same size and weight (added 2026-07-31).** Every service name on the services page renders at an identical font size and font weight. The staggered *layout position* — the varied left indents that give the list its asymmetry per 3.5 — **stays and is explicitly fine.** What is not fine is size hierarchy: rendering Custom Drapery larger than Soft Furnishings tells a reader that one service matters more than another, which is not true and not the message. Vary the position, never the scale.

**The service area is named on this page (added 2026-07-31).** Cincinnati and Northern Kentucky appear naturally in the overview copy. Same requirement on About (5.4) and as a note on the contact form (5.7). This is the geography that came out of the hero — it belongs where someone is actually deciding whether Amy covers them.

**Blinds and Shades** is the growth category and needs the most attention:

- Lafayette Interior Fashions is the sole source. Full catalog: blinds, shades, shutters, woven woods.
- Expanding sections for the decision categories: light and glare control, privacy, motorization, child safety, room-by-room guidance.
- **Animate the expansion.** Amy specifically asked that they open smoothly rather than snap. Use `grid-template-rows: 0fr` to `1fr`, 420ms, `cubic-bezier(0.4, 0, 0.2, 1)`. Never animate `height: auto`.
- Roman shades stay in the copy as a searchable term but route to manufactured product, not to Amy's workroom.

`/blinds` (section 4) is a separate, unlinked landing page for ad traffic and is **not** a replacement for this child page. This one is the site's real blinds-and-shades content and stays in the nav and the sitemap.

## 5.4 About

1. Amy's story. Specific, not vague. It needs actual detail about what she made and for whom.
2. **Where it started.** The origin section, anchored to Grandma's attic, with an early photograph of Amy.
3. The invention framing: every window shade she makes, she is inventing. She adapts to the room. There are no guides.
4. Fabric lines: Schumacher, Stout, Pollack. **Schumacher is cleared and may be named.** Stout and Pollack use the "the lines she represents" phrasing until each is individually cleared.
5. **The service area is named on this page** (added 2026-07-31): Cincinnati and Northern Kentucky, worked into the copy rather than bolted on. Same requirement as 5.3 and 5.7.
6. **Studio.** Three portraits in a row.

```
Amy Clark        Founder
Sam Clark        Web Development and Digital Strategy
Kelsee Etmans    Photographer
```

Headshots from `/public/images/team/`. Name in Label style, role beneath in `--ink-muted`. No biography paragraphs. Section heading is `Studio`, not `Our Team`.

## 5.5 Process

**Five numbered steps as of 2026-08-01**, revised from four. This is the only page where numbering is permitted.

1. Complimentary discovery call
2. In-home design consultation
3. Design and sourcing
4. Fabrication and coordination
5. Installation and finishing

**Why this changed.** The page opened at "Consultation" and never named the discovery call, so nothing on it conveyed that 5.9's two-step funnel exists, that the call and the consultation are different things, or that both happen. Steps 1 and 2 are now 5.9's two steps under their full names; the other three keep the names this section has always given them and should not be renamed without checking here first. 5.9 is newer and more specific than the original four-step list, from the same July 31 review, so it wins.

**The distinction between steps 1 and 2 must be unmistakable and must never be drawn with money.** Step 1: complimentary, by phone, short, Amy has seen photos of the space beforehand, nothing is measured or designed. Step 2: in the client's home, about three hours, where the project actually gets decided, and it comes after the call rather than instead of it.

**No fee, no amount, and no cost framing anywhere on this page** — rule 1, 5.9, and §10's acceptance checkbox all apply, and earlier passes caught five rule-1 violations that named no figure and were still cost framing. "Complimentary" on step 1 is the site's own sanctioned word (it is the primary CTA's wording). Do not add "paid", "free", "no charge", or a figure to step 2 to sharpen the contrast. `/contact` remains the only page that describes the in-home visit as paid.

## 5.6 Design Journal

Markdown-driven. **Ship with at least three posts.** An empty journal is worse than no journal.

Launch posts, all of which serve search and all of which came out of Amy's own material:

- How to read a fabric: weight, weave, and how it will actually hang
- Drapery, shades, or blinds: how to decide room by room
- What actually makes a window treatment look expensive

Each post internally links to at least one service page.

**Index layout: alternating, with the middle entry offset (set 2026-08-01).** Three cards in a row, outer two aligned on a shared baseline, the middle one dropped by a single restrained 3rem. Three columns from 900px up, one column below, and the offset applies only in the three-column layout. **Do not use the services list's progressive stagger here** — that was what this replaced, and with three entries it left no two cards aligned with each other, which reads as a mistake rather than as a composition. The alternating version is symmetric, so a reader resolves it as intent; three is exactly the count where that works. It is also the only asymmetry left on the site now that the portfolio grid is uniform (3.5).

**Post pages open with the eyebrow, the H1, a one-line standfirst, and the date, then the lead image.** The standfirst is the post's own `description` — the same string the index card shows — not a second piece of copy. It exists because the 16/9 lead is 720px tall at 1280px, which put the first line of prose 880px below the title with nothing in between saying what the post was about.

## 5.7 Contact

**This is a qualification form, not a booking link.** Its job is to filter.

Fields:

| Field | Type | Required |
|---|---|---|
| Name | text | yes |
| Email | email | yes |
| Phone | tel | no |
| Location | text | yes |
| Tell us about your room | textarea | yes |
| Tell us about you | textarea | no |
| Project type | multi-select: drapery, blinds and shades, upholstery, soft furnishings, whole home, not sure | yes |
| Budget | select, ranged: under $2,500, $2,500–$7,500, $7,500–$20,000, $20,000–$50,000, $50,000+, I'd like Amy's guidance on this | **yes** |
| Timeline | select | no |
| Photos | file upload, multiple | no |
| How did you hear about us? | select: Google search, Instagram, Facebook, Referred by a friend or family member, Referred by a designer or builder, Saw my work in a home, Houzz, Other | yes |

Above the form, a short paragraph explaining what the consultation is and that it is a paid in-home visit. **Do not say the fee credits toward the project.** Do not apologize for the fee. **Do not state the amount. Ever.** See 5.9.

The form also carries a short note naming the service area — Cincinnati and Northern Kentucky — so someone filling it in knows before they finish whether Amy covers them (added 2026-07-31, same requirement as 5.3 and 5.4).

Below the form, the FAQ. Frame every answer around the value Amy provides. No price answers.

## 5.8 Footer

Navigation, Instagram and Facebook links, contact, and **one service-area line**:

```
Serving Cincinnati and Northern Kentucky since [DATE — ask Amy]
```

Added 2026-07-31, replacing the hero's location block (5.1). The year is an
open question in ASK-AMY.md and **the placeholder must not ship** — a "since"
with no year is worse than no line at all.

The footer CTA line reads **`Let's Get Started`**, not "Ready to start your
project?" (2026-07-31). Shorter, and it is an invitation rather than a
question the reader can answer "no" to.

**Service Areas column: removed** (2026-07-29). `/cincinnati` and
`/northern-kentucky` still exist and stay in the sitemap; they are simply not
linked from the footer any more.

**The phone number is not Amy's real number (2026-07-31).** Her personal
mobile must not be published. The footer carries a **placeholder for a Google
Voice business number, which does not exist yet** — obtaining it is a launch
task (LAUNCH_CHECKLIST.md). Until it does, no phone number renders as a real,
dialable number anywhere on the site, including in the LocalBusiness JSON-LD.

## 5.9 The booking funnel

**Booking is two steps, and the site's job is step one** (added 2026-07-31).
This replaces the previous single "Schedule a Consultation" ask.

| | What it is | Cost | Where |
|---|---|---|---|
| **Step 1** | **Complimentary Discovery Call** | Free | Phone |
| **Step 2** | **In-Home Design Consultation** | Paid | In person, roughly 3 hours |

**The primary site-wide CTA is `Schedule your complimentary discovery call`.**
That exact framing everywhere a booking CTA appears: hero, contact band,
service pages, the blinds landing page. "Complimentary" and "call" both do
real work — they lower the commitment of the first step, which is the whole
reason for splitting the funnel.

Step 2 is described on `/contact` as what comes after the call. It is a paid,
roughly three-hour, in-person design visit. 5.7's rules all still apply to it:
never say the fee credits toward the project, never apologize for it.

**The consultation fee amount does not go on the site.** The figure discussed
in the 2026-07-31 review is for Amy's internal reference and for a future
automated confirmation email only. **It must not appear in any visible copy,
any meta tag, or any comment in this repo.** If it ever shows up in the build,
that is a defect — flag it to Sam rather than publishing it.

**Not yet built, deliberately:** the calendar booking tool for the discovery
call (Calendly vs. Google Calendar is an open question in ASK-AMY.md) and the
automated confirmation email. Both are backend decisions still pending. CTAs
route to `/contact` in the meantime and the components carry marked TODOs.

---

# 6. Motion specification

All of this is vanilla JavaScript. No animation library.

## 6.1 Hero cross-dissolve

Two stacked layers, opacity cross-fade over 1.4s. At the midpoint, the outgoing layer briefly lifts to `filter: brightness(1.06)` and returns. This reads as light passing through a sheer rather than a flat opacity blend. The effect should be barely perceptible. If a viewer can describe it, it is too strong.

Each image also runs a continuous scale from 1.0 to 1.055 across its full cycle. Slow enough that it registers below conscious attention.

## 6.2 Shade reveal

IntersectionObserver at `rootMargin: "-10% 0px"`, `threshold: 0.15`. Fires once per element. Stagger siblings by 90ms. See section 3.7 for the values.

## 6.3 Navigation

Transparent over the hero. On scroll past 80vh, background transitions to `--paper` with a hairline bottom rule and `backdrop-filter: blur(12px)`. 300ms.

## 6.4 Portfolio hover

Image scales 1.0 to 1.03 over 700ms `ease-out`. Caption rises 8px and its opacity goes 0.6 to 1. Nothing else.

## 6.5 Accordion

`grid-template-rows` 0fr to 1fr, 420ms. Chevron rotates 180 degrees over the same duration. Content opacity fades in over the final 200ms.

## 6.6 Links

Underline draws left to right using a pseudo-element and `transform: scaleX()`, 300ms, in `--indigo`. Never `text-decoration` toggling.

## 6.7 Images

Native lazy loading below the fold. Blur-up placeholder from a 20px-wide inline base64 version. Explicit width and height on every image to prevent layout shift.

## 6.8 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Plus: hero gallery advances by instant swap, shade reveals render fully visible on load, no scale on hover, **and the hero's one-time auto-scroll does not run at all (6.9).**

## 6.9 Scroll behaviour — SETTLED, do not revisit

**Closed decision, 2026-08-02.** Scroll behaviour on this site is one thing
and one thing only:

**The hero's one-time auto-scroll.** From a fresh load at the very top, the
first real downward scroll past a 40px threshold eases the rest of the way
into the first section and then removes its own listener. It fires **at most
once per page view**, never scrolls backward, and is disabled entirely under
`prefers-reduced-motion`. Implementation and full spec: `initHeroScrollEase()`
in `src/scripts/motion.js`, plus `.scroll-ease-target` in `global.css`.

**There is no section-level scroll snapping, anywhere, and there is not going
to be.** `scroll-snap-type` appears nowhere in the codebase.

**Do not add, extend, or re-propose scroll snapping unless Sam asks for it in
so many words.** This is not a preference to be weighed against a better
implementation. It has now been built and removed twice — once on 2026-07-25,
and again on 2026-08-02 after Sam evaluated the 2026-08-01 build on real
hardware. Both implementations measured correctly; measuring correctly was
never the question. It is the wrong feel for this site and for an audience the
brief puts at 40 to 85, and Kristen Hitch's accessibility objection from the
July 31 review still stands unanswered.

The same instruction is recorded in BUILD-PLAN.md's decision log and in
CLAUDE.md's session rules. It is in three places because it has come back
twice already.

---

# 7. Technical stack

**Astro**, static output. No React, no client-side framework.

Reasons: it emits plain HTML, which is the fastest thing to serve and the easiest thing for Google to index; it has a first-class image pipeline, which matters on a photography-led site; its content collections handle the Journal in markdown; and it leaves behind a codebase that a non-developer can be walked through after Sam leaves for college.

- Styling: plain CSS with custom properties. No Tailwind. Tailwind's defaults pull the design toward the template look this brief is trying to escape.
- Images: `astro:assets` with AVIF and WebP output, `srcset` at 480, 768, 1200, 1800, 2400.
- Fonts: self-hosted `.woff2`, `font-display: swap`, preload the two used weights.
- Forms: Netlify Forms or Formspree, with a honeypot field and server-side validation.
- Hosting: **Cloudflare Pages or Netlify. Not GoDaddy hosting.** The domain stays at GoDaddy; DNS points elsewhere. See the launch checklist.
- Repo: GitHub, with the deploy wired to the main branch.

---

# 8. SEO requirements

This site must be findable. Treat this section as build requirements, not suggestions.

## 8.1 Technical

- One `<h1>` per page. Logical heading order with no skipped levels.
- Unique `<title>` under 60 characters and `<meta name="description">` under 155 characters on every page.
- Canonical tag on every page.
- Open Graph and Twitter card tags with a dedicated 1200x630 image.
- `sitemap.xml` generated at build, `robots.txt` referencing it.
- Image filenames are descriptive and hyphenated. `pleated-linen-drapery-hyde-park-living-room.jpg`, never `IMG_4432.jpg`.
- Alt text on every image describing the treatment, the fabric, and the room.
- Target Lighthouse mobile: Performance 95+, Accessibility 100, Best Practices 100, SEO 100.
- LCP under 1.8s on 4G. The hero image is the LCP element, so preload it and do not lazy-load it.
- No layout shift. Explicit dimensions everywhere.

## 8.2 Structured data

`LocalBusiness` JSON-LD on the homepage, extending `HomeAndConstructionBusiness`:

```
name, image, @id, url, telephone (omit until the Google Voice
  number exists — 5.8: Amy's real number is not published),
priceRange (omit),
address: PostalAddress,
geo: GeoCoordinates,
areaServed: [Cincinnati OH, Northern Kentucky, Hamilton County, Kenton County, Boone County, Campbell County],
sameAs: [Instagram, Facebook, Google Business Profile],
openingHoursSpecification,
hasOfferCatalog listing the four services
```

Plus `BreadcrumbList` on nested pages, `Article` on Journal posts, and `FAQPage` on the FAQ.

## 8.3 Keyword targets by page

| Page | Primary target |
|---|---|
| Home | custom window treatments Cincinnati |
| /services/drapery | custom drapery Cincinnati, custom curtains Cincinnati |
| /services/blinds-shades | custom blinds Cincinnati, custom shades Northern Kentucky, Lafayette blinds Cincinnati |
| /services/upholstery | custom upholstery Cincinnati |
| /services/soft-furnishings | custom pillows and cushions Cincinnati |
| /cincinnati | window treatments Cincinnati OH |
| /northern-kentucky | custom drapery Northern Kentucky |
| /blinds | custom blinds Cincinnati (paid-traffic landing page, section 4) |

Do not stuff. Each term should appear in the title, the H1, once naturally in the first paragraph, and in the meta description. That is enough.

## 8.4 The local lever

The highest-value untapped opportunity is neighborhood-level content. Amy's clients are concentrated in specific affluent areas and almost nobody is competing for those terms:

Hyde Park, Indian Hill, Mariemont, Terrace Park, Wyoming, Anderson Township, Fort Mitchell, Fort Thomas, Villa Hills, Crestview Hills, Union, Edgewood.

**Do not build twelve thin doorway pages.** Google penalizes that. Instead, name these areas naturally within the two location pages and in project copy where accurate.

---

# 9. Assets and placeholders

**Before writing any page code, inventory `/public/images/` and produce a manifest** mapping every real file to the slot it fills. Report anything that is still unfilled.

Expected structure:

```
/public/images/
  hero/         full-bleed homepage images, landscape, 2400px wide minimum
  portfolio/    grouped by project slug
  team/         amy-clark.jpg, sam-clark.jpg, kelsee-etmans.jpg
  about/        origin and workroom images
  journal/      post images
  og/           social share image
```

**Use real images everywhere. Do not leave grey boxes or `placeholder.jpg`.** If a slot has no matching file, reuse the closest real image and record the substitution in the manifest so it can be swapped later. The point is that Amy can look at the site and see where the media goes.

---

# 10. Acceptance criteria

The build is done when all of the following are true:

- [ ] Homepage opens to a full-screen image with nothing above it but the nav line
- [ ] Gallery shows one image at a time and cross-fades, with no sliding motion
- [ ] The opening line fades in and out over the first frame, once per session
- [ ] Every image on the site enters with the shade reveal
- [ ] Two typeface families in three roles, and no others
- [ ] `--indigo` appears only on focus rings and hover underlines
- [ ] No cream, no terracotta, no gradient, no icon library, no emoji, no border-radius above 2px
- [ ] Zero pricing language anywhere in the codebase, including comments
- [ ] **The consultation fee amount appears nowhere** — not in copy, not in a meta tag, not in a comment (5.9)
- [ ] **All visible copy is third person** (Amy/she), testimonials excepted
- [ ] **Homepage order is Portfolio → Services → About**, every section has a visible heading, and no section carries two CTA buttons
- [ ] **Every booking CTA reads `Schedule your complimentary discovery call`**
- [ ] **All service names render at identical size and weight**; only their indents vary
- [ ] **No phone number resolves to Amy's personal mobile**, on the page or in JSON-LD
- [ ] **`/signature-pieces` returns 404 and is linked from nowhere**
- [x] The footer's "since" line carries a real year, not the placeholder — **2021, resolved 2026-08-01**
- [ ] **No page presents only a photograph above the fold** (3.5). At 1280px the first viewport of every page carries a heading, a line of text, a partially visible next element, or a scroll cue
- [ ] **The hero wordmark is legible over the photograph at 375px and 1280px** — all caps, letter-spaced, anchored to the bottom of the frame, on a scrim
- [ ] **The two placeholder portfolio entries are gone**, and the About section's portrait placeholder has been replaced with a real photograph
- [ ] **`scroll-snap-type` appears nowhere in the codebase**, and the hero's one-time auto-scroll is the only scroll behaviour on the site (6.9)
- [ ] **The Process page names the discovery call and the in-home consultation as separate steps, in that order, with no cost framing on either** (5.5)
- [ ] Consultation form requires budget and attribution
- [ ] Blinds accordion animates smoothly
- [ ] Studio section renders three real headshots
- [ ] Vendor copy names only vendors cleared for public naming (currently Schumacher and Lafayette), covers the rest under "the lines she represents," makes no unconfirmed relationship claim such as "dealer," and never names William Morris
- [ ] No project name contains a city, a state, a client name, or a leading "The"
- [ ] Three Journal posts exist with real content
- [ ] Every image has descriptive alt text and a descriptive filename
- [ ] `LocalBusiness` JSON-LD validates in Google's Rich Results Test
- [ ] `sitemap.xml` and `robots.txt` exist and are correct
- [ ] Lighthouse mobile: Performance 95+, Accessibility 100, SEO 100
- [ ] Keyboard navigable end to end with visible focus states
- [ ] `prefers-reduced-motion` disables all motion
- [ ] Renders correctly at 375px, 768px, 1440px, and 2560px
- [ ] No console errors or warnings

---

# 11. The standard

Amy K Clark Design sells a rare skill. She designs, makes, and installs, and almost nobody does all three. If the website looks like every other small business site, it contradicts the claim before anyone reads a word.

The test for any decision: **would this look at home next to the work of a fashion house Amy admires, or does it look like a template with her photos dropped in?**

Spend the boldness on the shade reveal and the full-screen opening. Keep everything else disciplined and quiet. Then take one accessory off.
