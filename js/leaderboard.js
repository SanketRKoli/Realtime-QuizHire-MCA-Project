/**
 * QuizHire – Live Leaderboard JavaScript
 * File: js/leaderboard.js
 *
 * Modules:
 *  1.  Mock player data + session init
 *  2.  Particles canvas background
 *  3.  Render podium (top 3)
 *  4.  Render leaderboard table
 *  5.  Real-time simulation (score updates + rank changes)
 *  6.  Filter tabs (All / Top10 / Top50 / My Position)
 *  7.  User performance card + ring animation
 *  8.  Statistics panel
 *  9.  Score distribution chart
 * 10.  Rank change popup + toast notifications
 * 11.  Refresh button
 * 12.  Animated counters
 */

'use strict';

/* ═══════════════════════════════════════════════════
   MOCK PLAYER DATA
═══════════════════════════════════════════════════ */
const AVATAR_COLORS = [
  'linear-gradient(135deg,#a78bfa,#38bdf8)',
  'linear-gradient(135deg,#38bdf8,#2dd4bf)',
  'linear-gradient(135deg,#fb923c,#f472b6)',
  'linear-gradient(135deg,#34d399,#38bdf8)',
  'linear-gradient(135deg,#f472b6,#a78bfa)',
  'linear-gradient(135deg,#fbbf24,#fb923c)',
  'linear-gradient(135deg,#2dd4bf,#34d399)',
  'linear-gradient(135deg,#a78bfa,#f472b6)',
  'linear-gradient(135deg,#f87171,#fb923c)',
  'linear-gradient(135deg,#38bdf8,#a78bfa)',
];

const PLAYERS = [
  { id:1,  name:'Arjun Sharma',   initials:'AS', score:84, accuracy:91, attempted:6, correct:5, xp:84,  streak:3, isYou:true  },
  { id:2,  name:'Priya Mehta',    initials:'PM', score:80, accuracy:88, attempted:6, correct:5, xp:80,  streak:2, isYou:false },
  { id:3,  name:'Rahul Kumar',    initials:'RK', score:72, accuracy:82, attempted:6, correct:4, xp:72,  streak:1, isYou:false },
  { id:4,  name:'Sneha Kulkarni', initials:'SK', score:70, accuracy:80, attempted:6, correct:4, xp:70,  streak:2, isYou:false },
  { id:5,  name:'Amit Joshi',     initials:'AJ', score:65, accuracy:75, attempted:6, correct:4, xp:65,  streak:1, isYou:false },
  { id:6,  name:'Kavya Reddy',    initials:'KR', score:60, accuracy:72, attempted:5, correct:3, xp:60,  streak:0, isYou:false },
  { id:7,  name:'Dev Agarwal',    initials:'DA', score:58, accuracy:70, attempted:5, correct:3, xp:58,  streak:1, isYou:false },
  { id:8,  name:'Anjali Das',     initials:'AD', score:55, accuracy:68, attempted:5, correct:3, xp:55,  streak:0, isYou:false },
  { id:9,  name:'Vikram Nair',    initials:'VN', score:52, accuracy:65, attempted:5, correct:3, xp:52,  streak:0, isYou:false },
  { id:10, name:'Pooja Tiwari',   initials:'PT', score:48, accuracy:60, attempted:5, correct:2, xp:48,  streak:0, isYou:false },
  { id:11, name:'Karan Bhatt',    initials:'KB', score:45, accuracy:58, attempted:4, correct:2, xp:45,  streak:0, isYou:false },
  { id:12, name:'Divya Lal',      initials:'DL', score:42, accuracy:55, attempted:4, correct:2, xp:42,  streak:0, isYou:false },
  { id:13, name:'Suresh Patel',   initials:'SP', score:40, accuracy:50, attempted:4, correct:2, xp:40,  streak:0, isYou:false },
  { id:14, name:'Meera Singh',    initials:'MS', score:38, accuracy:48, attempted:4, correct:2, xp:38,  streak:0, isYou:false },
  { id:15, name:'Rohan Pillai',   initials:'RP', score:35, accuracy:45, attempted:4, correct:1, xp:35,  streak:0, isYou:false },
  { id:16, name:'Nisha Chawla',   initials:'NC', score:32, accuracy:42, attempted:3, correct:1, xp:32,  streak:0, isYou:false },
  { id:17, name:'Arun Verma',     initials:'AV', score:30, accuracy:40, attempted:3, correct:1, xp:30,  streak:0, isYou:false },
  { id:18, name:'Deepika Malhotra',initials:'DM',score:28, accuracy:38, attempted:3, correct:1, xp:28,  streak:0, isYou:false },
  { id:19, name:'Sanjay Rao',     initials:'SR', score:25, accuracy:35, attempted:3, correct:1, xp:25,  streak:0, isYou:false },
  { id:20, name:'Tanya Ghosh',    initials:'TG', score:22, accuracy:30, attempted:2, correct:1, xp:22,  streak:0, isYou:false },
  { id:21, name:'Varun Hegde',    initials:'VH', score:20, accuracy:28, attempted:2, correct:0, xp:20,  streak:0, isYou:false },
  { id:22, name:'Riya Shah',      initials:'RS', score:18, accuracy:25, attempted:2, correct:0, xp:18,  streak:0, isYou:false },
  { id:23, name:'Nikhil Jain',    initials:'NJ', score:15, accuracy:22, attempted:2, correct:0, xp:15,  streak:0, isYou:false },
  { id:24, name:'Shreya Bansal',  initials:'SB', score:10, accuracy:18, attempted:1, correct:0, xp:10,  streak:0, isYou:false },
];

