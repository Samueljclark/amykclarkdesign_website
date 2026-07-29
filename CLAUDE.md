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
form. Fonts self-hosted (Archivo variable + Newsreader 300). Node pinned
to 24.18.0 in netlify.toml.

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