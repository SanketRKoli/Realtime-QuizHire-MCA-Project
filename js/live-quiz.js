/**
 * QuizHire – Live Quiz Page JavaScript
 * File: js/live-quiz.js
 *
 * Modules:
 *  1.  Quiz data & session setup
 *  2.  Particles background
 *  3.  Question rendering engine
 *  4.  Timer (SVG arc countdown)
 *  5.  Answer selection & submission
 *  6.  Score, streak & XP system
 *  7.  Progress & skill tracking
 *  8.  Live leaderboard (simulated)
 *  9.  Simulated participants answering
 * 10.  Toast & rank popup notifications
 * 11.  Quiz completed overlay + confetti
 * 12.  Exit modal
 * 13.  Right sidebar toggle (mobile)
 * 14.  Motivational tips
 */

'use strict';

/* ═══════════════════════════════════════════════════
   QUIZ DATA — 10 MCQ questions with code snippets
═══════════════════════════════════════════════════ */
const QUIZ_DATA = {
  room:     'DSA42',
  title:    'DSA Fundamentals',
  category: 'DSA',
  totalQ:   10,
  timePerQ: 30,   // seconds per question
  xpPerCorrect: 10,
  questions: [
    {
      id: 1, text: 'Which data structure uses the FIFO (First In, First Out) principle?',
      category: 'DSA', difficulty: 'Easy', points: 10,
      options: ['Stack', 'Queue', 'Tree', 'Graph'], correct: 1,
      tip: 'A Queue is like a real-world queue at a bank — first to arrive, first to be served.'
    },
    {
      id: 2, text: 'What is the time complexity of binary search on a sorted array of n elements?',
      category: 'DSA', difficulty: 'Medium', points: 20,
      options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correct: 2,
      tip: 'Binary search halves the search space each step — hence logarithmic time complexity.'
    },
    {
      id: 3, text: 'Which of the following is NOT a linear data structure?',
      category: 'DSA', difficulty: 'Easy', points: 10,
      options: ['Array', 'Linked List', 'Tree', 'Queue'], correct: 2,
      tip: 'Trees are hierarchical (non-linear). Arrays, Linked Lists, and Queues are all linear.'
    },
    {
      id: 4,
      text: 'What does this JavaScript function return for arr = [1, 2, 3, 4, 5]?',
      category: 'Programming', difficulty: 'Medium', points: 20,
      hasCode: true, codeLanguage: 'JavaScript',
      codeContent: `function mystery(arr) {\n  return arr.reduce((acc, val) => acc + val, 0);\n}`,
      options: ['5', '15', '[1,2,3,4,5]', 'undefined'], correct: 1,
      tip: 'Array.reduce() with an initial value of 0 accumulates sum. 1+2+3+4+5 = 15.'
    },
    {
      id: 5, text: 'In a max-heap, which element is always at the root?',
      category: 'DSA', difficulty: 'Medium', points: 20,
      options: ['Smallest element', 'Largest element', 'Middle element', 'Last inserted element'], correct: 1,
      tip: 'In a max-heap, every parent is ≥ its children, so the root always holds the maximum.'
    },
    {
      id: 6, text: 'What is the worst-case time complexity of QuickSort?',
      category: 'DSA', difficulty: 'Hard', points: 30,
      options: ['O(n log n)', 'O(n²)', 'O(log n)', 'O(n)'], correct: 1,
      tip: 'QuickSort worst case occurs when the pivot is always the smallest/largest — O(n²).'
    },
    {
      id: 7, text: 'Which traversal visits nodes in the order: Left → Root → Right?',
      category: 'DSA', difficulty: 'Easy', points: 10,
      options: ['Preorder', 'Postorder', 'Inorder', 'Level Order'], correct: 2,
      tip: 'Inorder (L→Root→R) produces a sorted sequence for Binary Search Trees.'
    },
    {
      id: 8,
      text: 'What output does this code produce?',
      category: 'Programming', difficulty: 'Hard', points: 30,
      hasCode: true, codeLanguage: 'JavaScript',
      codeContent: `let a = [1, 2, 3];\nlet b = a;\nb.push(4);\nconsole.log(a.length);`,
      options: ['3', '4', 'undefined', 'Error'], correct: 1,
      tip: 'Arrays are reference types in JS. b = a makes both point to the same array in memory.'
    },
    {
      id: 9, text: 'Which graph algorithm finds the shortest path between two nodes in an unweighted graph?',
      category: 'DSA', difficulty: 'Medium', points: 20,
      options: ['DFS', 'BFS', 'Dijkstra', 'Bellman-Ford'], correct: 1,
      tip: 'BFS explores level by level, guaranteeing the shortest path in unweighted graphs.'
    },
    {
      id: 10, text: 'What is the space complexity of a recursive Fibonacci function without memoization?',
      category: 'DSA', difficulty: 'Hard', points: 30,
      options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], correct: 1,
      tip: 'The call stack depth reaches n for fib(n), so space complexity is O(n).'
    }
  ]
};