/* Motivational tips shown as toasts */
const PLAYER_EVENTS = [
  '{name} answered correctly! +{pts} pts',
  '{name} is on a {streak}× streak!',
  '{name} answered in under 5 seconds!',
  '{name} moved to rank #{rank}',
  '{name} is climbing the leaderboard!',
];


/* ═══════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════ */
const state = {
  players:         [...PLAYERS],
  sortedPlayers:   [],
  yourPrevRank:    1,
  filter:          'all',
  simInterval:     null,
  rankPopupTimer:  null,
  updateTimer:     0,
  questionNum:     6,
  totalQ:          10,
};


/* ═══════════════════════════════════════════════════
   DOM REFS
═══════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

const lbTableBody    = $('lbTableBody');
const lastUpdated    = $('lastUpdated');
const showingCount   = $('showingCount');
const rankPopup      = $('rankPopup');
const rankPopupText  = $('rankPopupText');
const toastContainer = $('toastContainer');
const refreshBtn     = $('refreshBtn');
const refreshIcon    = $('refreshIcon');
const totalParticipants = $('totalParticipants');
const headerTopScore = $('headerTopScore');
const headerQ        = $('headerQuestionNum');

const upcRankNum     = $('upcRankNum');
const upcScore       = $('upcScore');
const upcAccuracy    = $('upcAccuracy');
const upcStreak      = $('upcStreak');
const upcXP          = $('upcXP');
const upcCorrect     = $('upcCorrect');
const upcAttempted   = $('upcAttempted');
const upcRingArc     = $('upcRingArc');
const upcLevelBadge  = $('upcLevelBadge');
const upcAvatar      = $('upcAvatar');
const upcName        = $('upcName');

const ARC_FULL = 263.9;  // 2π × 42


/* ═══════════════════════════════════════════════════
   1. INIT — personalise from session
═══════════════════════════════════════════════════ */
(function init() {
  const userName    = sessionStorage.getItem('qh_user_name')  || 'Arjun Sharma';
  const roomCode    = sessionStorage.getItem('qh_room_code')  || 'DSA42';
  const quizTitle   = sessionStorage.getItem('qh_quiz_title') || 'DSA Fundamentals';
  const initials    = userName.split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0,2);

  // Update player name
  const you = state.players.find(p => p.isYou);
  if (you) { you.name = userName; you.initials = initials; }

  // Header
  $('headerRoomCode').textContent = roomCode;
  $('headerTitle').textContent    = quizTitle;
  if (upcAvatar) upcAvatar.textContent = initials;
  if (upcName)   upcName.textContent   = userName;

  sortPlayers();
  renderPodium();
  renderTable(getFilteredPlayers());
  updateUserCard();
  renderStatsPanel();
  renderScoreDist();
  startSimulation();
  initCounters();
})();


