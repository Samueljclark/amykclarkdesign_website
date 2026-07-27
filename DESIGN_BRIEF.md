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

---

# 2. Non-negotiables

1. **No pricing.** No prices, no ranges, no "starting at," no "affordable," no budget talk of any kind in public copy.
2. **No claim that the consultation fee credits toward the project.** It does not.
3. **Never call Amy an interior designer or a full-service design firm.**
4. **No client names, no addresses, no cities in project names.**
5. **Banned words: calm, bespoke, elevated, curated, luxurious, transform, seamless, effortless, unlock, journey, passion for.**
6. **Approved words: tailored, considered, exclusive, personal, precise, finished.**
7. **Fabric lines are Schumacher, Stout, and Pollack. Blinds and shades are Lafayette Interior Fashions, sole source. Do not mention William Morris.** Naming in public copy is gated on clearance, per rule 8: **Schumacher is cleared and is named by name.** Stout and Pollack are real lines Amy carries but are **not cleared**, and are covered by "the lines I represent" until each is individually cleared. Lafayette may be named as the source for blinds and shades (8.3 makes it a keyword target), but **no formal relationship claim — "dealer," "authorized," "partner" — until Amy confirms it.**
8. **Do not use any vendor logo or trademark.** Use the phrase "the lines I represent" until permissions are confirmed.
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
- Vertical rhythm is generous to the point of feeling almost empty. Section spacing at 160px desktop, 96px mobile. If it feels too sparse, it is close to right.
- Asymmetry over grids. Portfolio images sit at varied scales and vertical offsets rather than in a uniform tile grid.
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
/services/blinds-shades  Blinds & Shades
/services/upholstery   Upholstery
/services/soft-furnishings  Pillows, Cushions & Soft Furnishings
/about                 About, origin story, Studio
/process               Process
/journal               Design Journal index
/journal/[slug]        Journal post
/contact               Consultation form
/cincinnati            Location page
/northern-kentucky     Location page
/404
```

Location pages exist for search only and live in the footer, not the main nav. **They do not conflict with the no-geography project naming rule.** Project names are placeless for brand reasons. The site still has to be findable.

Main nav, six items maximum: Portfolio, Services, About, Process, Journal, Contact.

---

# 5. Page specifications

## 5.1 Home

**Section 1: Hero.**

- Full viewport height. The image fills the entire screen.
- The only thing above it is the navigation line. No headline block, no descriptor paragraph, no stacked copy. Amy was explicit and repeated it.
- A short location line sits at the very top: `Cincinnati, Northern Kentucky, plus select travel projects`. Label style, 11px, quiet.
- `Amy K Clark Design` centered over the image, semi-transparent, legible over photography. Use a subtle scrim gradient rather than a hard overlay so the image stays clean.
- Three plain word links along the bottom: **Upholstery, Drapery, Shades**. Label style.
- The two existing CTAs stay. Primary is `Schedule a Consultation`, secondary is `View Portfolio`.
- A small quiet scroll cue at the very bottom.

**The gallery.** Build it as a component that accepts an array. A one-item array gives a static hero for free, which keeps the static-versus-gallery question reversible.

- One image on screen at a time. Never two. Amy was explicit.
- Cross-fade only. No sliding, no horizontal movement, no swipe.
- 6.5s hold, 1.4s dissolve.
- See section 6.1 for the dissolve treatment.

**The opening line.** `The little details make all the difference.` appears over the first frame, fades in at 400ms, holds 2.5s, fades out over 900ms as the second image arrives. Once per session, stored in sessionStorage. Amy's own idea and the best one in the meeting.

**Section 2: Portfolio.** Four to six projects, asymmetric, shade-reveal on scroll. Project name in Label style beneath each. One link to the full portfolio.

**Section 3: The differentiator.** Heading: `A Designer's Eye, A Workroom's Understanding`. Body underneath uses Amy's own framing about designing, fabricating, and installing, and the line that a decorator does not make anything. Short. Two sentences.

**Section 4: Services.** Four entries in this order: Custom Drapery, Blinds & Shades, Upholstery, Soft Furnishings. Name and one line each. Not a card grid with icons.

**Section 5: Testimonials.** **Two quotes visible at once**, Newsreader light, large, attributed by first name and last initial only. No stars, no cards, no avatars. The first slot is fixed and never changes — it is the anchor. The second slot rotates through more than two real quotes over time, cross-dissolving on section 6.1's timing, so the section shows two at a time but draws on a larger pool. (Amended 2026-07-27; this line previously read "Two quotes maximum," which the rotation would otherwise contradict.)

**Section 6: Contact.** One line and one button to the consultation form.

**Footer.** Navigation, location pages, Instagram and Facebook links, contact, service area line.

## 5.2 Portfolio

Index is an asymmetric image list. Project name only. No teaser copy.

Detail pages: a lead image, three to eight supporting images, a short paragraph on what the room needed and what Amy did, and a spec block. **State Amy's scope explicitly on every project** so the site never implies she designed the whole house.

Names are evocative and non-geographic. No leading "The." Garden Room, Blue Study, Collected Living Room.

## 5.3 Services

Overview page plus four child pages. Each child page targets its own keyword cluster and gets its own title, meta description, H1, and 400 to 700 words of real copy.

**Blinds & Shades** is the growth category and needs the most attention:

- Lafayette Interior Fashions is the sole source. Full catalog: blinds, shades, shutters, woven woods.
- Expanding sections for the decision categories: light and glare control, privacy, motorization, child safety, room-by-room guidance.
- **Animate the expansion.** Amy specifically asked that they open smoothly rather than snap. Use `grid-template-rows: 0fr` to `1fr`, 420ms, `cubic-bezier(0.4, 0, 0.2, 1)`. Never animate `height: auto`.
- Roman shades stay in the copy as a searchable term but route to manufactured product, not to Amy's workroom.

## 5.4 About

1. Amy's story. Specific, not vague. It needs actual detail about what she made and for whom.
2. **Where it started.** The origin section, anchored to Grandma's attic, with an early photograph of Amy.
3. The invention framing: every window shade she makes, she is inventing. She adapts to the room. There are no guides.
4. Fabric lines: Schumacher, Stout, Pollack. **Schumacher is cleared and may be named.** Stout and Pollack use the "the lines I represent" phrasing until each is individually cleared.
5. **Studio.** Three portraits in a row.

```
Amy Clark        Founder
Sam Clark        Web Development & Digital Strategy
Kelsee Etmans    Photographer
```

Headshots from `/public/images/team/`. Name in Label style, role beneath in `--ink-muted`. No biography paragraphs. Section heading is `Studio`, not `Our Team`.

## 5.5 Process

Four numbered steps. This is the only page where numbering is permitted.

1. Consultation
2. Design and sourcing
3. Fabrication and coordination
4. Installation and finishing

## 5.6 Design Journal

Markdown-driven. **Ship with at least three posts.** An empty journal is worse than no journal.

Launch posts, all of which serve search and all of which came out of Amy's own material:

- How to read a fabric: weight, weave, and how it will actually hang
- Drapery, shades, or blinds: how to decide room by room
- What actually makes a window treatment look expensive

Each post internally links to at least one service page.

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

Above the form, a short paragraph explaining what the consultation is and that it is a paid in-home visit. **Do not say the fee credits toward the project.** Do not apologize for the fee. Do not state the amount until Amy confirms it.

Below the form, the FAQ. Frame every answer around the value Amy provides. No price answers.

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

Plus: hero gallery advances by instant swap, shade reveals render fully visible on load, no scale on hover.

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
name, image, @id, url, telephone, priceRange (omit),
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
- [ ] Consultation form requires budget and attribution
- [ ] Blinds accordion animates smoothly
- [ ] Studio section renders three real headshots
- [ ] Vendor copy names only vendors cleared for public naming (currently Schumacher and Lafayette), covers the rest under "the lines I represent," makes no unconfirmed relationship claim such as "dealer," and never names William Morris
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
