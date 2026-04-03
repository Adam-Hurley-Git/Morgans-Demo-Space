/* ─────────────────────────────────────────────────────────────────────────
   MORGANS HOTEL — DIGITAL PORTFOLIO
   main.js — Nav · Scroll reveals · Before/After slider · Mobile menu
───────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── NAV: scroll state ──────────────────────────────────────────────── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── NAV: logo image fallback ─────────────────────────────────────── */
  const logoImg = document.querySelector('.nav__logo-img');
  if (logoImg) {
    logoImg.addEventListener('error', function () {
      this.classList.add('is-broken');
      this.style.display = 'none';
      const fallback = this.nextElementSibling;
      if (fallback) fallback.style.display = 'block';
    });
    // If already broken (cached 404)
    if (logoImg.complete && !logoImg.naturalWidth) {
      logoImg.dispatchEvent(new Event('error'));
    }
  }

  /* ── MOBILE MENU ────────────────────────────────────────────────────── */
  const burger    = document.getElementById('navBurger');
  const mobileNav = document.getElementById('navMobile');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen);
      // Animate burger → X
      const spans = burger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        const spans = burger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ── SCROLL REVEAL (IntersectionObserver) ───────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -48px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ── BEFORE / AFTER SLIDER ──────────────────────────────────────────── */
  const container = document.getElementById('beforeAfter');
  const beforePanel = document.getElementById('baBefore');
  const handle = document.getElementById('baHandle');

  if (container && beforePanel && handle) {
    let isDragging = false;
    let position = 50; // percentage

    function setPosition(pct) {
      // Clamp between 2% and 98%
      position = Math.min(98, Math.max(2, pct));
      beforePanel.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
      handle.style.left = `${position}%`;
    }

    function getPercent(clientX) {
      const rect = container.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    // Mouse
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(getPercent(e.clientX));
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch
    handle.addEventListener('touchstart', (e) => {
      isDragging = true;
      e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setPosition(getPercent(e.touches[0].clientX));
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });

    // Allow clicking anywhere on the container to jump
    container.addEventListener('click', (e) => {
      if (!isDragging) setPosition(getPercent(e.clientX));
    });

    // Initialise
    setPosition(50);

    // Keyboard accessibility on the handle button
    const btn = handle.querySelector('.ba__btn');
    if (btn) {
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  setPosition(position - 5);
        if (e.key === 'ArrowRight') setPosition(position + 5);
      });
    }
  }

  /* ── SMOOTH SCROLL for anchor links ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── STAGGERED card reveals ─────────────────────────────────────────── */
  // Add slight stagger delays to sibling reveal elements within grids
  document.querySelectorAll('.cards-two, .marketing-grid').forEach(grid => {
    grid.querySelectorAll('.reveal, .case-card, .m-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

})();
