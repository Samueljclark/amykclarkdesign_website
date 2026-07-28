# Image Manifest

Per DESIGN_BRIEF.md section 9. Inventory taken 2026-07-24. Originals are preserved
untouched in `/source-photos/`; processed, descriptively renamed copies live in
`/public/images/`. The 19 generated placeholder textures from the v1 static site were
retired to `/legacy-static/images/` and are not used anywhere: the brief bans
placeholders, and they are not real photographs.

## Standing rule: real photos as placeholders, going forward

Every section that needs an image gets a current real photo in that slot — never a
blank image box, gray rect, or generated placeholder texture waiting for better
photography. This does not contradict the ban above: the brief bans *fake*
placeholders (generated textures, stock, anything that isn't a real photograph of
real work); a real photo standing in for a *better* real photo is fine, and is
already how the hero and portfolio-strip slots were filled in step 2 (see the
correction section below). Mark every stand-in clearly, in this file, as
"placeholder, swap when Kelsee's shoot lands" (or the equivalent — whatever photo it's
actually waiting on). Applies to Portfolio (step 3) and every step after; this note
exists so it doesn't need repeating each time.

## Real files → slots

| Slot | File | Source original | Size | Notes |
|---|---|---|---|---|
| team/ Amy | `team/amy-clark.jpg` | Amyheadshot.JPG | 1600x1072 | **Replaced 2026-07-27 and no longer a quality flag.** Real professional headshot — Amy in a navy dress against a white-painted brick wall, natural light, 1941x1300 original. Supersedes the 426x408 circle-cropped avatar previously in this slot. |
| team/ Sam | `team/sam-clark.jpg` | samheadshot.jpg | 888x1120 | Formal portrait, good quality. Blue studio backdrop sits oddly against `--paper`; consider a candid to match the other two later. |
| team/ Kelsee | `team/kelsee-etmans.jpg` | Kelseeheadshot.png | 399x384 | Same flag as Amy's: circle-cropped avatar, ~400px. Request original. |
| about/ workroom | `about/amy-hand-stitching-check-fabric-ottoman-cutting-table.jpg` | processpicture.png | 1144x1548 | Real workroom photo: hands stitching a check-fabric ottoman on the gridded cutting table. Strong for About (invention framing) and Process. |
| about/ studio life | `about/photo-shoot-leaded-glass-entry-door.jpg` | doorspicture.jpeg | 4284x5712 | Shoot-day photo through a leaded-glass entry. Correction applied, see note below. |
| about/ studio life | `about/photo-shoot-banded-roman-shade-living-room.jpg` | takingpicturepicture.jpeg | 4284x5712 | Kelsee shooting a client room with a banded roman shade — drapery, French doors, pool patio beyond. The only real interior showing an installed treatment. Correction applied, see note below. |
| og/ | `og/og-default.jpg` | derived from photo-shoot-banded-roman-shade-living-room.jpg | 1200x630 | Real (not placeholder) social-share crop: drapery, chair, pillows, French doors. Generated 2026-07-24, see substitution note below. |

**Orientation correction, both `about/` photo-shoot files:** these two iPhone captures had no EXIF orientation tag (`kMDItemOrientation` read `1`/none on the originals), but the phone was physically rotated when shooting, so the stored pixel grid itself was sideways — every viewer, including browsers, would have rendered them rotated 90°. Verified visually and corrected in place (90° clockwise, baked via Pillow after `sips --rotate` proved unreliable when chained with resize/crop — it silently re-applied rotation on later operations). Originals in `/source-photos/` are untouched.

## Unfilled slots

