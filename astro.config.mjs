import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Domain per DESIGN_BRIEF.md header. Registered at GoDaddy; DNS will point to
// Cloudflare Pages or Netlify (brief section 7). www vs apex to be settled at DNS setup.
export default defineConfig({
  site: 'https://amykclarkdesign.com',
  output: 'static',
  integrations: [
    sitemap({
      // PERMANENT. /contact/thank-you is the form's success destination and
      // carries noindex. A noindex URL listed in the sitemap is a
      // contradictory signal and Search Console reports it as an error
      // ("Submitted URL marked noindex"), so anything noindex has to be
      // excluded here too. Keep this clause.
      //
      // The temporary clause that sat beside it — excluding the throwaway
      // service-list comparison page — was removed 2026-07-26 along with the
      // page itself, once variant B was adopted into ServiceList.astro.
      filter: (page) => !page.includes('/contact/thank-you'),
    }),
  ],
});
