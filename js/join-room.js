/**
 * QuizHire – Join Room JavaScript
 * File: js/join-room.js
 *
 * Modules:
 *  1.  Session personalization
 *  2.  Scroll reveal
 *  3.  Room code input — char slots + validation
 *  4.  Quick join chips
 *  5.  Lookup room (mock API)
 *  6.  Room Preview panel
 *  7.  Confirm join → success overlay → waiting room
 *  8.  Waiting room — participants + countdown timer
 *  9.  Simulated real-time participant joining
 * 10.  Recent rooms list
 * 11.  Leave room
 * 12.  Toast helper
 */

'use strict';

/* ═══════════════════════════════════════════════════
   MOCK ROOM DATA
═══════════════════════════════════════════════════ */
const MOCK_ROOMS = {
  DSA42: {
    code: 'DSA42', title: 'DSA Fundamentals', category: 'DSA', categoryClass: 'purple',
    difficulty: 'Medium', questions: 10, duration: 30,
    host: 'Prof. Sharma', players: 24, maxPlayers: 30, status: 'waiting'
  },
  APT88: {
    code: 'APT88', title: 'Aptitude Sprint', category: 'Aptitude', categoryClass: 'blue',
    difficulty: 'Easy', questions: 15, duration: 25,
    host: 'Admin', players: 18, maxPlayers: 25, status: 'waiting'
  },
  PS404: {
    code: 'PS404', title: 'Problem Solving', category: 'DSA', categoryClass: 'teal',
    difficulty: 'Hard', questions: 10, duration: 20,
    host: 'Dr. Mehta', players: 16, maxPlayers: 20, status: 'waiting'
  },
  VRB99: {
    code: 'VRB99', title: 'Verbal Ability', category: 'Communication', categoryClass: 'orange',
    difficulty: 'Easy', questions: 10, duration: 15,
    host: 'Admin', players: 19, maxPlayers: 20, status: 'waiting'
  },
  FS123: {
    code: 'FS123', title: 'Full Stack Mock', category: 'Programming', categoryClass: 'teal',
    difficulty: 'Hard', questions: 25, duration: 45,
    host: 'Prof. Patel', players: 28, maxPlayers: 35, status: 'waiting'
  }
};

/* Recent rooms mock data */
const RECENT_ROOMS = [
  { code: 'PRG15', title: 'Programming Logic',   category: 'Programming', icon: '💻', score: 90, date: 'Dec 20' },
  { code: 'APT80', title: 'Aptitude Challenge',  category: 'Aptitude',    icon: '🔢', score: 76, date: 'Dec 18' },
  { code: 'DSA39', title: 'DSA Fundamentals II', category: 'DSA',         icon: '📊', score: 82, date: 'Dec 15' },
  { code: 'RSN22', title: 'Reasoning Round 1',   category: 'Reasoning',   icon: '🧠', score: 64, date: 'Dec 12' }
];

/* Simulated participants pool */
const PARTICIPANT_NAMES = [
  'Arjun S.', 'Priya M.', 'Rahul K.', 'Sneha K.', 'Amit J.',
  'Kavya R.', 'Dev A.', 'Anjali D.', 'Rohan P.', 'Meera S.',
  'Vikram N.', 'Pooja T.', 'Karan B.', 'Divya L.', 'Suresh P.',
  'Nisha C.', 'Arun V.', 'Deepika M.', 'Sanjay R.', 'Tanya G.',
  'Varun H.', 'Riya S.', 'Nikhil J.', 'Shreya B.', 'Harsh K.'
];

/* Avatar gradient presets */
const AVATAR_COLORS = [
  'linear-gradient(135deg,#a78bfa,#38bdf8)',
  'linear-gradient(135deg,#38bdf8,#2dd4bf)',
  'linear-gradient(135deg,#fb923c,#f472b6)',
  'linear-gradient(135deg,#34d399,#38bdf8)',
  'linear-gradient(135deg,#f472b6,#a78bfa)',
  'linear-gradient(135deg,#fbbf24,#fb923c)',
  'linear-gradient(135deg,#2dd4bf,#34d399)'
];


