// video.js - Video utility functions

/**
 * Shows an intro video using the popup API.
 * 
 * @param {string} videoPath - Path to the video file
 * @param {number} delay - Delay in milliseconds before showing the video
 * @param {boolean} tintBackground - Whether to show a background overlay
 * @param {boolean} center - Whether the popup is centered on screen
 * @param {boolean} fullscreen - Whether the video should fill the container without margins
 * @param {boolean} autoplay - Whether the video should autoplay
 * @param {string=} nextScene - Optional path to navigate to after the video ends
 * @param {string=} endAction - What to do when video ends: 'dismiss' (default) or 'loop'
 */
function showIntroVideo(videoPath, delay = 0, tintBackground = true, center = true, fullscreen = false, autoplay = true, nextScene = null, endAction = 'dismiss', skippable = false) {
    // Remove any existing intro video popup
    const existing = document.getElementById('intro-video-modal');
    if (existing) existing.remove();
    const existingOverlay = document.getElementById('intro-video-overlay');
    if (existingOverlay) existingOverlay.remove();

    // Create overlay if needed
    let overlay = null;
    if (tintBackground) {
        overlay = document.createElement('div');
        overlay.id = 'intro-video-overlay';
        overlay.className = 'fade-overlay shared-popup-overlay';
        overlay.style.opacity = '1';
        document.body.appendChild(overlay);
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'intro-video-modal';
    modal.className = 'popup shared-popup show centered';
    modal.style.opacity = '0';

    // Video element
    const video = document.createElement('video');
    video.src = videoPath;
    video.autoplay = !!autoplay;
    video.muted = true;
    video.playsInline = true;
    video.className = 'popup-video';
    video.setAttribute('tabindex', '-1');

    modal.appendChild(video);
    document.body.appendChild(modal);

    // Fade in
    setTimeout(() => { modal.style.opacity = '1'; }, 10);
    if (overlay) setTimeout(() => { overlay.style.opacity = '1'; }, 10);

    // Dismiss and unmute logic
    let unmuted = false;
    video.addEventListener('click', function handler(e) {
        e.stopPropagation();
        if (!unmuted) {
            video.muted = false;
            unmuted = true;
        } else if (skippable) {
            cleanup();
        }
        // If skippable is false, do nothing on subsequent clicks
    });
    if (endAction !== 'loop') {
        video.addEventListener('ended', cleanup);
    }

    // Dismiss on overlay click (if present)
    if (overlay) overlay.onclick = cleanup;

    // Dismiss and cleanup function
    function cleanup() {
        modal.style.opacity = '0';
        if (overlay) overlay.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) modal.parentNode.removeChild(modal);
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            if (nextScene) window.location.href = nextScene;
        }, 300);
    }

    // Optionally delay show
    if (delay > 0) {
        modal.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        setTimeout(() => {
            modal.style.display = 'flex';
            if (overlay) overlay.style.display = 'block';
            setTimeout(() => { modal.style.opacity = '1'; if (overlay) overlay.style.opacity = '1'; }, 10);
        }, delay);
    }
}





// Make showIntroVideo globally accessible
window.showIntroVideo = showIntroVideo;

// Video utilities for shared functionality
window.videoUtils = {
    /**
     * Creates a video element with standard settings
     * @param {Object} options - Configuration options
     * @param {string} options.src - Source URL for the video
     * @param {number} options.fadeDuration - Duration of fade effect in ms
     * @param {boolean} options.autoplay - Whether video should autoplay
     * @param {boolean} options.muted - Whether video should be muted
     * @param {boolean} options.playsinline - Whether video should play inline on mobile
     * @param {boolean} options.skippable - Whether video can be skipped
     * @param {boolean} options.loop - Whether video should loop
     * @param {Function} options.onFadeOut - Callback when video fades out
     * @returns {HTMLVideoElement} The created video element
     */
    createSharedVideoElement: function (options) {
        const {
            src,
            fadeDuration = 0,
            autoplay = true,
            muted = false,
            playsinline = true,
            skippable = true,
            loop = false,
            onFadeOut = null
        } = options || {};

        const video = document.createElement('video');
        video.src = src;
        video.autoplay = autoplay;
        video.muted = muted;
        video.playsinline = true;
        video.setAttribute('playsinline', '');

        // Simply set the loop attribute based on the loop parameter
        video.loop = loop;

        // Don't show controls for consistent styling with intro videos
        video.controls = false;

        // Handle fade effect if specified
        if (typeof onFadeOut === 'function' && fadeDuration > 0 && !loop) {
            video.addEventListener('ended', function () {
                onFadeOut(video, fadeDuration);
            });
        }

        return video;
    }
}
