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
// **'Journal' became 'Design Journal' 2026-08-04**, per Meeting 3's confirmed
// register. It is the only two-word label in the list, which is a real tension
// with the same register's "nav: thin, horizontal, 6-7 words" line — on a
// literal word count this list is now eight, not seven.
//
// It was changed anyway because the rename is explicit and because it measurably
// fits: at 900px, the narrowest width the horizontal nav renders at, the gap
// between the wordmark and the first item goes from 101.3px to 42.6px and the
// document does not overflow (scrollWidth stays 900). Measured in a browser, not
// estimated.
//
// **If Sam reads "6-7 words" as a hard count, revert this one label and nothing
// else changes** — the page's own H1, eyebrow, breadcrumb and back-link all say
// "Design Journal" independently of this array.
import { FLAGS } from '../config/flags';

// Portfolio gated behind FLAGS.portfolioEnabled (2026-08-19, post-Meeting-4
// pass, Task 2) — the route itself moved to src/pages/_disabled/portfolio/,
// so linking to it here would be a dead link regardless. Filtered out of the
// data rather than deleted from this array, so re-enabling the flag restores
// it in the primary nav, the footer, and the mobile panel at once — all
// three render from this one export and none needed their own markup
// changed.
const allNavItems = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Blinds', href: '/blinds' },
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/process' },
  { label: 'Design Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

export const navItems = allNavItems.filter(
  (item) => item.href !== '/portfolio' || FLAGS.portfolioEnabled
);

// Footer-only location pages (5.1, section 4): search-only pages, deliberately
// not in the main nav above.
export const locationPages = [
  { label: 'Cincinnati', href: '/cincinnati' },
  { label: 'Northern Kentucky', href: '/northern-kentucky' },
];