/* ═══════════════════════════════════════════════════
   DOM REFERENCES
═══════════════════════════════════════════════════ */
const roomCodeInput   = document.getElementById('roomCodeInput');
const joinBtn         = document.getElementById('joinBtn');
const joinBtnLabel    = document.getElementById('joinBtnLabel');
const joinSpinner     = document.getElementById('joinSpinner');
const joinBtnArrow    = joinBtn.querySelector('.btn-arrow');
const errorBanner     = document.getElementById('errorBanner');
const errorText       = document.getElementById('errorText');
const codeSlots       = Array.from({ length: 6 }, (_, i) => document.getElementById(`cs${i}`));

const idlePanel       = document.getElementById('idlePanel');
const roomPreviewPanel = document.getElementById('roomPreviewPanel');
const waitingRoomPanel = document.getElementById('waitingRoomPanel');

const confirmJoinBtn  = document.getElementById('confirmJoinBtn');
const leaveRoomBtn    = document.getElementById('leaveRoomBtn');
const successOverlay  = document.getElementById('successOverlay');
const soBar           = document.getElementById('soBar');
const soSubText       = document.getElementById('soSubText');

const countdownNum    = document.getElementById('countdownNum');
const countdownArc    = document.getElementById('countdownArc');
const participantsList = document.getElementById('participantsList');
const participantCount = document.getElementById('participantCount');
const moreParticipants = document.getElementById('moreParticipants');
const moreCount       = document.getElementById('moreCount');
const wrTitle         = document.getElementById('wrTitle');
const wrYouAvatar     = document.getElementById('wrYouAvatar');
const wrYouName       = document.getElementById('wrYouName');
const recentList      = document.getElementById('recentList');
const toast           = document.getElementById('toast');

let toastTimer        = null;
let countdownInterval = null;
let simInterval       = null;
let currentRoom       = null;


/* ═══════════════════════════════════════════════════
   1. SESSION PERSONALIZATION
═══════════════════════════════════════════════════ */
(function initSession() {
  const name     = sessionStorage.getItem('qh_user_name')  || 'Arjun Sharma';
  const initials = name.split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0, 2);

  const topbarAvatar = document.getElementById('topbarAvatar');
  const topbarName   = document.getElementById('topbarName');

  if (topbarAvatar) topbarAvatar.textContent = initials;
  if (topbarName)   topbarName.textContent   = name;
  if (wrYouAvatar)  wrYouAvatar.textContent  = initials;
  if (wrYouName)    wrYouName.textContent    = `You (${name})`;
})();


/* ═══════════════════════════════════════════════════
   2. SCROLL REVEAL
═══════════════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.d || 0) * 100;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
})();


/* ═══════════════════════════════════════════════════
   3. CODE INPUT — CHARACTER SLOTS + VALIDATION
      Updates the decorative slot displays in real time
      as the user types. Sanitizes to A-Z0-9 only.
═══════════════════════════════════════════════════ */
roomCodeInput.addEventListener('input', function () {
  // Sanitize: uppercase alphanumeric only
  const raw     = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  this.value    = raw;

  // Update character slot display
  codeSlots.forEach((slot, i) => {
    const ch = raw[i] || '';
    slot.textContent = ch;
    slot.classList.toggle('filled', ch !== '');
  });

  // Clear error state when user types
  if (raw.length > 0) {
    this.classList.remove('error');
    hideError();
  }

  // Auto-lookup when 5-6 chars entered (debounced)
  clearTimeout(roomCodeInput._lookupTimer);
  if (raw.length >= 5) {
    roomCodeInput._lookupTimer = setTimeout(() => {
      previewRoom(raw);
    }, 350);
  } else {
    showIdle();
  }
});

roomCodeInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleJoin();
  }
});


/* ═══════════════════════════════════════════════════
   4. QUICK JOIN CHIPS
      Clicking a chip fills the input and triggers lookup
═══════════════════════════════════════════════════ */
document.querySelectorAll('.qc-chip').forEach(chip => {
  chip.addEventListener('click', function () {
    const code = this.dataset.code;
    roomCodeInput.value = code;
    roomCodeInput.dispatchEvent(new Event('input'));
    roomCodeInput.focus();
  });
});


