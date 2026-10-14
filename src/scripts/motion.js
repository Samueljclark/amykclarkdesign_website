// Amy K Clark Design — motion.js
// Vanilla JS, no library (DESIGN_BRIEF.md 6). Accordion (6.5) still lands
// with the page that uses it. Everything below is gated on 6.8.

// Image stages (Home's service hover, /services' scroll-synced image) carry
// their own lifecycle; see that file.
import './image-stage.js';

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

   FIX, 2026-08-28 — third attempt at the "mobile hamburger stops working
   after you navigate" bug. The first two were reasoned about and shipped
   unverified; this one was reproduced and measured in a running browser
   first, which is the only reason the actual cause turned up.

   TWO symptoms, ONE cause:
     1. After navigating to any second page, tapping the hamburger did
        nothing. The menu never opened again for the rest of the session.
     2. On Home, after navigating away and back, the nav never went solid on
        scroll — white nav type sitting on white page content.

   Cause, measured live rather than assumed: **`<SiteNav transition:persist />`
   in Base.astro is a silent no-op.** Astro only applies `transition:persist`
   to a *component* if that component forwards the generated
   `data-astro-transition-persist` attribute onto a real element, and
   SiteNav.astro's `<header>` does not spread `Astro.props`. Verified in the
   running page: after a soft navigation
   `document.querySelectorAll('[data-astro-transition-persist]')` is EMPTY,
   the previously-captured `<header>` reports `isConnected === false`, and the
   visible `<header>` is a brand-new node. (SiteFooter has the same no-op
   directive. Neither is fixed here — turning real persistence ON is a change
   to how page transitions look, which is Sam's call, not a bug fix.)

   So the header IS destroyed and rebuilt on every navigation, and every node
   reference captured at startup goes stale one navigation in. The previous
   fix moved the listeners onto `document` — right idea, and `document` really
   does survive — but each handler still resolved the panel as
   `nav.querySelector(...)` against the ONE `nav` captured when this function
   ran. Measured consequence, exactly the reported bug: the click set
   `is-open` on the DETACHED panel while the visible panel never moved, and
   `aria-expanded` flipped on the live button, so the two also desynced and
   the next tap set it back to false while still doing nothing. The scroll
   handler wrote `is-solid` / `on-dark` to that same detached header, which is
   symptom 2.

   THE RULE THIS FUNCTION NOW FOLLOWS, and the one to keep if it is touched
   again: **hold no element references.** `document` is the only thing closed
   over, because it is the only thing never replaced. Every handler re-queries
   from `document` at the moment of the event. That is correct whether the
   header persists, is rebuilt, or comes back from bfcache — it no longer
   depends on which, so it cannot silently break again if that answer
   changes. */
let navInitialised = false;

function initNav() {
  // Resolved fresh at every use, never cached — see the rule above.
  const getNav = () => document.querySelector('[data-nav]');
  const getToggle = () => document.querySelector('[data-nav-toggle]');
  const getPanel = () => document.querySelector('[data-nav-panel]');

  const setPanelOpen = (open) => {
    const panel = getPanel();
    const toggle = getToggle();
    if (!panel || !toggle) return;
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  const closePanel = () => setPanelOpen(false);
  const isPanelOpen = () => !!getPanel()?.classList.contains('is-open');

  const threshold = () => window.innerHeight * 0.8;

  // A named, stable function so the add/remove pair below always matches, and
  // so a double-add is deduped by the browser rather than stacking listeners.
  const applyScrollState = () => {
    const nav = getNav();
    if (!nav) return;
    const solid = window.scrollY > threshold();
    nav.classList.toggle('is-solid', solid);
    // .on-dark: the --indigo -> --paper contrast fallback (tokens.css).
    nav.classList.toggle('on-dark', !solid);
  };

  let scrollBound = false;

  const syncNavForPage = () => {
    const nav = getNav();
    if (!nav) return;

    closePanel();

    const transparent = document.body.dataset.transparentNav === 'true';
    nav.dataset.navTransparent = transparent ? 'true' : 'false';

    if (scrollBound) {
      window.removeEventListener('scroll', applyScrollState);
      scrollBound = false;
    }

    if (transparent) {
      applyScrollState();
      window.addEventListener('scroll', applyScrollState, { passive: true });
      scrollBound = true;
    } else {
      nav.classList.remove('is-solid', 'on-dark');
    }

    // Re-queried per page: with the header rebuilt each navigation these are
    // new <a> nodes every time, and the set changes when a nav flag flips.
    const currentPath = window.location.pathname;
    nav.querySelectorAll('.site-nav__list a[href]').forEach((link) => {
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

  // Guarded so the delegated listeners below can never be registered twice,
  // even if some future caller runs initNav() again on a soft navigation the
  // way the other init functions are run.
  if (navInitialised) return;
  navInitialised = true;

  document.addEventListener('astro:after-swap', syncNavForPage);

  // One delegated listener covers the toggle, every link inside the panel,
  // and tapping away from an open menu.
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest('[data-nav-toggle]')) {
      setPanelOpen(!isPanelOpen());
      return;
    }
    if (target.closest('[data-nav-panel] a')) {
      closePanel();
      return;
    }
    // Tapping anywhere else while the menu is open closes it. Without this the
    // panel covers the top of the page and the only way out is the toggle
    // itself — on a phone that reads as the menu being stuck.
    if (isPanelOpen() && !target.closest('[data-nav]')) {
      closePanel();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isPanelOpen()) return;
    closePanel();
    getToggle()?.focus();
  });

  // Crossing into the desktop row leaves `is-open` and aria-expanded set on a
  // control that is now display:none; coming back to a narrow width then shows
  // the menu already open without anyone asking for it.
  const desktopRow = window.matchMedia('(min-width: 900px)');
  const onBreakpoint = (event) => {
    if (event.matches) closePanel();
  };
  if (desktopRow.addEventListener) {
    desktopRow.addEventListener('change', onBreakpoint);
  } else {
    desktopRow.addListener(onBreakpoint); // Safari < 14
  }
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
    // try/catch (2026-10-08): with storage blocked, an uncaught throw here
    // stopped this whole module, taking every later init with it.
    let seen = true;
    try {
      seen = !!sessionStorage.getItem('akc-opening-line-seen');
      if (!seen) sessionStorage.setItem('akc-opening-line-seen', '1');
    } catch {
      seen = true;
    }
    if (reducedMotion || seen) {
      openingLine.classList.add('is-visible');
    } else {
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

/* ---- Hero → next-section scroll ease (BUILD-PLAN.md; DESIGN_BRIEF 6.9).
   Home only: the first small downward wheel, trackpad, or touch scroll from
   the very top smoothly carries the page to `.scroll-ease-target`, then
   hands control straight back.

   Reworked 2026-10-08 (COPY-PASS-V1, Task 4), on Sam's request. The
   mechanism was never removed; it was off on Sam's Mac because macOS Reduce
   Motion is on, and it still is off under reduced motion, by design (6.8).
   What changed:
     - **Once per browser session**, not once per page view: coming back to
       Home in the same session does not fire it again. sessionStorage,
       wrapped in try/catch; if storage is unavailable it falls back to once
       per page load (the module-level flag below).
     - **Triggered by input, not by the `scroll` event.** A wheel/trackpad
       or touch gesture at the top is what arms it, so scroll restoration on
       a refresh, the back button, or a #hash jump can never fire it. It also
       refuses to arm at all if the page loads scrolled or with a hash.
       Touch still triggers it, as the scroll-event version did.
     - **Momentum lock.** While the animation runs, and until the trackpad's
       momentum tail goes quiet (or a hard cap), further wheel and touch
       input is swallowed so it cannot fight the ease or carry the page past
       the section it lands on. Then control is the reader's again.
     - Lifecycle per COPY-PASS-V1 ground rule 13: re-armed on
       `astro:page-load`, torn down on `astro:before-swap`, nothing cached
       across page views. Also armed once at module evaluation so the first
       page view works before `window.load`. ---- */
const HERO_EASE_KEY = 'akc-hero-advance-done';
let heroEaseFiredThisLoad = false;
let heroEaseAnimating = false;
let cleanupHeroScrollEase = null;

function heroEaseAlreadyFired() {
  if (heroEaseFiredThisLoad) return true;
  try {
    return sessionStorage.getItem(HERO_EASE_KEY) === '1';
  } catch {
    return false;
  }
}

function markHeroEaseFired() {
  heroEaseFiredThisLoad = true;
  try {
    sessionStorage.setItem(HERO_EASE_KEY, '1');
  } catch {
    // Storage blocked: the module flag above keeps it to once per page load.
  }
}

// Swallows wheel and touch scrolling while the ease runs and until the
// momentum tail stops: released after `quietMs` with no wheel events once
// the page has arrived, or after `capMs` regardless.
function lockScrollInputUntilSettled(targetTop) {
  heroEaseAnimating = true;
  const quietMs = 180;
  const capMs = 3000; // a long Mac trackpad momentum tail runs ~2-3s
  const started = performance.now();
  let lastInput = started;
  let arrived = false;

  const swallow = (event) => {
    lastInput = performance.now();
    if (event.cancelable) event.preventDefault();
  };
  window.addEventListener('wheel', swallow, { passive: false });
  window.addEventListener('touchmove', swallow, { passive: false });

  const release = () => {
    window.removeEventListener('wheel', swallow);
    window.removeEventListener('touchmove', swallow);
    heroEaseAnimating = false;
  };

  let lastY = window.scrollY;
  let stillFrames = 0;
  const tick = () => {
    const now = performance.now();
    const y = window.scrollY;
    stillFrames = Math.abs(y - lastY) < 0.5 ? stillFrames + 1 : 0;
    lastY = y;
    if (!arrived && (Math.abs(y - targetTop) < 2 || stillFrames > 8)) arrived = true;
    if (now - started > capMs || (arrived && now - lastInput > quietMs)) {
      release();
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initHeroScrollEase() {
  // An ease in flight owns its own listeners; leave it to finish.
  if (heroEaseAnimating) return;

  if (cleanupHeroScrollEase) {
    cleanupHeroScrollEase();
    cleanupHeroScrollEase = null;
  }

  if (heroEaseAlreadyFired()) return;
  if (!document.querySelector('.scroll-ease-target')) return;
  // Never for a page that loads anywhere but the very top.
  if (window.location.hash || window.scrollY > 4) return;

  const atTop = () => window.scrollY <= 40;
  let touchStartY = null;

  const fire = (event) => {
    // Checked live, not at load: the setting can change mid-visit.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = document.querySelector('.scroll-ease-target');
    if (!target || heroEaseAlreadyFired() || !atTop()) return;

    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const top = Math.round(target.getBoundingClientRect().top + window.scrollY - margin);
    if (top <= window.scrollY) return; // never backward

    if (event.cancelable) event.preventDefault();
    markHeroEaseFired();
    cleanup();
    lockScrollInputUntilSettled(top);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const onWheel = (event) => {
    if (event.deltaY > 0) fire(event);
  };
  const onTouchStart = (event) => {
    touchStartY = event.touches[0]?.clientY ?? null;
  };
  const onTouchMove = (event) => {
    if (touchStartY === null) return;
    const y = event.touches[0]?.clientY ?? touchStartY;
    // Finger moving up = page scrolling down. A small dead zone so a tap
    // that wobbles does not count as a scroll.
    if (touchStartY - y > 8) fire(event);
  };

  const cleanup = () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    cleanupHeroScrollEase = null;
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  cleanupHeroScrollEase = cleanup;
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
  initAccordion();
});

// The hero ease follows COPY-PASS-V1 ground rule 13 (see its header):
// re-armed on every page load, torn down whenever the page is swapped out.
document.addEventListener('astro:page-load', initHeroScrollEase);
document.addEventListener('astro:before-swap', () => {
  if (cleanupHeroScrollEase) cleanupHeroScrollEase();
});
