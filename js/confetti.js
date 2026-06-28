/* ============================================================
   confetti.js — Canvas confetti + fireworks system
   ============================================================ */

(function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let particles = [];
  let fireworks = [];
  let animFrame;
  let running = false;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Colors palette
  const COLORS = [
    '#FFD166', '#C9A96E', '#FFB3C6', '#FFFFFF',
    '#FF6B6B', '#4ECDC4', '#A8DADC', '#FFE66D',
    '#F7DC6F', '#BB8FCE', '#85C1E9',
  ];

  class Confetti {
    constructor(x, y) {
      this.x = x || rand(0, W);
      this.y = y || rand(-20, -5);
      this.vx = rand(-4, 4);
      this.vy = rand(2, 8);
      this.color = pick(COLORS);
      this.size = rand(6, 14);
      this.rotation = rand(0, 360);
      this.rotationSpeed = rand(-6, 6);
      this.shape = pick(['rect', 'circle', 'heart', 'star']);
      this.alpha = 1;
      this.gravity = 0.15;
      this.friction = 0.99;
      this.wobble = rand(0, Math.PI * 2);
      this.wobbleSpeed = rand(0.05, 0.12);
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.vy += this.gravity;
      this.vx *= this.friction;
      this.x += this.vx + Math.sin(this.wobble) * 1.5;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      if (this.y > H + 20) this.alpha = 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 4;

      switch (this.shape) {
        case 'rect':
          ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'heart':
          heartPath(ctx, 0, 0, this.size / 3);
          ctx.fill();
          break;
        case 'star':
          drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4);
          ctx.fill();
          break;
      }
      ctx.restore();
    }
  }

  class Firework {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.particles = [];
      this.color = pick(COLORS);
      this.exploded = false;
      this.vy = rand(-12, -18);
      this.vx = rand(-2, 2);
      this.trail = [];
      const count = randInt(50, 80);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = rand(2, 8);
        this.particles.push({
          x: this.x,
          y: this.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: pick(COLORS),
          size: rand(2, 5),
        });
      }
    }

    update() {
      if (!this.exploded) {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.4;
        if (this.vy >= -2) {
          this.exploded = true;
        }
      } else {
        this.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12;
          p.vx *= 0.97;
          p.alpha -= 0.018;
        });
        this.particles = this.particles.filter(p => p.alpha > 0);
      }
    }

    draw() {
      if (!this.exploded) {
        this.trail.forEach((t, i) => {
          ctx.beginPath();
          ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,209,102,${i / this.trail.length * 0.6})`;
          ctx.fill();
        });
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD166';
        ctx.shadowColor = '#FFD166';
        ctx.shadowBlur = 8;
        ctx.fill();
      } else {
        this.particles.forEach(p => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();
        });
      }
    }

    isDone() {
      return this.exploded && this.particles.length === 0;
    }
  }

  function drawStar(ctx, cx, cy, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outer);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
      rot += step;
    }
    ctx.lineTo(cx, cy - outer);
    ctx.closePath();
  }

  function animate() {
    if (!running && particles.length === 0 && fireworks.length === 0) {
      ctx.clearRect(0, 0, W, H);
      return;
    }
    animFrame = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    // Update + draw confetti
    particles.forEach(p => { p.update(); p.draw(); });
    particles = particles.filter(p => p.alpha > 0);

    // Update + draw fireworks
    fireworks.forEach(f => { f.update(); f.draw(); });
    fireworks = fireworks.filter(f => !f.isDone());
  }

  // API
  EventBus.on('triggerConfetti', ({ x = 0.5, y = 0.3, count = 100 }) => {
    const spawnX = x * W;
    const spawnY = y * H;
    for (let i = 0; i < count; i++) {
      particles.push(new Confetti(spawnX + rand(-60, 60), spawnY + rand(-20, 20)));
    }
    if (!running) {
      running = true;
      animate();
      setTimeout(() => { running = false; }, 5000);
    }
  });

  EventBus.on('triggerFireworks', ({ count = 8 }) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        fireworks.push(new Firework(rand(W * 0.2, W * 0.8), rand(H * 0.4, H * 0.8)));
      }, i * 300);
    }
    if (!running) {
      running = true;
      animate();
      setTimeout(() => { running = false; }, 8000);
    }
  });

  // Cake candles blown → fireworks
  EventBus.on('candlesBlown', () => {
    setTimeout(() => {
      EventBus.emit('triggerFireworks', { count: 12 });
      // Confetti rain
      let count = 0;
      const rain = setInterval(() => {
        for (let i = 0; i < 10; i++) {
          particles.push(new Confetti(rand(0, W), -10));
        }
        count++;
        if (count > 20) clearInterval(rain);
      }, 200);
      running = true;
      animate();
    }, 1000);
  });

  window.ConfettiSystem = { trigger: (x, y, count) => EventBus.emit('triggerConfetti', { x, y, count }) };
})();