/* Mock participants for leaderboard */
const PARTICIPANTS = [
  { name: 'Arjun S.', initials: 'AS', color: 'linear-gradient(135deg,#a78bfa,#38bdf8)', score: 0, isYou: true  },
  { name: 'Priya M.', initials: 'PM', color: 'linear-gradient(135deg,#38bdf8,#2dd4bf)', score: 0, isYou: false },
  { name: 'Rahul K.', initials: 'RK', color: 'linear-gradient(135deg,#fb923c,#f472b6)', score: 0, isYou: false },
  { name: 'Sneha K.', initials: 'SK', color: 'linear-gradient(135deg,#34d399,#38bdf8)', score: 0, isYou: false },
  { name: 'Amit J.',  initials: 'AJ', color: 'linear-gradient(135deg,#f472b6,#a78bfa)', score: 0, isYou: false },
  { name: 'Dev A.',   initials: 'DA', color: 'linear-gradient(135deg,#fbbf24,#fb923c)', score: 0, isYou: false },
  { name: 'Kavya R.', initials: 'KR', color: 'linear-gradient(135deg,#2dd4bf,#34d399)', score: 0, isYou: false },
  { name: 'Vikram N.',initials: 'VN', color: 'linear-gradient(135deg,#a78bfa,#f472b6)', score: 0, isYou: false },
];

const TIPS_POOL = [
  'Focus on understanding the concept rather than memorizing.',
  'Faster answers earn bonus XP — but accuracy comes first!',
  'You\'re doing great! Stay consistent and trust your prep.',
  'Break complex questions down into smaller parts.',
  'If unsure, eliminate obviously wrong options first.',
  'Your streak is building — keep those correct answers coming!',
  'Review weak areas in the Skill Analysis after this quiz.',
];


/* ═══════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════ */
const state = {
  currentQ:      0,
  selectedOpt:   null,
  answered:      false,
  locked:        false,
  score:         0,
  correct:       0,
  streak:        0,
  maxStreak:     0,
  timeLeft:      QUIZ_DATA.timePerQ,
  totalTime:     0,         // accumulated seconds used
  timerInterval: null,
  simInterval:   null,
  rankPopupTimer:null,
  yourRank:      1,
  totalPlayers:  24,
  quizComplete:  false,
};


