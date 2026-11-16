/* Optional mobile catalogue filters. All filters remain accessible in the DOM. */
(() => {
  const toggle = document.getElementById('dcat-filter-toggle');
  const panel = document.getElementById('dcat-filter-panel');
  if(!toggle || !panel) return;
  const sync = () => { if (window.matchMedia('(min-width:641px)').matches) { panel.classList.remove('is-expanded'); toggle.setAttribute('aria-expanded','false'); } };
  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(open));
  });
  window.addEventListener('resize', sync);
})();
