// ===== HOME PAGE JS — FIXED =====
(function() {
  'use strict';

  // ===== PAGE LOADER =====
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    // Always hide loader after max 1.8s, no waiting for images
    function hideLoader() {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
      // Trigger scroll reveal after body is marked loaded
      setTimeout(initScrollReveal, 100);
      setTimeout(initStatCounters, 150);
      setTimeout(initMap, 200);
    }

    // Minimum visible time so it doesn't flash
    const minTime = 1400;
    const startTime = Date.now();

    function tryHide() {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minTime - elapsed);
      setTimeout(hideLoader, remaining);
    }

    // Try to hide after document load
    if (document.readyState === 'complete') {
      tryHide();
    } else {
      window.addEventListener('load', tryHide);
      // Fallback: force hide after 2.5s regardless
      setTimeout(hideLoader, 2500);
    }
  }

  // ===== PARTICLE SYSTEM =====
  function initParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const count = 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --dur: ${5 + Math.random() * 8}s;
        --delay: ${Math.random() * 5}s;
        --op: ${0.1 + Math.random() * 0.4};
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
      `;
      container.appendChild(p);
    }
  }

  // ===== LIVE COUNTER =====
  function initLiveCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
      const max = parseInt(counter.dataset.counterMax || '30');
      const min = parseInt(counter.dataset.counterMin || '3');

      function randomUpdate() {
        const val = Math.floor(Math.random() * (max - min + 1)) + min;
        counter.style.transition = 'opacity 0.3s';
        counter.style.opacity = '0';
        setTimeout(() => {
          counter.textContent = val;
          counter.style.opacity = '1';
        }, 300);
        const delay = 8000 + Math.random() * 15000;
        setTimeout(randomUpdate, delay);
      }

      randomUpdate();
    });
  }

  // ===== SCROLL REVEAL =====
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) translateX(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });

    document.querySelectorAll('.reveal-left').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-40px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });

    document.querySelectorAll('.reveal-right').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(40px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });

    // Staggered children
    document.querySelectorAll('.reveal-stagger').forEach(parent => {
      const children = parent.children;
      Array.from(children).forEach((child, i) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
        child.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
        observer.observe(child);
      });
    });
  }

  // ===== MAP SVG ANIMATION =====
  function initMap() {
    const svg = document.querySelector('#mapSvg');
    if (!svg) return;

    // Animate connection lines
    const paths = svg.querySelectorAll('.map-line');
    paths.forEach((path, i) => {
      try {
        const length = path.getTotalLength ? path.getTotalLength() : 200;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        setTimeout(() => {
          path.style.transition = `stroke-dashoffset 1.5s ease ${i * 0.3}s`;
          path.style.strokeDashoffset = '0';
        }, 300);
      } catch(e) {}
    });

    // City hover effects
    const cities = svg.querySelectorAll('.city-group');
    cities.forEach(city => {
      city.addEventListener('mouseenter', () => {
        const ring = city.querySelector('.city-ring');
        if (ring) ring.setAttribute('r', '16');
      });
      city.addEventListener('mouseleave', () => {
        const ring = city.querySelector('.city-ring');
        if (ring) ring.setAttribute('r', '12');
      });
    });
  }

  // ===== FLAVOR CARDS HOVER =====
  function initFlavorCards() {
    const cards = document.querySelectorAll('.flavor-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() { this.style.zIndex = '10'; });
      card.addEventListener('mouseleave', function() { this.style.zIndex = ''; });
    });
  }

  // ===== COUNTER ANIMATION =====
  function animateCounter(el, target, duration = 1500) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * ease).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function initStatCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.countTo || '0');
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count-to]').forEach(el => observer.observe(el));
  }

  // ===== INSTAGRAM GRID HOVER =====
  function initIgGrid() {
    const posts = document.querySelectorAll('.ig-post');
    posts.forEach(post => {
      post.addEventListener('click', () => window.open('https://instagram.com/sitifit.sm', '_blank'));
    });
  }

  // ===== NAV SCROLL =====
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    function handleScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ===== INIT =====
  function init() {
    initLoader();
    initParticles();
    initLiveCounters();
    initFlavorCards();
    initIgGrid();
    initNavScroll();
    // Scroll reveal and map init happen after loader hides (inside initLoader)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