/* ═══════════════════════════════════════════════════
   DOM REFS
═══════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

const timerNum       = $('timerNum');
const timerArc       = $('timerArc');
const headerScore    = $('headerScore');
const questionProgress = $('questionProgress');
const progressFill   = $('progressFill');
const streakBadge    = $('streakBadge');
const streakCount    = $('streakCount');
const xpPopup        = $('xpPopup');
const questionCard   = $('questionCard');
const questionNumber = $('questionNumber');
const questionText   = $('questionText');
const qCategoryBadge = $('qCategoryBadge');
const qDiffBadge     = $('qDiffBadge');
const qPoints        = $('qPoints');
const codeBlock      = $('codeBlock');
const codeLang       = $('codeLang');
const codeContent    = $('codeContent');
const copyCode       = $('copyCode');
const submitAnswerBtn = $('submitAnswerBtn');
const skipBtn        = $('skipBtn');
const answerFeedback = $('answerFeedback');
const afIcon         = $('afIcon');
const afTitle        = $('afTitle');
const afSub          = $('afSub');
const afScore        = $('afScore');
const mtText         = $('mtText');
const lbList         = $('lbList');
const yourRankDisplay = $('yourRankDisplay');
const totalPlayersDisplay = $('totalPlayersDisplay');
const rsRank         = $('rsRank');
const rsRankChange   = $('rsRankChange');
const statAccuracy   = $('statAccuracy');
const statAttempted  = $('statAttempted');
const statCorrect    = $('statCorrect');
const statRemaining  = $('statRemaining');
const skillDSA       = $('skillDSA');
const skillSpeed     = $('skillSpeed');
const skillAccuracy  = $('skillAccuracy');
const toastContainer = $('toastContainer');
const rankPopup      = $('rankPopup');
const rankPopupText  = $('rankPopupText');
const quizCompletedOverlay = $('quizCompletedOverlay');
const exitModal      = $('exitModal');
const motivationalTip = $('motivationalTip');
const optBtns        = Array.from({ length: 4 }, (_, i) => $(`opt${i}`));
const headerRoomCode = $('headerRoomCode');
const headerTitle    = $('headerTitle');

const ARC_FULL_TIMER  = 150.8;  // 2π × 24 (header timer radius)
const ARC_FULL_SCORE  = 314.2;  // 2π × 50 (result score ring)


/* ═══════════════════════════════════════════════════
   1. INIT
═══════════════════════════════════════════════════ */
(function init() {
  // Apply room/quiz info from sessionStorage or defaults
  const room  = sessionStorage.getItem('qh_room_code')  || QUIZ_DATA.room;
  const title = sessionStorage.getItem('qh_quiz_title') || QUIZ_DATA.title;
  headerRoomCode.textContent = room;
  headerTitle.textContent    = title;

  renderQuestion(0);
  renderLeaderboard();
  startSimulation();
  initParticles();

  // Set total players
  totalPlayersDisplay.textContent = `of ${state.totalPlayers} players`;
})();


/* ═══════════════════════════════════════════════════
   2. PARTICLES BACKGROUND
═══════════════════════════════════════════════════ */
function initParticles() {
  const canvas = $('particlesCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const particles = [];
  const COUNT   = 40;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.3 + 0.05,
      color: Math.random() > 0.5 ? '#a78bfa' : '#38bdf8',
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}


/* ═══════════════════════════════════════════════════
   3. QUESTION RENDERING
═══════════════════════════════════════════════════ */
function renderQuestion(idx) {
  if (idx >= QUIZ_DATA.questions.length) {
    endQuiz();
    return;
  }

  const q = QUIZ_DATA.questions[idx];
  state.currentQ   = idx;
  state.selectedOpt = null;
  state.answered    = false;
  state.locked      = false;

  // Animate card in
  questionCard.classList.remove('exit');
  void questionCard.offsetWidth; // reflow
  questionCard.style.animation = 'none';
  void questionCard.offsetWidth;
  questionCard.style.animation = '';

  // Meta
  questionNumber.textContent  = `Question ${idx + 1}`;
  questionText.textContent    = q.text;
  qCategoryBadge.textContent  = q.category;
  qPoints.textContent         = `+${q.points} pts`;

  // Difficulty badge
  qDiffBadge.textContent = q.difficulty;
  qDiffBadge.className   = `qc-diff-badge ${q.difficulty.toLowerCase()}`;

  // Code block
  if (q.hasCode) {
    codeLang.textContent    = q.codeLanguage;
    codeContent.textContent = q.codeContent;
    codeBlock.hidden        = false;
  } else {
    codeBlock.hidden = true;
  }

  // Options
  optBtns.forEach((btn, i) => {
    btn.className          = 'option-btn';
    btn.disabled           = false;
    btn.setAttribute('aria-checked', 'false');
    $(`opt${i}-text`).textContent = q.options[i];
  });

  // Controls
  submitAnswerBtn.disabled = true;
  answerFeedback.hidden    = true;

  // Progress
  const pct = ((idx + 1) / QUIZ_DATA.totalQ) * 100;
  progressFill.style.width     = pct + '%';
  questionProgress.textContent = `Q ${idx + 1} / ${QUIZ_DATA.totalQ}`;
  statRemaining.textContent    = QUIZ_DATA.totalQ - idx;

  // Tip
  mtText.textContent = q.tip || TIPS_POOL[idx % TIPS_POOL.length];

  // Start timer
  startTimer(QUIZ_DATA.timePerQ, idx);
}


/* ═══════════════════════════════════════════════════
   4. TIMER — SVG arc countdown
═══════════════════════════════════════════════════ */
function startTimer(seconds, questionIdx) {
  clearInterval(state.timerInterval);
  state.timeLeft = seconds;

  // Add SVG gradient def once
  if (!document.getElementById('timerGrad')) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const defs  = document.createElementNS(svgNS, 'defs');
    const grad  = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', 'timerGrad');
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '1'); grad.setAttribute('y2', '1');
    const s1 = document.createElementNS(svgNS, 'stop');
    s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#a78bfa');
    const s2 = document.createElementNS(svgNS, 'stop');
    s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#38bdf8');
    grad.appendChild(s1); grad.appendChild(s2);
    defs.appendChild(grad);
    timerArc?.closest('svg')?.prepend(defs);
  }

  function tick() {
    const pct    = state.timeLeft / seconds;
    const offset = ARC_FULL_TIMER * (1 - pct);
    if (timerArc) timerArc.style.strokeDashoffset = offset;
    if (timerNum) timerNum.textContent = state.timeLeft;

    // Warning state ≤ 10s
    if (state.timeLeft <= 10) {
      timerNum.classList.add('warning');
      if (timerArc) timerArc.style.stroke = '#f87171';
      document.querySelector('.quiz-header')?.classList.add('warning');
    } else {
      timerNum.classList.remove('warning');
      if (timerArc) timerArc.style.stroke = '';
      document.querySelector('.quiz-header')?.classList.remove('warning');
    }

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      if (!state.answered) handleTimeout(questionIdx);
      return;
    }
    state.timeLeft--;
    state.totalTime++;
  }

  tick();
  state.timerInterval = setInterval(tick, 1000);
}

