document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('intro-screen');
  const introText = document.getElementById('intro-text');
  const mainContent = document.getElementById('main-content');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // =====================================================
  // BOTTOM DOCK — GOOEY NAVIGATION
  // =====================================================

  const dock = document.getElementById('bottom-dock');
  const dockItems = document.querySelectorAll('.dock-item');
  const goo = document.querySelector('.dock-goo');
  const indicator = document.querySelector('.dock-active-indicator');

  function moveDockIndicator(item) {
  if (!dock || !item || !indicator || !goo) return;

  const dockRect = dock.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  // Position exacte de l'élément dans le Dock
  const itemLeft = itemRect.left - dockRect.left;

  // Centre exact de l'élément
  const itemCenter = itemLeft + (itemRect.width / 2);

  // Petit point lumineux
  indicator.style.left = `${itemCenter}px`;

  // Lumière / Gooey
  goo.style.setProperty('--goo-x', `${itemLeft}px`);
}
  function setActiveDockItem(item) {
    dockItems.forEach(link => {
      link.classList.remove('active');
    });

    item.classList.add('active');

    moveDockIndicator(item);
  }

  dockItems.forEach(item => {

    item.addEventListener('click', () => {
      setActiveDockItem(item);
    });

  });

  /*
    Position initiale
  */

  const initialDockItem =
    document.querySelector('.dock-item.active');

  if (initialDockItem) {
    requestAnimationFrame(() => {
      moveDockIndicator(initialDockItem);
    });
  }

  /*
    Repositionnement lors du resize
  */

  window.addEventListener('resize', () => {

    const activeItem =
      document.querySelector('.dock-item.active');

    if (activeItem) {
      moveDockIndicator(activeItem);
    }

  });

  // =====================================================
// DOCK — ACTIVE SECTION ON SCROLL
// Version stable
// =====================================================

const sections = [
  document.getElementById('home'),
  document.getElementById('about'),
  document.getElementById('skills'),
  document.getElementById('projects'),
  document.getElementById('contact')
].filter(Boolean);

function updateActiveSection() {

  const scrollPosition = window.scrollY + window.innerHeight * 0.35;

  let currentSection = sections[0];

  sections.forEach(section => {

    const sectionTop = section.offsetTop;

    if (scrollPosition >= sectionTop) {
      currentSection = section;
    }

  });

  if (!currentSection) return;

  const activeItem = document.querySelector(
    `.dock-item[data-section="${currentSection.id}"]`
  );

  if (activeItem) {
    setActiveDockItem(activeItem);
  }
}

window.addEventListener('scroll', updateActiveSection, {
  passive: true
});

window.addEventListener('resize', updateActiveSection);

requestAnimationFrame(updateActiveSection);

  function revealSite() {
    // Ancien système d'intro désactivé.
    // L'ouverture du portfolio est maintenant contrôlée
    // uniquement par l'intro cinématique aux lucioles.
    return;
  }

  if (prefersReducedMotion) {
    // Reduced motion: reveal main content immediately (no cinematic intro)
    document.body.style.overflow = '';
    if (mainContent) mainContent.style.opacity = '1';
  } else {
    // Non-reduced motion: cinematic intro (canvas) will handle appearance and overflow.
    // Do not run the old typewriter effect or manipulate introText.
  }

  // --- Reveal au scroll ---
  const cards = document.querySelectorAll('.bento-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));

  // --- Effet tilt 3D au survol (desktop uniquement) ---
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty(
          '--mouse-x',
          `${x}px`
        );

        card.style.setProperty(
          '--mouse-y',
          `${y}px`
        );
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0) scale(1.01)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- Curseur lumineux ---
  const cursorGlow = document.getElementById('cursor-glow');
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches && cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
      cursorGlow.style.opacity = '1';
    });
    window.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
  }

  // --- Element 3D dans le Hero ---
  const heroCanvas = document.getElementById('hero-3d');
  if (heroCanvas && window.THREE && !prefersReducedMotion) {
    const heroSection = heroCanvas.closest('section');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, heroSection.clientWidth / heroSection.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
    renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Forme principale : icosaedre filaire dore
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xD4AF37, wireframe: true, transparent: true, opacity: 0.55 });
    const shape = new THREE.Mesh(geometry, material);
    shape.position.set(2.2, 0, 0);
    scene.add(shape);

    // Particules vertes flottantes
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      positions[p * 3] = (Math.random() - 0.5) * 12;
      positions[p * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[p * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x3ED598, size: 0.035, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    });

    function resizeHero() {
      const w = heroSection.clientWidth, h = heroSection.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', resizeHero);

    let heroVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
    });
    heroObserver.observe(heroSection);

    function animateHero() {
      requestAnimationFrame(animateHero);
      if (!heroVisible) return;
      shape.rotation.x += 0.0025;
      shape.rotation.y += 0.0035;
      particles.rotation.y += 0.0008;
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
    animateHero();
  }
