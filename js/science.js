// Science page - bar chart animations are handled by main.js barObserver
// This file is for any science-page-specific interactivity

// Ensure data-width attributes use percentage format for bar fills
document.querySelectorAll('.bar-fill[data-width]').forEach(fill => {
  const val = fill.getAttribute('data-width');
  if (val && !val.includes('%')) {
    fill.setAttribute('data-width', val + '%');
  }
});

// Outcomes cards: hide initially, reveal with stagger on first scroll
(function() {
  const grid = document.querySelector('.outcomes-grid');
  if (!grid) return;

  const cards = Array.from(grid.children);
  cards.forEach(card => {
    card.classList.add('reveal', 'reveal-up');
  });

  function startObserving() {
    window.removeEventListener('scroll', startObserving);
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.15}s`;
    });
    // Small RAF delay so transition delays are applied before adding 'revealed'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cards.forEach(card => card.classList.add('revealed'));
      });
    });
  }

  window.addEventListener('scroll', startObserving, { once: true });
})();
