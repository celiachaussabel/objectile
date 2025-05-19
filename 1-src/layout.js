// layout.js - Shared layout functionality for responsive scaling

/**
 * Scales the container element to fit the viewport while maintaining aspect ratio
 * This ensures the 1920x1080 design scales properly on all screen sizes
 */
function scaleContainer() {
  const container = document.querySelector('.container');
  if (container) {
    const w = innerWidth / 1920;
    const h = innerHeight / 1080;
    container.style.transform = `translate(-50%, -50%) scale(${Math.max(w, h)})`;
  }
}

// Initialize scaling on load and resize
window.addEventListener('load', scaleContainer);
window.addEventListener('resize', scaleContainer);
