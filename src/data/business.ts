// Canonical business facts, confirmed by Sam 2026-07-24. Single source of
// truth for the footer (below) and for LocalBusiness JSON-LD (step 7 of
// BUILD-PLAN.md — not built yet). Update here, not inline in components.

export const business = {
  phone: '859-640-5814',
  phoneHref: 'tel:+18596405814',

  // Service-area business, no published street address (DESIGN_BRIEF.md 2:
  // "no client names, no addresses"). Fort Wright is the base city for
  // schema/areaServed purposes only — it is not published as marketing copy.
  // The public-facing location line is Amy's own copy ("Cincinnati/NKY
  // Based" / "Serving all areas" — hero, footer), distinct from this array,
  // which stays spelled out for JSON-LD search matching, not brand voice.
  baseCity: 'Fort Wright',
  baseState: 'KY',
  areaServed: [
    'Fort Wright, KY',
    'Northern Kentucky',
    'Cincinnati, OH',
    'Hamilton County, OH',
    'Kenton County, KY',
    'Boone County, KY',
    'Campbell County, KY',
  ],

  // TBD: Sam to confirm actual hours before this feeds LocalBusiness
  // JSON-LD's openingHoursSpecification (step 7). Do not publish a guess.
  openingHours: null as null | string,

  instagram: 'https://www.instagram.com/amykclarkdesign/',
  facebook: 'https://www.facebook.com/amy.clark.908579',
  googleBusinessProfile:
    'https://www.google.com/maps/place/Amy+K+Clark+Design/data=!4m2!3m1!1s0x0:0xdff475002c8eece0',

  // CONFIRM WITH SAM: real contact email. Still a placeholder.
  email: 'hello@amykclarkdesign.com',
};