function handleTimeout(idx) {
  state.answered = true;
  state.streak   = 0;
  updateStreakBadge();
  lockOptions();
  showFeedback('timeout', idx);
  scheduleNext();
}


/* ═══════════════════════════════════════════════════
   5. ANSWER SELECTION & SUBMISSION
═══════════════════════════════════════════════════ */
optBtns.forEach((btn, i) => {
  btn.addEventListener('click', function () {
    if (state.locked || state.answered) return;
    state.selectedOpt = i;

    // Update UI
    optBtns.forEach((b, j) => {
      b.classList.toggle('selected', j === i);
      b.setAttribute('aria-checked', j === i ? 'true' : 'false');
    });

    submitAnswerBtn.disabled = false;
  });
});

submitAnswerBtn.addEventListener('click', submitAnswer);

document.addEventListener('keydown', e => {
  if (state.locked || state.answered || state.quizComplete) return;
  const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
  const idx = keyMap[e.key.toLowerCase()];
  if (idx !== undefined) {
    optBtns[idx].click();
  }
  if (e.key === 'Enter' && state.selectedOpt !== null) {
    submitAnswer();
  }
});

function submitAnswer() {
  if (state.answered || state.selectedOpt === null || state.locked) return;
  clearInterval(state.timerInterval);

  state.answered = true;
  state.locked   = true;
  const q        = QUIZ_DATA.questions[state.currentQ];
  const isCorrect = state.selectedOpt === q.correct;

  lockOptions();
  revealAnswer(state.selectedOpt, q.correct, isCorrect, q);
  updateScore(isCorrect, q);
  scheduleNext();
}

function lockOptions() {
  optBtns.forEach(btn => { btn.disabled = true; });
  submitAnswerBtn.disabled = true;
}

function revealAnswer(selected, correct, isCorrect, q) {
  optBtns[correct].classList.add('correct');
  if (!isCorrect && selected !== null) {
    optBtns[selected].classList.add('wrong');
  }
  showFeedback(isCorrect ? 'correct' : 'wrong', state.currentQ, isCorrect, q);
}

function showFeedback(type, idx, isCorrect, q) {
  answerFeedback.hidden    = false;
  answerFeedback.className = `answer-feedback ${type}`;

  if (type === 'correct') {
    afIcon.textContent  = '✓';
    afTitle.textContent = 'Correct! 🎉';
    afSub.textContent   = `The answer is: ${q.options[q.correct]}`;
    afScore.textContent = `+${q.points} pts`;
    afScore.style.color = 'var(--clr-green)';
  } else if (type === 'wrong') {
    afIcon.textContent  = '✗';
    afTitle.textContent = 'Incorrect';
    afSub.textContent   = `Correct answer: ${q.options[q.correct]}`;
    afScore.textContent = '+0 pts';
    afScore.style.color = 'var(--clr-red)';
  } else {
    afIcon.textContent  = '⏰';
    afTitle.textContent = 'Time\'s up!';
    const qi = QUIZ_DATA.questions[idx];
    afSub.textContent   = `Correct answer: ${qi.options[qi.correct]}`;
    afScore.textContent = '+0 pts';
    afScore.style.color = 'rgba(255,255,255,0.3)';
  }
}


