/* ============================================================
   secret.js — H-A-P-P-Y keyboard easter egg
   ============================================================ */

(function initSecret() {
  const SEQUENCE = ['h', 'a', 'p', 'p', 'y'];
  let typed = [];

  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    typed.push(key);
    if (typed.length > SEQUENCE.length) typed.shift();

    if (JSON.stringify(typed) === JSON.stringify(SEQUENCE)) {
      typed = [];
      revealSecret();
    }
  });

  window.revealSecret = function() {
    const overlay = document.getElementById('secretOverlay');
    overlay.classList.remove('hidden');

    // Particle burst
    EventBus.emit('triggerConfetti', { x: 0.5, y: 0.4, count: 150 });
    EventBus.emit('triggerFireworks', { count: 6 });

    // Emitting hearts everywhere
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        emitHearts(rand(0, window.innerWidth), rand(window.innerHeight * 0.2, window.innerHeight * 0.8), 5);
      }, i * 100);
    }
  };

  window.closeSecret = function() {
    const overlay = document.getElementById('secretOverlay');
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.style.opacity = '';
    }, 400);
  };

  // Close on overlay click
  document.getElementById('secretOverlay').addEventListener('click', function(e) {
    if (e.target === this) window.closeSecret();
  });
})();
