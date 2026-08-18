import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Domain per DESIGN_BRIEF.md header. Registered at GoDaddy; DNS will point to
// Cloudflare Pages or Netlify (brief section 7). www vs apex to be settled at DNS setup.
export default defineConfig({
  site: 'https://amykclarkdesign.com',
  output: 'static',
  integrations: [
    sitemap({
      // PERMANENT. Every page here carries noindex (Base.astro's `noindex`
      // prop). A noindex URL listed in the sitemap is a contradictory signal
      // and Search Console reports it as an error ("Submitted URL marked
      // noindex"), so anything noindex has to be excluded here too.
      //   /contact/thank-you — the form's success destination, no standalone
      //     search value.
      //   /privacy, /terms — added 2026-08-06. Boilerplate legal pages add
      //     nothing to search relevance; keeping them out avoids diluting the
      //     sitemap. Still fully real, fully reachable pages — just not
      //     indexed. Keep this clause in sync with Base's `noindex` prop on
      //     each page; a page cannot carry one without the other.
      //
      // The temporary clause that sat beside it — excluding the throwaway
      // service-list comparison page — was removed 2026-07-26 along with the
      // page itself, once variant B was adopted into ServiceList.astro.
      filter: (page) =>
        !page.includes('/contact/thank-you') &&
        !page.includes('/privacy') &&
        !page.includes('/terms'),
    }),
  ],
});
