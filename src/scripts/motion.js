// Amy K Clark Design — motion.js
// Vanilla JS, no library (DESIGN_BRIEF.md 6). Accordion (6.5) still lands
// with the page that uses it. Everything below is gated on 6.8.

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- View Transitions error suppression. Not a motion effect — page-
   lifecycle hygiene, so it isn't gated on reduced motion.
   Astro's ClientRouter (astro:transitions) doesn't catch a rejection on the
   native ViewTransition.finished promise the way it catches the sibling
   updateCallbackDone's (its router.js chains `.finally()` on `finished`
   with no trailing `.catch()`), so a benign, Astro-internal transition
   rejection surfaces on the console as an unhandled exception on
   navigation. Can't patch node_modules; this narrowly matches and
   suppresses only that one known DOMException, the same way Astro's own
   code already handles the sibling promise a few lines above it. */
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  if (
    reason instanceof DOMException &&
    reason.name === 'InvalidStateError' &&
    reason.message.includes('Transition was aborted')
  ) {
    event.preventDefault();
  }
});

/* ---- 6.3 Navigation: transparent over the hero, solid past 80vh. ----
   `[data-nav]` carries `transition:persist`, so this runs once — but the
   persisted state would go stale on navigation without a resync. `<body>`'s
   `data-transparent-nav` isn't persisted, so `syncNavForPage()` re-reads it
   plus `location.pathname` on `astro:after-swap`.

   FIX (mobile hamburger sometimes unresponsive after navigating, reported
   live during a demo): the toggle's click handling, the panel-link-closes-
   panel handling, and the Escape handling used to be bound directly to the
   specific toggle/panel button nodes queried once here, on the assumption
   that `transition:persist` keeps those exact nodes (and therefore their
   listeners) alive for the rest of the session. If that assumption ever
   breaks for any reason — a persistence mismatch, a browser falling back to
   a full page navigation, a bfcache restore — the toggle button silently has
   no listener at all, and nothing brings it back, because `initNav()` itself
   only ever runs once. All three are now delegated to `document` instead,
   querying the toggle/panel fresh at the moment of the event rather than
   closing over node references captured at load time. `document` itself is
   never replaced, so these can't be silently dropped the way a listener on
   the toggle node itself could be. */
function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const navLinks = nav.querySelectorAll('.site-nav__list a[href]');

  const closePanel = () => {
    const toggle = nav.querySelector('[data-nav-toggle]');
    const panel = nav.querySelector('[data-nav-panel]');
    if (!toggle || !panel) return;
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const threshold = () => window.innerHeight * 0.8;
  let onScroll = null;

  const syncNavForPage = () => {
    closePanel();

    const transparent = document.body.dataset.transparentNav === 'true';
    nav.dataset.navTransparent = transparent ? 'true' : 'false';

    if (onScroll) {
      window.removeEventListener('scroll', onScroll);
      onScroll = null;
    }

    if (transparent) {
      onScroll = () => {
        const solid = window.scrollY > threshold();
        nav.classList.toggle('is-solid', solid);
        // .on-dark: the --indigo -> --paper contrast fallback (tokens.css).
        nav.classList.toggle('on-dark', !solid);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    } else {
      nav.classList.remove('is-solid', 'on-dark');
    }

    const currentPath = window.location.pathname;
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isCurrent = !!href && (currentPath === href || currentPath.startsWith(`${href}/`));
      link.classList.toggle('is-current', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  syncNavForPage();
  document.addEventListener('astro:after-swap', syncNavForPage);

  // One delegated listener covers the toggle button and every link inside
  // the panel, for the whole life of the page — see the fix note above.
  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-nav-toggle]');
    if (toggle) {
      const panel = nav.querySelector('[data-nav-panel]');
      if (!panel) return;
      const open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      return;
    }
    if (event.target.closest('[data-nav-panel] a')) {
      closePanel();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const panel = nav.querySelector('[data-nav-panel]');
    if (!panel || !panel.classList.contains('is-open')) return;
    closePanel();
    nav.querySelector('[data-nav-toggle]')?.focus();
  });
}

/* ---- 6.2 Shade reveal: fires once per element, siblings staggered 90ms. ---- */
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  // Reduced motion: render fully visible on load, no observer (6.8).
  if (reducedMotion) {
    targets.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const staggerMs =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--reveal-stagger'), 10) ||
    90;

  /* What gets observed is the element's unclipped `.reveal-frame` wrapper
     (RevealImage.astro), never the `.reveal` box itself. A browser applies
     an element's own clip-path when it computes the intersectionRect it
     reports, and 3.7's resting `clip-path: inset(0 0 100% 0)` clips the box
     to zero height — so observing `.reveal` directly pinned
     intersectionRatio at exactly 0 forever and 6.2's `threshold: 0.15` was
     never met. The reveal simply never fired, on any image on the site.
     Measured directly: same element, same observer options, ratio 0 clipped
     vs 0.67 with `clip-path: none`. The frame is measured, the reveal is
     what gets the class. */
  const boxOf = (el) => el.closest('.reveal-frame') || el;
  const revealOf = new Map();
  targets.forEach((el) => revealOf.set(boxOf(el), el));

  // Sibling stagger groups by the frame's parent, since each `.reveal` is
  // now an only child of its own frame.
  const siblingGroups = new Map();
  targets.forEach((el) => {
    const parent = boxOf(el).parentElement;
    if (!siblingGroups.has(parent)) siblingGroups.set(parent, []);
    siblingGroups.get(parent).push(el);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const box = entry.target;
        const el = revealOf.get(box) || box;
        const siblings = siblingGroups.get(box.parentElement) || [el];
        const index = siblings.indexOf(el);
        window.setTimeout(() => el.classList.add('is-revealed'), index * staggerMs);
        obs.unobserve(box);
      });
    },
    { rootMargin: '-10% 0px', threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(boxOf(el)));

  // Leave-viewport settle (BUILD-PLAN.md). Second, ongoing observer, since
  // the one above unobserves after its one-time reveal. Only matters in CSS
  // once `.is-revealed` is set, so toggling it early is harmless.
  const leaveObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = revealOf.get(entry.target) || entry.target;
        el.classList.toggle('is-leaving-view', !entry.isIntersecting);
      });
    },
    { threshold: 0 }
  );

  targets.forEach((el) => leaveObserver.observe(boxOf(el)));
}