/* ═══════════════════════════════════════════════════
   5. ROOM LOOKUP (mock API simulation)
      Simulates a 600ms network lookup.
      Returns room data if code exists.
═══════════════════════════════════════════════════ */
function lookupRoom(code) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_ROOMS[code.toUpperCase()] || null);
    }, 600);
  });
}

async function previewRoom(code) {
  const room = await lookupRoom(code);
  if (room) {
    currentRoom = room;
    showRoomPreview(room);
    roomCodeInput.classList.remove('error');
    roomCodeInput.classList.add('success');
  } else {
    showIdle();
    roomCodeInput.classList.remove('success');
  }
}


/* ═══════════════════════════════════════════════════
   6. ROOM PREVIEW PANEL — populate and show
═══════════════════════════════════════════════════ */
function showRoomPreview(room) {
  // Populate fields
  document.getElementById('rpCode').textContent         = room.code;
  document.getElementById('rpQuizTitle').textContent    = room.title;
  document.getElementById('rpHost').innerHTML           =
    `<svg viewBox="0 0 14 14" fill="none" width="12" height="12"><circle cx="7" cy="4" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
     Hosted by <strong>${room.host}</strong>`;
  document.getElementById('rpDuration').textContent     = room.duration + ' min';
  document.getElementById('rpQuestions').textContent    = room.questions + ' Q';
  document.getElementById('rpDifficulty').textContent   = room.difficulty;
  document.getElementById('rpPlayers').textContent      = `${room.players} / ${room.maxPlayers}`;

  // Fill bar
  const pct = Math.round((room.players / room.maxPlayers) * 100);
  document.getElementById('rpFillProgress').style.width = pct + '%';
  document.getElementById('rpFillLabel').textContent    = pct + '% full';

  // Category chip colour
  const chip = document.getElementById('rpCategoryChip');
  chip.textContent = room.category;
  chip.className   = `rp-category-chip ${room.categoryClass}`;

  // Show panel
  idlePanel.hidden        = true;
  roomPreviewPanel.hidden = false;
  waitingRoomPanel.hidden = true;
}

function showIdle() {
  idlePanel.hidden        = false;
  roomPreviewPanel.hidden = true;
  waitingRoomPanel.hidden = true;
  currentRoom = null;
}


/* ═══════════════════════════════════════════════════
   7. JOIN BUTTON HANDLER
      Validates code → shows loading → success overlay
═══════════════════════════════════════════════════ */
joinBtn.addEventListener('click', handleJoin);

async function handleJoin() {
  const code = roomCodeInput.value.trim().toUpperCase();

  if (!code) {
    showError('Please enter a room code.');
    roomCodeInput.classList.add('error');
    shakeInput();
    return;
  }
  if (code.length < 4) {
    showError('Room code must be at least 4 characters.');
    roomCodeInput.classList.add('error');
    shakeInput();
    return;
  }

  setJoinLoading(true);

  const room = await lookupRoom(code);
  setJoinLoading(false);

  if (!room) {
    showError(`Room "${code}" not found. Check the code and try again.`);
    roomCodeInput.classList.add('error');
    roomCodeInput.classList.remove('success');
    shakeInput();
    showIdle();
    return;
  }

  currentRoom = room;
  hideError();
  showSuccessOverlay(room);
}

/* Confirm join from preview panel */
confirmJoinBtn.addEventListener('click', () => {
  if (!currentRoom) return;
  showSuccessOverlay(currentRoom);
});

function setJoinLoading(on) {
  joinBtn.disabled           = on;
  joinBtnLabel.textContent   = on ? 'Looking up…' : 'Join Room';
  joinSpinner.hidden         = !on;
  joinBtnArrow.style.display = on ? 'none' : '';
}

function shakeInput() {
  roomCodeInput.style.animation = 'none';
  requestAnimationFrame(() => {
    roomCodeInput.style.animation = 'shake 0.35s ease';
  });
}

/* Inject shake keyframe */
(function injectShake() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
    }`;
  document.head.appendChild(s);
})();


/* ═══════════════════════════════════════════════════
   SUCCESS OVERLAY — then reveal waiting room
═══════════════════════════════════════════════════ */
function showSuccessOverlay(room) {
  soSubText.textContent = `You've joined Room ${room.code}. Get ready to compete!`;
  successOverlay.hidden = false;
  successOverlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';

  // Animate progress bar
  requestAnimationFrame(() => { soBar.style.width = '100%'; });

  // After 1.8s — hide overlay, show waiting room
  setTimeout(() => {
    successOverlay.hidden = true;
    document.body.style.overflow = '';
    enterWaitingRoom(room);
  }, 1900);
}


