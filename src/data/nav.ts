// Main nav. SiteNav.astro and SiteFooter.astro each render this same list —
// previously two separate hardcoded arrays that had to be kept in sync by
// hand. One list now, which is why adding an entry here adds it to both.
//
// **`/blinds` added 2026-08-01 on Sam's instruction, and it reverses two
// things DESIGN_BRIEF.md said as of the 2026-07-31 review.** Recorded here
// rather than applied silently, because both were deliberate at the time:
//   1. Section 4 caps this list at six items and names them. It is seven now.
//   2. Section 4 also says `/blinds` "does not appear in the main nav or the
//      footer" and that being unlinked "is intentional, not an oversight" —
//      the page was built as a destination for paid ad traffic with nothing
//      competing for the click.
// DESIGN_BRIEF.md is updated to match in step 10. The page itself still
// works as an ad landing page; it is simply no longer unlinked.
//
// Position: directly after Services, so the two "what she does" entries sit
// together and Blinds does not read as unrelated to the service pages. Label
// is "Blinds", not "Blinds and Shades" — it matches the URL, it is what the
// ad category is called, and a seven-item nav cannot afford a three-word
// label (measured: the row is already the tightest thing in the chrome).
//
// **The footer gets it too**, which Sam did not ask for in so many words. The
// footer's "Site" column has always been a mirror of this array, and a footer
// that silently omits one nav item is a new inconsistency rather than a
// smaller change. Split this into two arrays if that turns out to be wrong.
export const navItems = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Blinds', href: '/blinds' },
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/process' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

// Footer-only location pages (5.1, section 4): search-only pages, deliberately
// not in the main nav above.
export const locationPages = [
  { label: 'Cincinnati', href: '/cincinnati' },
  { label: 'Northern Kentucky', href: '/northern-kentucky' },
];