/* ═══════════════════════════════════════════════════
   2. PARTICLES BACKGROUND
═══════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = $('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const COUNT = 35;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.25 + 0.05,
      color: Math.random() > 0.5 ? '#a78bfa' : '#38bdf8',
    });
  }

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  })();
})();


/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
function sortPlayers() {
  state.sortedPlayers = [...state.players].sort((a, b) =>
    b.score !== a.score ? b.score - a.score : b.accuracy - a.accuracy
  );
  state.sortedPlayers.forEach((p, i) => { p.rank = i + 1; });
}

function getFilteredPlayers() {
  const sp = state.sortedPlayers;
  switch (state.filter) {
    case 'top10':  return sp.slice(0, 10);
    case 'top50':  return sp.slice(0, 50);
    case 'mine': {
      const you    = sp.find(p => p.isYou);
      const rank   = you?.rank || 1;
      const start  = Math.max(0, rank - 4);
      const end    = Math.min(sp.length, rank + 5);
      return sp.slice(start, end);
    }
    default: return sp;
  }
}

function getRankClass(rank) {
  return rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
}

function getRankDisplay(rank) {
  return rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank;
}

function getLevelClass(accuracy) {
  if (accuracy >= 75) return 'better';
  if (accuracy >= 50) return 'good';
  return 'needs';
}


/* ═══════════════════════════════════════════════════
   3. RENDER PODIUM
═══════════════════════════════════════════════════ */
function renderPodium() {
  const top3 = state.sortedPlayers.slice(0, 3);
  const slots = [
    { avatarId:'p1Avatar', nameId:'p1Name', scoreId:'p1Score', xpId:'p1XP' },
    { avatarId:'p2Avatar', nameId:'p2Name', scoreId:'p2Score', xpId:'p2XP' },
    { avatarId:'p3Avatar', nameId:'p3Name', scoreId:'p3Score', xpId:'p3XP' },
  ];

  top3.forEach((p, i) => {
    const s = slots[i];
    const avatarEl = $(s.avatarId);
    if (avatarEl) {
      avatarEl.textContent   = p.initials;
      avatarEl.style.background = AVATAR_COLORS[p.id % AVATAR_COLORS.length];
    }
    const nameEl = $(s.nameId);
    if (nameEl) nameEl.textContent = p.isYou ? 'You (' + p.name + ')' : p.name;
    const scoreEl = $(s.scoreId);
    if (scoreEl) scoreEl.textContent = p.score;
    const xpEl = $(s.xpId);
    if (xpEl) xpEl.textContent = p.xp + ' XP';
  });

  // Update header top score
  if (headerTopScore && state.sortedPlayers[0]) {
    headerTopScore.textContent = state.sortedPlayers[0].score;
  }
}


/* ═══════════════════════════════════════════════════
   4. RENDER LEADERBOARD TABLE
═══════════════════════════════════════════════════ */
function renderTable(players, changedIds = []) {
  if (!lbTableBody) return;

  lbTableBody.innerHTML = players.map((p) => {
    const isChanged   = changedIds.includes(p.id);
    const rankCls     = getRankClass(p.rank);
    const rankDisp    = getRankDisplay(p.rank);
    const rankArrow   = isChanged ? '▲' : '—';
    const arrowClass  = isChanged ? 'up' : 'same';
    const accClass    = p.accuracy >= 80 ? 'high' : '';
    const colorStyle  = `background:${AVATAR_COLORS[p.id % AVATAR_COLORS.length]}`;
    const rowClass    = [
      'lb-row',
      p.isYou        ? 'you'          : '',
      isChanged      ? 'rank-changed' : '',
    ].filter(Boolean).join(' ');

    return `<tr class="${rowClass}" data-id="${p.id}">
      <td>
        <div class="rank-cell">
          <span class="rank-num ${rankCls}">${rankDisp}</span>
          <span class="rank-arrow ${arrowClass}">${rankArrow}</span>
        </div>
      </td>
      <td>
        <div class="player-cell">
          <div class="row-avatar" style="${colorStyle}">${p.initials}</div>
          <span class="row-name">${p.name}</span>
          ${p.isYou ? '<span class="row-you-tag">You</span>' : ''}
        </div>
      </td>
      <td class="score-cell">${p.score}</td>
      <td class="acc-cell ${accClass} hide-sm">${p.accuracy}%</td>
      <td class="hide-sm">${p.attempted}/10</td>
      <td class="xp-cell hide-xs">${p.xp} XP</td>
      <td class="streak-cell hide-xs">${p.streak > 0 ? '🔥'.repeat(Math.min(p.streak, 3)) + ' ×' + p.streak : '—'}</td>
    </tr>`;
  }).join('');

  // Update meta
  if (showingCount) showingCount.textContent = `Showing ${players.length} players`;
  if (lastUpdated)  lastUpdated.textContent  = 'Updated just now';
  if (totalParticipants) totalParticipants.textContent = state.players.length;
  if (headerQ) headerQ.textContent = `Q ${state.questionNum}/10`;
}


