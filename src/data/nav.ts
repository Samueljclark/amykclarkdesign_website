// Main nav (DESIGN_BRIEF.md section 4: six items, no more). SiteNav.astro and
// SiteFooter.astro each render this same list — previously two separate
// hardcoded arrays that had to be kept in sync by hand. One list now.

export const navItems = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
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