| Slot | Needs | Blocking? | Substitution until real file arrives |
|---|---|---|---|
| `hero/` | Full-bleed landscape images, 2400px+ wide | Yes, for home page | **FILLED, see correction below.** `hero/pleated-drapery-living-room-french-doors-pool-view.jpg`, cropped from `photo-shoot-banded-roman-shade-living-room.jpg`. Swap when Kelsee's edited selects arrive. |
| `portfolio/` | Per-project folders, 4-8 images each | Yes, for portfolio | **One demo project, "Collected Living Room," built with one image so far** (`portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg`, also cropped from the same source — see correction below). Real project photography with 4-8 images per project is still the single biggest outstanding asset; the full detail-page template lands in build step 3. |
| `journal/` | One image per post | No | **FILLED with three reuses, see the step 6 table below.** The original plan in this row named the entry-door shot for the third post; that was written before the correction section below established the entry-door photo shows no window treatment at all. The hero drapery crop was used instead. |
| about/ origin | Early photograph of Amy (brief 5.4.2, Grandma's attic section) | No, but the section is weaker without it | **Now live with a stand-in** (the workroom shot) since /about is built — see the step 5 table below. Only Amy can supply the real one. |

`og/` is filled — see the real-files table above. It stands in as the site-wide default until Kelsee's photography allows a more deliberate, art-directed OG image (or per-page ones).

## Correction, found during the Home build (step 2)

Both `photo-shoot-banded-roman-shade-living-room.jpg` and `photo-shoot-leaded-glass-entry-door.jpg` are **behind-the-scenes shots of the photographer mid-shoot**, not clean room photography: the roman-shade image has Kelsee crouched in the foreground with a camera and a baby safety gate fills the bottom third of the frame; the entry-door image has her standing in the doorway waving at the camera, and shows no window treatment at all (it's an entry door). The original manifest entry noted "Kelsee shooting a client room" but still recorded both as viable hero/portfolio substitutes without flagging that the photographer and gate are the dominant subject — worth knowing if similar shoot-day photos turn up elsewhere, since this manifest's own text description undersold the problem until the actual pixels were checked.

Neither file is usable as-is for a lookbook-standard hero or portfolio image. Two new derived crops were cut from `photo-shoot-banded-roman-shade-living-room.jpg` only (the door photo has no treatment in it at all, so nothing in it is salvageable for this purpose):

| File | Crop region (of the 4284x5712 original) | Use |
|---|---|---|
| `hero/pleated-drapery-living-room-french-doors-pool-view.jpg` | top ~57%, full width (0,850 → 4284x2430) | Home hero. Excludes the photographer and gate entirely; keeps drapery, chandelier, French doors, pool view. |
| `portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg` | tight crop on the doors (1856,1371 → 2428x2143) | Home portfolio strip / "Collected Living Room" project. A closer detail crop of the same room, deliberately different framing from the hero so the two don't repeat on the same page. |

Both live in `/public/images/` (masters, per section 9) and `/src/assets/images/` (same bytes, for `astro:assets` processing — see BUILD-PLAN.md's image-serving note). Originals in `/source-photos/` and the uncropped `/public/images/about/` copies are untouched. The ottoman-stitching photo (`about/amy-hand-stitching-check-fabric-ottoman-cutting-table.jpg`) was left alone — it's a real, clean, usable shot, just not a room/treatment shot, so it stays reserved for About/Process as originally noted.

## Step 5 (About + Process) slot assignments, 2026-07-26

The three team headshots were sitting unused until now; About's Studio row (5.4.5)
is their first real slot. All three were copied into `src/assets/images/team/` so
`astro:assets` can process them, same hybrid arrangement as every other photo here.
~200-byte blur-up placeholders were precomputed for each via the same one-off
`sharp` script used in step 2.

| Page | Slot | File | Status |
|---|---|---|---|
| `/about` | lead | `portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg` | Placeholder. Real photo, but it is the project detail crop doing a fourth job. Swap when Kelsee's shoot lands. |
| `/about` | origin ("Where it started") | `about/amy-hand-stitching-check-fabric-ottoman-cutting-table.jpg` | **Placeholder, and the weakest substitution on the site.** 5.4.2 asks for an early photograph of Amy; none exists on this machine and only Amy can supply one (asset request 3). The workroom shot is the closest real image of her actually making something. |
| `/about` | Studio ×3 | `team/amy-clark.jpg`, `team/sam-clark.jpg`, `team/kelsee-etmans.jpg` | Real, first use. See the crop note below. |
| `/process` | lead | `about/amy-hand-stitching-check-fabric-ottoman-cutting-table.jpg` | Placeholder, but a good fit: the only real photo of fabrication, which is what the page is about. Reused from About deliberately (different page, different context) since no second workroom photo exists. |

**Studio row crop, and why it is square.** Every other image on the site uses a
4:5 or 16:9 crop. The Studio row uses 1:1, driven by the assets rather than by
preference: Amy's and Kelsee's files are circle-cropped avatars centred on a
near-black square ground (426x408 and 399x384), and a 4:5 crop cuts the top and
bottom off both circles. Square keeps them whole. Sam's is a real 888x1120
portrait, and a centred square crop shaves the top of his head, so the row also
carries `object-position: 50% 15%`. Both of those are marked in `about.astro`'s
style block as revert-on-arrival. **The row will not look right until asset
request 2 lands** — two dark-ground circle avatars beside one blue-backdrop studio
portrait is three different photographic treatments in a row, and no amount of CSS
fixes that.

## Step 6 (Journal + Contact) slot assignments, 2026-07-26

No new photography entered the repo this step. All three Journal heroes are
reuses of the same three real photos the rest of the site runs on, which are now
carrying four and five jobs each. Every one is a placeholder in the standing-rule
sense: a real photo standing in for a better real photo.

They are wired through `src/data/journalImages.ts` rather than through each
post's frontmatter, so alt text and the pre-generated blur-up strings live with
the asset and exist in one copy. `content.config.ts`'s `heroImage` is an enum
derived from that file's keys, so a typo fails the build instead of shipping a
broken image.

| Page | Slot | File | Status |
|---|---|---|---|
| `/journal/how-to-read-a-fabric` | hero | `about/amy-hand-stitching-check-fabric-ottoman-cutting-table.jpg` | Placeholder, but the best fit available: the post is about judging fabric by hand and this is the only photo of fabric being handled. Fourth use of this file (About origin, Process lead, project supporting, here). |
| `/journal/drapery-shades-or-blinds` | hero | `portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg` | Placeholder, and the most apt of the three: the post is about choosing between a shade and drapery, and this frame literally shows both on the same opening. Fourth use. |
| `/journal/what-makes-a-window-treatment-look-expensive` | hero | `hero/pleated-drapery-living-room-french-doors-pool-view.jpg` | Placeholder. Chosen over the entry-door shot this file originally earmarked for the third post — that photo shows no window treatment at all (see the correction section above), so it cannot illustrate a post about treatment detail. Fourth use of the hero crop. |
| `/journal` (index) | 3 thumbnails | the same three files, 4:5 crop | Same three placeholders at a different crop. |
| `/contact`, `/contact/thank-you` | — | none | **Deliberately image-free.** 5.7 asks for no image, and a fifth reuse of the same three photos would add nothing to a form page. Flagged in `contact.astro`'s header comment as revisit-when-Kelsee's-shoot-lands. |

**The repetition is now the most visible asset problem on the site.** Counted off
the built HTML: 22 rendered images across 18 pages, drawn from six real files —
and three of those six are the Studio headshots, which appear once each. So three
photographs are carrying nineteen of the twenty-two. Nothing is broken and
nothing is fake, but a reader moving from `/about` to `/process` to the Journal
sees the same ottoman and the same French doors three times. Asset request 1
below is the fix, and it matters more than it did two steps ago.

## 2026-07-26: two real photographs arrived — the first non-placeholders

Sam added two phone/screenshot captures of finished pillows. **These are the
only images on the site that are not standing in for something better.** Both
were renamed to descriptive, hyphenated filenames per 8.1 (the originals were
`Screenshot 2026-07-26 at 9.31.40 PM.png` and `…9.32.52 PM.png`), cropped,
converted to JPEG, and written to both `public/images/` and
`src/assets/images/`, same hybrid arrangement as every other photo here.
Untouched originals stay in `/source-photos/`.

| File | Source | Size | Notes |
|---|---|---|---|
| `portfolio/signature-pieces/tapestry-canal-house-lumbar-pillow-navy-piping.jpg` | Screenshot 2026-07-26 at 9.31.40 PM.png (1912x1432) | 1800x1050 | Lumbar pillow, woven tapestry of European canal-house facades, navy contrast piping. Cropped to drop the white margins and a table edge intruding at bottom right. |
| `portfolio/signature-pieces/woven-dot-lumbar-pillow-blue-ochre-piping.jpg` | Screenshot 2026-07-26 at 9.32.52 PM.png (1910x1422) | 1830x1180 | Lumbar pillow, blue-grey textured weave with a small cream-and-ochre dot motif, ochre contrast piping. |

**Both source files are screenshots, and the second one carried app chrome** —
an Instagram carousel "next" arrow at the right edge and pagination dots along
the bottom. Cropped out before anything shipped; verified by opening the
processed file, not by trusting the crop numbers. Worth checking for on any
future screenshot-sourced photo. Neither is studio photography, and both should
be reshot properly when Kelsee's session happens, but they are real finished
objects and they read as such.

Both carry pre-generated ~200-byte blur-up strings (6.7), same one-off `sharp`
approach as every other photo. Both are wired through `src/data/photos.ts`.

## `src/data/photos.ts` — where the real photographs now live

Added 2026-07-26. One entry per real photograph, holding the `astro:assets`
handle, the alt text, the blur-up string, and the `/public` master path. Any
page needing a photo imports it from here rather than restating alt text.
`journalImages.ts` is now a thin alias over it, so the journal collection's
derived `heroImage` enum and every existing import keep working.

Five entries today: the three long-serving photographs plus the two new
pillows.

## 2026-07-26 slot assignments: ServiceList hover stage and /signature-pieces

| Page | Slot | File | Status |
|---|---|---|---|
| Home + `/services` | ServiceList hover stage, Custom Drapery | `hero/pleated-drapery-living-room-french-doors-pool-view.jpg` | Placeholder. |
| Home + `/services` | ServiceList hover stage, Blinds & Shades | `portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg` | Placeholder. |
| Home + `/services` | ServiceList hover stage, Upholstery | `about/amy-hand-stitching-check-fabric-ottoman-cutting-table.jpg` | Placeholder, and the aptest of the four — a check-fabric ottoman on the cutting table is literally upholstery. |
| Home + `/services` | ServiceList hover stage, Soft Furnishings | `hero/pleated-drapery-living-room-french-doors-pool-view.jpg` | Placeholder. **Shares the Drapery photo** — the only one of the three showing pillows and a cushioned seat. The two rows are non-adjacent (1 and 4), so the repeat never reads as a stuck image. |
| `/signature-pieces` | Canal Houses | `portfolio/signature-pieces/tapestry-canal-house-lumbar-pillow-navy-piping.jpg` | **Real, not a placeholder.** |
| `/signature-pieces` | Dot Weave | `portfolio/signature-pieces/woven-dot-lumbar-pillow-blue-ochre-piping.jpg` | **Real, not a placeholder.** |
| `/cincinnati` | lead | `portfolio/collected-living-room/banded-roman-shade-drapery-french-doors-detail.jpg` | Placeholder. |
| `/northern-kentucky` | lead | `hero/pleated-drapery-living-room-french-doors-pool-view.jpg` | Placeholder. |

The hover-stage images only exist at `(hover: hover)` and `min-width: 1200px`
— outside that they are `display: none`, so on touch devices and narrow
screens they are neither in the accessibility tree nor fetched.

**Repetition, recounted.** Eight real files now (three long-serving
photographs, three Studio headshots, two pillows). The three long-serving ones
still carry the overwhelming majority of image slots across the site — the
count grew this session rather than shrank, because the hover stage and two
location pages all draw on them. Asset request 1 has not got any less urgent.

## 2026-07-27: Amy's real headshot replaced the avatar

Sam replaced `source-photos/Amyheadshot.JPG` in place — same filename as the
old avatar (macOS is case-insensitive, so the earlier `.png` was overwritten by
a `.JPG`), which is why it does not look new in a directory listing. **Check
file dimensions, not filenames, when a photo is said to be new.** The old asset
was 426x408; the new original is 1941x1300.

Processed the same way as every other real photo: resized to 1600x1072, written
to both `public/images/team/` and `src/assets/images/team/` as `amy-clark.jpg`,
new ~180-byte blur-up generated with the standing `sharp` one-liner, and alt
text rewritten from the generic "Amy Clark, founder of Amy K Clark Design" to
describe what is actually in the frame.

**The Studio row's square-crop workaround is now half-obsolete, and was scoped
down rather than removed.** It existed for two reasons: two circle-cropped
avatars that a 4:5 crop would slice, and a lifted `object-position` so a centred
square crop would not shave the top of Sam's head. Amy's half of the first
reason is gone. **Kelsee's is not** — hers is still a ~400px circle avatar on a
dark ground, so the row stays 1:1 until asset request 2 lands. The
`object-position: 50% 15%` was applied to all three figures and only ever did
real work on Sam's; it is now scoped to his figure alone. Full reasoning in
`about.astro`'s style block.

**The row is now two real photographs and one avatar**, against three
mismatched treatments before. Still not uniform — Amy's white brick and Sam's
blue studio backdrop are different worlds — but the weakest asset is now
clearly the remaining one.

## 2026-07-28: the Ivory House shoot — the first non-substitute project photography

Sam added roughly 27 rough-edit frames from a real client-house shoot
(photographer: Kelsee Etmans) to `source-photos/preeditstardustlnpics/`. This
is the first real project photography this build has had; every image slot
that has run on crops of one substitute photo since step 2 draws from it now.
The full ~27-frame set stays on disk (never deleted, per this file's standing
rule) but is **not tracked in git** — see `.gitignore`'s note and the "what's
tracked" table below. The photographer's own Drive folder is the real archive.

**Ownership of what's in frame was established in stages, and got broader
each time — worth recording plainly so the reasoning is traceable.** The
session began under a narrower, drapery-and-two-pillows-only understanding;
Sam then corrected it twice, ending at whole-house scope covering all four
services. The **final, confirmed scope** is what's used throughout this
manifest and `projects.ts`:

**Confirmed as Amy's work:**
1. Drapery, throughout the house.
2. The kitchen island's rattan bar-stool cushions (floral/botanical print).
3. The breakfast-room dining chairs — Amy reupholstered these (houndstooth/
   tweed). The only real, finished-upholstery photography this site has.
4. Two sage geometric lumbar pillows on the living room's cream barrel chairs.
5. The white wood blinds in the bay-window breakfast room.
6. One sage pillow among the banquette pillows in that same bay-window room.
7. The round navy/olive knit "ball" pillow (on the sheepskin armchair).

**Confirmed NOT Amy's:** the sheepskin/fur armchair itself, the living-room
sofa, the barrel and rattan chairs themselves (only their cushions/pillows
are hers), and any pillow not named above.

**Alt text describes what's visible; the authorship claim lives in `scope`
and the spec block, not in alt text.** Several selected frames necessarily
show furniture Amy didn't make alongside work she did (a room photograph
can't crop out the sofa) — consistent with how the site has always handled
this (the existing "Collected Living Room" project's supporting image
already includes furniture with no attributed maker). Rule 10's accessibility
requirement and 5.2's scope-honesty requirement are two different jobs,
handled in two different places, same as before.

**One thing that reads as ambiguous and is flagged in ASK-AMY.md rather than
resolved by guessing:** Amy's own account describes the reupholstered dining
chairs as being "in the same room" as the bay-window blinds. In the
photographs these read as two physically distinct spaces — different floor
(hardwood vs. carpet), different window treatment (bare double-hung windows
vs. full bay with blinds and drapery), and family photographs visible in the
dining-chair frames that aren't present in the blinds frames. Both frames are
used for their own confirmed, individual scope (Upholstery; Blinds & Shades)
regardless of how the two rooms relate — nothing here depends on the answer —
but the relationship itself is asked about rather than assumed.

### Frames selected (10 of ~27), and why

| # | File | Used for | Why this frame over its near-duplicates |
|---|---|---|---|
| 01 | `pinch-pleat-drapery-living-room-orb-chandelier.jpg` | Home hero | Cropped top-anchored from the original (full frame, trimmed ~250px off the bottom) to foreground the chandelier, drapery, and art rather than the seating group. Full chandelier visible, most generous headroom of the living-room set. |
| 02 | `pinch-pleat-drapery-living-room-french-doors-detail.jpg` | Portfolio supporting | Alternate angle of the same room, used instead of the near-identical 05/06 (05 has a stray chandelier chain crossing the top of frame; 06 is a redundant vertical re-crop). |
| 03 | `pinch-pleat-drapery-header-rings-crown-molding.jpg` | Portfolio supporting, Drapery ServiceList hover stage | The strongest, most unambiguous drapery-craft shot in the whole set: rod, rings, crown molding, panel falling into frame, nothing else competing for attention. |
| 04 | `pinch-pleat-drapery-header-second-window.jpg` | Portfolio supporting | A second window's header detail, confirming the pleat/rod treatment repeats — kept distinct from 03 rather than a duplicate of the same window. |
| 17 | `ivory-drapery-white-wood-blinds-bay-window-breakfast-room.jpg` | Portfolio lead | Cleanest, most complete version of the bay-window room among 15/16/17/18: full ceiling medallion and chandelier, all three windows' drapery+blinds symmetric, centerpiece anchoring the foreground. 15 and 16 are dimmer, earlier-in-sequence exposures of the same setup. |
| 18 | `white-wood-blinds-drapery-bay-window-detail.jpg` | Portfolio supporting, Blinds & Shades ServiceList hover stage | Tighter crop of the same room as 17, chandelier and blinds more prominent — used as a second, distinct angle rather than reusing 17 twice. |
| 19 | `sage-geometric-lumbar-pillows-cream-barrel-chairs.jpg` | Portfolio supporting | Cleanest of the near-duplicate pair 19/20; both sage lumbar pillows clearly in frame, no personal items visible. |
| 22 | `botanical-cushions-rattan-counter-stools-kitchen-island.jpg` | Portfolio supporting, Soft Furnishings ServiceList hover stage | The single most distinctive frame in the whole set — closeup of the floral cushion print. Unambiguous, no competing subject. |
| 24 | `houndstooth-reupholstered-dining-chair-breakfast-table.jpg` | Portfolio supporting, Upholstery ServiceList hover stage | Cleanest of 21/23/24: 21 shows family photographs on a counter in the background (a real privacy concern, not just a compositional one) and was excluded specifically for that reason; 23 and 24 don't show that counter. 24's tighter crop shows the chair fabric texture more clearly than 23. |
| 27 | `round-knit-pillow-navy-olive-armchair.jpg` | Portfolio supporting | Tightest of the three fur-armchair crops (25/26/27); the ball pillow reads as sharp and central rather than a small accent lost in the chair's fur texture, which was the deciding factor once the pillow itself was confirmed hers. |

### Disqualified, and on what grounds

- **05, 06** — near-duplicates of 04 and 02 respectively, no distinct content.
- **07, 08, 09** — near-duplicate archway views (sofa, chaise, console with
  flowers, orb chandelier). Not used: with whole-house scope now covering
  richer, more clearly-Amy's-work frames elsewhere, these added nothing that
  8/17/18 didn't already cover, and the sofa/chaise are not Amy's.
- **10–14** — tight crops of the living-room seating group (pillows, boucle
  chair). Superseded once 19 gave a clean, confirmed-ownership pillow shot
  from a different room; these mix confirmed and unconfirmed pillows in the
  same frame at similar prominence, which is a harder scope-honesty case than
  19 or 22.
- **15, 16** — earlier, dimmer exposures of the same bay-window setup as 17/18.
- **20** — a near-duplicate of 19.
- **21, 23** — the breakfast-nook table setting. 21 excluded specifically for
  showing family photographs in the background (privacy, not just
  composition); 23 is a usable near-duplicate of 24, not needed alongside it.
- **25, 26** — wider crops of the same fur-armchair setup as 27, where the fur
  texture reads as more prominent than the pillow.

### New file `src/assets/images/portfolio/ivory-house/` and `public/images/portfolio/ivory-house/`

All ten selected frames, resized to 2000px on the long side, JPEG quality 88,
in both locations per the site's existing hybrid image-serving convention.
Blur-up placeholders generated the standard way (`sharp`, 24px wide, WebP).

### What's tracked in git and what isn't

| Path | Tracked? |
|---|---|
| `source-photos/preeditstardustlnpics/` (all ~27 rough-edit originals) | **No** — ignored via `.gitignore`, kept on disk. The photographer's Drive folder is the real archive for the full shoot. |
| `src/assets/images/portfolio/ivory-house/` (10 selected, processed files) | Yes |
| `public/images/portfolio/ivory-house/` (same 10, verbatim-served masters) | Yes |
| `public/images/og/og-default.jpg` (replaced, see below) | Yes |

### Slots this resolves

| Slot | Before | Now |
|---|---|---|
| Home hero | Crop of the substitute photo (`pleated-drapery-living-room-french-doors-pool-view.jpg`) | Real Ivory House living-room photo (01) |
| Portfolio index / detail lead | One project, one supporting image, both substitute crops | Two projects; Ivory House ships with a real lead (17) and 8 real supporting images |
| ServiceList hover stage — Drapery | Substitute photo, shared with Soft Furnishings | Real drapery header detail (03) |
| ServiceList hover stage — Blinds & Shades | Substitute photo | Real white wood blinds (18) — **first dedicated Blinds & Shades photography this site has had**, and the SEO growth priority per 5.3 |
| ServiceList hover stage — Upholstery | Workroom process photo (ottoman-stitching), not a finished piece | Real reupholstered dining chair (24) — **first finished-upholstery photography this site has had** |
| ServiceList hover stage — Soft Furnishings | Shared the Drapery substitute photo | Real kitchen cushion detail (22) — all four rows now distinct |
| OG image | Crop of the substitute photo | New crop of the Ivory House hero image (01) |

**Still on substitute photography, unresolved by this shoot:** the three
Journal post heroes, the two location pages (`/cincinnati`,
`/northern-kentucky`), and the Studio/About workroom images — all still use
`pleated-drapery`/`banded-roman-shade`/`ottoman-stitching` from the original
substitute set. Left alone deliberately; rewiring them was not part of this
pass and each is a small, separate decision.

**Permission is still outstanding and blocking.** Written permission from
both the photographer (copyright) and the homeowner (their house) has not
been obtained. Tracked in `LAUNCH_CHECKLIST.md` §1 alongside the testimonial
permissions, on the identical holding pattern: wired in and visible now,
must not go live on the real domain until both permissions are in hand.

## Asset requests, in priority order

1. ~~Kelsee's edited project photography (fills hero/ and portfolio/, the two
   blocking slots).~~ **Landed 2026-07-28** — see the Ivory House section
   above. Rough-edit frames, not final edits, but real and usable; the
   photographer's final edited selects, when they arrive, are a straight
   swap of the same ten files.
2. **A real rectangular headshot for Kelsee.** Amy's landed 2026-07-27; Kelsee's is the last circle-crop avatar in the Studio row and the only thing still forcing the 1:1 crop.
3. An early photograph of Amy for the origin section.
4. **Proper photographs of the pillows on `/signature-pieces`**, and of any
   other finished pieces worth showing there. The two live now are honest and
   usable, but they are a phone capture and a social-media screenshot, not
   studio work — and this is the one page whose whole job is showing objects.
5. **What the Ivory House shoot still does not cover**, carried over from the
   original request list rather than invented fresh: no photo of Amy actually
   working, no installation-in-progress shot, no fabric or trim detail shot
   (swatch, seam, hem), and no second blinds/shades install beyond this one
   room. Blinds & Shades finally has real photography as of this shoot, which
   removes the single most urgent gap — the remaining four are the next
   priorities for a future session with Amy or a future shoot. Also in
   ASK-AMY.md's photography section.
