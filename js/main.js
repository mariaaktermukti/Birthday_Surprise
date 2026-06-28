/* ============================================================
   main.js — App bootstrap and global interactions
   ============================================================ */

(function main() {
  // ---- Random ambient confetti (occasional) ----
  EventBus.on('mainUnlocked', () => {
    // Welcome confetti burst when page unlocks
    setTimeout(() => {
      EventBus.emit('triggerConfetti', { x: 0.2, y: 0.1, count: 80 });
      setTimeout(() => {
        EventBus.emit('triggerConfetti', { x: 0.8, y: 0.1, count: 80 });
      }, 300);
    }, 1500);

    // Occasional random shooting star confetti every 40-70 seconds
    function scheduleAmbientConfetti() {
      const delay = rand(40000, 70000);
      setTimeout(() => {
        EventBus.emit('triggerConfetti', { x: rand(0.1, 0.9), y: 0.0, count: 30 });
        scheduleAmbientConfetti();
      }, delay);
    }
    scheduleAmbientConfetti();

    // ---- Shooting stars (CSS-based) ----
    initShootingStars();

    // ---- Ambient cursor glow orb on hero ----
    initHeroGlow();
  });

  // ---- Shooting stars ----
  function initShootingStars() {
    const style = document.createElement('style');
    style.textContent = `
      .shooting-star {
        position: fixed;
        top: 0;
        left: 0;
        width: 2px;
        height: 2px;
        background: linear-gradient(90deg, rgba(255,45,120,0.9), rgba(255,107,157,0.6), transparent);
        border-radius: 100px;
        pointer-events: none;
        z-index: 1;
        animation: shootingStar linear forwards;
      }
      @keyframes shootingStar {
        0% { transform: translate(var(--sx), var(--sy)) rotate(var(--angle)); opacity: 1; width: 0px; }
        10% { width: 80px; }
        100% { transform: translate(calc(var(--sx) + var(--dx)), calc(var(--sy) + var(--dy))) rotate(var(--angle)); opacity: 0; width: 120px; }
      }
    `;
    document.head.appendChild(style);

    function spawnShootingStar() {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      const angle = rand(20, 50);
      const startX = rand(10, 80);
      const startY = rand(0, 30);
      const dist = rand(200, 400);
      const duration = rand(0.8, 1.5);

      star.style.setProperty('--sx', startX + 'vw');
      star.style.setProperty('--sy', startY + 'vh');
      star.style.setProperty('--angle', angle + 'deg');
      star.style.setProperty('--dx', (Math.cos(angle * Math.PI / 180) * dist) + 'px');
      star.style.setProperty('--dy', (Math.sin(angle * Math.PI / 180) * dist) + 'px');
      star.style.animationDuration = duration + 's';
      star.style.filter = 'drop-shadow(0 0 3px rgba(255,45,120,0.8))';

      document.body.appendChild(star);
      setTimeout(() => star.remove(), duration * 1000 + 100);
    }

    // Spawn shooting stars randomly
    function scheduleShootingStar() {
      const delay = rand(3000, 9000);
      setTimeout(() => {
        spawnShootingStar();
        scheduleShootingStar();
      }, delay);
    }
    scheduleShootingStar();
  }

  // ---- Hero ambient glow follows cursor ----
  function initHeroGlow() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,209,102,0.04) 0%, transparent 70%);
      pointer-events: none;
      z-index: 5;
      transform: translate(-50%, -50%);
      transition: left 0.3s ease, top 0.3s ease;
    `;
    hero.style.position = 'relative';
    hero.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top = (e.clientY - rect.top) + 'px';
      }
    });
  }

  // ---- Smooth hash navigation ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Console Easter Egg ----
  console.log('%c❤️ Happy Birthday! ❤️', 'color: #FFD166; font-size: 24px; font-weight: bold; font-family: Georgia, serif;');
  console.log('%cThis website was made with love. Every pixel placed with intention. Every word written from the heart.', 'color: #C9A96E; font-size: 12px; font-style: italic;');
  console.log('%cIf you found this, you\'re as curious as she is. She\'d like that about you. 😊', 'color: rgba(255,255,255,0.4); font-size: 11px;');
})();
