// Science page - bar chart animations are handled by main.js barObserver
// This file is for any science-page-specific interactivity

// Ensure data-width attributes use percentage format for bar fills
document.querySelectorAll('.bar-fill[data-width]').forEach(fill => {
  const val = fill.getAttribute('data-width');
  if (val && !val.includes('%')) {
    fill.setAttribute('data-width', val + '%');
  }
});
