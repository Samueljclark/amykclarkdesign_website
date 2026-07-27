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
   plus `location.pathname` on `astro:after-swap`. */
function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const navLinks = nav.querySelectorAll('.site-nav__list a[href]');
  const toggle = nav.querySelector('[data-nav-toggle]');
  const panel = nav.querySelector('[data-nav-panel]');

  const closePanel = () => {
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

  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closePanel);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) {
      closePanel();
      toggle.focus();
    }
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

// Same reason `cleanupHeroScrollEase` below exists: this runs again on every
// `astro:after-swap`, so without clearing the previous timer a home -> about ->
// home round trip leaves one extra interval running per visit, all of them
// driving layers that were detached by the DOM swap. Currently latent — the hero
// array holds one image and the `layers.length < 2` guard returns before any
// timer is set — but it activates the moment a second hero image is added, which
// is what happens when Kelsee's photography lands. Cleared here rather than in a
// separate cleanup function because there is exactly one timer to track.
let heroGalleryTimer = null;

function initHeroGallery() {
  if (heroGalleryTimer !== null) {
    window.clearInterval(heroGalleryTimer);
    heroGalleryTimer = null;
  }

  const gallery = document.querySelector('[data-hero-gallery]');
  if (!gallery) return;

  const openingLine = document.querySelector('[data-hero-opening-line]');
  if (openingLine) {
    if (reducedMotion || sessionStorage.getItem('akc-opening-line-seen')) {
      openingLine.remove();
    } else {
      sessionStorage.setItem('akc-opening-line-seen', '1');
      window.setTimeout(() => openingLine.classList.add('is-visible'), 400);
      window.setTimeout(() => openingLine.classList.add('is-hiding'), 400 + 2500);
      window.setTimeout(() => openingLine.remove(), 400 + 2500 + 900);
    }
  }

  const layers = gallery.querySelectorAll('[data-hero-layer]');
  if (layers.length < 2 || reducedMotion) return;

  const cycleMs = parseCssSeconds('--hero-hold') + parseCssSeconds('--hero-dissolve');
  let index = 0;
  heroGalleryTimer = window.setInterval(() => {
    const next = (index + 1) % layers.length;
    layers[index].classList.add('is-leaving');
    layers[index].classList.remove('is-active');
    layers[next].classList.remove('is-leaving');
    layers[next].classList.add('is-active');
    index = next;
  }, cycleMs);
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
initHeroScrollEase();
initAccordion();

document.addEventListener('astro:after-swap', () => {
  initReveal();
  initHeroGallery();
  initHeroScrollEase();
  initAccordion();
});
