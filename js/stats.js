/* ============================================================
   stats.js — Animated husband statistics cards
   ============================================================ */

(function initStats() {
  const statsData = [
    { icon: '❤️', label: 'Love Level', value: '∞ / 10', bar: 100, barText: '100% — Off the charts' },
    { icon: '😴', label: 'Sleeping Skills', value: 'Professional Grade', bar: 97, barText: '97% — Olympic Level' },
    { icon: '💅', label: 'Laziness', value: 'Certified Expert', bar: 87, barText: '87% — Impressive' },
    { icon: '😍', label: 'Handsomeness', value: 'Immeasurable', bar: 100, barText: 'Infinite — Unmatchable' },
    { icon: '🎧', label: 'Listening to Wife', value: 'Loading... (Never completed)', bar: 12, barText: '12% — Still processing...' },
    { icon: '🧠', label: 'Patience With Wife', value: 'Legendary', bar: 95, barText: '95% — Absolute hero' },
    { icon: '🍔', label: 'Food Detection Radius', value: '5 Kilometers', bar: 99, barText: '99% — Superhuman' },
    { icon: '😂', label: 'Being Annoying (Lovably)', value: 'PhD Level', bar: 91, barText: '91% — Mastered' },
    { icon: '🏆', label: 'Winning Arguments With Wife', value: '0%', bar: 0, barText: '0% — As it should be' },
    { icon: '🎮', label: '"Just 5 More Minutes" Games', value: 'Time Manipulator', bar: 85, barText: '85% — Chronological genius' },
    { icon: '🌡️', label: 'Cuddliness', value: 'Very High', bar: 93, barText: '93% — Premium quality' },
    { icon: '⚡', label: 'Snack Hunting Speed', value: 'Lightning Fast', bar: 89, barText: '89% — Faster than me' },
  ];

  const grid = document.getElementById('statsGrid');

  statsData.forEach(stat => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div class="stat-icon">${stat.icon}</div>
      <div class="stat-label font-sans">${stat.label}</div>
      <div class="stat-value font-serif">${stat.value}</div>
      <div class="stat-bar-wrap">
        <div class="stat-bar-fill" data-width="${stat.bar}" style="width:0%"></div>
      </div>
      <p class="font-sans text-white/25 text-xs mt-2">${stat.barText}</p>
    `;
    grid.appendChild(card);
  });

  // Animate on scroll
  EventBus.on('mainUnlocked', () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.stat-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: (i % 3) * 0.1,
          onComplete: () => {
            // Animate the bar fill
            const bar = card.querySelector('.stat-bar-fill');
            if (bar) {
              const targetWidth = bar.dataset.width;
              gsap.to(bar, {
                width: targetWidth + '%',
                duration: 1.4,
                ease: 'power2.out',
                delay: 0.2,
              });
            }
          }
        }
      );
    });
  });
})();
