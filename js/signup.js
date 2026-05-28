/**
 * QuizHire – Signup Page JavaScript
 * File: js/signup.js
 *
 * Handles:
 *  1. Form validation (name, email, password, confirm, terms)
 *  2. Password strength meter
 *  3. Show/Hide password toggles (password + confirm)
 *  4. Role selector (Student / Admin)
 *  5. Progress bar update on field completion
 *  6. Form submit with loading state + mock registration
 *  7. Success overlay with redirect to login
 */

'use strict';

/* ─── DOM REFERENCES ────────────────────────────────── */
const signupForm    = document.getElementById('signupForm');
const nameInput     = document.getElementById('fullName');
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput  = document.getElementById('confirmPassword');
const agreeChk      = document.getElementById('agreeTerms');

const nameGroup     = document.getElementById('nameGroup');
const emailGroup    = document.getElementById('emailGroup');
const passwordGroup = document.getElementById('passwordGroup');
const confirmGroup  = document.getElementById('confirmGroup');

const nameError     = document.getElementById('nameError');
const emailError    = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmError  = document.getElementById('confirmError');
const termsError    = document.getElementById('termsError');

const globalError   = document.getElementById('globalError');
const globalErrText = document.getElementById('globalErrText');

const submitBtn     = document.getElementById('submitBtn');
const btnLabel      = document.getElementById('btnLabel');
const btnSpinner    = document.getElementById('btnSpinner');
const btnArrow      = submitBtn.querySelector('.btn-arrow');

const togglePwdBtn  = document.getElementById('togglePassword');
const toggleCfmBtn  = document.getElementById('toggleConfirm');

const strengthMeter = document.getElementById('strengthMeter');
const strengthLabel = document.getElementById('strengthLabel');
const sBars         = [
  document.getElementById('sBar1'),
  document.getElementById('sBar2'),
  document.getElementById('sBar3'),
  document.getElementById('sBar4')
];

const progressFill  = document.getElementById('progressFill');
const successOverlay = document.getElementById('successOverlay');
const successMsg    = document.getElementById('successMsg');
const successBar    = document.getElementById('successBar');
const roleBtns      = document.querySelectorAll('.role-btn');


