/* ============================================================
   cake.js — Beautiful canvas birthday cake with candles
   ============================================================ */

(function initCake() {
  const canvas = document.getElementById('cakeCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width, H = canvas.height;
  let candlesLit = true;
  let animFrame;
  let extinguishProgress = []; // per candle 0..1

  // ---- Cake Data ----
  const numCandles = 7;
  const candles = [];
  const cakeX = W / 2;
  const cakeY = H - 60;

  // Build candle positions
  for (let i = 0; i < numCandles; i++) {
    const t = (i / (numCandles - 1));
    const x = cakeX - 140 + t * 280;
    candles.push({ x, y: 0, lit: true, extinguish: 0 });
    extinguishProgress.push(0);
  }

  function draw(ts = 0) {
    animFrame = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);

    drawCakeBase();
    drawFrosting();
    drawDecorations();
    candles.forEach((c, i) => drawCandle(c, i, ts));
  }

  function drawCakeBase() {
    // Bottom tier
    const grad = ctx.createLinearGradient(cakeX - 160, cakeY - 80, cakeX + 160, cakeY);
    grad.addColorStop(0, '#2a1a0a');
    grad.addColorStop(0.5, '#3d2510');
    grad.addColorStop(1, '#1a0f05');
    ctx.fillStyle = grad;
    roundRect(ctx, cakeX - 160, cakeY - 80, 320, 80, 12);
    ctx.fill();

    // Middle tier
    const grad2 = ctx.createLinearGradient(cakeX - 120, cakeY - 160, cakeX + 120, cakeY - 80);
    grad2.addColorStop(0, '#3d2a1a');
    grad2.addColorStop(0.5, '#5a3e28');
    grad2.addColorStop(1, '#2a1a0a');
    ctx.fillStyle = grad2;
    roundRect(ctx, cakeX - 120, cakeY - 160, 240, 80, 10);
    ctx.fill();

    // Top tier
    const grad3 = ctx.createLinearGradient(cakeX - 80, cakeY - 220, cakeX + 80, cakeY - 160);
    grad3.addColorStop(0, '#4d3420');
    grad3.addColorStop(0.5, '#6b4a2e');
    grad3.addColorStop(1, '#3d2a1a');
    ctx.fillStyle = grad3;
    roundRect(ctx, cakeX - 80, cakeY - 220, 160, 60, 8);
    ctx.fill();
  }

  function drawFrosting() {
    const t = Date.now() / 1000;

    // Bottom tier frosting drips
    ctx.fillStyle = 'rgba(255, 230, 180, 0.9)';
    drawFrostingWave(cakeX, cakeY - 80, 310, 18);

    // Gold dots
    for (let i = 0; i < 8; i++) {
      const x = cakeX - 130 + i * 37;
      ctx.beginPath();
      ctx.arc(x, cakeY - 50, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,209,102,0.8)';
      ctx.fill();
    }

    // Middle tier frosting
    ctx.fillStyle = 'rgba(255, 220, 170, 0.85)';
    drawFrostingWave(cakeX, cakeY - 160, 230, 15);

    // Pink dots on middle
    for (let i = 0; i < 6; i++) {
      const x = cakeX - 90 + i * 36;
      ctx.beginPath();
      ctx.arc(x, cakeY - 130, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,179,198,0.8)';
      ctx.fill();
    }

    // Top tier frosting
    ctx.fillStyle = 'rgba(255, 240, 200, 0.9)';
    drawFrostingWave(cakeX, cakeY - 220, 155, 12);
  }

  function drawFrostingWave(cx, y, width, drip) {
    ctx.beginPath();
    ctx.moveTo(cx - width / 2, y);
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const x = cx - width / 2 + (i / steps) * width;
      const wave = Math.sin(i * Math.PI / 1.5) * (drip / 2);
      ctx.lineTo(x, y + wave + drip / 2);
    }
    ctx.lineTo(cx + width / 2, y);
    ctx.closePath();
    ctx.fill();
  }

  function drawDecorations() {
    // Stars / sparkles
    const sparkles = [
      { x: cakeX - 100, y: cakeY - 55 },
      { x: cakeX + 90, y: cakeY - 45 },
      { x: cakeX - 20, y: cakeY - 135 },
      { x: cakeX + 60, y: cakeY - 120 },
    ];
    sparkles.forEach(s => {
      drawSparkle(s.x, s.y, 6, 'rgba(255,209,102,0.8)');
    });

    // Heart on top tier
    ctx.save();
    ctx.translate(cakeX, cakeY - 200);
    ctx.scale(0.7, 0.7);
    ctx.fillStyle = 'rgba(255,179,198,0.9)';
    ctx.font = '22px serif';
    ctx.textAlign = 'center';
    ctx.fillText('❤️', 0, 8);
    ctx.restore();

    // "Happy Birthday" text
    ctx.save();
    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,209,102,0.9)';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('HAPPY BIRTHDAY', cakeX, cakeY - 42);
    ctx.restore();
  }

  function drawCandle(candle, index, ts) {
    const cx = candle.x;
    const candleTop = cakeY - 230 - 35;
    const candleH = 35;
    const candleW = 10;

    // Candle body gradient
    const colors = [
      ['#FFD166', '#C9A96E'],
      ['#FFB3C6', '#C9A96E'],
      ['#B8C0FF', '#8891d4'],
      ['#FFD166', '#FF9B54'],
      ['#C9A96E', '#FFD166'],
      ['#FFB3C6', '#FF6B9D'],
      ['#FFD166', '#FFB3C6'],
    ];
    const [c1, c2] = colors[index % colors.length];

    const cGrad = ctx.createLinearGradient(cx - candleW / 2, candleTop, cx + candleW / 2, candleTop + candleH);
    cGrad.addColorStop(0, c1);
    cGrad.addColorStop(1, c2);

    ctx.fillStyle = cGrad;
    roundRect(ctx, cx - candleW / 2, candleTop, candleW, candleH, 3);
    ctx.fill();

    // Wax drips
    ctx.fillStyle = c1 + '99';
    ctx.beginPath();
    ctx.ellipse(cx, candleTop + 2, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flame
    if (candle.lit && candle.extinguish < 1) {
      drawFlame(cx, candleTop, ts, index, candle.extinguish);
    } else if (candle.extinguish >= 1) {
      // Smoke
      drawSmoke(cx, candleTop, ts);
    }
  }

  function drawFlame(x, y, ts, index, extinguish) {
    const t = ts / 1000 + index * 0.7;
    const flicker = Math.sin(t * 8) * 2 + Math.cos(t * 5) * 1.5;
    const alpha = 1 - extinguish;

    // Outer glow
    const glowGrad = ctx.createRadialGradient(x, y - 12, 0, x, y - 12, 22);
    glowGrad.addColorStop(0, `rgba(255,209,102,${0.15 * alpha})`);
    glowGrad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(x, y - 12, 22, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Main flame
    ctx.save();
    ctx.translate(x + flicker * 0.3, y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-6, -8, -4, -18 + flicker, 0, -24 + flicker * 0.5);
    ctx.bezierCurveTo(4, -18 + flicker, 6, -8, 0, 0);
    const flameGrad = ctx.createLinearGradient(0, 0, 0, -24);
    flameGrad.addColorStop(0, `rgba(255,100,0,${alpha})`);
    flameGrad.addColorStop(0.3, `rgba(255,180,30,${alpha})`);
    flameGrad.addColorStop(0.7, `rgba(255,230,100,${alpha})`);
    flameGrad.addColorStop(1, `rgba(255,255,200,${alpha * 0.5})`);
    ctx.fillStyle = flameGrad;
    ctx.fill();

    // Inner flame core
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.bezierCurveTo(-2, -8, -1, -14, 0, -18);
    ctx.bezierCurveTo(1, -14, 2, -8, 0, -2);
    ctx.fillStyle = `rgba(255,255,200,${0.9 * alpha})`;
    ctx.fill();
    ctx.restore();
  }

  function drawSmoke(x, y, ts) {
    const t = ts / 1000;
    for (let i = 0; i < 3; i++) {
      const age = ((t * 0.5 + i * 0.3) % 1);
      const smokeY = y - age * 30;
      const smokeX = x + Math.sin(t * 2 + i) * 4;
      const r = age * 6;
      const alpha = (1 - age) * 0.3;
      ctx.beginPath();
      ctx.arc(smokeX, smokeY, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,200,200,${alpha})`;
      ctx.fill();
    }
  }

  function drawSparkle(x, y, r, color) {
    const t = Date.now() / 500;
    const a = Math.sin(t + x) * 0.5 + 0.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t);
    ctx.fillStyle = color.replace('0.8', String(0.4 + a * 0.5));
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.3, -r * 0.3);
      ctx.lineTo(0, 0);
      ctx.lineTo(-r * 0.3, -r * 0.3);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ---- Public functions ----
  window.blowCandles = function() {
    if (!candlesLit) { window.relightCandles(); return; }
    candlesLit = false;

    // Stagger extinguish
    candles.forEach((c, i) => {
      setTimeout(() => {
        const interval = setInterval(() => {
          c.extinguish = Math.min(1, c.extinguish + 0.05);
          if (c.extinguish >= 1) clearInterval(interval);
        }, 30);
      }, i * 150);
    });

    setTimeout(() => {
      document.getElementById('wishMessage').classList.remove('hidden');
      document.getElementById('relightBtn').style.display = '';
      EventBus.emit('triggerConfetti', { x: 0.5, y: 0.3, count: 200 });
      EventBus.emit('candlesBlown');
    }, numCandles * 150 + 800);
  };

  window.relightCandles = function() {
    candlesLit = true;
    candles.forEach(c => { c.extinguish = 0; c.lit = true; });
    document.getElementById('wishMessage').classList.add('hidden');
    document.getElementById('relightBtn').style.display = 'none';
  };

  let micStream = null;
  window.startMicBlowing = async function() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Microphone not supported in this browser. Use the button instead!');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const btn = document.getElementById('micBtn');
      btn.textContent = '🎤 Blow now!';
      btn.style.borderColor = 'rgba(255,179,198,0.5)';

      const check = setInterval(() => {
        analyser.getByteFrequencyData(buf);
        const vol = buf.reduce((a, b) => a + b, 0) / buf.length;
        if (vol > 18) {
          clearInterval(check);
          stream.getTracks().forEach(t => t.stop());
          audioCtx.close();
          btn.textContent = '🎤 Use Microphone';
          btn.style.borderColor = '';
          window.blowCandles();
        }
      }, 100);
    } catch (e) {
      alert('Microphone permission denied. Please use the button!');
    }
  };

  // Start drawing
  draw();
})();
