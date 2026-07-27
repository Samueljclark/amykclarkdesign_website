# Ask Amy — everything that would make the site more her

Where things actually stand (2026-07-26): **the whole site is built.** Home,
Portfolio, all five Services pages, About, Process, the Journal with three
posts, Contact with the consultation form, both location pages, and a new
Signature Pieces page. The SEO layer and the full acceptance pass are done too.
All of it on the current direction (Archivo + Newsreader type, the single
restrained indigo accent, photography carrying the color), not the old v1 site.

**Nothing structural is waiting on Amy any more. What is waiting on her is
everything below** — the permissions, the facts, the words, and the
photographs.

That changes what this list is for. It is no longer feeding pages that don't
exist yet — **it is now the difference between pages that are structurally
finished and pages that sound like Amy.** The copy on About, the Journal posts, and
the project record are all written at exactly the level of detail that is actually
established, and they stop there rather than inventing anything. Her own words are
what makes them good. Same ordering by payoff as before, and most of it still comes
out of one recorded conversation and one afternoon with her phone camera.

## 1. One recorded conversation (30 to 45 minutes, just talk)

Record it on a phone. Her phrasing is the raw material for making every page and
every Journal essay sound like her instead of like good marketing copy.

**The attic, specifically.** The founder story needs actual detail. `/about` is
live and its origin section is deliberately thin — the attic, the trunks, taking
things apart to see the construction, and nothing beyond that, because nothing
beyond that is established. Ask for the details only she knows: what was the first thing
she pulled out of those trunks? What did she take apart to see how it was made? Does
she remember a specific piece of lace or a coat lining? Did anything from that attic
survive, and does she still have it?

**The family years.** "A practical way to work while raising a family" is doing a lot
of vague lifting. What did she actually sew in those years? Prom dresses, slipcovers,
curtains for neighbors?

**Real project stories, beyond the one already live.** For each: what was wrong with
the room, what fabric won and why, what the client said when they saw it finished.
Only one project exists on the site so far — more stories, with photos, directly
expand the Portfolio. Get the neighborhood too (Hyde Park, Mariemont, Fort Thomas,
Covington) — real place names make the local SEO feel earned instead of stuffed.

**The talking-out-of-it story.** Ask when she last talked a client OUT of the more
expensive option and why. That story is the whole trust pitch of the site in
miniature, and it belongs in her words on About or Process, both of which are now
live and have room for it.

**Her opinions, for the Journal.** All three launch posts are now written and live
(how to read a fabric, drapery vs. shades vs. blinds, what makes a treatment look
expensive), each marked as a draft pending her review. **They are good and they are
not hers.** Ten minutes of her riffing per topic replaces the general advice in each
one with her actual rules of thumb, the mistake she sees most often, and the story
she tells clients — which is the whole difference between a post that ranks and a
post that sounds like the person who made the thing.

**Her quirks, confirmed.** What does she collect? What's her favorite fabric house,
favorite era, favorite detail nobody notices? One or two of these belong on `/about`,
which currently has none of them.

## 2. Photos (phone quality is fine, imperfect is fine)

The standing rule (IMAGE-MANIFEST.md) is that every section that needs an image gets
a real photo, never a blank box or a generated placeholder — but the site is still
running on a small pool of real photos, mostly one source shoot cropped a few
different ways. More real photography is the single highest-leverage thing right now.

**Two real pillow photos arrived 2026-07-26** and are live on the new Signature
Pieces page — the first images on the site that are not standing in for
something better. They are a phone capture and a social-media screenshot rather
than studio work, so they want reshooting, but they prove the point: photographs
of actual finished objects carry this site further than anything else we can
add.

1. **The Fort Loramie shoot.** Needs to actually get booked before Sam leaves for
   college, plus written permission to photograph and publish. This is time-boxed in
   a way the others aren't.
2. **More real projects, three shots each**: one wide room shot, one medium shot of
   the treatment, one close detail (fabric, trim, hardware). Maps directly onto the
   Portfolio detail template (`ProjectGallery.astro`), which already supports any
   number of supporting images — the only thing missing is the photos. Get client
   permission for anything identifiable.