/* ─── 1. VALIDATION HELPERS ──────────────────────────
   Each returns an error string or null if valid.
────────────────────────────────────────────────────── */
function validateName(val) {
  if (!val.trim())          return 'Full name is required.';
  if (val.trim().length < 2) return 'Name must be at least 2 characters.';
  if (!/^[a-zA-Z\s'-]+$/.test(val.trim())) return 'Name can only contain letters, spaces, or hyphens.';
  return null;
}

function validateEmail(val) {
  if (!val.trim()) return 'Email address is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Please enter a valid email address.';
  return null;
}

function validatePassword(val) {
  if (!val)           return 'Password is required.';
  if (val.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function validateConfirm(val, original) {
  if (!val)           return 'Please confirm your password.';
  if (val !== original) return 'Passwords do not match.';
  return null;
}

function validateTerms(checked) {
  if (!checked) return 'You must agree to the Terms of Service.';
  return null;
}

/* Show / clear / reset field state helpers */
function showError(group, errorEl, msg) {
  group.classList.add('has-error');
  group.classList.remove('has-success');
  errorEl.textContent = msg;
}
function clearError(group, errorEl) {
  group.classList.remove('has-error');
  group.classList.add('has-success');
  errorEl.textContent = '';
}
function resetField(group, errorEl) {
  group.classList.remove('has-error', 'has-success');
  errorEl.textContent = '';
}


/* ─── 2. PASSWORD STRENGTH METER ─────────────────────
   Scores password on 4 criteria:
   - length ≥ 8
   - contains uppercase letter
   - contains a number
   - contains a special character
   Score 1 = Weak, 2 = Fair, 3 = Good, 4 = Strong
────────────────────────────────────────────────────── */
const STRENGTH_LEVELS = [
  { cls: '',                 label: 'Enter a password',  color: 'rgba(255,255,255,0.35)' },
  { cls: 'strength-weak',   label: 'Weak',              color: '#f87171' },
  { cls: 'strength-fair',   label: 'Fair',              color: '#fb923c' },
  { cls: 'strength-good',   label: 'Good',              color: '#fbbf24' },
  { cls: 'strength-strong', label: 'Strong ✓',          color: '#34d399' }
];

function getPasswordScore(val) {
  if (!val) return 0;
  let score = 0;
  if (val.length >= 8)            score++;
  if (/[A-Z]/.test(val))          score++;
  if (/[0-9]/.test(val))          score++;
  if (/[^A-Za-z0-9]/.test(val))  score++;
  return score; // 0–4
}

function updateStrengthMeter(val) {
  const score = getPasswordScore(val);
  const level = STRENGTH_LEVELS[score];

  // Remove all strength classes
  strengthMeter.classList.remove('strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
  if (level.cls) strengthMeter.classList.add(level.cls);

  strengthLabel.textContent  = level.label;
  strengthLabel.style.color  = level.color;
}


/* ─── 3. PROGRESS BAR ────────────────────────────────
   Tracks how many of the 4 required fields are valid.
   Updates the card's top progress bar (33% → 66% → 100%).
────────────────────────────────────────────────────── */
function updateProgress() {
  const filled = [
    nameInput.value.trim().length > 0,
    emailInput.value.trim().length > 0,
    passwordInput.value.length >= 8,
    confirmInput.value.length > 0,
    agreeChk.checked
  ].filter(Boolean).length;

  const pct = Math.round((filled / 5) * 100);
  progressFill.style.width = pct + '%';
}


/* ─── 4. LIVE INLINE VALIDATION ──────────────────────
   blur  → full validation, show error if bad
   input → clear error once user starts correcting
────────────────────────────────────────────────────── */
nameInput.addEventListener('blur', function () {
  const err = validateName(this.value);
  err ? showError(nameGroup, nameError, err) : clearError(nameGroup, nameError);
});
nameInput.addEventListener('input', function () {
  if (nameGroup.classList.contains('has-error')) resetField(nameGroup, nameError);
  updateProgress();
  hideGlobalError();
});

emailInput.addEventListener('blur', function () {
  const err = validateEmail(this.value);
  err ? showError(emailGroup, emailError, err) : clearError(emailGroup, emailError);
});
emailInput.addEventListener('input', function () {
  if (emailGroup.classList.contains('has-error')) resetField(emailGroup, emailError);
  updateProgress();
  hideGlobalError();
});

passwordInput.addEventListener('input', function () {
  updateStrengthMeter(this.value);
  if (passwordGroup.classList.contains('has-error')) resetField(passwordGroup, passwordError);
  // Re-validate confirm if it already has content
  if (confirmInput.value) {
    const err = validateConfirm(confirmInput.value, this.value);
    err ? showError(confirmGroup, confirmError, err) : clearError(confirmGroup, confirmError);
  }
  updateProgress();
  hideGlobalError();
});
passwordInput.addEventListener('blur', function () {
  const err = validatePassword(this.value);
  err ? showError(passwordGroup, passwordError, err) : clearError(passwordGroup, passwordError);
});

confirmInput.addEventListener('blur', function () {
  const err = validateConfirm(this.value, passwordInput.value);
  err ? showError(confirmGroup, confirmError, err) : clearError(confirmGroup, confirmError);
});
confirmInput.addEventListener('input', function () {
  if (confirmGroup.classList.contains('has-error')) resetField(confirmGroup, confirmError);
  updateProgress();
  hideGlobalError();
});

agreeChk.addEventListener('change', function () {
  if (this.checked) termsError.textContent = '';
  updateProgress();
});


/* ─── 5. SHOW / HIDE PASSWORD TOGGLES ───────────────
   Separate toggles for password and confirm fields.
────────────────────────────────────────────────────── */
function setupToggle(btn, inputEl) {
  btn.addEventListener('click', function () {
    const isHidden = inputEl.type === 'password';
    inputEl.type = isHidden ? 'text' : 'password';

    const eyeShow = this.querySelector('.eye-show');
    const eyeHide = this.querySelector('.eye-hide');
    eyeShow.style.display = isHidden ? 'none'  : 'block';
    eyeHide.style.display = isHidden ? 'block' : 'none';
    this.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');

    inputEl.focus();
  });
}

setupToggle(togglePwdBtn, passwordInput);
setupToggle(toggleCfmBtn, confirmInput);


/* ─── 6. ROLE SELECTOR ───────────────────────────────
   Toggles active state between Student and Admin.
────────────────────────────────────────────────────── */
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


/* ─── 7. GLOBAL ERROR HELPERS ───────────────────────── */
function showGlobalError(msg) {
  globalErrText.textContent = msg;
  globalError.hidden = false;
}
function hideGlobalError() {
  globalError.hidden = true;
}


/* ─── 8. LOADING STATE ───────────────────────────────── */
function setLoading(on) {
  submitBtn.disabled = on;
  if (on) {
    btnLabel.textContent   = 'Creating account…';
    btnSpinner.hidden      = false;
    btnArrow.style.display = 'none';
  } else {
    btnLabel.textContent   = 'Create Account';
    btnSpinner.hidden      = true;
    btnArrow.style.display = '';
  }
}


/* ─── 9. SHAKE ANIMATION ─────────────────────────────── */
(function injectShake() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100% { transform:translateX(0); }
      20%     { transform:translateX(-6px); }
      40%     { transform:translateX(6px); }
      60%     { transform:translateX(-4px); }
      80%     { transform:translateX(4px); }
    }
  `;
  document.head.appendChild(s);
})();

function shakeCard() {
  const card = document.querySelector('.signup-card');
  if (!card) return;
  card.style.animation = 'none';
  requestAnimationFrame(function () {
    card.style.animation = 'shake 0.35s ease';
  });
}


/* ─── 10. MOCK REGISTRATION ──────────────────────────
   Simulates an API POST /api/auth/register
   In production: replace with real fetch() call.

   Checks for duplicate mock email to demo that flow.
────────────────────────────────────────────────────── */
const EXISTING_EMAILS = ['student@quizhire.com', 'admin@quizhire.com'];

function mockRegister(name, email, password, role) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      // Simulate duplicate email check
      if (EXISTING_EMAILS.includes(email.toLowerCase())) {
        resolve({ success: false, message: 'An account with this email already exists. Please log in.' });
        return;
      }
      // Success
      resolve({ success: true, user: { name, email, role } });
    }, 1600); // Simulated network delay
  });
}


/* ─── 11. FORM SUBMIT HANDLER ────────────────────────
   Validates all fields → calls mockRegister →
   shows success overlay → redirects to login.html
────────────────────────────────────────────────────── */
signupForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  hideGlobalError();

  const name     = nameInput.value.trim();
  const email    = emailInput.value.trim();
  const password = passwordInput.value;
  const confirm  = confirmInput.value;
  const agreed   = agreeChk.checked;
  const role     = document.querySelector('.role-btn.active')?.dataset.role || 'student';

  // Validate all fields
  const errs = {
    name:    validateName(name),
    email:   validateEmail(email),
    pwd:     validatePassword(password),
    confirm: validateConfirm(confirm, password),
    terms:   validateTerms(agreed)
  };

  let hasError = false;

  if (errs.name)    { showError(nameGroup,     nameError,     errs.name);    hasError = true; }
  if (errs.email)   { showError(emailGroup,    emailError,    errs.email);   hasError = true; }
  if (errs.pwd)     { showError(passwordGroup, passwordError, errs.pwd);     hasError = true; }
  if (errs.confirm) { showError(confirmGroup,  confirmError,  errs.confirm); hasError = true; }
  if (errs.terms)   { termsError.textContent = errs.terms;                   hasError = true; }

  if (hasError) {
    shakeCard();
    // Scroll to first error
    const firstErr = signupForm.querySelector('.has-error .field-input');
    if (firstErr) firstErr.focus();
    return;
  }

  // Start loading
  setLoading(true);

  try {
    const result = await mockRegister(name, email, password, role);

    if (result.success) {
      // Store session (mock)
      sessionStorage.setItem('qh_user_name',  name);
      sessionStorage.setItem('qh_user_email', email);
      sessionStorage.setItem('qh_user_role',  role);

      // Show success overlay
      showSuccessOverlay(name, role);

    } else {
      setLoading(false);
      showGlobalError(result.message || 'Registration failed. Please try again.');
      shakeCard();
    }

  } catch (err) {
    setLoading(false);
    showGlobalError('Something went wrong. Please check your connection and try again.');
    console.error('Signup error:', err);
  }
});


/* ─── 12. SUCCESS OVERLAY ────────────────────────────
   Shows confirmation screen then redirects to login.
────────────────────────────────────────────────────── */
function showSuccessOverlay(name, role) {
  const firstName = name.split(' ')[0];
  const dest      = role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';

  successMsg.textContent = `Welcome, ${firstName}! Your account is ready. Redirecting to login…`;

  successOverlay.hidden = false;
  successOverlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';

  // Animate the progress bar over 2.5s then redirect
  requestAnimationFrame(function () {
    successBar.style.width = '100%';
  });

  setTimeout(function () {
    window.location.href = 'login.html';
  }, 2800);
}


/* ─── INIT ───────────────────────────────────────────── */
updateProgress(); // Set initial bar state

console.log('%cQuizHire Signup 📝', 'font-size:14px; font-weight:bold; color:#a78bfa;');
console.log('%cTest duplicate → student@quizhire.com', 'color:#f87171;');