/* ═══════════════════════════════════════════════════
   8. WAITING ROOM — populate + countdown
═══════════════════════════════════════════════════ */
function enterWaitingRoom(room) {
  wrTitle.textContent = room.title;

  idlePanel.hidden        = true;
  roomPreviewPanel.hidden = true;
  waitingRoomPanel.hidden = false;

  // Render initial participants
  renderParticipants(room.players);

  // Start countdown (30 seconds)
  startCountdown(30);

  // Simulate participants joining in real time
  startSimulation(room);

  showToast(`🎮 You've joined ${room.title}!`, 'success');
}

/* Render participants list (show max 12, rest in overflow) */
function renderParticipants(count) {
  const MAX_VISIBLE  = 12;
  const visibleCount = Math.min(count, MAX_VISIBLE);

  participantsList.innerHTML = '';

  // Always add current user first
  const userName = sessionStorage.getItem('qh_user_name') || 'Arjun Sharma';
  const userInitials = userName.split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0, 2);
  participantsList.appendChild(createParticipantItem(userInitials, userName + ' (You)', true, 'online'));

  // Fill rest with mock participants
  const shuffled = [...PARTICIPANT_NAMES].sort(() => Math.random() - 0.5);
  for (let i = 0; i < visibleCount - 1; i++) {
    const name   = shuffled[i] || `Player ${i + 2}`;
    const inits  = name.split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0, 2);
    const status = Math.random() > 0.3 ? 'online' : 'away';
    participantsList.appendChild(createParticipantItem(inits, name, false, status, i));
  }

  // Overflow indicator
  const overflow = count - MAX_VISIBLE;
  if (overflow > 0) {
    moreParticipants.hidden = false;
    moreCount.textContent   = `+${overflow} more participants`;
  } else {
    moreParticipants.hidden = true;
  }

  participantCount.textContent = count + ' joined';
}

function createParticipantItem(initials, name, isYou, status, idx = 0) {
  const li   = document.createElement('li');
  li.className = 'p-item';
  li.style.transitionDelay = (idx * 40) + 'ms';

  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  li.innerHTML = `
    <div class="p-avatar" style="background:${color}">${initials}</div>
    <span class="p-name">${name}</span>
    <div class="p-ready ${status}" title="${status === 'online' ? 'Ready' : 'Joining…'}"></div>
  `;
  return li;
}


/* ═══════════════════════════════════════════════════
   9. SIMULATED REAL-TIME PARTICIPANT JOINING
      Adds 1–2 participants every 4-8 seconds
═══════════════════════════════════════════════════ */
function startSimulation(room) {
  clearInterval(simInterval);
  let count = room.players;

  simInterval = setInterval(() => {
    if (count >= room.maxPlayers) {
      clearInterval(simInterval);
      return;
    }

    // Add 1 new participant
    count++;
    const idx    = count - 2;
    const names  = [...PARTICIPANT_NAMES].sort(() => Math.random() - 0.5);
    const name   = names[idx % PARTICIPANT_NAMES.length] || `Player ${count}`;
    const inits  = name.split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0, 2);
    const color  = AVATAR_COLORS[idx % AVATAR_COLORS.length];

    // Only add if under visible threshold
    if (count <= 13) {
      const li = document.createElement('li');
      li.className = 'p-item';
      li.innerHTML = `
        <div class="p-avatar" style="background:${color}">${inits}</div>
        <span class="p-name">${name}</span>
        <div class="p-ready online"></div>`;
      participantsList.appendChild(li);
    } else {
      const overflow = count - 13;
      moreParticipants.hidden = false;
      moreCount.textContent   = `+${overflow} more participants`;
    }

    participantCount.textContent = count + ' joined';
    showToast(`${name} joined the room`, 'success');

  }, Math.floor(Math.random() * 4000) + 3000); // 3–7 seconds
}


