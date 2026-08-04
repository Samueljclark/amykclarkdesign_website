# Amy K Clark Design — Website Build

## Authority
DESIGN_BRIEF.md is the single source of truth for design, copy, page
structure, and content decisions. BUILD-PLAN.md governs build order and
step-by-step status. IMAGE-MANIFEST.md tracks every image in use.

If anything in this file, in old chat history, or anywhere else in this
repo conflicts with DESIGN_BRIEF.md or BUILD-PLAN.md, those two win.

## Who's who
- Amy Clark — founder, Amy K Clark Design. Custom drapery, blinds/shades,
  upholstery, soft furnishings. Fort Wright, KY.
- Sam Clark — building this site, using Claude Code.
- Kelsee Etmans — photographer, Studio section.

## Stack
Astro, static output, hosted on Netlify. Netlify Forms for the contact
form. Fonts self-hosted (Archivo variable + Bodoni Moda variable). Node
pinned to 24.18.0 in netlify.toml.

## legacy-static/ is archived, not a reference
An earlier plain-HTML version of this site (different palette, different
type system, different page list, no Portfolio/Journal) lives in
legacy-static/ for history only. Do not pull structure, copy, palette,
or typography from it. DESIGN_BRIEF.md replaced it entirely.

## Session rules
- Stay on Sonnet 5 for all coding work. If a message about
  model-unavailability causes an automatic fallback, check /model and
  switch back to Sonnet 5 before continuing. Never use Fable 5 unless
  Sam explicitly asks.
- Skip the Claude Browser screenshot/click-testing loop for routine
  build steps. Verify with production build and code-level checks only.
  Sam reviews visually himself in a real browser between steps. Reserve
  Browser-based visual testing for the final acceptance pass only.
- Run /clear before starting each new step in BUILD-PLAN.md.
- Run /cost at the end of each step.
- **Where documents live (set 2026-08-03). Do not put new loose markdown at
  the repo root.**
  - **Governing docs stay at the repo root and do not move:** this file,
    `DESIGN_BRIEF.md`, `BUILD-PLAN.md`, `ASK-AMY.md`, `LAUNCH_CHECKLIST.md`,
    `IMAGE-MANIFEST.md`. Their paths are referenced here, in each other, and in
    Sam's working prompts, so moving one breaks things quietly.
  - **Generated handoff artifacts go in `docs/handoff/`** — anything produced
    to hand to someone outside this repo (a photographer, a copywriter, a
    reviewer). If a script generates it, point the script at that folder.
  - **Superseded documents go in `docs/archive/`** with a `YYYY-MM-DD-` prefix
    on the filename. **Never delete them.** Losing context is the expensive
    mistake; disk space is not the problem.
  - **Notes and reference material go in `docs/notes/`** — meeting notes,
    research, scratch documents. Things that informed a decision without being
    authoritative.
  - `docs/README.md` explains all four categories and is the entry point for
    anyone new to the repo.
- **Typography is two faces and that is a settled decision (set 2026-08-04).
  Bodoni Moda for the Display role and testimonial quotes, Archivo for
  everything else. Do not add a third face, and do not restore Newsreader.**
  Amy's ceiling is three; the site uses two and that headroom is deliberate,
  not an invitation. **Didot supersedes the Meeting 3 "Helvetica" note for the
  display face specifically**, because Amy sent the Didot screenshot after that
  meeting and later direct input from her wins. Helvetica still governs body,
  nav, and UI, which is what Archivo is. Real Didot is not licensable here, so
  Bodoni Moda is the stand-in Didone; `Didot` is deliberately absent from the
  font stack so macOS does not render this site differently from everywhere
  else. Full reasoning: DESIGN_BRIEF.md 3.4 and BUILD-PLAN.md's 2026-08-04
  entry. **This is logged so it is not re-litigated** — if it comes up again,
  read those two entries before changing anything.
- **Scroll behavior on this site is a settled decision. Hero one-time
  auto-scroll only, no section snapping. Do not modify or propose changes to
  scroll behavior unless Sam specifically asks for it.** The hero ease is
  `initHeroScrollEase()` in `src/scripts/motion.js` plus `.scroll-ease-target`
  in `global.css`; leave both alone. Section-level `scroll-snap-type` has been
  built and removed twice (2026-07-25 and 2026-08-02) — both implementations
  worked correctly and were still rejected, so "but this one is done properly"
  is not a reason to try again. Full reasoning: DESIGN_BRIEF.md 6.9 and
  BUILD-PLAN.md's 2026-08-02 decision entry.
- After finishing any real change (a build step, a bug fix, a content or
  copy update, a documentation update), commit it to git with a clear,
  descriptive commit message before ending your turn — don't wait to be
  asked. Only commit when the build is actually clean (npm run build
  succeeds); if something's left broken or half-done, say so instead of
  committing it. Small, frequent commits are better than one giant one —
  commit after each real unit of work, not just at the very end of a
  long session.
- **Commit straight to `main`, and push. No feature branches, no pull
  requests.** This is a solo repo with no collaborators and no review
  process, so a branch-and-PR round trip only delays the work and leaves
  changes sitting unmerged. Do not ask which branch to use — it is always
  `main`. The single exception is Sam explicitly asking for a branch or a
  PR in so many words; otherwise `git commit` on `main` then
  `git push` is the whole workflow.
- **Claude Code does not write final user-facing prose.** All visible site
  copy lives in `src/content/pages/*.md` or another copy data file, never
  inline in `.astro` components. Any prose Claude Code adds or changes must
  be wrapped in an HTML comment reading `DRAFT COPY - NEEDS REWRITE`, and
  every such block must be listed at the end of the session report so Sam
  can hand it off to be rewritten properly. Structural text, alt text, and
  meta descriptions are exempt from the marker.