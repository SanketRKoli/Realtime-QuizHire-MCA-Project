/**
 * QuizHire – Login Page JavaScript
 * File: js/login.js
 *
 * Handles:
 *  1. Form validation (email + password)
 *  2. Show / Hide password toggle
 *  3. Remember Me (localStorage)
 *  4. Forgot Password modal — FIXED close behaviour
 *  5. Role selector (Student / Admin)
 *  6. Form submit with loading state + mock auth
 */

'use strict';

/* ─── DOM REFERENCES ────────────────────────────────── */
const loginForm      = document.getElementById('loginForm');
const emailInput     = document.getElementById('email');
const passwordInput  = document.getElementById('password');
const emailGroup     = document.getElementById('emailGroup');
const passwordGroup  = document.getElementById('passwordGroup');
const emailError     = document.getElementById('emailError');
const passwordError  = document.getElementById('passwordError');
const globalError    = document.getElementById('globalError');
const globalErrText  = document.getElementById('globalErrorText');
const submitBtn      = document.getElementById('submitBtn');
const btnLabel       = document.getElementById('btnLabel');
const btnSpinner     = document.getElementById('btnSpinner');
const btnArrow       = submitBtn.querySelector('.btn-arrow');
const togglePwdBtn   = document.getElementById('togglePassword');
const rememberChk    = document.getElementById('rememberMe');
const forgotLink     = document.getElementById('forgotLink');
const forgotModal    = document.getElementById('forgotModal');
const modalClose     = document.getElementById('modalClose');
const modalCard      = forgotModal.querySelector('.modal-card');
const resetEmailIn   = document.getElementById('resetEmail');
const resetError     = document.getElementById('resetError');
const resetBtn       = document.getElementById('resetBtn');
const resetSuccess   = document.getElementById('resetSuccess');
const roleBtns       = document.querySelectorAll('.role-btn');


/* ─── 1. VALIDATION HELPERS ─────────────────────────── */
function validateEmail(val) {
  if (!val.trim()) return 'Email address is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Please enter a valid email address.';
  return null;
}

