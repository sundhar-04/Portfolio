/* ============================================
   SUNDHARESAN A – 3D PORTFOLIO
   Three.js Scene + Scroll Interactions
   ============================================ */

(function () {
  'use strict';

  // ── CONFIG ──
  const CONFIG = {
    particleCount: 600,
    headDetail: 3,
    scrollSections: ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'achievements', 'contact'],
    typewriterTexts: [
      'AI & Data Science Engineer',
      'DevOps Intern @ Springer Capital',
      'Full-Stack Developer',
      'Competitive Programmer',
      'Machine Learning Enthusiast'
    ],
    sectionColors: {
      hero: { r: 0.23, g: 0.51, b: 0.97 },      // blue
      about: { r: 0.23, g: 0.51, b: 0.97 },      // blue
      skills: { r: 0.55, g: 0.36, b: 0.96 },      // purple
      experience: { r: 0.98, g: 0.45, b: 0.09 },   // orange
      projects: { r: 0.06, g: 0.73, b: 0.51 },     // green
      certifications: { r: 0.02, g: 0.71, b: 0.83 },// cyan
      achievements: { r: 0.96, g: 0.62, b: 0.04 },  // gold
      contact: { r: 0.55, g: 0.36, b: 0.96 }       // purple
    }
  };

  // ── STATE ──
  const state = {
    mouse: { x: 0, y: 0 },
    scroll: 0,
    currentSection: 'hero',
    isMobile: window.innerWidth < 768,
    headVisible: false
  };

  // ═══════════════════════════════════════════
  //  THREE.JS – HERO SCENE (Particles + Head)
  // ═══════════════════════════════════════════

  function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── Lighting ──
    const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x3B82F6, 2, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8B5CF6, 1.5, 50);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xF97316, 1, 50);
    pointLight3.position.set(0, 5, -5);
    scene.add(pointLight3);

    // ── Particles ──
    const particlesGeometry = new THREE.BufferGeometry();
    const count = state.isMobile ? 300 : CONFIG.particleCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const mixR = Math.random();
      colors[i * 3] = 0.23 + mixR * 0.3;
      colors[i * 3 + 1] = 0.36 + mixR * 0.2;
      colors[i * 3 + 2] = 0.96;

      sizes[i] = Math.random() * 3 + 0.5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // ── Floating Geometric Shapes ──
    const shapes = [];

    // Icosahedron (main accent)
    const icoGeo = new THREE.IcosahedronGeometry(0.4, 0);
    const icoMat = new THREE.MeshPhongMaterial({
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(-6, 2, -3);
    scene.add(ico);
    shapes.push({ mesh: ico, speed: 0.005, axis: 'xy', float: 0.8 });

    // Octahedron
    const octGeo = new THREE.OctahedronGeometry(0.35, 0);
    const octMat = new THREE.MeshPhongMaterial({
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.25,
      wireframe: true
    });
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.position.set(6, -2, -4);
    scene.add(oct);
    shapes.push({ mesh: oct, speed: 0.007, axis: 'yz', float: 1.2 });

    // Torus
    const torusGeo = new THREE.TorusGeometry(0.3, 0.1, 8, 16);
    const torusMat = new THREE.MeshPhongMaterial({
      color: 0xF97316,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-4, -3, -2);
    scene.add(torus);
    shapes.push({ mesh: torus, speed: 0.004, axis: 'xz', float: 0.6 });

    // Small dodecahedrons scattered
    for (let i = 0; i < 5; i++) {
      const dodGeo = new THREE.DodecahedronGeometry(0.15, 0);
      const dodMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.55, 0.8, 0.6),
        transparent: true,
        opacity: 0.15,
        wireframe: true
      });
      const dod = new THREE.Mesh(dodGeo, dodMat);
      dod.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 3
      );
      scene.add(dod);
      shapes.push({ mesh: dod, speed: 0.003 + Math.random() * 0.006, axis: 'xy', float: Math.random() * 1.5 });
    }

    // ── Animation Loop ──
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate particles based on scroll + mouse
      particles.rotation.y = elapsed * 0.05 + state.scroll * 0.5;
      particles.rotation.x = state.mouse.y * 0.1;

      // Float and rotate shapes
      shapes.forEach((s, i) => {
        const mesh = s.mesh;
        mesh.rotation.x += s.speed;
        mesh.rotation.y += s.speed * 0.7;
        mesh.position.y += Math.sin(elapsed * s.float + i) * 0.002;

        // Mouse parallax on shapes
        mesh.position.x += (state.mouse.x * 0.3 - mesh.position.x) * 0.001;
      });

      // Camera subtle movement with mouse
      camera.position.x += (state.mouse.x * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (state.mouse.y * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }

    animate();

    // ── Resize ──
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      state.isMobile = window.innerWidth < 768;
    });
  }


  // ═══════════════════════════════════════════
  //  SCROLL HANDLING
  // ═══════════════════════════════════════════

  function initScrollHandler() {
    const navbar = document.getElementById('navbar');
    const sections = CONFIG.scrollSections.map(id => document.getElementById(id)).filter(Boolean);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      state.scroll = docHeight > 0 ? scrollTop / docHeight : 0;

      // Nav background
      if (navbar) {
        navbar.classList.toggle('scrolled', scrollTop > 50);
      }

      // Detect current section
      let current = 'hero';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          current = section.id;
        }
      });
      state.currentSection = current;

      // Update active nav link
      document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
      });
    });
  }

  // ═══════════════════════════════════════════
  //  MOUSE TRACKING
  // ═══════════════════════════════════════════

  function initMouseTracking() {
    window.addEventListener('mousemove', (e) => {
      state.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  // ═══════════════════════════════════════════
  //  INTERSECTION OBSERVER (Scroll Animations)
  // ═══════════════════════════════════════════

  function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // Animate skill bars if present
          const bars = entry.target.querySelectorAll('[data-animate-bars] .skill-bar');
          bars.forEach((bar, i) => {
            setTimeout(() => {
              bar.style.width = bar.dataset.width + '%';
            }, i * 100);
          });

          // Also check if this element itself contains skill bars
          if (entry.target.querySelector('[data-animate-bars]')) {
            const innerBars = entry.target.querySelectorAll('.skill-bar');
            innerBars.forEach((bar, i) => {
              setTimeout(() => {
                bar.style.width = bar.dataset.width + '%';
              }, i * 100 + 300);
            });
          }
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // ═══════════════════════════════════════════
  //  TYPEWRITER EFFECT
  // ═══════════════════════════════════════════

  function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const texts = CONFIG.typewriterTexts;
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
      const currentText = texts[textIndex];

      if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        element.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 400; // Pause before typing next
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
  }

  // ═══════════════════════════════════════════
  //  NAVIGATION
  // ═══════════════════════════════════════════

  function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    // Hamburger toggle
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      });

      // Close mobile nav on link click
      document.querySelectorAll('[data-mobile-link]').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Smooth scroll for all nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
          const top = target.offsetTop - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ═══════════════════════════════════════════
  //  3D CARD TILT EFFECT
  // ═══════════════════════════════════════════

  function initCardTilt() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ═══════════════════════════════════════════
  //  STAGGER CHILDREN DELAY
  // ═══════════════════════════════════════════

  function initStaggerDelays() {
    document.querySelectorAll('.stagger-children').forEach(parent => {
      const children = parent.children;
      for (let i = 0; i < children.length; i++) {
        children[i].style.setProperty('--i', i);
        children[i].style.transitionDelay = `${i * 100}ms`;
      }
    });
  }

  // ═══════════════════════════════════════════
  //  INIT EVERYTHING
  // ═══════════════════════════════════════════

  function safeCall(name, fn) {
    try { fn(); }
    catch (e) { console.warn('[Portfolio] ' + name + ' failed:', e.message); }
  }

  function init() {
    // Critical: these must run even if Three.js fails
    safeCall('ScrollAnimations', initScrollAnimations);
    safeCall('Typewriter', initTypewriter);
    safeCall('Navigation', initNavigation);
    safeCall('ScrollHandler', initScrollHandler);
    safeCall('MouseTracking', initMouseTracking);
    safeCall('CardTilt', initCardTilt);
    safeCall('StaggerDelays', initStaggerDelays);

    // 3D features: optional, may fail if Three.js CDN blocked
    safeCall('HeroScene', initHeroScene);


    // Trigger initial scroll state
    window.dispatchEvent(new Event('scroll'));
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