3. **Her hands and her workroom.** Cutting table, machine, trim drawer, stacked
   fabric bolts, swatch books from real lines. One workroom photo is already live
   (the ottoman-stitching shot, now doing four jobs across the Portfolio detail page,
   About's origin section, Process, and a Journal post); more of these break up that
   repetition, which is now the most visible asset problem on the site.
4. **At least one blinds/shades install** she's proud of, for the Blinds & Shades
   page, which is built and currently illustrated by a reused drapery crop.
5. **An installation-in-progress shot** (ladder, level, dressing the folds) for
   Process, which is built and currently reuses the workroom ottoman shot.
6. **Anything from the attic era** — surviving textiles, her grandmother's things, an
   old photo of the Covington house, for About's origin section.
7. **More finished pillows and cushions, and better shots of the two already
   up.** `/signature-pieces` exists now and shows exactly what Amy has
   photographed: two lumbar pillows. It scales to as many as she has. Plain
   ground, even light, one straight-on shot each is enough — the piping and the
   pattern match are what the page is about.

## 3. Facts to confirm (short answers, could be one text thread)

- **Consultation fee amount.** Not stated anywhere in the current build —
  DESIGN_BRIEF.md is explicit that no number gets published until Amy confirms one.
- **Vendor permissions — partly settled, and the rest is now specific.**
  **Schumacher is cleared** (Amy confirmed 2026-07-26) and is named on
  `/services/drapery`. **Stout and Pollack are not cleared** — real lines she
  carries, but pending her rep calls — so they are named nowhere on the public
  site and "the lines I represent" stands in for them. Those two calls are the
  open item. Separately, **Lafayette Interior Fashions is named publicly** on
  `/services/blinds-shades`, in the page title, the meta description, and the
  body. That naming is what DESIGN_BRIEF rule 7 and 8.3 ask for and it stays.
  What changed 2026-07-26: the page used to state outright that **"Amy is a
  Lafayette Interior Fashions dealer,"** a factual claim about a business
  relationship that had never been confirmed with her. It now reads "the one
  line I represent in this category," the same holding pattern Stout and Pollack
  are under. **The question for Amy is narrow: is she formally a Lafayette
  dealer, and may the site say so?** If yes, the stronger wording goes back.
  Same round of calls as Stout and Pollack. Tracked as decisions 11 and 12 in
  BUILD-PLAN.md.
- **Business hours.** Still `null` in `src/data/business.ts`, flagged not to
  guess. The LocalBusiness JSON-LD is now built and live, and it **omits the
  opening-hours block entirely** rather than publishing an invented one. Google
  shows hours to people deciding whether to call, so this one is worth ten
  seconds of her time.
- **Names for the two pillows on `/signature-pieces`.** They currently read
  "Canal Houses" and "Dot Weave," which describe the weave and are ours, not
  hers. If she calls them something, that wins. Also worth asking whether
  either fabric is from a line she can name publicly yet.
- **Final tagline.** Unresolved since the first meeting.
- **Ampersand usage in body copy.** Whether/where "&" is used in running text (nav
  and page titles already use it, e.g. "Blinds & Shades").
- **Whether to expand beyond the single restrained accent color, or keep photography
  as the only source of color.** Tracked as decision 10 in BUILD-PLAN.md — see that
  entry for the reasoning already on file rather than repeating it here.
- **Written permission for every testimonial now on the site.** Home shows two
  at a time: a fixed top slot and a second slot that **rotates through four**.
  Five real quotes are live in total, and **none is published with permission
  yet.** All are on the same holding pattern, and all but Diane's were cut from
  Amy's public Google Business profile — **a public review is not permission to
  feature it on her own website.**
  - **"…made my house into a home." — Diane K.** Fixed top slot, never rotates.
    Attribution format approved by Amy 2026-07-25; permission to publish the
    quote itself was logged as separately pending then and still is.
  - **"She even matches complicated designs on the seams." — Kelly G.** In
    rotation, and the quote shown at page load and under reduced motion.
  - **"Even though I was satisfied, she felt it needed a bit more cushioning."
    — Heather L.** In rotation. Verbatim, cut from a long two-project review.
  - **"…designed and installed her gorgeous work." — Jenny H.** In rotation.
    Verbatim tail of one sentence, elided at the front like Diane's.
  - **"The design is beautiful and color came out perfect." — Lisa C.** In
    rotation. Trimmed from a longer review and **the pink heart emoji removed**
    (DESIGN_BRIEF 3.2 bans emoji); otherwise verbatim, including "color came
    out perfect" rather than "the color."

  **Amy needs written permission from Diane, Kelly, Heather, Jenny, and Lisa
  before launch.** If any says no, that quote is one line to delete and the
  rotation simply carries the rest.
- **kimmybbarn's review is on file but deliberately unused**, and this is the
  one judgement call worth confirming: it carries no project detail, which is
  the standard every other quote here was selected against. Full text is in
  `SITE-COPY-EXPORT.md` if Amy would rather it were used.
