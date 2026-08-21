// Canonical business facts, confirmed by Sam 2026-07-24. Single source of
// truth for the footer (below) and for LocalBusiness JSON-LD (step 7 of
// BUILD-PLAN.md — not built yet). Update here, not inline in components.

export const business = {
  // PHONE — 2026-07-31 review. Amy's real mobile (859-640-5814) is NOT
  // published: it is her personal number, and putting it on a public website
  // is a decision nobody made deliberately. A Google Voice business number
  // will replace it; it does not exist yet (LAUNCH_CHECKLIST.md).
  //
  // Both fields are null until it does, and everything that consumes them is
  // written to handle null rather than to fall back to something: the footer
  // renders no phone row at all, and the LocalBusiness JSON-LD omits
  // `telephone` entirely. **Do not put a placeholder string like "Coming
  // soon" or "(555)" here** — the footer would render it as a phone number
  // and the schema would publish it to Google as one.
  //
  // TODO (Sam): obtain the Google Voice number, then set both fields. Format
  // `phone` for display ('859-640-5814') and `phoneHref` as a tel: URI with
  // the country code ('tel:+18596405814'). Nothing else needs changing.
  phone: null as null | string,
  phoneHref: null as null | string,

  // The service-area line in the footer (DESIGN_BRIEF 5.8), replacing the
  // hero's old location block. Set 2026-08-01 to 2021 (Sam's figure, not
  // confirmed as Amy's own), reopened as a question in the same session that
  // reversion this file documents, and **corrected 2026-08-19: 2020, Amy
  // confirmed directly** (post-Meeting-4 pass, Task 3). The footer prints
  // this value verbatim, so it now reads "Serving Cincinnati and Northern
  // Kentucky since 2020." Also feeds `foundingDate` in JsonLd.astro's
  // LocalBusiness node — one value, both consumers.
  servingSince: '2020',

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

  // ---------------------------------------------------------------------
  // BOOKING LINK — DELIBERATELY NOT PUBLIC. Added 2026-08-05.
  // ---------------------------------------------------------------------
  // Amy's appointment-scheduling URL (Google Calendar appointment schedule).
  // Empty until she creates one; see LAUNCH_CHECKLIST.md.
  //
  // **This must never appear on any page of the website, and never in the
  // client autoresponder.** Meeting 3 §12.1 confirmed the public CTA leads to
  // the qualification form, not to a calendar, because Amy needs leads
  // filtered before they can take a slot from her. Publishing this URL
  // anywhere on the site reverses that decision by accident.
  //
  // The only place it is allowed to appear is inside the notification email
  // sent to Amy herself, merged into the one-click reply draft she edits and
  // sends by hand. That is stage two: she has already read the submission and
  // decided she wants to see this person.
  //
  // The function that builds that draft
  // (`netlify/functions/submission-created.js`) omits the whole line when this
  // is empty, so setting it later is a one-line change here and nothing else.
  //
  // If you ever need to prove it has not leaked:
  //   npm run build && grep -r "$(node -e "...")" dist/
  // The report for 2026-08-05 records dist/ containing zero occurrences.
  bookingUrl: '',
};
