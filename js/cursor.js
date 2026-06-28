/* ============================================================
   cursor.js — Custom cursor with glow + floating hearts
   ============================================================ */

(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let isMoving = false, moveTimer;
  let heartTimer;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';

    isMoving = true;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => isMoving = false, 100);
  });

  // Smooth trail follow
  function animateTrail() {
    trailX = lerp(trailX, mouseX, 0.12);
    trailY = lerp(trailY, mouseY, 0.12);
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Grow cursor on hover
  document.querySelectorAll('a, button, [onclick], .gallery-item, .timeline-card, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '50px';
      cursor.style.height = '50px';
      cursor.style.opacity = '0.6';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.opacity = '1';
    });
  });

  // Click burst
  document.addEventListener('click', (e) => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursor.style.opacity = '0';
    setTimeout(() => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity = '1';
    }, 200);

    // Emit hearts on every click
    // Emit pink hearts on click
    emitHearts(e.clientX, e.clientY, 4);
  });

  // Periodically emit pink sparkle near cursor while moving
  setInterval(() => {
    if (isMoving && Math.random() < 0.35) {
      const h = document.createElement('span');
      h.className = 'floating-heart';
      h.style.left = (mouseX + rand(-15, 15)) + 'px';
      h.style.top = (mouseY + rand(-15, 15)) + 'px';
      h.textContent = pick(['🌸', '✨', '💕', '🩷', '⭐', '💫']);
      h.style.fontSize = rand(10, 16) + 'px';
      h.style.animationDuration = '0.8s';
      document.getElementById('floatingHearts').appendChild(h);
      setTimeout(() => h.remove(), 900);
    }
  }, 110);
})();
