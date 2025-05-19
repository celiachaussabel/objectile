// fade.js - reusable fade-to-black and redirect utility

/**
 * Fades the screen to black using the element with id 'fadeOverlay', then navigates to the given URL.
 * @param {string} url - The URL to navigate to after fade out.
 * @param {number} duration - Fade duration in milliseconds (default: 3000).
 */
function fadeMusic() {
  if (music.volume > 0.05) {
    music.volume = Math.max(0, music.volume - 0.05);
    setTimeout(fadeMusic, 100);
  } else {
    music.volume = 0;
    music.pause();
  }
}

function handleFadeTransitionEnd(overlay, url, e) {
  if (e.propertyName === 'opacity') {
    overlay.removeEventListener('transitionend', handleFadeTransitionEnd);
    overlay._fadeInProgress = false;
    window.location.href = url;
  }
}

function fadeToScene(url, duration = 1500) {
  let overlay = document.getElementById('fadeOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'fadeOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = '#000';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = `opacity ${duration}ms ease-out`;
    overlay.style.zIndex = '99999';
    document.body.appendChild(overlay);
  } else {
    overlay.style.transition = `opacity ${duration}ms ease-out`;
  }
  if (overlay._fadeInProgress) return;
  overlay._fadeInProgress = true;
  void overlay.offsetWidth;
  overlay.style.opacity = '1';

  // Fade out music if present
  if (typeof music !== 'undefined' && music && typeof music.volume === 'number' && !music.paused) {
    fadeMusic();
  }

  overlay.addEventListener('transitionend', handleFadeTransitionEnd.bind(null, overlay, url));
}




// Optionally, expose as a module for ESM/CommonJS or attach to window for global use
if (typeof window !== 'undefined') {
  window.fadeToScene = fadeToScene;
}
