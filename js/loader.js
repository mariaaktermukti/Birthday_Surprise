/* ============================================================
   loader.js — Animated luxury loader
   ============================================================ */

(function initLoader() {
  const canvas = document.getElementById('loaderCanvas');
  const ctx = canvas.getContext('2d');
  const fill = document.getElementById('loaderFill');
  const loaderText = document.getElementById('loaderText');
  const loaderSubText = document.getElementById('loaderSubText');

  let animFrame, particles = [], progress = 0, done = false;
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Loader particles — pink palette
  const pinkColors = [
    [255, 45, 120],   // hot pink
    [255, 107, 157],  // rose pink
    [255, 143, 177],  // soft rose
    [232, 180, 255],  // lavender
    [255, 209, 220],  // blush
    [255, 255, 255],  // white
  ];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.5 + 0.05,
      speed: Math.random() * 0.4 + 0.1,
      dir: Math.random() * Math.PI * 2,
      color: pick(pinkColors),
    });
  }

  function drawLoader(ts) {
    if (done) return;
    animFrame = requestAnimationFrame(drawLoader);
    ctx.clearRect(0, 0, w, h);

    // Draw particles
    particles.forEach(p => {
      p.x += Math.cos(p.dir) * p.speed;
      p.y += Math.sin(p.dir) * p.speed;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const c = p.color;
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${p.alpha})`;
      ctx.fill();
    });

    // Glowing pink orbs
    const t = ts / 1000;
    const orbs = [
      { x: w * 0.25 + Math.sin(t * 0.4) * 70, y: h * 0.35 + Math.cos(t * 0.3) * 50, r: 140, color: '255,45,120', a: 0.06 },
      { x: w * 0.75 + Math.cos(t * 0.3) * 60, y: h * 0.65 + Math.sin(t * 0.4) * 50, r: 180, color: '232,54,106', a: 0.04 },
      { x: w * 0.5 + Math.sin(t * 0.6) * 40, y: h * 0.25 + Math.cos(t * 0.5) * 70, r: 100, color: '201,160,192', a: 0.05 },
      { x: w * 0.15 + Math.cos(t * 0.5) * 30, y: h * 0.75 + Math.sin(t * 0.6) * 40, r: 80, color: '232,180,255', a: 0.04 },
    ];
    orbs.forEach(o => {
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `rgba(${o.color},${o.a})`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
  }
  animFrame = requestAnimationFrame(drawLoader);

  // Progress simulation
  const messages = [
    'Preparing a very special surprise... 💕',
    'Gathering all the love...',
    'Wrapping it in rose petals...',
    'Adding a pinch of magic... ✨',
    'Almost there, my love...',
  ];

  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % messages.length;
    loaderText.style.opacity = '0';
    setTimeout(() => {
      loaderText.textContent = messages[msgIdx];
      loaderText.style.opacity = '1';
    }, 300);
  }, 1200);

  loaderText.style.transition = 'opacity 0.3s ease';

  const interval = setInterval(() => {
    progress += rand(2, 5);
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      clearInterval(msgInterval);
      setTimeout(finishLoader, 400);
    }
    fill.style.width = progress + '%';
    loaderSubText.textContent = Math.floor(progress) + '% complete ✨';
  }, 80);

  function finishLoader() {
    done = true;
    cancelAnimationFrame(animFrame);
    const loader = document.getElementById('loader');
    loader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    loader.style.opacity = '0';
    loader.style.transform = 'scale(1.05)';
    setTimeout(() => {
      loader.style.display = 'none';
      EventBus.emit('loaderDone');
    }, 800);
  }
})();
