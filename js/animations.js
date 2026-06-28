/* ============================================================
   animations.js — Snappy scroll + cinematic section reveals
   ============================================================ */

(function initAnimations() {
  EventBus.on('mainUnlocked', () => {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // =====================================================
    // 1. LENIS SMOOTH SCROLL — fast & snappy
    // =====================================================
    let lenis;
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 0.85,                     // was 1.6 — much snappier now
        easing: t => 1 - Math.pow(1 - t, 3), // cubic ease-out — feels instant
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.1,               // wheel feels responsive
        touchMultiplier: 1.6,               // fast on mobile too
        infinite: false,
      });

      function raf(time) {
        lenis.raf(time);
        ScrollTrigger.update();
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // GSAP + Lenis sync
      gsap.ticker.lagSmoothing(0);

      // Scroll velocity tilt on hero canvas
      lenis.on('scroll', ({ velocity }) => {
        const v = Math.abs(velocity);
        if (v > 5) {
          const heroCanvas = document.getElementById('heroCanvas');
          if (heroCanvas) {
            heroCanvas.style.transform = `scaleX(${1 + v * 0.002}) translateY(${velocity * 0.15}px)`;
            heroCanvas.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
              heroCanvas.style.transform = '';
            }, 200);
          }
        }
      });
    }

    // =====================================================
    // 2. SCROLL PROGRESS BAR — pink line at top
    // =====================================================
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      height: 2px;
      width: 0%;
      background: linear-gradient(90deg, #FF2D78, #FF6B9D, #FFD1DC);
      z-index: 100000;
      pointer-events: none;
      box-shadow: 0 0 10px rgba(255,45,120,0.8), 0 0 20px rgba(255,45,120,0.4);
      transition: width 0.05s linear;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });

    // =====================================================
    // 3. SECTION HEADER REVEALS — staggered, fast
    // =====================================================
    gsap.utils.toArray('.section-header').forEach(header => {
      // Split badge + title + subtitle into separate animation targets
      const badge = header.querySelector('.section-badge');
      const title = header.querySelector('h2, h3');
      const sub   = header.querySelector('p');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });
      if (badge) tl.fromTo(badge, { opacity: 0, y: 20, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' });
      if (title) tl.fromTo(title, { opacity: 0, y: 36, skewX: -3 }, { opacity: 1, y: 0, skewX: 0, duration: 0.55, ease: 'power4.out' }, '-=0.15');
      if (sub)   tl.fromTo(sub,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2');
    });

    // =====================================================
    // 4. GLASS CARDS — staggered fly-in
    // =====================================================
    // Stats cards
    gsap.utils.toArray('.stat-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50, scale: 0.92, rotationX: 10 },
        {
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
          opacity: 1, y: 0, scale: 1, rotationX: 0,
          duration: 0.5, delay: i * 0.07,
          ease: 'power3.out',
        }
      );
    });

    // Timeline cards
    gsap.utils.toArray('.timeline-card').forEach((card, i) => {
      const isLeft = i % 2 === 0;
      gsap.fromTo(card,
        { opacity: 0, x: isLeft ? -50 : 50, scale: 0.94 },
        {
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
          opacity: 1, x: 0, scale: 1,
          duration: 0.55, ease: 'power3.out',
        }
      );
    });

    // =====================================================
    // 5. ROAST SECTION — pop-in with bounce
    // =====================================================
    gsap.fromTo('#roast .roast-card',
      { opacity: 0, scale: 0.85, y: 40 },
      {
        scrollTrigger: { trigger: '#roast .roast-card', start: 'top 88%' },
        opacity: 1, scale: 1, y: 0,
        duration: 0.6, ease: 'back.out(2)',
      }
    );

    // =====================================================
    // 6. QUIZ — slide in from bottom
    // =====================================================
    gsap.fromTo('#quizContainer',
      { opacity: 0, y: 60 },
      {
        scrollTrigger: { trigger: '#quizContainer', start: 'top 88%' },
        opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
      }
    );

    // =====================================================
    // 7. CAKE — scale pop
    // =====================================================
    gsap.fromTo('#cakeCanvas',
      { opacity: 0, scale: 0.8, y: 40 },
      {
        scrollTrigger: { trigger: '#cakeCanvas', start: 'top 88%' },
        opacity: 1, scale: 1, y: 0,
        duration: 0.65, ease: 'back.out(1.7)',
      }
    );

    // =====================================================
    // 8. GIFT BOX
    // =====================================================
    gsap.fromTo('#giftContainer',
      { opacity: 0, y: 50, scale: 0.9 },
      {
        scrollTrigger: { trigger: '#giftContainer', start: 'top 88%' },
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, ease: 'back.out(1.8)',
      }
    );

    // =====================================================
    // 9. LOVE LETTER
    // =====================================================
    gsap.fromTo('#envelopeWrapper',
      { opacity: 0, y: 50, rotationY: 10 },
      {
        scrollTrigger: { trigger: '#envelopeWrapper', start: 'top 88%' },
        opacity: 1, y: 0, rotationY: 0,
        duration: 0.65, ease: 'power3.out',
      }
    );

    // =====================================================
    // 10. GALLERY ITEMS — cascade stagger
    // =====================================================
    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, scale: 0.88, y: 30, rotate: (Math.random() - 0.5) * 8 },
        {
          scrollTrigger: { trigger: item, start: 'top 92%' },
          opacity: 1, scale: 1, y: 0,
          rotate: parseFloat(item.style.getPropertyValue('--rotate') || '0'),
          duration: 0.45, delay: (i % 4) * 0.06,
          ease: 'power3.out',
        }
      );
    });

    // =====================================================
    // 11. FOOTER
    // =====================================================
    const footerTl = gsap.timeline({
      scrollTrigger: { trigger: '#footer', start: 'top 85%' },
    });
    footerTl
      .fromTo('#footer .footer-message', { opacity: 0, y: 50, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power4.out' })
      .fromTo('#footer .footer-signature', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');

    // =====================================================
    // 12. HERO PARALLAX — fast scrub
    // =====================================================
    gsap.to('.hero-content', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.4 },
      y: 100, opacity: 0.3, ease: 'none',
    });

    // =====================================================
    // 13. SCROLL-VELOCITY SKEW EFFECT
    // =====================================================
    // Makes the page content subtly skew when scrolling fast — like Locomotive.js
    const skewProxy = { skewY: 0 };
    let prevScroll = window.scrollY;
    let scrollVelocity = 0;
    let rafSkew;

    function updateSkew() {
      const curr = window.scrollY;
      const diff = curr - prevScroll;
      prevScroll = curr;
      scrollVelocity += (diff - scrollVelocity) * 0.2;
      const clampedSkew = Math.max(-2.5, Math.min(2.5, scrollVelocity * 0.06));

      document.querySelectorAll('section').forEach(s => {
        s.style.transform = `skewY(${clampedSkew}deg)`;
      });

      rafSkew = requestAnimationFrame(updateSkew);
    }
    rafSkew = requestAnimationFrame(updateSkew);

    // =====================================================
    // 14. 3D CARD TILT ON HOVER
    // =====================================================
    document.querySelectorAll('.glass-card, .stat-card, .timeline-card').forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-6px) scale(1.01)`;
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
      });
    });

    // =====================================================
    // 15. NAV AUTO-HIDE + PINK ACTIVE LINK
    // =====================================================
    let lastScrollY = 0;
    const nav = document.querySelector('nav');
    nav.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)';

    window.addEventListener('scroll', () => {
      const curr = window.scrollY;
      if (curr > lastScrollY + 10 && curr > 80) {
        nav.style.transform = 'translateY(-110%)';
      } else if (curr < lastScrollY - 5) {
        nav.style.transform = 'translateY(0)';
      }
      lastScrollY = curr;
    }, { passive: true });

    // Active nav highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = '';
            link.style.textShadow = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.style.color = '#FF6B9D';
              link.style.textShadow = '0 0 12px rgba(255,45,120,0.5)';
            }
          });
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => obs.observe(s));

    // =====================================================
    // 16. FOOTER AMBIENT CANVAS
    // =====================================================
    initFooterCanvas();
  });

  // =====================================================
  //  FOOTER ORBS CANVAS
  // =====================================================
  function initFooterCanvas() {
    const canvas = document.getElementById('footerCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));

    const orbs = Array.from({ length: 6 }, () => ({
      x: rand(0, 1), y: rand(0, 1),
      r: rand(80, 240),
      color: pick(['255,45,120', '232,54,106', '255,107,157', '201,160,192', '232,180,255']),
      a: rand(0.03, 0.08),
      speed: rand(0.0004, 0.001),
      dir: rand(0, Math.PI * 2),
    }));

    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      orbs.forEach(o => {
        o.dir += o.speed;
        const x = (o.x + Math.cos(o.dir) * 0.1) * W;
        const y = (o.y + Math.sin(o.dir) * 0.08) * H;
        const g = ctx.createRadialGradient(x, y, 0, x, y, o.r);
        g.addColorStop(0, `rgba(${o.color},${o.a})`);
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
    }
    draw();
  }
})();
