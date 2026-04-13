/* ============================================
   OG4U — Landing Page Scripts
   GSAP Animations, ScrollTrigger, Mobile Menu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  const preloaderTl = gsap.timeline();
  preloaderTl.to('.preloader-logo', {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    delay: 2
  }).to(preloader, {
    yPercent: -100,
    duration: 0.8,
    ease: 'power4.inOut',
    onComplete: () => {
      preloader.style.display = 'none';
      initAnimations();
    }
  });

  // --- Cursor Glow (desktop only) ---
  const cursorGlow = document.getElementById('cursorGlow');
  if (globalThis.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.style.opacity = '1';
    });

    function updateCursor() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.transform = `translate3d(${glowX - 200}px, ${glowY - 200}px, 0)`;
      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  }

  // --- Navigation scroll effect ---
  const nav = document.getElementById('nav');

  globalThis.addEventListener('scroll', () => {
    if (globalThis.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- Mobile Menu ---
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let menuOpen = false;

  navToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    navToggle.classList.toggle('active', menuOpen);
    mobileMenu.classList.toggle('active', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Products Tab Switching ---
  const tabs = document.querySelectorAll('.products-tab');
  const productCards = document.querySelectorAll('.product-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      productCards.forEach(card => {
        if (card.dataset.category === category) {
          card.style.display = '';
          gsap.fromTo(card, {
            opacity: 0,
            y: 30,
            scale: 0.95
          }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power3.out',
            delay: Number.parseInt(card.dataset.delay) * 0.1
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- CTA Form ---
  const ctaForm = document.getElementById('ctaForm');
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = ctaForm.querySelector('.cta-input');
    const btn = ctaForm.querySelector('.cta-submit span');
    const originalText = btn.textContent;

    btn.textContent = "You're OG now!";
    input.value = '';
    gsap.fromTo(btn.parentElement, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' });

    setTimeout(() => {
      btn.textContent = originalText;
    }, 3000);
  });

  // --- GSAP Animations ---
  function initAnimations() {
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    heroTl
      .to('.hero-badge', { opacity: 1, y: 0, duration: 0.8 })
      .to('.hero-title-word', { y: 0, duration: 1, stagger: 0.1 }, '-=0.4')
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('.hero-stats', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('.hero-scroll', { opacity: 0.6, duration: 0.6 }, '-=0.3');

    // Bottle entrance — one clean timeline, then hand off to CSS
    gsap.fromTo('#heroBottle', {
      opacity: 0,
      scale: 0.5,
      y: 80
    }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.4,
      onComplete() {
        // After entrance, add CSS class for lightweight infinite animation
        document.getElementById('heroBottle').classList.add('bottle-alive');
      }
    });

    gsap.fromTo('.hero-bottle-ring', {
      opacity: 0, scale: 0.5
    }, {
      opacity: 1, scale: 1,
      duration: 0.8, stagger: 0.15,
      ease: 'back.out(2)', delay: 0.6
    });

    // Scroll parallax — GPU-only props (translate3d via y), no scale/opacity change
    gsap.to('#heroBottle', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2
      },
      y: -30
    });

    // Mouse follow on desktop — throttled, GPU-only
    if (globalThis.matchMedia('(pointer: fine)').matches) {
      const heroSection = document.querySelector('.hero');
      let ticking = false;

      heroSection.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const rect = heroSection.getBoundingClientRect();
          const xPct = (e.clientX - rect.left) / rect.width - 0.5;
          const yPct = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to('#heroBottleSvg', {
            x: xPct * 12,
            y: yPct * 8,
            duration: 1,
            ease: 'power2.out',
            overwrite: 'auto'
          });
          ticking = false;
        });
      });

      heroSection.addEventListener('mouseleave', () => {
        gsap.to('#heroBottleSvg', {
          x: 0, y: 0,
          duration: 1.2,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    }

    // Touch drag for mobile
    if (globalThis.matchMedia('(pointer: coarse)').matches) {
      let touchStartX = 0;
      const bottleEl = document.getElementById('heroBottleSvg');
      if (bottleEl) {
        const touchTarget = bottleEl.parentElement.parentElement;
        touchTarget.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
        }, { passive: true });
        touchTarget.addEventListener('touchmove', (e) => {
          const dx = (e.touches[0].clientX - touchStartX) * 0.25;
          gsap.to(bottleEl, {
            x: dx,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }, { passive: true });
        touchTarget.addEventListener('touchend', () => {
          gsap.to(bottleEl, {
            x: 0,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }, { passive: true });
      }
    }

    // Counter animation
    document.querySelectorAll('.hero-stat-num').forEach(el => {
      const target = Number.parseInt(el.dataset.target);
      gsap.to(el, {
        textContent: target,
        duration: 2,
        delay: 1.5,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    createParticles();
    initScrollReveals();
    initBottleTilt();
  }

  // --- Scroll Reveals ---
  function initScrollReveals() {
    gsap.utils.toArray('.reveal-tag').forEach(el => {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.reveal-title').forEach(el => {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1
      });
    });

    gsap.utils.toArray('.reveal-card').forEach(el => {
      const delay = Number.parseInt(el.dataset.delay || 0) * 0.12;
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay
      });
    });

    gsap.to('.marquee-track', {
      scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      x: -100
    });
  }

  // --- Particles (fewer, CSS-animated instead of per-particle GSAP) ---
  function createParticles() {
    const container = document.getElementById('heroParticles');
    const count = globalThis.innerWidth < 768 ? 8 : 15;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';

      const size = Math.random() * 3 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      const colors = ['#a855f7', '#6366f1', '#3b82f6', '#ec4899'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      const dur = (Math.random() * 4 + 3).toFixed(1);
      const delay = (Math.random() * 3).toFixed(1);
      particle.style.animationDuration = `${dur}s`;
      particle.style.animationDelay = `${delay}s`;

      container.appendChild(particle);
    }
  }

  // --- Bottle tilt on hover ---
  function initBottleTilt() {
    document.querySelectorAll('.product-card').forEach(card => {
      const bottle = card.querySelector('.product-bottle') || card.querySelector('.product-bottle-img');
      if (!bottle) return;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(bottle, {
          rotateY: x * 15,
          rotateX: -y * 10,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(bottle, {
          rotateY: 0, rotateX: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + globalThis.scrollY - offset;
        globalThis.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
