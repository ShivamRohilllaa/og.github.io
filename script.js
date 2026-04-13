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
  if (window.matchMedia('(pointer: fine)').matches) {
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
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  }

  // --- Navigation scroll effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
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
            delay: parseInt(card.dataset.delay) * 0.1
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
    // Hero animations timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    heroTl
      .to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.8
      })
      .to('.hero-title-word', {
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out'
      }, '-=0.4')
      .to('.hero-sub', {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, '-=0.5')
      .to('.hero-actions', {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, '-=0.5')
      .to('.hero-stats', {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, '-=0.5')
      .to('.hero-scroll', {
        opacity: 0.6,
        duration: 0.6
      }, '-=0.3');

    // Hero bottle entrance — dramatic pop-in
    const bottleEntryTl = gsap.timeline({ delay: 0.3 });
    bottleEntryTl
      .fromTo('#heroBottle', {
        opacity: 0,
        scale: 0.3,
        y: 120,
        rotation: -15
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 1.4,
        ease: 'elastic.out(1, 0.6)'
      })
      .fromTo('.hero-bottle-ring', {
        opacity: 0,
        scale: 0.5
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(2)'
      }, '-=0.6');

    // Multi-layer floating — body sways, SVG bobs independently
    gsap.to('#heroBottleSvg', {
      y: -18,
      rotation: 2,
      duration: 2.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    gsap.to('#heroBottle', {
      y: -10,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // Subtle continuous tilt/dance
    gsap.to('#heroBottleSvg', {
      rotation: -2.5,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.5
    });

    // Glow pulse sync with movement
    gsap.to('.hero-bottle-glow', {
      scale: 1.15,
      opacity: 0.9,
      duration: 2.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // Ring breathing animation
    gsap.utils.toArray('.hero-bottle-ring').forEach((ring, i) => {
      gsap.to(ring, {
        scale: 1.08,
        opacity: 0.15,
        duration: 2.5 + i * 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.3
      });
    });

    // Periodic "shake/kick" every few seconds
    function bottleKick() {
      const kickTl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(4 + Math.random() * 3, bottleKick);
        }
      });
      kickTl
        .to('#heroBottleSvg', { x: 6, rotation: 3, duration: 0.08, ease: 'power2.in' })
        .to('#heroBottleSvg', { x: -5, rotation: -2.5, duration: 0.08, ease: 'power2.in' })
        .to('#heroBottleSvg', { x: 4, rotation: 2, duration: 0.07 })
        .to('#heroBottleSvg', { x: -3, rotation: -1.5, duration: 0.07 })
        .to('#heroBottleSvg', { x: 0, rotation: 0, duration: 0.3, ease: 'elastic.out(1, 0.4)' });
    }
    gsap.delayedCall(3, bottleKick);

    // Scroll parallax — gentle, stays fully visible
    gsap.to('#heroBottle', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      },
      y: -40,
      scale: 0.96
    });

    // Mouse follow tilt on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
      const heroSection = document.querySelector('.hero');
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to('#heroBottleSvg', {
          rotateY: xPct * 12,
          rotateX: -yPct * 8,
          x: xPct * 15,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
      heroSection.addEventListener('mouseleave', () => {
        gsap.to('#heroBottleSvg', {
          rotateY: 0,
          rotateX: 0,
          x: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto'
        });
      });
    }

    // Touch drag interaction for mobile
    if (window.matchMedia('(pointer: coarse)').matches) {
      let touchStartX = 0;
      const bottle = document.getElementById('heroBottleSvg');
      bottle.parentElement.parentElement.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      bottle.parentElement.parentElement.addEventListener('touchmove', (e) => {
        const dx = (e.touches[0].clientX - touchStartX) * 0.3;
        gsap.to(bottle, {
          rotation: dx * 0.15,
          x: dx,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }, { passive: true });
      bottle.parentElement.parentElement.addEventListener('touchend', () => {
        gsap.to(bottle, {
          rotation: 0,
          x: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto'
        });
      }, { passive: true });
    }

    // Counter animation
    document.querySelectorAll('.hero-stat-num').forEach(el => {
      const target = parseInt(el.dataset.target);
      gsap.to(el, {
        textContent: target,
        duration: 2,
        delay: 1.5,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: el,
          start: 'top 90%'
        }
      });
    });

    // Particles
    createParticles();

    // Scroll-triggered reveals
    initScrollReveals();

    // Product bottle hover tilt
    initBottleTilt();
  }

  // --- Scroll Reveals ---
  function initScrollReveals() {
    // Section tags
    gsap.utils.toArray('.reveal-tag').forEach(el => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    });

    // Section titles
    gsap.utils.toArray('.reveal-title').forEach(el => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.1
      });
    });

    // Cards
    gsap.utils.toArray('.reveal-card').forEach(el => {
      const delay = parseInt(el.dataset.delay || 0) * 0.12;
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay
      });
    });

    // Marquee parallax
    gsap.to('.marquee-track', {
      scrollTrigger: {
        trigger: '.marquee',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      },
      x: -100
    });
  }

  // --- Particles ---
  function createParticles() {
    const container = document.getElementById('heroParticles');
    const count = window.innerWidth < 768 ? 15 : 30;

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

      container.appendChild(particle);

      gsap.to(particle, {
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to(particle, {
        y: `random(-80, 80)`,
        x: `random(-40, 40)`,
        duration: Math.random() * 6 + 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
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
          rotateY: 0,
          rotateX: 0,
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
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