// =====================================================
  // SCENE TRANSITIONS — ÉTAPE 1
  // =====================================================

  const portfolioScenes = document.querySelectorAll('.portfolio-scene');

  if (portfolioScenes.length) {
    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scene-visible');
        } else {
          entry.target.classList.remove('scene-visible');
        }
      });
    }, {
      threshold: 0.25
    });

    portfolioScenes.forEach(scene => {
      sceneObserver.observe(scene);
    });
  }
 // =====================================================
  // FIREFLY — ÉTAPE 2C
  // Trajectoire narrative par section
  // =====================================================

  const firefly = document.getElementById('portfolio-firefly');

  if (firefly && !prefersReducedMotion) {

    let fireflyX = window.innerWidth * 0.5;
    let fireflyY = window.innerHeight * 0.5;

    let targetX = fireflyX;
    let targetY = fireflyY;

    let currentScene = 'home';

    const fireflyScenes = {
      home: {
        x: 0.72,
        y: 0.28,
        amplitudeX: 18,
        amplitudeY: 10,
        speedX: 0.9,
        speedY: 0.7
      },

      about: {
        x: 0.22,
        y: 0.38,
        amplitudeX: 26,
        amplitudeY: 14,
        speedX: 0.7,
        speedY: 0.55
      },

      skills: {
        x: 0.78,
        y: 0.30,
        amplitudeX: 14,
        amplitudeY: 18,
        speedX: 1.2,
        speedY: 0.8
      },

      projects: {
        x: 0.25,
        y: 0.62,
        amplitudeX: 22,
        amplitudeY: 12,
        speedX: 0.85,
        speedY: 0.65
      },

      contact: {
        x: 0.72,
        y: 0.72,
        amplitudeX: 12,
        amplitudeY: 8,
        speedX: 0.55,
        speedY: 0.45
      }
    };

    function detectCurrentScene() {

      let closestSection = null;
      let closestDistance = Infinity;

      sections.forEach(section => {

        const rect = section.getBoundingClientRect();

        const sectionCenter =
          rect.top + rect.height / 2;

        const distance =
          Math.abs(sectionCenter - window.innerHeight / 2);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }

      });

      if (closestSection) {
        currentScene = closestSection.id;
      }
    }

    function updateFireflyTarget() {

      detectCurrentScene();

      const scene =
        fireflyScenes[currentScene] ||
        fireflyScenes.home;

      targetX =
        window.innerWidth * scene.x;

      targetY =
        window.innerHeight * scene.y;
    }

    window.addEventListener(
      'scroll',
      updateFireflyTarget,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      updateFireflyTarget
    );

    updateFireflyTarget();

    function animateFirefly() {

      fireflyX +=
        (targetX - fireflyX) * 0.035;

      fireflyY +=
        (targetY - fireflyY) * 0.035;

      const time =
        performance.now() * 0.001;

      const scene =
        fireflyScenes[currentScene] ||
        fireflyScenes.home;

      const organicX =
        Math.sin(time * scene.speedX) *
        scene.amplitudeX;

      const organicY =
        Math.cos(time * scene.speedY) *
        scene.amplitudeY;

      firefly.style.left =
        `${fireflyX}px`;

      firefly.style.top =
        `${fireflyY}px`;

      firefly.style.transform =
        `translate(
          calc(-50% + ${organicX}px),
          calc(-50% + ${organicY}px)
        )`;

      requestAnimationFrame(animateFirefly);
    }

    animateFirefly();
  }
 /* =========================
   AMBIENT FIREFLIES
========================= */

const ambientFireflies = document.getElementById('ambient-fireflies');

