/* ============================================================
   gift.js — Luxury gift box unwrap with heart burst
   ============================================================ */

(function initGift() {
  let opened = false;

  window.unwrapGift = function() {
    if (opened) return;
    opened = true;

    const lid = document.getElementById('giftLid');
    const container = document.getElementById('giftContainer');
    const giftBox = document.getElementById('giftBox');
    const giftMessage = document.getElementById('giftMessage');

    // Step 1: Lid lifts
    lid.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    lid.style.transform = 'rotateX(-130deg) translateY(-20px)';
    lid.style.transformOrigin = 'top center';

    // Sparkle effect on box
    gsap.to(giftBox, {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    });

    setTimeout(() => {
      // Step 2: Box shakes
      gsap.to(giftBox, {
        x: -8,
        rotation: -3,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: 'none',
        onComplete: () => {
          gsap.set(giftBox, { x: 0, rotation: 0 });

          // Step 3: Box explodes away
          gsap.to(giftBox, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'back.in(2)',
          });

          // Step 4: Hearts burst
          burstHearts();

          // Step 5: Message appears
          setTimeout(() => {
            container.style.display = 'none';
            giftMessage.classList.remove('hidden');
            EventBus.emit('triggerConfetti', { x: 0.5, y: 0.3, count: 200 });
          }, 600);
        },
      });
    }, 800);
  };

  function burstHearts() {
    const heartsDiv = document.getElementById('giftHearts');
    const items = ['❤️', '💕', '💖', '💗', '💝', '✨', '🌹', '💋', '🩷'];

    for (let i = 0; i < 30; i++) {
      const span = document.createElement('span');
      span.textContent = pick(items);
      span.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: ${rand(16, 30)}px;
        pointer-events: none;
        animation: giftHeartBurst ${rand(0.8, 1.5)}s ${rand(0, 0.4)}s ease-out forwards;
        --tx: ${rand(-150, 150)}px;
        --ty: ${rand(-200, -50)}px;
        z-index: 10;
      `;
      heartsDiv.appendChild(span);
    }

    // Add keyframe
    if (!document.getElementById('giftHeartKF')) {
      const s = document.createElement('style');
      s.id = 'giftHeartKF';
      s.textContent = `
        @keyframes giftHeartBurst {
          0% { transform: translate(-50%,-50%) scale(0); opacity: 1; }
          70% { opacity: 0.8; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.5); opacity: 0; }
        }
      `;
      document.head.appendChild(s);
    }

    setTimeout(() => heartsDiv.innerHTML = '', 2000);
  }
})();
