// Hero demo: video plays → double back tap → "Checking claim…" → verdict in the Island, then loops.
// The markup starts on the verdict, so with no JS (or reduced motion) the finished state shows.
(() => {
  const stage = document.querySelector('[data-demo="hero"]');
  if (!stage || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const steps = [
    ['idle', 1800],
    ['tap', 900],
    ['checking', 2300],
    ['verdict', 5200],
  ];
  let index = 0;
  let timer = 0;

  const run = () => {
    const [step, duration] = steps[index];
    stage.dataset.step = step;
    index = (index + 1) % steps.length;
    timer = setTimeout(run, duration);
  };

  // Only animate while the hero is on screen.
  new IntersectionObserver(([entry]) => {
    clearTimeout(timer);
    if (entry.isIntersecting) run();
  }, { threshold: 0.35 }).observe(stage);
})();

// Mobile menu: open/close the primary nav.
(() => {
  const header = document.querySelector('.site-header');
  const toggle = header.querySelector('.nav-toggle');
  const setOpen = (open) => {
    header.toggleAttribute('data-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!header.hasAttribute('data-open')));
  header.querySelector('.primary-nav').addEventListener('click', (event) => event.target.closest('a') && setOpen(false));
  document.addEventListener('keydown', (event) => event.key === 'Escape' && setOpen(false));
})();

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});