/* ---- 6.1 Hero cross-dissolve + 5.1 opening line. Reveal (3.7) isn't
   handled here: the hero shares the `.reveal` class, and an already-visible
   element reveals for free via initReveal()'s first observer callback. */
function parseCssSeconds(varName) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const value = parseFloat(raw);
  return raw.endsWith('ms') ? value : value * 1000;
}

/* ---- Shared cross-dissolve timer (6.1). ----
   Extracted from initHeroGallery() when the testimonial rotation became a
   second consumer, so the timer logic exists in exactly one place. Both
   callers get the three lessons the hero gallery learned the hard way:

     1. **Single-item guard.** Fewer than two layers means there is nothing to
        cross-dissolve, so no interval is created at all. This is not just an
        optimisation — a one-layer cycle re-runs the same handoff forever and
        was the cause of the hero's repeating-scale bug.
     2. **Reduced motion (6.8).** Returns before creating any timer. The
        caller is responsible for leaving a sensible static first layer.
     3. **Caller-owned cleanup.** Returns its own teardown function rather
        than tracking the interval internally, because these run again on
        every `astro:after-swap` and an uncleaned interval keeps driving
        layers the DOM swap already detached. That leak was real, and this
        signature is what makes forgetting it hard.

   `is-active` / `is-leaving` are the same two classes the hero's CSS already
   keys off, so the visual treatment stays entirely in each component's own
   stylesheet — this function only decides *when*. */
function startCrossDissolve(layers, cycleMs) {
  if (!layers || layers.length < 2 || reducedMotion) return null;

  let index = 0;
  const timer = window.setInterval(() => {
    const next = (index + 1) % layers.length;
    layers[index].classList.add('is-leaving');
    layers[index].classList.remove('is-active');
    layers[next].classList.remove('is-leaving');
    layers[next].classList.add('is-active');
    index = next;
  }, cycleMs);

  return () => window.clearInterval(timer);
}

// Cleanup handles for the two cross-dissolve consumers. Both re-run on every
// `astro:after-swap`; without these, a home -> about -> home round trip leaves
// an extra interval running per visit against detached layers.
let stopHeroGallery = null;
let stopQuoteRotation = null;

