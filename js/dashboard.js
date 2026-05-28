/**
 * QuizHire – Student Dashboard JavaScript
 * File: js/dashboard.js
 *
 * Handles:
 *  1. Load student session data + personalize UI
 *  2. Greeting (Good Morning / Afternoon / Evening)
 *  3. Sidebar toggle (mobile hamburger + close)
 *  4. Section navigation (Overview / Skills / Companies / Learning / History)
 *  5. Animated stat counters
 *  6. Scroll reveal animations (IntersectionObserver)
 *  7. Notification panel toggle
 *  8. Company tab switching (Better / Good / Needs)
 *  9. Career strip dismiss
 * 10. Logout handler
 */

'use strict';

/* ─── DOM REFERENCES ────────────────────────────────── */
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose   = document.getElementById('sidebarClose');
const hamburger      = document.getElementById('hamburger');
const navLinks       = document.querySelectorAll('.snav-link[data-section]');
const sections       = document.querySelectorAll('.dash-section');
const breadcrumb     = document.getElementById('breadcrumbLabel');
const notifBtn       = document.getElementById('notifBtn');
const notifPanel     = document.getElementById('notifPanel');
const companyTabs    = document.querySelectorAll('.ctab');
const careerStrip    = document.getElementById('careerStrip');
const stripClose     = document.getElementById('stripClose');
const logoutBtn      = document.getElementById('logoutBtn');
const greetingText   = document.getElementById('greetingText');
const welcomeName    = document.getElementById('welcomeName');
const sidebarName    = document.getElementById('sidebarName');
const sidebarAvatar  = document.getElementById('sidebarAvatar');
const topbarAvatar   = document.getElementById('topbarAvatar');


/* ═══════════════════════════════════════════════════
   1. SESSION DATA — Load student info from sessionStorage
      (set by login.js on successful login)
      Falls back to demo data if not found.
═══════════════════════════════════════════════════ */
(function loadStudentData() {
  const savedName  = sessionStorage.getItem('qh_user_name')  || 'Arjun Sharma';
  const savedEmail = sessionStorage.getItem('qh_user_email') || 'student@quizhire.com';

  // Build initials from name (e.g. "Arjun Sharma" → "AS")
  const initials = savedName
    .split(' ')
    .map(function (w) { return w[0]?.toUpperCase() || ''; })
    .join('')
    .slice(0, 2);

  // Update all name / avatar references
  if (welcomeName)  welcomeName.textContent  = savedName + ' 👋';
  if (sidebarName)  sidebarName.textContent  = savedName;
  if (sidebarAvatar) sidebarAvatar.textContent = initials;
  if (topbarAvatar)  topbarAvatar.textContent  = initials;
})();


/* ═══════════════════════════════════════════════════
   2. DYNAMIC GREETING
      Morning  → before 12:00
      Afternoon → 12:00–17:59
      Evening  → 18:00+
═══════════════════════════════════════════════════ */
(function setGreeting() {
  if (!greetingText) return;
  const hour = new Date().getHours();
  let greeting = 'Good Evening,';
  if (hour < 12) greeting = 'Good Morning,';
  else if (hour < 18) greeting = 'Good Afternoon,';
  greetingText.textContent = greeting;
})();


/* ═══════════════════════════════════════════════════
   3. SIDEBAR TOGGLE (mobile)
      Hamburger opens, X-button / overlay click closes.
═══════════════════════════════════════════════════ */
function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('visible');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('visible');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger)      hamburger.addEventListener('click', openSidebar);
if (sidebarClose)   sidebarClose.addEventListener('click', closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeSidebar();
});


/* ═══════════════════════════════════════════════════
   4. SECTION NAVIGATION
      Clicking a sidebar nav link shows the matching
      <section id="..."> and hides all others.
      Updates breadcrumb label and active link state.
═══════════════════════════════════════════════════ */
const SECTION_LABELS = {
  overview:  'Overview',
  skills:    'Skill Analysis',
  companies: 'Companies',
  learning:  'Learning Path',
  quizzes:   'Quiz History'
};

function showSection(targetId) {
  // Hide all sections
  sections.forEach(function (sec) {
    sec.hidden = (sec.id !== targetId);
  });

  // Update active nav link
  navLinks.forEach(function (link) {
    const isActive = link.dataset.section === targetId;
    link.classList.toggle('active', isActive);
  });

  // Update topbar breadcrumb
  if (breadcrumb) breadcrumb.textContent = SECTION_LABELS[targetId] || targetId;

  // Scroll page back to top on section change
  const scroll = document.querySelector('.page-scroll');
  if (scroll) scroll.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile sidebar after navigation
  closeSidebar();

  // Re-trigger reveal animations for newly visible section
  triggerReveal();
}

navLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.dataset.section;
    if (target) showSection(target);
  });
});

// Handle hash on load (e.g. dashboard.html#skills)
(function handleInitialHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash && SECTION_LABELS[hash]) {
    showSection(hash);
  }
})();


