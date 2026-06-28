/* ============================================================
   gallery.js — Masonry polaroid gallery with lightbox
   ============================================================ */

(function initGallery() {
  // Gallery placeholder items
  // To use your own photos: replace the gradient backgrounds with <img src="your-photo.jpg">
  const galleryItems = [
    { caption: 'The day we first met ❤️', color: ['#2a1a3e', '#4a2c6e'], emoji: '✨', rotate: '-2deg', tall: false },
    { caption: 'Our first adventure', color: ['#1a2e1a', '#2c4a2c'], emoji: '🌿', rotate: '1.5deg', tall: true },
    { caption: 'Sunday morning vibes', color: ['#2e1a1a', '#5a2c2c'], emoji: '☕', rotate: '-1deg', tall: false },
    { caption: 'Making me laugh as always', color: ['#1a1a2e', '#2c2c5a'], emoji: '😂', rotate: '2deg', tall: false },
    { caption: 'The trip we almost didn\'t take', color: ['#2e2a1a', '#5a4a2c'], emoji: '✈️', rotate: '-1.5deg', tall: true },
    { caption: 'Your birthday last year', color: ['#2e1a2e', '#5a2c5a'], emoji: '🎂', rotate: '1deg', tall: false },
    { caption: 'A random Tuesday that felt like magic', color: ['#1a2e2e', '#2c5a5a'], emoji: '💫', rotate: '-2.5deg', tall: false },
    { caption: 'That perfect sunset', color: ['#2e1a0e', '#6a3a1a'], emoji: '🌅', rotate: '1.5deg', tall: true },
    { caption: 'You, just being you', color: ['#1e1a2e', '#3c2c5a'], emoji: '👑', rotate: '-1deg', tall: false },
    { caption: 'Us, against everything', color: ['#2e1a1e', '#5c2c3c'], emoji: '💪', rotate: '2deg', tall: false },
    { caption: 'The moment I knew', color: ['#1a1e2e', '#2c3c5c'], emoji: '💡', rotate: '-1.5deg', tall: false },
    { caption: 'Just... forever', color: ['#2a1a2a', '#5a3a5a'], emoji: '∞', rotate: '1deg', tall: true },
  ];

  const grid = document.getElementById('galleryGrid');

  galleryItems.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'gallery-item gallery-polaroid';
    el.style.setProperty('--rotate', item.rotate);
    el.setAttribute('data-caption', item.caption);
    el.setAttribute('data-index', idx);

    const imgH = item.tall ? 220 : 160;
    const gradient = `linear-gradient(135deg, ${item.color[0]}, ${item.color[1]})`;

    el.innerHTML = `
      <div style="
        width: 100%;
        height: ${imgH}px;
        background: ${gradient};
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 8px;
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.05), transparent 60%);
        "></div>
        <span style="font-size: 2.5rem; z-index:1;">${item.emoji}</span>
        <span style="font-family:var(--font-sans); font-size:0.6rem; color:rgba(255,255,255,0.3); letter-spacing:0.1em; text-transform:uppercase; z-index:1;">Add your photo</span>
      </div>
      <div class="gallery-overlay">
        <span class="gallery-caption">${item.caption}</span>
      </div>
      <p style="font-family:var(--font-script); font-size:0.85rem; color:rgba(255,255,255,0.5); text-align:center; padding: 8px 4px 0; line-height: 1.4;">${item.caption}</p>
    `;

    el.addEventListener('click', () => openLightbox(item, idx));
    grid.appendChild(el);
  });

  // Scroll animations
  EventBus.on('mainUnlocked', () => {
    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, scale: 0.85, y: 30 },
        {
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: (i % 3) * 0.1,
        }
      );
    });
  });

  // Lightbox
  window.openLightbox = function(item, idx) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');

    // Create a canvas image as placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 600, 400);
    grd.addColorStop(0, item.color[0]);
    grd.addColorStop(1, item.color[1]);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 600, 400);

    // Draw emoji
    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.emoji, 300, 180);

    // Draw helper text
    ctx.font = '400 16px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('Replace with your photo ❤️', 300, 280);

    img.src = canvas.toDataURL();
    caption.textContent = item.caption;
    lb.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    const lb = document.getElementById('lightbox');
    lb.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // Close on backdrop click
  document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) window.closeLightbox();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeLightbox();
  });
})();
