// A missing screenshot keeps the designed placeholder; adding the file is enough.
document.querySelectorAll('[data-demo-image]').forEach(image => {
  image.addEventListener('load', () => {
    image.hidden = false;
    image.previousElementSibling.hidden = true;
  });
  image.src = image.dataset.demoImage;
});
const header = document.querySelector('.site-header');
const toggle = header.querySelector('.nav-toggle');
const setOpen = open => {
  header.toggleAttribute('data-open', open);
  toggle.setAttribute('aria-expanded', String(open));
};
toggle.addEventListener('click', () => setOpen(!header.hasAttribute('data-open')));
header.querySelector('.primary-nav').addEventListener('click', event => {
  if (event.target.closest('a')) setOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { setOpen(false); if (document.activeElement.closest('.primary-nav')) toggle.focus(); }
});
document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());

// Scroll-linked perspective, with native scrolling and one frame per scroll update.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const scenes = [...document.querySelectorAll('[data-scroll-scene]')];
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);
let frame = 0;
function render() {
  frame = 0;
  const height = innerHeight;
  const distance = document.documentElement.scrollHeight - height;
  progress.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
  scenes.forEach(scene => {
    const box = scene.getBoundingClientRect();
    if (box.bottom < -100 || box.top > height + 100) return;
    const p = Math.max(-1, Math.min(1, (box.top + box.height / 2 - height / 2) / height));
    scene.querySelectorAll('.demo-device').forEach((device, index) => {
      device.style.setProperty('--rx', `${reduced.matches ? 0 : p * 28}deg`);
      device.style.setProperty('--ry', `${reduced.matches ? 0 : p * -38 + (index - (scene.children.length > 2 ? 1 : 0)) * 2}deg`);
      device.style.setProperty('--drift', `${reduced.matches ? 0 : p * (index % 2 ? -30 : 30)}px`);
      device.style.setProperty('--lift', `${reduced.matches ? 0 : p * 70}px`);
    });
    scene.style.setProperty('--sticker-y', `${reduced.matches ? 0 : -p * 65}px`);
  });
}
function schedule() { if (!frame) frame = requestAnimationFrame(render); }
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule);
reduced.addEventListener('change', schedule);
schedule();
