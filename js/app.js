/**
 * QuizHire – Landing Page JavaScript
 * File: js/app.js
 *
 * Handles:
 *  1. Navbar scroll effect
 *  2. Mobile hamburger menu
 *  3. Scroll-reveal animations (IntersectionObserver)
 *  4. Animated number counters (stats bar)
 *  5. Smooth scroll for anchor links
 *  6. Navbar active link highlight on scroll
 */

/* ─── 1. NAVBAR SCROLL EFFECT ────────────────────────
   Adds a frosted-glass background when user scrolls
   past 60px from the top.
────────────────────────────────────────────────────── */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load in case page is already scrolled
})();


/* ─── 2. MOBILE HAMBURGER MENU ───────────────────────
   Toggles the mobile drawer open/closed.
   Also closes drawer when a drawer link is clicked.
────────────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (!hamburger || !mobileDrawer) return;

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (mobileDrawer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close drawer when any drawer link is clicked
  const drawerLinks = mobileDrawer.querySelectorAll('.drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });
})();


/* ─── 3. SCROLL REVEAL ANIMATION ────────────────────
   Uses IntersectionObserver to add the 'visible' class
   when elements with class 'reveal' enter the viewport.
   Stagger delay is set via [data-d] attribute (0–6).
────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const STAGGER_MS  = 100; // milliseconds per delay step
  const THRESHOLD   = 0.12; // how much of element must be visible

  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // Apply CSS transition-delay based on data-d attribute
  revealEls.forEach(function (el) {
    const delay = parseInt(el.dataset.d || 0, 10);
    el.style.transitionDelay = (delay * STAGGER_MS) + 'ms';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once revealed (one-shot animation)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: THRESHOLD,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(function (el) { observer.observe(el); });
})();


/* ─── 4. ANIMATED NUMBER COUNTERS ────────────────────
   Counts up numeric stats (e.g. 0 → 500) when the
   stats bar enters the viewport.
   Uses [data-target] attribute for target value.

   Algorithm:
   - easeOutCubic easing for natural deceleration
   - Duration: 1800ms
   - requestAnimationFrame for smooth 60fps updates
────────────────────────────────────────────────────── */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  const DURATION = 1800; // ms

  // Easing function: ease-out cubic
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target    = parseInt(el.dataset.target, 10);
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const value    = Math.floor(easeOutCubic(progress) * target);

      el.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target; // Ensure final value is exact
      }
    }

    requestAnimationFrame(update);
  }

  // Trigger counters when stats bar is visible
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;

  let counted = false; // Only run once

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNums.forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterObserver.observe(statsBar);
})();


/* ─── 5. SMOOTH SCROLL FOR ANCHOR LINKS ─────────────
   Intercepts clicks on #hash links and smoothly
   scrolls to the target section, accounting for
   the fixed navbar height.
────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  const NAV_OFFSET = 80; // px — accounts for fixed navbar height

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const top = targetEl.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
  });
})();


/* ─── 6. ACTIVE NAV LINK HIGHLIGHT ON SCROLL ─────────
   Highlights the nav link corresponding to the
   section currently in the viewport as user scrolls.
────────────────────────────────────────────────────── */
(function initActiveNavLinks() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const NAV_OFFSET = 100;

  function updateActiveLink() {
    let currentId = '';

    sections.forEach(function (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY >= sectionTop - NAV_OFFSET) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // Run once on load
})();


/* ─── INIT LOG ───────────────────────────────────────── */
console.log('%cQuizHire 🎯', 'font-size:18px; font-weight:bold; color:#a78bfa;');
console.log('%cReal-Time Quiz & Skill Recommendation Platform', 'color:#38bdf8;');