/* ═══════════════════════════════════════════════════
   10. COUNTDOWN TIMER
       Counts down from totalSeconds, animates SVG arc.
       When it hits 0 — simulates quiz start redirect.
═══════════════════════════════════════════════════ */
const ARC_FULL = 263.9; // 2π × 42 (radius)

function startCountdown(totalSeconds) {
  clearInterval(countdownInterval);
  let remaining = totalSeconds;

  function update() {
    countdownNum.textContent = remaining;

    // Update SVG arc stroke-dashoffset
    const progress = remaining / totalSeconds;
    const offset   = ARC_FULL * (1 - progress);
    countdownArc.style.strokeDashoffset = offset;

    // Colour shifts as time runs low
    if (remaining <= 10) {
      countdownNum.style.color = '#f87171';
      countdownArc.style.stroke = '#f87171';
    } else if (remaining <= 20) {
      countdownNum.style.color = '#fbbf24';
    }

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      clearInterval(simInterval);
      onQuizStart();
    }

    remaining--;
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

function onQuizStart() {
  showToast('🚀 Quiz is starting!', 'success');
  setTimeout(() => {
    window.location.href = 'live-quiz.html';
    
  }, 1200);
}


/* ═══════════════════════════════════════════════════
   11. RECENT ROOMS LIST
═══════════════════════════════════════════════════ */
function renderRecentRooms() {
  if (!recentList) return;
  recentList.innerHTML = '';

  RECENT_ROOMS.forEach(room => {
    const scoreClass = room.score >= 80 ? 'good' : room.score >= 60 ? 'medium' : 'low';
    const li = document.createElement('li');
    li.className = 'rr-item';
    li.innerHTML = `
      <div class="rr-icon" style="background:rgba(167,139,250,0.08);font-size:18px">${room.icon}</div>
      <div class="rr-info">
        <p class="rr-name">${room.title}</p>
        <p class="rr-meta">${room.code} · ${room.category} · ${room.date}</p>
      </div>
      <span class="rr-score ${scoreClass}">${room.score}%</span>
      <button class="rr-rejoin" data-code="${room.code}" aria-label="Rejoin ${room.title}">Rejoin</button>
    `;
    recentList.appendChild(li);
  });

  // Rejoin clicks
  recentList.querySelectorAll('.rr-rejoin').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const code = btn.dataset.code;
      roomCodeInput.value = code;
      roomCodeInput.dispatchEvent(new Event('input'));
      roomCodeInput.focus();
    });
  });

  // Row click fills input
  recentList.querySelectorAll('.rr-item').forEach(item => {
    item.addEventListener('click', function () {
      const code = this.querySelector('.rr-rejoin')?.dataset.code;
      if (code) {
        roomCodeInput.value = code;
        roomCodeInput.dispatchEvent(new Event('input'));
        roomCodeInput.focus();
      }
    });
  });
}

renderRecentRooms();


/* ═══════════════════════════════════════════════════
   12. LEAVE ROOM
═══════════════════════════════════════════════════ */
leaveRoomBtn?.addEventListener('click', () => {
  clearInterval(countdownInterval);
  clearInterval(simInterval);
  currentRoom = null;
  roomCodeInput.value = '';
  roomCodeInput.classList.remove('error', 'success');
  codeSlots.forEach(s => { s.textContent = ''; s.classList.remove('filled'); });
  showIdle();
  showToast('You left the room.', 'error');
  waitingRoomPanel.hidden = true;
  idlePanel.hidden = false;
});


/* ═══════════════════════════════════════════════════
   HELPERS — Error banner + Toast
═══════════════════════════════════════════════════ */
function showError(msg) {
  errorText.textContent = msg;
  errorBanner.hidden    = false;
}
function hideError() {
  errorBanner.hidden = true;
}

function showToast(message, type = 'success') {
  clearTimeout(toastTimer);
  toast.textContent  = message;
  toast.className    = `toast ${type}`;
  toast.hidden       = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
}


/* ═══════════════════════════════════════════════════
   INIT LOG
═══════════════════════════════════════════════════ */
console.log('%cQuizHire Join Room 🎮', 'font-size:14px;font-weight:bold;color:#a78bfa;');
console.log('%cAvailable rooms: DSA42, APT88, PS404, VRB99, FS123', 'color:#38bdf8;');