function validatePassword(val) {
  if (!val)          return 'Password is required.';
  if (val.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

function showFieldError(group, errorEl, message) {
  group.classList.add('has-error');
  group.classList.remove('has-success');
  errorEl.textContent = message;
}

function clearFieldError(group, errorEl) {
  group.classList.remove('has-error');
  group.classList.add('has-success');
  errorEl.textContent = '';
}

function resetField(group, errorEl) {
  group.classList.remove('has-error', 'has-success');
  errorEl.textContent = '';
}


/* ─── 2. LIVE INLINE VALIDATION ─────────────────────── */
emailInput.addEventListener('blur', function () {
  const err = validateEmail(this.value);
  err ? showFieldError(emailGroup, emailError, err) : clearFieldError(emailGroup, emailError);
});
emailInput.addEventListener('input', function () {
  if (emailGroup.classList.contains('has-error')) resetField(emailGroup, emailError);
  hideGlobalError();
});

passwordInput.addEventListener('blur', function () {
  const err = validatePassword(this.value);
  err ? showFieldError(passwordGroup, passwordError, err) : clearFieldError(passwordGroup, passwordError);
});
passwordInput.addEventListener('input', function () {
  if (passwordGroup.classList.contains('has-error')) resetField(passwordGroup, passwordError);
  hideGlobalError();
});


/* ─── 3. SHOW / HIDE PASSWORD ───────────────────────── */
togglePwdBtn.addEventListener('click', function () {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';

  this.querySelector('.eye-show').style.display = isHidden ? 'none'  : 'block';
  this.querySelector('.eye-hide').style.display = isHidden ? 'block' : 'none';
  this.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  passwordInput.focus();
});


/* ─── 4. REMEMBER ME ────────────────────────────────── */
(function loadRememberedEmail() {
  const saved = localStorage.getItem('qh_remember_email');
  if (saved) {
    emailInput.value    = saved;
    rememberChk.checked = true;
    clearFieldError(emailGroup, emailError);
  }
})();

function handleRememberMe(email) {
  if (rememberChk.checked) {
    localStorage.setItem('qh_remember_email', email);
  } else {
    localStorage.removeItem('qh_remember_email');
  }
}


/* ─── 5. GLOBAL ERROR BANNER ────────────────────────── */
function showGlobalError(message) {
  globalErrText.textContent = message;
  globalError.hidden = false;
}
function hideGlobalError() {
  globalError.hidden = true;
}


/* ─── 6. LOADING STATE ──────────────────────────────── */
function setLoading(on) {
  submitBtn.disabled = on;
  if (on) {
    btnLabel.textContent   = 'Signing in…';
    btnSpinner.hidden      = false;
    btnArrow.style.display = 'none';
  } else {
    btnLabel.textContent   = 'Sign In';
    btnSpinner.hidden      = true;
    btnArrow.style.display = '';
  }
}


/* ─── 7. SHAKE ANIMATION ────────────────────────────── */
(function injectShake() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }`;
  document.head.appendChild(s);
})();

function shakeCard() {
  const card = document.querySelector('.login-card');
  if (!card) return;
  card.style.animation = 'none';
  requestAnimationFrame(function () { card.style.animation = 'shake 0.35s ease'; });
}


/* ─── 8. MOCK AUTH ──────────────────────────────────── */
const MOCK_USERS = [
  { email: 'student@quizhire.com', password: 'student123', role: 'student', redirect: 'dashboard.html'       },
  { email: 'admin@quizhire.com',   password: 'admin123',   role: 'admin',   redirect: 'admin-dashboard.html' }
];

function mockLogin(email, password, role) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      const user = MOCK_USERS.find(function (u) {
        return u.email === email.toLowerCase() && u.password === password && u.role === role;
      });
      resolve(user
        ? { success: true,  user: user }
        : { success: false, message: 'Invalid email or password. Please try again.' }
      );
    }, 1500);
  });
}


/* ─── 9. FORM SUBMIT ────────────────────────────────── */
loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  hideGlobalError();

  const email    = emailInput.value.trim();
  const password = passwordInput.value;
  const role     = document.querySelector('.role-btn.active')?.dataset.role || 'student';

  const emailErr = validateEmail(email);
  const pwErr    = validatePassword(password);
  let hasError   = false;

  if (emailErr) { showFieldError(emailGroup,    emailError,    emailErr); hasError = true; }
  if (pwErr)    { showFieldError(passwordGroup, passwordError, pwErr);    hasError = true; }

  if (hasError) { shakeCard(); return; }

  setLoading(true);

  try {
    const result = await mockLogin(email, password, role);

    if (result.success) {
      handleRememberMe(email);
      sessionStorage.setItem('qh_user_email', email);
      sessionStorage.setItem('qh_user_role',  role);
      window.location.href = result.user.redirect;
    } else {
      setLoading(false);
      showGlobalError(result.message);
      showFieldError(emailGroup,    emailError,    ' ');
      showFieldError(passwordGroup, passwordError, ' ');
      shakeCard();
    }
  } catch (err) {
    setLoading(false);
    showGlobalError('Something went wrong. Please check your connection and try again.');
    console.error('Login error:', err);
  }
});


/* ─── 10. ROLE SELECTOR ─────────────────────────────── */
roleBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    roleBtns.forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    this.classList.add('active');
    this.setAttribute('aria-pressed', 'true');
  });
});


/* ─── 11. FORGOT PASSWORD MODAL — FIXED ──────────────
   Bugs fixed:
   • .modal-overlay[hidden] { display:none !important } in CSS
   • stopPropagation on modal card prevents overlay-click from firing inside card
   • resetBtn state is always reset on open
   • Focus management for accessibility
────────────────────────────────────────────────────── */

/* Stop clicks inside the card from reaching the overlay */
modalCard.addEventListener('click', function (e) { e.stopPropagation(); });

/* Open */
forgotLink.addEventListener('click', function (e) {
  e.preventDefault();
  openModal();
});

/* Close via X button */
modalClose.addEventListener('click', function (e) {
  e.stopPropagation();
  closeModal();
});

/* Close by clicking the dark overlay (outside the card) */
forgotModal.addEventListener('click', function (e) {
  if (e.target === forgotModal) closeModal();
});

/* Close on Escape key */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !forgotModal.hidden) closeModal();
});

function openModal() {
  // Reset state every time modal opens
  resetError.textContent  = '';
  resetSuccess.hidden     = true;
  resetBtn.disabled       = false;
  resetBtn.textContent    = 'Send Reset Link';

  // Pre-fill email from login form if available
  if (emailInput.value.trim()) resetEmailIn.value = emailInput.value.trim();

  forgotModal.hidden = false;
  forgotModal.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';

  setTimeout(function () { resetEmailIn.focus(); }, 80);
}

function closeModal() {
  forgotModal.hidden = true;
  forgotModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  forgotLink.focus();
}

/* Reset form submit */
resetBtn.addEventListener('click', function () {
  const email = resetEmailIn.value.trim();

  if (!email) {
    resetError.textContent = 'Please enter your email address.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    resetError.textContent = 'Please enter a valid email address.';
    return;
  }

  resetError.textContent = '';
  resetBtn.disabled      = true;
  resetBtn.textContent   = 'Sending…';

  setTimeout(function () {
    resetSuccess.hidden  = false;
    resetBtn.textContent = 'Sent ✓';
    setTimeout(closeModal, 2500);
  }, 1200);
});


/* ─── INIT LOG ───────────────────────────────────────── */
console.log('%cQuizHire Login 🔐', 'font-size:14px; font-weight:bold; color:#a78bfa;');
console.log('%cStudent → student@quizhire.com / student123', 'color:#38bdf8;');
console.log('%cAdmin   → admin@quizhire.com / admin123',     'color:#34d399;');
