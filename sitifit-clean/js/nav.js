// ===== NAVIGATION JS =====

(function() {
  'use strict';

  function initNav() {
    const nav = document.querySelector('.nav');
    const trigger = document.querySelector('.nav-dots-trigger');
    const menu = document.querySelector('.fullscreen-menu');
    const menuLinks = document.querySelectorAll('.menu-nav-links a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Scroll handler
    function handleScroll() {
      if (window.scrollY > 50) {
        nav && nav.classList.add('scrolled');
      } else {
        nav && nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Menu toggle
    let menuOpen = false;

    function openMenu() {
      menuOpen = true;
      menu && menu.classList.add('open');
      trigger && trigger.classList.add('active');
      document.body.style.overflow = 'hidden';
      animateMenuLinks(true);
    }

    function closeMenu() {
      menuOpen = false;
      menu && menu.classList.remove('open');
      trigger && trigger.classList.remove('active');
      document.body.style.overflow = '';
      animateMenuLinks(false);
    }

    function animateMenuLinks(show) {
      menuLinks.forEach((link, i) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(30px)';
        link.style.transition = 'none';
        if (show) {
          setTimeout(() => {
            link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
          }, 50 + i * 80);
        }
      });
    }

    trigger && trigger.addEventListener('click', () => {
      if (menuOpen) closeMenu(); else openMenu();
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    // Close on link click
    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
      // Set active state
      const href = link.getAttribute('href') || '';
      if (href.includes(currentPage) || (currentPage === 'index.html' && href === 'index.html') || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active-link');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