/* ═══════════════════════════════════════════════════
   6. SCORE, STREAK & XP
═══════════════════════════════════════════════════ */
function updateScore(isCorrect, q) {
  const attempted = state.currentQ + 1;

  if (isCorrect) {
    const timeBonus = Math.max(0, Math.floor(state.timeLeft / 3));
    const earned    = q.points + timeBonus;
    state.score    += earned;
    state.correct++;
    state.streak++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);

    // Animate score bump
    headerScore.textContent = state.score;
    headerScore.classList.add('bump');
    setTimeout(() => headerScore.classList.remove('bump'), 300);

    // XP popup
    xpPopup.textContent = `+${earned} XP`;
    xpPopup.hidden = false;
    setTimeout(() => { xpPopup.hidden = true; }, 1300);

    // Toast notification
    showToast(`✓ Correct! +${earned} pts`, 'correct');

    // Update participant score in leaderboard
    const you = PARTICIPANTS.find(p => p.isYou);
    if (you) {
      you.score = state.score;
      renderLeaderboard();
      checkRankChange();
    }

  } else {
    state.streak = 0;
  }

  updateStreakBadge();

  // Update stats
  statAttempted.textContent = attempted;
  statCorrect.textContent   = state.correct;
  const acc = attempted > 0 ? Math.round((state.correct / attempted) * 100) : 100;
  statAccuracy.textContent  = acc + '%';

  // Skill bars
  skillDSA.style.width      = Math.min(state.correct * 12, 100) + '%';
  skillSpeed.style.width    = Math.min((QUIZ_DATA.timePerQ - state.timeLeft) < 15 ? 80 : 50, 100) + '%';
  skillAccuracy.style.width = acc + '%';
}

function updateStreakBadge() {
  if (state.streak >= 2) {
    streakBadge.hidden      = false;
    streakCount.textContent = `×${state.streak}`;
  } else {
    streakBadge.hidden = true;
  }
}


/* ═══════════════════════════════════════════════════
   7. AUTO-ADVANCE TO NEXT QUESTION
═══════════════════════════════════════════════════ */
function scheduleNext() {
  setTimeout(() => {
    if (state.currentQ + 1 >= QUIZ_DATA.totalQ) {
      endQuiz();
    } else {
      renderQuestion(state.currentQ + 1);
    }
  }, 2200);
}

skipBtn.addEventListener('click', () => {
  if (state.answered) return;
  clearInterval(state.timerInterval);
  state.answered = true;
  state.streak   = 0;
  updateStreakBadge();
  lockOptions();
  const q = QUIZ_DATA.questions[state.currentQ];
  optBtns[q.correct].classList.add('correct');
  showFeedback('timeout', state.currentQ);
  scheduleNext();
});


/* ═══════════════════════════════════════════════════
   8. LIVE LEADERBOARD
═══════════════════════════════════════════════════ */
function renderLeaderboard() {
  // Sort by score descending
  const sorted = [...PARTICIPANTS].sort((a, b) => b.score - a.score);
  lbList.innerHTML = '';

  sorted.forEach((p, i) => {
    const rank     = i + 1;
    const rankCls  = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
    const rankSyms = ['🥇', '🥈', '🥉'];
    const rankDisp = rank <= 3 ? rankSyms[rank - 1] : rank;

    if (p.isYou) state.yourRank = rank;

    const li = document.createElement('li');
    li.className = `lb-item${p.isYou ? ' you' : ''}`;
    li.innerHTML = `
      <span class="lb-rank ${rankCls}">${rankDisp}</span>
      <div class="lb-avatar" style="background:${p.color}">${p.initials}</div>
      <span class="lb-name">${p.isYou ? 'You' : p.name}</span>
      <span class="lb-score">${p.score}</span>
    `;
    lbList.appendChild(li);
  });

  yourRankDisplay.textContent = `#${state.yourRank}`;
  rsRank.textContent          = `#${state.yourRank}`;
}

