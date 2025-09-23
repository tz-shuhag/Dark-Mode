function applyDarkMode() {
  // Apply filter to body only
  document.body.style.filter = 'invert(100%) hue-rotate(180deg)';
  document.body.style.backgroundColor = '#fcfcfc';

  // Remove filter from images, videos, etc.
  const elements = document.querySelectorAll('img, video, picture, iframe, svg, [style*="background-image"]');
  elements.forEach(el => {
    el.style.filter = 'invert(100%) hue-rotate(180deg)';
  });

  document.documentElement.classList.add('dark-mode-on');
}

function removeDarkMode() {
  // Remove filters
  document.body.style.filter = '';
  document.body.style.backgroundColor = '';

  const elements = document.querySelectorAll('img, video, picture, iframe, svg, [style*="background-image"]');
  elements.forEach(el => {
    el.style.filter = '';
  });

  document.documentElement.classList.remove('dark-mode-on');
}
