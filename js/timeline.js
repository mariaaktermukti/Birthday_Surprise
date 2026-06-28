/* ============================================================
   timeline.js — Animated scrolling love story timeline
   ============================================================ */

(function initTimeline() {
  const timelineData = [
    {
      year: 'The Beginning',
      emoji: '💬',
      title: 'First Conversation',
      desc: 'The universe sent me a message. It said your name. I replied before thinking — which is totally out of character. And yet, here we are.',
    },
    {
      year: 'The Early Days',
      emoji: '😂',
      title: 'First Laugh Together',
      desc: 'You said something absolutely ridiculous and I laughed so hard I snorted. You didn\'t run. That was when I knew.',
    },
    {
      year: 'Plot Twist',
      emoji: '🌩️',
      title: 'First Fight',
      desc: 'I was right. You were wrong. Technically. Historically. Scientifically. But I\'m a loving wife so I\'ll let you believe otherwise.',
    },
    {
      year: 'Resolution',
      emoji: '🫶',
      title: 'First Apology',
      desc: 'You said sorry with eyes that meant it. I said sorry with my whole heart. We became something stronger. We always do.',
    },
    {
      year: 'Forever Begins',
      emoji: '💍',
      title: 'The Day We Said "I Do"',
      desc: 'You cried before I even walked down the aisle. I pretended not to notice. It was the most beautiful thing I\'ve ever seen.',
    },
    {
      year: 'Right Now',
      emoji: '🥂',
      title: 'Today — Your Birthday',
      desc: 'Another year of you on this earth. Another year of me winning the lottery every single morning I wake up next to you.',
    },
  ];

  const container = document.getElementById('timelineContainer');

  timelineData.forEach((item, index) => {
    const isEven = index % 2 === 0;

    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.innerHTML = `
      ${isEven ? `
        <div class="timeline-card" style="grid-column:1; text-align:right; margin-right: 20px;">
          <div class="timeline-year">${item.year}</div>
          <div class="timeline-title font-serif">${item.title}</div>
          <div class="timeline-desc font-sans">${item.desc}</div>
        </div>
        <div class="timeline-node" style="grid-column:2;">
          <div class="timeline-dot">${item.emoji}</div>
        </div>
        <div style="grid-column:3;"></div>
      ` : `
        <div style="grid-column:1;"></div>
        <div class="timeline-node" style="grid-column:2;">
          <div class="timeline-dot">${item.emoji}</div>
        </div>
        <div class="timeline-card" style="grid-column:3; text-align:left; margin-left: 20px;">
          <div class="timeline-year">${item.year}</div>
          <div class="timeline-title font-serif">${item.title}</div>
          <div class="timeline-desc font-sans">${item.desc}</div>
        </div>
      `}
    `;
    container.appendChild(el);
  });

  // Animate on scroll
  EventBus.on('mainUnlocked', () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.timeline-card').forEach((card, i) => {
      const isLeft = i % 2 === 0;
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.1,
      });

      // Set initial position
      gsap.set(card, {
        x: isLeft ? -40 : 40,
        opacity: 0,
        y: 20,
      });
    });

    gsap.utils.toArray('.timeline-dot').forEach(dot => {
      gsap.fromTo(dot, 
        { scale: 0, opacity: 0 },
        {
          scrollTrigger: {
            trigger: dot,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }
      );
    });
  });
})();
