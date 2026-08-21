// Feature flags. One export, checked wherever a feature needs to be turned
// off without deleting its code — added 2026-08-19 (post-Meeting-4 pass,
// Task 2) specifically for the portfolio.
//
// `as const` so `FLAGS.portfolioEnabled` narrows to the literal `false`
// rather than `boolean`, which is what makes TypeScript flag any code that
// assumes it could be true as unreachable, catching drift at build time.
export const FLAGS = {
  // Amy has one photographed house on file. Amy and Kristen agreed a thin
  // portfolio (one project) reads worse than no portfolio at all, so it is
  // off for v1 launch — the routes are moved under `src/pages/_disabled/`
  // (Astro excludes underscore-prefixed directories from routing) rather
  // than deleted, and every consumer (nav, footer, the homepage teaser
  // section, 404, the thank-you page) checks this flag rather than being
  // torn out. Re-enable when three or more photographed projects exist:
  // flip this to `true` and move `src/pages/_disabled/portfolio/` back to
  // `src/pages/portfolio/`. Do not re-enable without Sam's explicit request.
  portfolioEnabled: false,
} as const;