/* ═══════════════════════════════════════════════════
   5. ANIMATED STAT COUNTERS
      Counts from 0 → target value using easeOutCubic.
      Triggered once when the stats row enters viewport.
═══════════════════════════════════════════════════ */
const COUNTER_DURATION = 1600; // ms

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  const target    = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / COUNTER_DURATION, 1);
    const value    = Math.floor(easeOutCubic(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

// Observe the stat-cards row; run counters once when visible
(function initCounters() {
  const statCards = document.querySelector('.stat-cards');
  if (!statCards) return;

  let fired = false;
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !fired) {
        fired = true;
        document.querySelectorAll('[data-target]').forEach(animateCounter);
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  obs.observe(statCards);
})();


/* ═══════════════════════════════════════════════════
   6. SCROLL REVEAL — IntersectionObserver
      Elements with class 'reveal' fade + slide up
      when they enter the viewport. Stagger via
      sibling index (each 80ms apart).
═══════════════════════════════════════════════════ */
function triggerReveal() {
  const revealEls = document.querySelectorAll('.reveal:not(.visible)');

  // Group by parent so siblings stagger together
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(function (el, i) {
    // Stagger delay based on position within its parent container
    const siblings = Array.from(el.parentElement?.children || []);
    const sibIdx   = siblings.indexOf(el);
    el.style.transitionDelay = (Math.max(sibIdx, 0) * 80) + 'ms';
    observer.observe(el);
  });
}

// Run reveal on initial load
triggerReveal();


/* ═══════════════════════════════════════════════════
   7. NOTIFICATION PANEL TOGGLE
      Clicking the bell opens/closes the panel.
      Clicking elsewhere closes it.
═══════════════════════════════════════════════════ */
if (notifBtn && notifPanel) {
  notifBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = !notifPanel.hidden;
    notifPanel.hidden = isOpen;

    // Remove dot when first opened
    if (!isOpen) {
      const dot = notifBtn.querySelector('.notif-dot');
      if (dot) setTimeout(function () { dot.style.display = 'none'; }, 600);
    }
  });

  // Click outside → close
  document.addEventListener('click', function (e) {
    if (!notifPanel.hidden && !notifPanel.contains(e.target) && e.target !== notifBtn) {
      notifPanel.hidden = true;
    }
  });

  // Escape → close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !notifPanel.hidden) notifPanel.hidden = true;
  });
}


/* ═══════════════════════════════════════════════════
   8. COMPANY TAB SWITCHING
      Tabs: Better / Good / Needs Improvement
      Switches visible company-panel and updates
      active tab style + aria-selected.
═══════════════════════════════════════════════════ */
companyTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    const level = this.dataset.level;

    // Update tab active state
    companyTabs.forEach(function (t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');

    // Show matching panel, hide others
    document.querySelectorAll('.company-panel').forEach(function (panel) {
      panel.hidden = (panel.id !== 'panel-' + level);
    });

    // Re-trigger reveal for newly shown cards
    triggerReveal();
  });
});


/* ═══════════════════════════════════════════════════
   9. CAREER STRIP DISMISS
      Clicking ✕ slides and removes the strip.
═══════════════════════════════════════════════════ */
if (stripClose && careerStrip) {
  stripClose.addEventListener('click', function () {
    careerStrip.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    careerStrip.style.transform  = 'translateY(100%)';
    careerStrip.style.opacity    = '0';
    setTimeout(function () { careerStrip.remove(); }, 350);
  });
}


/* ═══════════════════════════════════════════════════
  10. LOGOUT HANDLER
      Clears sessionStorage and redirects to login.
═══════════════════════════════════════════════════ */
if (logoutBtn) {
  logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    sessionStorage.removeItem('qh_user_name');
    sessionStorage.removeItem('qh_user_email');
    sessionStorage.removeItem('qh_user_role');
    window.location.href = 'login.html';
  });
}


/* ═══════════════════════════════════════════════════
  11. SKILL BARS — Animate in on section reveal
      Width is set via CSS var(--w). We defer them
      slightly so the transition is visible.
═══════════════════════════════════════════════════ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  bars.forEach(function (bar) {
    // Store the target width, set to 0 initially, animate later
    const targetW = bar.style.getPropertyValue('--w') || '0%';
    bar.style.setProperty('--w', '0%');

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            bar.style.setProperty('--w', targetW);
          }, 200);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    obs.observe(bar);
  });
})();


/* ═══════════════════════════════════════════════════
  12. LEARNING PROGRESS BARS — Same animate-in trick
═══════════════════════════════════════════════════ */
(function initLpBars() {
  const bars = document.querySelectorAll('.lp-bar');
  bars.forEach(function (bar) {
    const targetW = bar.style.getPropertyValue('--w') || '0%';
    bar.style.setProperty('--w', '0%');

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            bar.style.setProperty('--w', targetW);
          }, 300);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    obs.observe(bar);
  });
})();


/* ─── INIT LOG ───────────────────────────────────────── */
console.log('%cQuizHire Dashboard 📊', 'font-size:14px;font-weight:bold;color:#a78bfa;');
console.log('%cStudent Dashboard loaded successfully', 'color:#34d399;');
