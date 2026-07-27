# Launch Checklist — Amy K Clark Design

Everything below must be resolved before the late August 2026 launch. Each item is also
flagged in the code with a `CONFIRM WITH SAM` comment so it is easy to grep:

```
grep -rn "CONFIRM WITH SAM" *.html journal/*.html robots.txt sitemap.xml
grep -rn "PLACEHOLDER IMAGE" *.html journal/*.html
```

## Blocking items (site works, but these must be real before launch)

1. **Contact form backend** — `contact.html` posts to `https://formspree.io/f/FORM_ID_HERE`.
   Create a free Formspree form pointed at the real inbox and swap in the ID.
   The optional photo-upload field needs a paid Formspree plan; delete the field and the
   form's `enctype` attribute if staying on the free tier.
2. **Domain** — every canonical URL, OG URL, `sitemap.xml`, and `robots.txt` assumes
   `https://www.amykclarkdesign.com/`. Confirm or find-and-replace once the real domain exists.
3. **Email (and phone?)** — footer and contact page use `hello@amykclarkdesign.com` as a
   placeholder. Must exactly match the Google Business Profile NAP once that exists.
4. **Instagram handle** — footer and contact page link to bare instagram.com.
5. **Photo of Amy** — `images/about/amy-portrait.jpg` is a placeholder. A real photo is
   non-optional for the About page; stock cannot substitute.
6. **Consultation fee** — `$125` is published on Process and Contact. Confirm the number,
   or strip it and keep the fee mentioned without an amount.

## Strongly recommended before launch

7. **Real project photos** — every image is a generated placeholder marked with a
   `PLACEHOLDER IMAGE` comment. Drop real photos (Instagram archive / Google Drive folder)
   into `/images/...` using the same filenames, or update the `src` paths. Keep the
   descriptive alt text pattern. The hero should become the flagship whole-house project
   (14-foot ceilings) when available.
8. **Testimonials** — home page has the one known quote ("made my house into a home",
   attribution unconfirmed). Collect 2 to 3 more with permission and duplicate the
   blockquote. Then add review schema to the JSON-LD.
9. **Fabric line name-drops** — About page keeps "designer fabric houses" generic.
   If Schumacher / William Morris access is current and accurate, name them (flagged in code).
10. **OG image** — `images/og/og-default.png` is a rasterized placeholder texture. Replace
    with a real project photo crop (1200x630) when photography exists.
11. **Analytics** — add a GA4 property + Search Console verification before launch, then
    submit `sitemap.xml` in Search Console.
12. **favicon.ico** — an SVG favicon ships now; add a real `.ico` for maximum
    compatibility (old browsers request `/favicon.ico` by convention).

## Journal (blog) go-live steps

The Journal ships dark on purpose: `journal.html` is `noindex` and excluded from
`sitemap.xml` so search engines never index a page of coming-soon cards. When the first
2 to 3 essays are written:

1. Duplicate `journal/post-template.html` per essay, fill in the bracketed fields,
   and delete each post's `noindex` line.
2. Remove the `noindex` meta from `journal.html`.
3. Uncomment the journal entry in `sitemap.xml` and add one entry per post.
4. Optionally add a "From the Journal" strip to the home page linking the newest posts.

Placeholder essay titles (already carded on `journal.html`, drafts to be written separately):

| Title | SEO cluster |
| --- | --- |
| Roman Shades or Blinds? How to Choose the Right Treatment, Room by Room | blinds/shades |
| Three Decisions to Make Before You Fall in Love with a Drapery Fabric | drapery |
| Window Treatments for Older Cincinnati Homes: Tall Windows, Deep Casings, and Sizes No Chart Expects | local + drapery |
| The West-Facing Room Problem: Managing Heat and Glare Without Losing the Light | blinds/shades |
| What Is Inside Your Drapery Matters More Than You Think: A Case for Good Lining | drapery |
| Is That Chair Worth Reupholstering? An Honest Way to Decide | upholstery |
| Shades and Drapery Together: When One Treatment Is Not Enough | layering (both clusters) |
| How to Read a Fabric: Weight, Weave, and What They Mean for Your Windows | fabric consultation |

## Maintenance notes

- **Add a portfolio project**: instructions are in a comment block at the top of the
  project list in `portfolio.html`. Duplicate a block, add an images folder, swap text.
- **Brand identity swap**: colors and fonts are CSS variables at the top of
  `css/style.css`; the wordmark is plain text in the header of each page.
- **Header/footer edits**: the same markup is repeated on every page. Edit once, then
  copy to all 8 pages + `journal/post-template.html` (or diff-check; see comment in each).