function checkRankChange() {
  const prevRank = parseInt(yourRankDisplay.textContent.replace('#', '')) || state.yourRank;
  const newRank  = state.yourRank;

  if (newRank < prevRank) {
    rsRankChange.textContent = `▲ Up ${prevRank - newRank} position${prevRank - newRank > 1 ? 's' : ''}`;
    rsRankChange.className   = 'rsr-change up';
    rsRank.classList.add('bump');
    setTimeout(() => rsRank.classList.remove('bump'), 400);
    showRankPopup(`🎉 You moved to Rank #${newRank}!`);
  } else if (newRank > prevRank) {
    rsRankChange.textContent = `▼ Down ${newRank - prevRank} position${newRank - prevRank > 1 ? 's' : ''}`;
    rsRankChange.className   = 'rsr-change down';
  } else {
    rsRankChange.textContent = '— Holding position';
    rsRankChange.className   = 'rsr-change same';
  }
}


/* ═══════════════════════════════════════════════════
   9. SIMULATED PARTICIPANTS ANSWERING
      Other players answer randomly every 2–8 seconds,
      updating their scores and re-sorting the leaderboard.
═══════════════════════════════════════════════════ */
function startSimulation() {
  clearInterval(state.simInterval);

  state.simInterval = setInterval(() => {
    if (state.quizComplete) { clearInterval(state.simInterval); return; }

    // Pick a random non-you participant
    const others = PARTICIPANTS.filter(p => !p.isYou);
    const p      = others[Math.floor(Math.random() * others.length)];
    const correct = Math.random() > 0.35; // 65% chance they answer correctly

    if (correct) {
      const pts = [10, 10, 20, 20, 30][Math.floor(Math.random() * 5)];
      p.score  += pts;
      showToast(`${p.name} answered correctly`, 'info');
    }

    renderLeaderboard();
    checkRankChange();

  }, Math.floor(Math.random() * 5000) + 2000); // 2–7s
}


/* ═══════════════════════════════════════════════════
   10. TOAST NOTIFICATIONS
═══════════════════════════════════════════════════ */
function showToast(message, type = 'info') {
  const div = document.createElement('div');
  div.className   = `toast-item ${type}`;
  div.textContent = message;
  toastContainer.appendChild(div);

  setTimeout(() => {
    div.style.opacity   = '0';
    div.style.transform = 'translateX(20px)';
    div.style.transition = 'all 0.3s ease';
    setTimeout(() => div.remove(), 350);
  }, 3000);
}

function showRankPopup(message) {
  clearTimeout(state.rankPopupTimer);
  rankPopupText.textContent = message;
  rankPopup.hidden           = false;
  state.rankPopupTimer = setTimeout(() => { rankPopup.hidden = true; }, 3000);
}


/* ═══════════════════════════════════════════════════
   11. QUIZ COMPLETED — overlay + confetti
═══════════════════════════════════════════════════ */
function endQuiz() {
  clearInterval(state.timerInterval);
  clearInterval(state.simInterval);
  state.quizComplete = true;

  // Populate overlay stats
  const attempted  = Math.min(state.currentQ + 1, QUIZ_DATA.totalQ);
  const accuracy   = attempted > 0 ? Math.round((state.correct / attempted) * 100) : 0;
  const avgTime    = Math.round(state.totalTime / Math.max(attempted, 1));
  const maxScore   = QUIZ_DATA.questions.reduce((sum, q) => sum + q.points, 0);
  const scorePct   = Math.round((state.score / maxScore) * 100);

  $('endRank').textContent      = `#${state.yourRank}`;
  $('endAccuracy').textContent  = accuracy + '%';
  $('endCorrect').textContent   = `${state.correct}/${QUIZ_DATA.totalQ}`;
  $('endTime').textContent      = avgTime + 's';
  $('finalMax').textContent     = `/ ${maxScore}`;
  $('qcoSubtitle').textContent  = `${QUIZ_DATA.title} · Room ${QUIZ_DATA.room}`;

  // Determine performance level
  let levelTitle, levelSub, levelIcon, levelClass;
  if (scorePct >= 75) {
    levelTitle = 'BETTER Performance 🏆';
    levelSub   = 'Eligible for all companies including Google, Microsoft & Amazon!';
    levelIcon  = '🏆';
    levelClass = '';
    $('trophyIcon').textContent = '🏆';
  } else if (scorePct >= 50) {
    levelTitle = 'GOOD Performance ✅';
    levelSub   = 'Eligible for TCS, Wipro, Infosys, Capgemini and more.';
    levelIcon  = '✅';
    levelClass = '';
    $('trophyIcon').textContent = '✅';
  } else {
    levelTitle = 'Needs Improvement 📈';
    levelSub   = 'Focus on weak areas. Check your learning roadmap in the dashboard.';
    levelIcon  = '📈';
    levelClass = 'needs';
    $('trophyIcon').textContent = '📈';
  }

  $('qlbIcon').textContent   = levelIcon;
  $('qlbTitle').textContent  = levelTitle;
  $('qlbSub').textContent    = levelSub;
  const banner = $('qcoLevelBanner');
  banner.className = levelClass ? `qco-level-banner ${levelClass}` : 'qco-level-banner';

  // Show overlay
  quizCompletedOverlay.hidden = false;
  quizCompletedOverlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';

  // Animate score ring after brief delay
  setTimeout(() => {
    animateScoreRing(scorePct);
    animateFinalScore(state.score);
    if (scorePct >= 50) startConfetti();
  }, 400);
}