function initHeroGallery() {
  if (stopHeroGallery) {
    stopHeroGallery();
    stopHeroGallery = null;
  }

  const gallery = document.querySelector('[data-hero-gallery]');
  if (!gallery) return;

  /* Permanent as of the most recent session (was transient: faded out and
     `.remove()`d after ~3.8s). Still a one-time entrance fade per session
     rather than replaying on every soft navigation back to Home — reduced
     motion or an already-fired session both skip straight to visible, with
     nothing removed either way. */
  const openingLine = document.querySelector('[data-hero-opening-line]');
  if (openingLine) {
    if (reducedMotion || sessionStorage.getItem('akc-opening-line-seen')) {
      openingLine.classList.add('is-visible');
    } else {
      sessionStorage.setItem('akc-opening-line-seen', '1');
      window.setTimeout(() => openingLine.classList.add('is-visible'), 400);
    }
  }

  const layers = gallery.querySelectorAll('[data-hero-layer]');
  const cycleMs = parseCssSeconds('--hero-hold') + parseCssSeconds('--hero-dissolve');
  stopHeroGallery = startCrossDissolve(layers, cycleMs);
}

/* ---- Testimonial rotation (5.1, BUILD-PLAN interpretation call). ----
   Home's second testimonial slot cycles through several real quotes on the
   same 6.1 cross-dissolve the hero uses — deliberately the same device rather
   than a second motion idea, per 3.7's "do not add competing effects."
   The first slot never rotates and has no JS at all.

   No `aria-live`: this is decorative rotation, and announcing a new quote
   every cycle would interrupt a screen-reader user mid-sentence for no gain.
   Whatever quote is in the DOM at load reads normally once, in document
   order, like any other blockquote. */
function initQuoteRotation() {
  if (stopQuoteRotation) {
    stopQuoteRotation();
    stopQuoteRotation = null;
  }

  const rotator = document.querySelector('[data-quote-rotator]');
  if (!rotator) return;

  const layers = rotator.querySelectorAll('[data-quote-layer]');
  const cycleMs = parseCssSeconds('--hero-hold') + parseCssSeconds('--hero-dissolve');
  stopQuoteRotation = startCrossDissolve(layers, cycleMs);
}

/* ---- Hero → next-section scroll ease (BUILD-PLAN.md, not in the brief).
   Fires at most once per page view: any real downward scroll from the very
   top smoothly finishes the trip into `.scroll-ease-target`. Listens to the
   `scroll` event itself, not wheel/touch deltas, so every input triggers it
   identically; never fires backward. Re-runs each `astro:page-load` since
   its target lives in the swapped `<main>` — `cleanup` clears any listener
   from a page view that navigated away before firing, so they don't pile up
   across repeated soft navigations. */
let cleanupHeroScrollEase = null;

function initHeroScrollEase() {
  if (cleanupHeroScrollEase) {
    cleanupHeroScrollEase();
    cleanupHeroScrollEase = null;
  }

  if (reducedMotion) return;

  const target = document.querySelector('.scroll-ease-target');
  if (!target) return;

  if (window.scrollY > 4) return; // only for a fresh load at the very top

  const threshold = 40; // px of real downward scroll before easing the rest of the way in
  let done = false;

  const onScroll = () => {
    if (done) return;
    if (window.scrollY < threshold) return;
    done = true;
    window.removeEventListener('scroll', onScroll);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  cleanupHeroScrollEase = () => window.removeEventListener('scroll', onScroll);
}

/* ---- 6.5 Accordion: blinds decision categories (5.3). The open/close
   animation is entirely CSS (Accordion.astro); this only toggles the class
   and keeps aria-expanded in sync. Items open independently. */
function initAccordion() {
  document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;

    trigger.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
    });
  });
}

// initNav() runs once (its target persists). The others target `<main>`,
// swapped on every navigation, so they need to run immediately here for the
// true first load, then again on `astro:after-swap` for soft navigations.
//
// Deliberately NOT `astro:page-load`: for the true first load, that event is
// wired to the native `window.load` (confirmed from Astro's router source),
// which waits for every image on the page to finish downloading — on this
// image-heavy hero, that left `.reveal` clipped to 0% height (invisible) for
// several real seconds after the page was otherwise fully rendered, directly
// against 8.1's LCP requirement. `astro:after-swap` fires immediately after
// each transition's DOM swap instead, with no such wait, and doesn't fire at
// all for the true first load (nothing to swap yet), so the two together
// cover both cases without ever double-running on the same page view.
initNav();
initReveal();
initHeroGallery();
initQuoteRotation();
initHeroScrollEase();
initAccordion();

document.addEventListener('astro:after-swap', () => {
  initReveal();
  initHeroGallery();
  initQuoteRotation();
  initHeroScrollEase();
  initAccordion();
});