if (ambientFireflies && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const fireflyCount = window.innerWidth <= 640 ? 7 : 14;

    for (let i = 0; i < fireflyCount; i++) {
        const firefly = document.createElement('span');

        firefly.className = 'ambient-firefly';

        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${Math.random() * 100}%`;

        firefly.style.setProperty(
            '--duration',
            `${8 + Math.random() * 10}s`
        );

        firefly.style.setProperty(
            '--blink-duration',
            `${2 + Math.random() * 3}s`
        );

        firefly.style.setProperty(
            '--delay',
            `${Math.random() * -10}s`
        );

        firefly.style.setProperty(
            '--move-x-1',
            `${-50 + Math.random() * 100}px`
        );

        firefly.style.setProperty(
            '--move-y-1',
            `${-40 + Math.random() * 80}px`
        );

        firefly.style.setProperty(
            '--move-x-2',
            `${-80 + Math.random() * 160}px`
        );

        firefly.style.setProperty(
            '--move-y-2',
            `${-70 + Math.random() * 140}px`
        );

        firefly.style.setProperty(
            '--move-x-3',
            `${-40 + Math.random() * 80}px`
        );

        firefly.style.setProperty(
            '--move-y-3',
            `${-90 + Math.random() * 180}px`
        );

        ambientFireflies.appendChild(firefly);
    }
}

/* =========================================================
   CINEMATIC FIREFLY WELCOME
   ========================================================= */

(() => {
  if (document.getElementById('firefly-welcome')) return;

  const intro = document.createElement('div');
  intro.id = 'firefly-welcome';

  const canvas = document.createElement('canvas');
  intro.appendChild(canvas);

  document.body.appendChild(intro);

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    intro.remove();
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mainContent = document.getElementById('main-content');
  const oldIntro = document.getElementById('intro-screen');

  document.body.style.overflow = 'hidden';

  if (mainContent) mainContent.style.opacity = '0';
  if (oldIntro) oldIntro.style.display = 'none';

  let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let welcomeTargets = [], meliorTargets = [], particles = [];

  const PARTICLE_COUNT_DESKTOP = 700;
  const PARTICLE_COUNT_MOBILE = 380;
  let particleCount = window.innerWidth <= 640 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particleCount = window.innerWidth <= 640 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
  }

  resize();
  window.addEventListener('resize', resize);

  /* ---------------------------------------------------------
     TEXT → PARTICLE TARGETS
  --------------------------------------------------------- */
  function createTextTargets(text, isMelior = false) {
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

    const isLongText = isMelior || text.length > 10;
    const targetWidth = isLongText ? Math.min(width * 0.94, 1400) : Math.min(width * 0.88, 1250);
    let fontSize = isLongText ? Math.min(width * 0.11, 120) : Math.min(width * 0.115, 125);
    const fontWeight = 800; // thicker letters for denser contours/interiors

    offscreen.width = Math.ceil(targetWidth);
    offscreen.height = Math.ceil(isLongText ? height * 0.48 : height * 0.35);

    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.font = `${fontWeight} ${fontSize}px "Fraunces", serif`;

    while (offCtx.measureText(text).width > targetWidth && fontSize > 30) {
      fontSize -= 2;
      offCtx.font = `${fontWeight} ${fontSize}px "Fraunces", serif`;
    }

    // Draw text with stronger stroke (no multi-offsets) and support two-line layout for long phrase
    offCtx.fillStyle = '#ffffff';
    offCtx.strokeStyle = '#ffffff';
    offCtx.lineJoin = 'round';
    offCtx.lineWidth = Math.max(2, Math.floor(fontSize * 0.06));

    // If this is a long phrase, attempt a single-line draw first; if it doesn't fit,
    // split into two balanced lines (by word widths) to produce a clean two-line layout.
    if (isMelior) {
      offCtx.font = `${fontWeight} ${fontSize}px "Fraunces", serif`;
      const measured = offCtx.measureText(text).width;

      if (measured <= targetWidth) {
        // single-line fits
        offCtx.strokeText(text, offscreen.width / 2, offscreen.height / 2);
        offCtx.fillText(text, offscreen.width / 2, offscreen.height / 2);
      } else {
        const words = text.split(' ');
        // find best split point that balances rendered width
        let bestSplit = 1;
        let bestDiff = Infinity;
        for (let i = 1; i < words.length; i++) {
          const left = words.slice(0, i).join(' ');
          const right = words.slice(i).join(' ');
          const lw = offCtx.measureText(left).width;
          const rw = offCtx.measureText(right).width;
          const diff = Math.abs(lw - rw);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestSplit = i;
          }
        }

        const top = words.slice(0, bestSplit).join(' ');
        const bottom = words.slice(bestSplit).join(' ');
        const lineHeight = Math.round(fontSize * 1.05);

        offscreen.height = Math.ceil(lineHeight * 2.6);
        offCtx.font = `${fontWeight} ${fontSize}px "Fraunces", serif`;

        const topY = offscreen.height / 2 - lineHeight * 0.55;
        const bottomY = offscreen.height / 2 + lineHeight * 0.55;

        offCtx.strokeText(top, offscreen.width / 2, topY);
        offCtx.fillText(top, offscreen.width / 2, topY);

        // slight extra spacing on lower line to increase separation
        offCtx.strokeText(bottom, offscreen.width / 2, bottomY);
        offCtx.fillText(bottom, offscreen.width / 2, bottomY);
      }
    } else {
      // single-line draw
      offCtx.strokeText(text, offscreen.width / 2, offscreen.height / 2);
      offCtx.fillText(text, offscreen.width / 2, offscreen.height / 2);
    }

    const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
    const pixels = imageData.data;

    const points = [];
    // denser sampling to capture interior pixels (2 on mobile, 3 on desktop)
    const gap = width <= 640 ? 2 : 3;

    for (let y = 0; y < offscreen.height; y += gap) {
      for (let x = 0; x < offscreen.width; x += gap) {
        const index = (y * offscreen.width + x) * 4;
        const alpha = pixels[index + 3];
        if (alpha > 100) points.push({ x, y });
      }
    }

    if (!points.length) return [];

    if (points.length > particleCount) {
      const area = offscreen.width * offscreen.height;
        // use slightly smaller cells to favor interior sampling and avoid empty holes
        const cellSize = Math.max(3, Math.sqrt(area / particleCount) * 0.85);
      const cols = Math.max(1, Math.floor(offscreen.width / cellSize));
      const rows = Math.max(1, Math.floor(offscreen.height / cellSize));
      const cells = new Array(cols * rows).fill(0).map(() => []);

      points.forEach(p => {
        const cx = Math.min(cols - 1, Math.floor(p.x / cellSize));
        const cy = Math.min(rows - 1, Math.floor(p.y / cellSize));
        cells[cy * cols + cx].push(p);
      });

      const reduced = [];
      for (let i = 0; i < cells.length && reduced.length < particleCount; i++) {
        const cell = cells[i];
        if (!cell.length) continue;
        let sx = 0, sy = 0;
        cell.forEach(pt => { sx += pt.x; sy += pt.y; });
        reduced.push({ x: Math.round(sx / cell.length), y: Math.round(sy / cell.length) });
      }

      if (reduced.length < particleCount) {
        const remaining = [];
        cells.forEach(cell => cell.forEach(p => remaining.push(p)));
        let i = 0;
        while (reduced.length < particleCount && i < remaining.length) {
          reduced.push(remaining[i]);
          i += Math.ceil(remaining.length / (particleCount - reduced.length + 1));
        }
      }

      return reduced.slice(0, particleCount).map(p => ({ x: width / 2 - offscreen.width / 2 + p.x, y: height / 2 - offscreen.height / 2 + p.y }));
    }

    const mapped = points.map(p => ({ x: width / 2 - offscreen.width / 2 + p.x, y: height / 2 - offscreen.height / 2 + p.y }));
    if (mapped.length < particleCount) {
      const out = [];
      for (let i = 0; i < particleCount; i++) out.push(mapped[i % mapped.length]);
      return out;
    }
    return mapped;
  }

  /* ---------------------------------------------------------
     PARTICLES
  --------------------------------------------------------- */

  function createParticles() {
    welcomeTargets = createTextTargets('WELCOME', false);
    meliorTargets = createTextTargets('TO MY PORTFOLIO', true);

    particles = [];
    for (let i = 0; i < particleCount; i++) {
      const welcomeIdx = welcomeTargets.length ? Math.floor(i * welcomeTargets.length / particleCount) : -1;
      const meliorIdx = meliorTargets.length ? Math.floor(i * meliorTargets.length / particleCount) : -1;

      const welcome = (welcomeIdx >= 0 && welcomeTargets[welcomeIdx]) ? welcomeTargets[welcomeIdx] : { x: Math.random() * width, y: Math.random() * height };
      const melior = (meliorIdx >= 0 && meliorTargets[meliorIdx]) ? meliorTargets[meliorIdx] : { x: Math.random() * width, y: Math.random() * height };

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        startX: Math.random() * width,
        startY: Math.random() * height,
        welcomeX: welcome.x,
        welcomeY: welcome.y,
        meliorX: melior.x,
        meliorY: melior.y,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.4,
        driftX: (Math.random() - 0.5) * 6,
        driftY: (Math.random() - 0.5) * 6,
        gold: Math.random() < 0.12,
        vx: 0,
        vy: 0,
        depth: Math.random(),
        noiseSeed: Math.random() * 1000,
        _welcomeInit: false
      });
    }
  }

  createParticles();


    /* ---------------------------------------------------------
       EASING
       --------------------------------------------------------- */

    function easeOutExpo(t) {
        return t === 1
            ? 1
            : 1 - Math.pow(2, -10 * t);
    }

    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 -
                Math.pow(-2 * t + 2, 3) / 2;
    }

    function clamp(value, min, max) {
        return Math.max(
            min,
            Math.min(max, value)
        );
    }

    /* ---------------------------------------------------------
       DRAW
       --------------------------------------------------------- */

    function drawParticle(
      particle,
      x,
      y,
      alpha,
      time,
      boost = 1
    ) {
      const pulse =
        0.82 +
        Math.sin(
          time * (particle.speed * 1.35) +
          particle.phase
        ) * 0.18 +
        Math.sin(
          time * 0.8 +
          particle.phase * 2.1
        ) * 0.08;

      const size =
        particle.size * pulse;

      const color = particle.gold ? '#D9B57C' : '#0EAB6A';

      // Reduced halo to avoid merging; halo increases only slightly with boost
      const baseGlow = 0.06;
      const glowAlpha = clamp(baseGlow * alpha * (1 + (boost - 1) * 0.18 + (particle.gold ? 0.12 : 0)), 0, 0.45);
      const glowRadius = size * (2.25 + Math.sin(time * 1.5 + particle.phase) * 0.18) * (1 + (boost - 1) * 0.08);

      /*
       * Glow (halo)
       */
      ctx.beginPath();

      ctx.fillStyle = particle.gold
        ? `rgba(217,181,124,${glowAlpha})`
        : `rgba(14,171,106,${glowAlpha})`;

      ctx.arc(
        x,
        y,
        glowRadius,
        0,
        Math.PI * 2
      );

      ctx.fill();

      /*
       * Core
       */
      ctx.beginPath();

      ctx.fillStyle = color;

        // slightly increase core size during boosted rendering for readability
      const sizeBoosted = size * (1 + (boost - 1) * 0.18);
      const coreAlpha = Math.min(alpha * (1 + (boost - 1) * 0.6), 1);
      ctx.globalAlpha = coreAlpha;

      ctx.arc(
        x,
        y,
        sizeBoosted,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.globalAlpha = 1;
    }

    /* ---------------------------------------------------------
       TIMELINE
       --------------------------------------------------------- */

    const startTime = performance.now();

    // Timeline (millisecond marks)
    // Slower, more cinematic pacing:
    // PHASE_RANDOM: initial apparition
    // PHASE_WELCOME: end of first formation (WELCOME)
    // PHASE_HOLD: hold after WELCOME
    // PHASE_MORPH: end of first dispersion
    // PHASE_MELIOR: end of second formation (TO MY PORTFOLIO)
    // PHASE_EXIT: end of final dispersion (reveal)
    const PHASE_RANDOM = 2000;
    const PHASE_WELCOME = 8000;
    const PHASE_HOLD = 9800;
    const PHASE_MORPH = 12600;
    const PHASE_MELIOR = 18000;
    const PHASE_EXIT = 35000;

    function animate(now) {
        const elapsed =
            now - startTime;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        /*
         * Very subtle atmospheric glow.
         */
        const atmosphere =
            ctx.createRadialGradient(
                width / 2,
                height / 2,
                0,
                width / 2,
                height / 2,
                Math.max(width, height) * 0.55
            );

        atmosphere.addColorStop(
            0,
            'rgba(14,171,106,0.035)'
        );

        atmosphere.addColorStop(
            1,
            'rgba(0,0,0,0)'
        );

        ctx.fillStyle = atmosphere;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        particles.forEach((particle, index) => {
            let x = particle.x;
            let y = particle.y;
            let alpha = particle.alpha;
          let renderBoost = 1;

            /*
             * ACT I
             * Random fireflies appear.
             */
            if (elapsed < PHASE_RANDOM) {
                const progress =
                    clamp(
                        elapsed / PHASE_RANDOM,
                        0,
                        1
                    );

                const appearDelay =
                    (index /
                        particles.length) *
                    0.8;

                const local =
                    clamp(
                        (progress -
                            appearDelay) /
                            0.45,
                        0,
                        1
                    );

                const appearAlpha =
                    easeOutExpo(local) *
                    particle.alpha;

                alpha = Math.max(0.04, appearAlpha);

                const organicX =
                    Math.sin(elapsed * 0.0018 + particle.phase) *
                    (particle.driftX || 1.5);

                const organicY =
                    Math.cos(elapsed * 0.0016 + particle.phase * 1.2) *
                    (particle.driftY || 1.5);

                x = particle.startX + organicX;
                y = particle.startY + organicY;
            }

           /*
             * ACT II
             * Fireflies form WELCOME — attraction + inertie + settling
             */
            else if (elapsed < PHASE_WELCOME) {
                const progress =
                    clamp(
                        (elapsed - PHASE_RANDOM) /
                        (PHASE_WELCOME - PHASE_RANDOM),
                        0,
                        1
                    );

                if (!particle._welcomeInit) {
                    particle.x = particle.startX;
                    particle.y = particle.startY;
                    particle.vx = 0;
                    particle.vy = 0;
                    particle._welcomeInit = true;
                }

               const rampFactor = clamp(progress / 0.2, 0, 1);
                const attraction = (0.010 + particle.depth * 0.006) * rampFactor;
                const friction = 0.90;

                const dx = particle.welcomeX - particle.x;
                const dy = particle.welcomeY - particle.y;

                particle.vx += dx * attraction;
                particle.vy += dy * attraction;
                particle.vx *= friction;
                particle.vy *= friction;

                particle.x += particle.vx;
                particle.y += particle.vy;

                const noiseX = Math.sin(elapsed * 0.0011 + particle.noiseSeed) * 1.6;
                const noiseY = Math.cos(elapsed * 0.0013 + particle.noiseSeed) * 1.6;

                const remaining = 1 - progress;
                if (remaining < 0.12) {
                    const settleProgress = (0.12 - remaining) / 0.12;
                    const settle = easeOutExpo(settleProgress);

                    particle.x += (particle.welcomeX - particle.x) * settle * 0.35;
                    particle.y += (particle.welcomeY - particle.y) * settle * 0.35;
                    particle.vx *= 0.75;
                    particle.vy *= 0.75;
                }

                if (progress >= 1) {
                    particle.x = particle.welcomeX;
                    particle.y = particle.welcomeY;
                    particle.vx = 0;
                    particle.vy = 0;
                }

                x = particle.x + noiseX * (1 - progress * 0.6);
                y = particle.y + noiseY * (1 - progress * 0.6);

                alpha = particle.alpha;
                renderBoost = 1 + progress * 0.6;
            }

              /*
               * ACT III
               * WELCOME breathes.
               */
              else if (elapsed < PHASE_HOLD) {
                const breathe = Math.sin(elapsed * 0.003 + particle.phase);

                x = particle.welcomeX + Math.cos(particle.phase) * breathe * 1.3;
                y = particle.welcomeY + Math.sin(particle.phase) * breathe * 1.3;

                alpha = particle.alpha * (0.85 + breathe * 0.15);
                renderBoost = 1.6;
              }

              /*
               * ACT IV
               * Dispersion from WELCOME (particles move outward)
               */
              else if (elapsed < PHASE_MORPH) {
                const progress = clamp((elapsed - PHASE_HOLD) / (PHASE_MORPH - PHASE_HOLD), 0, 1);
                const eased = easeInOutCubic(progress);

                const angle = particle.phase + index * 0.035;
                const radius = eased * (28 + (index % 5) * 12);
                const driftX = Math.sin(elapsed * 0.002 + particle.phase) * 14 *eased;
                const driftY = Math.cos(elapsed * 0.0017 + particle.phase) * 12 * eased;

                x = particle.welcomeX + Math.cos(angle) * radius + driftX;
                y = particle.welcomeY + Math.sin(angle) * radius + driftY;

                particle._dispersedEndDriftX = driftX;
                particle._dispersedEndDriftY = driftY;

                alpha = particle.alpha * (0.7 + (1 - eased) * 0.3);
                renderBoost = 1.6 - eased * 0.3;
              }

              /*
               * ACT V
               * Particles re-gather to form 'TO MY PORTFOLIO'
               */
              else if (elapsed < PHASE_MELIOR) {
                const progress = clamp((elapsed - PHASE_MORPH) / (PHASE_MELIOR - PHASE_MORPH), 0, 1);
                const eased = easeInOutCubic(progress);

                const finalAngle = particle.phase + index * 0.035;
                const finalRadius = 28 + (index % 5) * 12;
                const dispersedX = particle.welcomeX + Math.cos(finalAngle) * finalRadius;
                const dispersedY = particle.welcomeY + Math.sin(finalAngle) * finalRadius;

                const driftX = Math.sin(elapsed * 0.002 + particle.phase) * 14 * (1 - eased);
                const driftY = Math.cos(elapsed * 0.0017 + particle.phase) * 12 * (1 - eased);

                x = dispersedX + (particle.meliorX - dispersedX) * eased + driftX;
                y = dispersedY + (particle.meliorY - dispersedY) * eased + driftY;

                alpha = particle.alpha;
                renderBoost = 1.3 + eased * 0.3;
              }

            /*
             * ACT VI
             * The fireflies explode outward.
             */
            else if (elapsed < PHASE_EXIT) {
                const progress =
                    clamp(
                        (elapsed -
                            PHASE_MELIOR) /
                            (PHASE_EXIT -
                                PHASE_MELIOR),
                        0,
                        1
                    );

                const eased =
                    easeInOutCubic(progress);

                const angle =
                    particle.phase +
                    index * 0.035;

                const radius =
                    eased *
                    (160 +
                        (index %
                            7) *
                            65);

                x =
                    particle.meliorX +
                    Math.cos(angle) *
                    radius;

                y =
                    particle.meliorY +
                    Math.sin(angle) *
                    radius;

                alpha =
                    particle.alpha *
                    (1 - eased);
                renderBoost = 1.6 - eased * 0.6;
            }

            else {
                alpha = 0;
            }

            drawParticle(
              particle,
              x,
              y,
              alpha,
              elapsed * 0.001,
              renderBoost
            );
        });

        /*
         * Finish.
         */
        if (elapsed >= PHASE_EXIT) {
            finishIntro();
            return;
        }

        requestAnimationFrame(animate);
    }

    /* ---------------------------------------------------------
       FINISH
       --------------------------------------------------------- */

    function finishIntro() {
        intro.classList.add(
            'is-ending'
        );

        if (mainContent) {
            mainContent.style.opacity = '1';
        }

        if (oldIntro) {
            oldIntro.style.display = 'none';
        }

        setTimeout(() => {
            document.body.style.overflow = '';
            intro.remove();
            window.removeEventListener(
                'resize',
                resize
            );
        }, 750);
    }

    /* ---------------------------------------------------------
       REDUCED MOTION
       --------------------------------------------------------- */

    if (reducedMotion) {
        const reducedText =
            document.createElement('div');

      reducedText.textContent =
        'TO MY PORTFOLIO';

        reducedText.style.position =
            'absolute';

        reducedText.style.inset = '0';

        reducedText.style.display =
            'flex';

        reducedText.style.alignItems =
            'center';

        reducedText.style.justifyContent =
            'center';

        reducedText.style.fontFamily =
            '"Fraunces", serif';

        reducedText.style.fontSize =
            'clamp(3rem, 12vw, 8rem)';

        reducedText.style.color =
            '#D9B57C';

        intro.appendChild(
            reducedText
        );

        setTimeout(
            finishIntro,
            1000
        );

        return;
    }

    requestAnimationFrame(
        animate
    );
})();
});
