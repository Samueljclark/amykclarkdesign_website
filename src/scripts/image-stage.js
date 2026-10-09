// Amy K Clark Design — image-stage.js
//
// One image "stage" that shows one of several stacked photographs, and the
// two ways a page picks which one (COPY-PASS-V1, Tasks 2 and 5):
//
//   data-image-stage="hover"  — Home's service list. Hover, keyboard focus,
//                               or a tap on a row shows that row's photo.
//   data-image-stage="scroll" — /services. Whichever section is crossing the
//                               upper part of the viewport shows its photo.
//
// Markup contract, inside one `[data-image-stage]` root:
//   [data-stage-layer]                      — the stacked photos, in order
//   [data-stage-trigger="<layer index>"]    — hover mode: the rows
//   [data-stage-section="<layer index>"]    — scroll mode: the sections
// The active layer gets `.is-active`; the root gets `data-stage-active` once
// JS has taken over, which is what lets each component's CSS drop its no-JS
// resting state (first layer showing).
//
// WHY THIS IS JS NOW (Task 2 root cause). The Home swap used to be pure CSS,
// and every swap rule sat inside `@media (prefers-reduced-motion:
// no-preference)`. With macOS Reduce Motion on, those rules did not exist and
// the stage stayed frozen on the first photo — that is the "works on one Mac,
// not the other" bug, reproduced in Chromium and WebKit. The swap is content,
// not motion; only the crossfade is motion. So the swap now happens here,
// unconditionally, and each component's CSS gates only the `transition` on
// reduced motion. Touch and keyboard were never wired at all (the stage was
// `(hover: hover)` only and the rows were not focusable); they are now.
//
// LIFECYCLE (COPY-PASS-V1 ground rule 13). The site uses Astro view
// transitions, so `<main>` is replaced on every soft navigation:
//   - init runs on `astro:page-load` (every navigation, including the first);
//   - it is also called once at module evaluation, so the first page view
//     responds before `window.load` (which `astro:page-load` waits for on a
//     true first load — see motion.js's note on the hero reveal);
//   - every init tears down the previous one first, so repeated calls can
//     never stack listeners; teardown also runs on `astro:before-swap`;
//   - nothing is cached across page views: roots, layers, triggers and
//     sections are queried fresh on each init and released on teardown.

let teardown = null;

function setActive(root, layers, index) {
  if (!layers[index]) return;
  layers.forEach((layer, i) => layer.classList.toggle('is-active', i === index));
  root.dataset.stageActive = String(index);
}

function initHoverStage(root, signal) {
  const layers = [...root.querySelectorAll('[data-stage-layer]')];
  const triggers = [...root.querySelectorAll('[data-stage-trigger]')];
  if (!layers.length || !triggers.length) return;

  // A re-init on the same page view (first load, then `astro:page-load`)
  // keeps whatever the reader already picked; a fresh page starts at 0.
  setActive(root, layers, Number(root.dataset.stageActive ?? 0));

  triggers.forEach((trigger) => {
    const index = Number(trigger.dataset.stageTrigger);
    const show = () => setActive(root, layers, index);
    // Mouse and pen hover. Touch fires pointerenter too, which is harmless.
    trigger.addEventListener('pointerenter', show, { signal });
    // Keyboard (and any programmatic focus).
    trigger.addEventListener('focus', show, { signal });
    // Tap on touch screens, where there is no hover to speak of.
    trigger.addEventListener('click', show, { signal });
  });
}

function initScrollStage(root, signal) {
  const layers = [...root.querySelectorAll('[data-stage-layer]')];
  const sections = [...root.querySelectorAll('[data-stage-section]')];
  if (!layers.length || !sections.length) return;

  setActive(root, layers, Number(sections[0].dataset.stageSection));

  // A thin band 35-40% of the way down the viewport. The section crossing it
  // owns the stage — wide enough that a fast scroll cannot skip it, narrow
  // enough that exactly one section is usually inside.
  const visible = new Set();
  const pick = () => {
    const current = sections.filter((s) => visible.has(s));
    if (!current.length) return;
    // If two share the band, the later one is the one arriving.
    setActive(root, layers, Number(current[current.length - 1].dataset.stageSection));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      pick();
    },
    { rootMargin: '-35% 0px -60% 0px', threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
  signal.addEventListener('abort', () => observer.disconnect());
}

export function initImageStages() {
  if (teardown) teardown();

  const controller = new AbortController();
  teardown = () => {
    controller.abort();
    teardown = null;
  };

  document.querySelectorAll('[data-image-stage]').forEach((root) => {
    if (root.dataset.imageStage === 'scroll') initScrollStage(root, controller.signal);
    else initHoverStage(root, controller.signal);
  });
}

initImageStages();
document.addEventListener('astro:page-load', initImageStages);
document.addEventListener('astro:before-swap', () => {
  if (teardown) teardown();
});
