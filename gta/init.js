// gta/init.js
// Initialization helpers for the GTA loading / UI screens.
// - Ensures a ticker element (#ticker-idx) exists inside the hint HUD header
// - Ensures an audio element (#loading-audio) exists and attaches safe gesture-based unmute
// - Exposes a simple initGame() stub for future expansion

(function () {
  function ensureTicker() {
    if (document.getElementById('ticker-idx')) return;
    const header = document.querySelector('.hint-hud-header');
    if (!header) return;

    const ticker = document.createElement('span');
    ticker.id = 'ticker-idx';
    ticker.className = 'hint-status-ticker';
    ticker.textContent = 'SYS.01';
    header.appendChild(ticker);
  }

  function ensureAudio() {
    let audioEl = document.getElementById('loading-audio');
    if (!audioEl) {
      audioEl = document.createElement('audio');
      audioEl.id = 'loading-audio';
      // Start muted so browsers allow autoplay; we will unmute on first user gesture
      audioEl.muted = true;
      audioEl.loop = true;
      audioEl.setAttribute('preload', 'auto');
      // No default src included so the file can be easily set by the page author.
      // If you want background music, set audioEl.src = 'path/to/music.mp3' in your page or here.
      document.body.appendChild(audioEl);
    }

    // Attempt autoplay; many browsers allow autoplay when the element is muted.
    try {
      const p = audioEl.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          console.log('[init] background audio autoplay succeeded (muted).');
        }).catch(() => {
          console.log('[init] autoplay blocked; will wait for user gesture to start.');
        });
      }
    } catch (e) {
      // ignore
    }

    // Unmute on first meaningful user gesture and set a pleasant default volume.
    function unmuteOnGesture() {
      try {
        if (!audioEl) return;
        audioEl.muted = false;
        audioEl.volume = 0.12;
        audioEl.play().catch(() => {});
      } finally {
        window.removeEventListener('click', unmuteOnGesture);
        window.removeEventListener('keydown', unmuteOnGesture);
        window.removeEventListener('touchstart', unmuteOnGesture);
      }
    }

    window.addEventListener('click', unmuteOnGesture, { once: true });
    window.addEventListener('keydown', unmuteOnGesture, { once: true });
    window.addEventListener('touchstart', unmuteOnGesture, { once: true });

    return audioEl;
  }

  function initGame() {
    ensureTicker();
    const audio = ensureAudio();
    // Future initialization work can be added here (asset loaders, input hooks, state machines, ...)
    return {
      audio
    };
  }

  // Auto-run on DOMContentLoaded when included on a page
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      try {
        initGame();
        console.log('[init] GTA init.js: initialization complete.');
      } catch (err) {
        console.error('[init] Error during init:', err);
      }
    });

    // Export to the global namespace for interactive debugging / calls
    window.GTA = window.GTA || {};
    window.GTA.initGame = initGame;
  }
})();