/* Animate SVG ring */
function animateScoreRing(pct) {
  const arc    = $('scoreArc');
  const offset = ARC_FULL_SCORE * (1 - pct / 100);
  if (arc) {
    arc.style.transition      = 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)';
    arc.style.strokeDashoffset = offset;
  }
}

/* Count-up final score */
function animateFinalScore(target) {
  const el  = $('finalScore');
  const dur  = 1500;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
}

/* Retry quiz */
$('retryBtn').addEventListener('click', () => {
  // Reset all state
  PARTICIPANTS.forEach(p => { p.score = 0; });
  Object.assign(state, {
    currentQ: 0, selectedOpt: null, answered: false, locked: false,
    score: 0, correct: 0, streak: 0, maxStreak: 0,
    timeLeft: QUIZ_DATA.timePerQ, totalTime: 0, yourRank: 1, quizComplete: false
  });
  quizCompletedOverlay.hidden = true;
  document.body.style.overflow = '';
  renderQuestion(0);
  renderLeaderboard();
  startSimulation();
});


/* ═══════════════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════════════ */
function startConfetti() {
  const canvas = $('confettiCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors  = ['#a78bfa','#38bdf8','#34d399','#f472b6','#fbbf24','#fb923c'];
  const pieces  = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -200,
    w: Math.random() * 8 + 4,
    h: Math.random() * 12 + 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    drot: (Math.random() - 0.5) * 0.15,
    dy: Math.random() * 3 + 2,
    dx: (Math.random() - 0.5) * 2,
  }));

  let frame = 0;
  const FRAMES = 180;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / FRAMES);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x   += p.dx;
      p.y   += p.dy;
      p.rot += p.drot;
    });
    frame++;
    if (frame < FRAMES) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}


/* ═══════════════════════════════════════════════════
   12. EXIT MODAL
═══════════════════════════════════════════════════ */
$('exitBtn').addEventListener('click', () => {
  exitModal.hidden = false;
  exitModal.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
});

$('exitCancelBtn').addEventListener('click', () => {
  exitModal.hidden = true;
  exitModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
});

exitModal.addEventListener('click', e => {
  if (e.target === exitModal) {
    exitModal.hidden = true;
    exitModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!exitModal.hidden) {
      exitModal.hidden = true;
      document.body.style.overflow = '';
    }
  }
});


/* ═══════════════════════════════════════════════════
   13. MOBILE SIDEBAR TOGGLE
═══════════════════════════════════════════════════ */
$('rsToggle')?.addEventListener('click', () => {
  document.getElementById('rightSidebar')?.classList.toggle('open');
});


/* ═══════════════════════════════════════════════════
   14. COPY CODE BUTTON
═══════════════════════════════════════════════════ */
copyCode?.addEventListener('click', () => {
  const text = codeContent?.textContent || '';
  navigator.clipboard?.writeText(text).then(() => {
    copyCode.textContent = 'Copied!';
    setTimeout(() => { copyCode.textContent = 'Copy'; }, 1800);
  });
});


/* ═══════════════════════════════════════════════════
   INIT LOG
═══════════════════════════════════════════════════ */
console.log('%cQuizHire Live Quiz ⚡', 'font-size:14px;font-weight:bold;color:#a78bfa;');
console.log('%cKeyboard shortcuts: 1-4 or A-D to select · Enter to submit', 'color:#38bdf8;');