/* ═══════════════════════════════════════════════════
   5. REAL-TIME SIMULATION
      Every 2–6s: a random player scores points,
      leaderboard re-sorts, rank changes detected.
═══════════════════════════════════════════════════ */
function startSimulation() {
  clearInterval(state.simInterval);
  state.simInterval = setInterval(() => {
    if (state.questionNum >= state.totalQ) { clearInterval(state.simInterval); return; }

    // Pick random non-you players to score
    const others = state.players.filter(p => !p.isYou);
    const count  = Math.floor(Math.random() * 3) + 1; // 1–3 players answer simultaneously

    const changed = [];
    for (let i = 0; i < count; i++) {
      const p       = others[Math.floor(Math.random() * others.length)];
      const correct = Math.random() > 0.4;
      if (correct) {
        const pts = [10, 10, 20, 20, 30][Math.floor(Math.random() * 5)];
        p.score    += pts;
        p.xp       += pts;
        p.attempted = Math.min(p.attempted + 1, 10);
        p.correct  += 1;
        p.accuracy  = Math.round((p.correct / p.attempted) * 100);
        if (Math.random() > 0.6) p.streak++;
        changed.push(p);

        // Show toast for notable players
        if (Math.random() > 0.5) {
          showToast(`${p.name} answered correctly! +${pts} pts`, 'score');
        }
      }
    }

    // Occasionally advance the question counter
    if (Math.random() > 0.7 && state.questionNum < state.totalQ) {
      state.questionNum++;
    }

    const prevRankYou = state.players.find(p => p.isYou)?.rank || 1;
    sortPlayers();
    const newRankYou  = state.sortedPlayers.find(p => p.isYou)?.rank || 1;

    renderPodium();
    renderTable(getFilteredPlayers(), changed.map(p => p.id));
    updateUserCard();
    renderStatsPanel();
    renderScoreDist();

    // Rank change notification for user
    if (newRankYou < prevRankYou) {
      showRankPopup(`🎉 You moved to Rank #${newRankYou}!`);
      showToast(`🎉 You moved up to Rank #${newRankYou}!`, 'rank');
    } else if (newRankYou > prevRankYou) {
      showToast(`▼ You dropped to Rank #${newRankYou}`, 'info');
    }

    state.updateTimer++;
    if (lastUpdated) {
      lastUpdated.textContent = `Updated ${state.updateTimer}s ago`;
    }

  }, Math.floor(Math.random() * 4000) + 2000); // 2–6s
}

// Keep the "Updated Ns ago" counter ticking
setInterval(() => {
  state.updateTimer++;
  if (lastUpdated) lastUpdated.textContent = `Updated ${state.updateTimer}s ago`;
}, 1000);


/* ═══════════════════════════════════════════════════
   6. FILTER TABS
═══════════════════════════════════════════════════ */
document.querySelectorAll('.lb-filter').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.lb-filter').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');
    state.filter = this.dataset.filter;
    renderTable(getFilteredPlayers());

    // Scroll to user row on "mine" filter
    if (state.filter === 'mine') {
      setTimeout(() => {
        const youRow = lbTableBody?.querySelector('.you');
        youRow?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  });
});


/* ═══════════════════════════════════════════════════
   7. USER PERFORMANCE CARD
═══════════════════════════════════════════════════ */
function updateUserCard() {
  const you = state.sortedPlayers.find(p => p.isYou);
  if (!you) return;

  const rank    = you.rank;
  const total   = state.sortedPlayers.length;
  const rankPct = 1 - (rank - 1) / Math.max(total - 1, 1);

  // Animate rank number
  if (upcRankNum) {
    const prev = upcRankNum.textContent;
    upcRankNum.textContent = `#${rank}`;
    if (prev !== `#${rank}`) {
      upcRankNum.classList.add('bump');
      setTimeout(() => upcRankNum.classList.remove('bump'), 400);
    }
  }

  // SVG ring
  if (upcRingArc) {
    const offset = ARC_FULL * (1 - rankPct);
    upcRingArc.style.transition       = 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)';
    upcRingArc.style.strokeDashoffset = offset;
  }

  // Stats
  if (upcScore)    upcScore.textContent    = you.score;
  if (upcAccuracy) upcAccuracy.textContent = you.accuracy + '%';
  if (upcStreak)   upcStreak.textContent   = you.streak;
  if (upcXP)       upcXP.textContent       = you.xp + ' XP';
  if (upcCorrect)  upcCorrect.textContent  = you.correct;
  if (upcAttempted) upcAttempted.textContent = you.attempted;

  // Level badge
  if (upcLevelBadge) {
    const lv = getLevelClass(you.accuracy);
    upcLevelBadge.textContent = lv === 'better' ? 'BETTER' : lv === 'good' ? 'GOOD' : 'IMPROVE';
    upcLevelBadge.className   = `upc-level-badge ${lv}`;
  }
}


