/* ============================================================
   utils.js — Shared utility functions
   ============================================================ */

/**
 * Clamp a value between min and max
 */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Linear interpolation
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Map a value from one range to another
 */
function map(val, inMin, inMax, outMin, outMax) {
  return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Random number between min and max
 */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Random integer between min and max (inclusive)
 */
function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

/**
 * Pick a random element from an array
 */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle an array (Fisher-Yates)
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Delay (promise-based)
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce a function
 */
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Intersection Observer helper
 */
function onVisible(el, callback, options = {}) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        if (options.once !== false) obs.unobserve(entry.target);
      }
    });
  }, { threshold: options.threshold || 0.15, ...options });
  obs.observe(el);
  return obs;
}

/**
 * Get hex color with opacity as rgba
 */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Create SVG heart path
 */
function heartPath(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x, y - size / 2, x - size, y - size / 2, x - size, y);
  ctx.bezierCurveTo(x - size, y + size / 3, x - size / 2, y + size * 0.65, x, y + size);
  ctx.bezierCurveTo(x + size / 2, y + size * 0.65, x + size, y + size / 3, x + size, y);
  ctx.bezierCurveTo(x + size, y - size / 2, x, y - size / 2, x, y);
  ctx.closePath();
}

/**
 * Emit floating hearts from a position
 */
function emitHearts(x, y, count = 5) {
  const container = document.getElementById('floatingHearts');
  if (!container) return;
  const hearts = ['❤️', '💕', '💖', '💗', '💝', '🩷'];
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'floating-heart';
    h.style.left = (x + rand(-30, 30)) + 'px';
    h.style.top = (y + rand(-20, 20)) + 'px';
    h.textContent = pick(hearts);
    h.style.fontSize = rand(14, 22) + 'px';
    h.style.animationDuration = rand(0.8, 1.4) + 's';
    container.appendChild(h);
    setTimeout(() => h.remove(), 1500);
  }
}

/**
 * Simple event bus
 */
const EventBus = {
  _listeners: {},
  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  },
  emit(event, data) {
    (this._listeners[event] || []).forEach(fn => fn(data));
  },
};

window.clamp = clamp;
window.lerp = lerp;
window.map = map;
window.rand = rand;
window.randInt = randInt;
window.pick = pick;
window.shuffle = shuffle;
window.delay = delay;
window.debounce = debounce;
window.onVisible = onVisible;
window.hexToRgba = hexToRgba;
window.heartPath = heartPath;
window.emitHearts = emitHearts;
window.EventBus = EventBus;
