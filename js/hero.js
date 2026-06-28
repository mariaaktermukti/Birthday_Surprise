/* ============================================================
   hero.js — Cinematic hero with Three.js stars + GSAP
   ============================================================ */

(function initHero() {
  // ---- Three.js star field ----
  const canvas = document.getElementById('heroCanvas');
  let renderer, scene, camera, stars, shootingStars = [];
  let animFrame;

  function initThreeJS() {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 1;

    // Star particles
    const starsGeo = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      [1, 0.18, 0.47],    // hot pink  #FF2D78
      [1, 0.42, 0.62],    // rose pink #FF6B9D
      [1, 0.56, 0.69],    // soft rose #FF8FB1
      [1, 0.82, 0.86],    // blush     #FFD1DC
      [0.91, 0.71, 1.0],  // lavender  #E8B4FF
      [1, 1, 1],           // white
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = -Math.random() * 1000;
      sizes[i] = Math.random() * 2.5 + 0.5;

      const c = pick(colorPalette);
      colors[i * 3]     = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 1.5,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // Ambient particles (glowing pink orbs)
    for (let i = 0; i < 14; i++) {
      const geo = new THREE.SphereGeometry(rand(0.5, 2.5), 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: pick([0xFF2D78, 0xFF6B9D, 0xFF8FB1, 0xC9A0C0, 0xE8B4FF]),
        transparent: true,
        opacity: rand(0.06, 0.18),
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        -Math.random() * 10 - 5
      );
      mesh.userData = {
        floatY: Math.random() * Math.PI * 2,
        floatSpeed: rand(0.003, 0.008),
        origY: mesh.position.y,
      };
      scene.add(mesh);
      shootingStars.push(mesh);
    }

    window.addEventListener('resize', onResize);
    animate();
  }

  function onResize() {
    if (!renderer) return;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  let mouseNorm = { x: 0, y: 0 };
  document.addEventListener('mousemove', (e) => {
    mouseNorm.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseNorm.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate(t = 0) {
    animFrame = requestAnimationFrame(animate);
    const time = t * 0.001;

    // Slow parallax rotation
    if (stars) {
      stars.rotation.y = lerp(stars.rotation.y, mouseNorm.x * 0.05, 0.02);
      stars.rotation.x = lerp(stars.rotation.x, mouseNorm.y * 0.05, 0.02);
      stars.rotation.z += 0.0002;
    }

    // Float orbs
    shootingStars.forEach(mesh => {
      if (mesh.userData.floatY !== undefined) {
        mesh.userData.floatY += mesh.userData.floatSpeed;
        mesh.position.y = mesh.userData.origY + Math.sin(mesh.userData.floatY) * 1.5;
        mesh.rotation.y += 0.005;
      }
    });

    renderer.render(scene, camera);
  }

  // ---- Hero Canvas particles (2D layer) ----
  const particleContainer = document.getElementById('heroParticles');
  createFloatingParticles(particleContainer);

  function createFloatingParticles(container) {
    const pinkShades = [
      [255, 45, 120],
      [255, 107, 157],
      [255, 143, 177],
      [232, 180, 255],
      [255, 209, 220],
    ];
    for (let i = 0; i < 50; i++) {
      const p = document.createElement('div');
      const size = rand(2, 7);
      const left = rand(0, 100);
      const top = rand(0, 100);
      const delay = rand(0, 10);
      const duration = rand(5, 12);
      const shade = pick(pinkShades);
      const alpha = rand(0.3, 0.9);

      p.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: ${top}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${shade[0]},${shade[1]},${shade[2]},${alpha}), transparent);
        pointer-events: none;
        animation: floatParticle ${duration}s ${delay}s ease-in-out infinite alternate;
        box-shadow: 0 0 ${size * 4}px rgba(${shade[0]},${shade[1]},${shade[2]},0.5);
      `;
      container.appendChild(p);
    }

    // Add keyframe
    if (!document.getElementById('particleKeyframe')) {
      const style = document.createElement('style');
      style.id = 'particleKeyframe';
      style.textContent = `
        @keyframes floatParticle {
          0% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { opacity: 0.9; }
          100% { transform: translate(${rand(-30,30)}px, ${rand(-60,-20)}px) scale(1.5); opacity: 0.1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ---- GSAP Hero Entrance ----
  function animateHeroEntrance() {
    // Register plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to('#heroBadge', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    .to('#heroTitle', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
    }, '-=0.4')
    .to('#heroSubtitle', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
    }, '-=0.6')
    .to('#heroCta', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.4');

    // Init Three.js
    initThreeJS();
  }

  EventBus.on('mainUnlocked', animateHeroEntrance);
})();

function scrollToTimeline() {
  const el = document.getElementById('timeline');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