/* ═══════════════════════════════════════════════════
   8. STATISTICS PANEL
═══════════════════════════════════════════════════ */
function renderStatsPanel() {
  const sp = state.sortedPlayers;
  if (!sp.length) return;

  const highest  = sp[0];
  const totalScore = sp.reduce((s, p) => s + p.score, 0);
  const avg      = Math.round(totalScore / sp.length);
  const fastest  = [...sp].sort((a,b) => b.accuracy - a.accuracy)[0];
  const accurate = [...sp].filter(p => p.attempted > 0)
                          .sort((a,b) => b.accuracy - a.accuracy)[0];

  const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  set('statHighest', `${highest.name}: ${highest.score} pts`);
  set('statAverage', `${avg} pts`);
  set('statFastest', `${fastest.name}: ${fastest.accuracy}% acc`);
  set('statAccurate', `${accurate.name}: ${accurate.accuracy}%`);
  set('statActive', sp.filter(p => p.attempted > 0).length.toString());
}


/* ═══════════════════════════════════════════════════
   9. SCORE DISTRIBUTION CHART
═══════════════════════════════════════════════════ */
function renderScoreDist() {
  const container = $('scoreDistBars');
  if (!container) return;

  // Buckets: 0-50 (low), 51-75 (mid), 76-100 (high) per 10-point range
  const buckets = {};
  for (let i = 0; i <= 90; i += 10) {
    buckets[i] = 0;
  }
  state.sortedPlayers.forEach(p => {
    const bucket = Math.floor(p.score / 10) * 10;
    const key    = Math.min(bucket, 90);
    if (buckets[key] !== undefined) buckets[key]++;
  });

  const maxCount = Math.max(...Object.values(buckets), 1);
  const colors   = { low: '#a78bfa', mid: '#38bdf8', high: '#34d399' };

  container.innerHTML = Object.entries(buckets).map(([range, count]) => {
    const rangeNum = parseInt(range);
    const pct      = Math.round((count / maxCount) * 100);
    const color    = rangeNum >= 76 ? colors.high : rangeNum >= 51 ? colors.mid : colors.low;
    return `<div class="sdb-col">
      <div class="sdb-bar" style="height:${Math.max(pct, 4)}%;background:${color}" title="${count} players (${range}–${rangeNum+9})" aria-label="${count} players scored ${range} to ${rangeNum+9}"></div>
      <span class="sdb-lbl">${range}</span>
    </div>`;
  }).join('');
}


/* ═══════════════════════════════════════════════════
   10. RANK POPUP + TOASTS
═══════════════════════════════════════════════════ */
function showRankPopup(msg) {
  clearTimeout(state.rankPopupTimer);
  rankPopupText.textContent = msg;
  rankPopup.hidden           = false;
  state.rankPopupTimer = setTimeout(() => { rankPopup.hidden = true; }, 3000);
}

function showToast(message, type = 'info') {
  const div = document.createElement('div');
  div.className   = `toast-item ${type}`;
  div.textContent = message;
  toastContainer.appendChild(div);
  setTimeout(() => {
    div.style.opacity   = '0';
    div.style.transform = 'translateX(16px)';
    div.style.transition = 'all 0.3s ease';
    setTimeout(() => div.remove(), 350);
  }, 3000);
}


/* ═══════════════════════════════════════════════════
   11. REFRESH BUTTON
═══════════════════════════════════════════════════ */
refreshBtn?.addEventListener('click', () => {
  refreshBtn.classList.add('spinning');
  state.updateTimer = 0;
  setTimeout(() => {
    sortPlayers();
    renderPodium();
    renderTable(getFilteredPlayers());
    updateUserCard();
    renderStatsPanel();
    renderScoreDist();
    refreshBtn.classList.remove('spinning');
    showToast('Leaderboard refreshed ✓', 'info');
  }, 800);
});


/* ═══════════════════════════════════════════════════
   12. ANIMATED COUNTERS (header stats)
═══════════════════════════════════════════════════ */
function initCounters() {
  const targets = [
    { el: totalParticipants, target: PLAYERS.length },
    { el: headerTopScore,    target: state.sortedPlayers[0]?.score || 84 },
  ];
  const duration = 1200;

  targets.forEach(({ el, target }) => {
    if (!el) return;
    const start = performance.now();
    const tick  = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  });
}


/* ─── INIT LOG ────────────────────────────────────── */
console.log('%cQuizHire Leaderboard 🏆', 'font-size:14px;font-weight:bold;color:#a78bfa;');
console.log('%c24 players · Real-time simulation active', 'color:#34d399;');
