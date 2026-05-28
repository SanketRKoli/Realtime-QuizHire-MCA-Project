/**
 * QuizHire – Admin Dashboard JavaScript
 * File: js/admin-dashboard.js
 *
 * Modules:
 *  1.  Session & personalization
 *  2.  Dynamic greeting + live clock
 *  3.  Sidebar toggle (mobile)
 *  4.  Section navigation
 *  5.  Scroll reveal (IntersectionObserver)
 *  6.  Animated stat counters
 *  7.  Notification panel
 *  8.  Quiz table (render + search + filter)
 *  9.  Question bank table (render + search + filter)
 * 10.  Student table (render + search + filter)
 * 11.  Live rooms (render + timer)
 * 12.  Create Quiz modal
 * 13.  Add Question modal
 * 14.  Toast notification helper
 * 15.  Settings handlers
 * 16.  Logout
 */

'use strict';

/* ═══════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════ */
const MOCK_QUIZZES = [
  { id:1, title:'DSA Fundamentals',    category:'DSA',          questions:10, duration:30, code:'DSA42', students:24, status:'active'  },
  { id:2, title:'Aptitude Sprint',     category:'Aptitude',     questions:15, duration:25, code:'APT88', students:18, status:'done'    },
  { id:3, title:'Programming Logic',   category:'Programming',  questions:20, duration:40, code:'PRG15', students:30, status:'done'    },
  { id:4, title:'Reasoning Challenge', category:'Reasoning',    questions:12, duration:20, code:'RSN33', students:22, status:'done'    },
  { id:5, title:'Communication Quiz',  category:'Communication',questions:10, duration:15, code:'COM07', students:12, status:'draft'   },
  { id:6, title:'Full Stack Mock',     category:'Programming',  questions:25, duration:45, code:'FS123', students:30, status:'done'    },
  { id:7, title:'Problem Solving',     category:'DSA',          questions:10, duration:20, code:'PS404', students:16, status:'done'    },
  { id:8, title:'Verbal Ability',      category:'Communication',questions:10, duration:15, code:'VRB99', students:19, status:'done'    },
];

const MOCK_QUESTIONS = [
  { id:1, text:'Which data structure uses FIFO principle?', category:'DSA',          difficulty:'Easy',   marks:1 },
  { id:2, text:'What is the time complexity of binary search?', category:'DSA',      difficulty:'Medium', marks:2 },
  { id:3, text:'What does OOP stand for?',                  category:'Programming',  difficulty:'Easy',   marks:1 },
  { id:4, text:'Which keyword is used to inherit a class in Java?', category:'Programming', difficulty:'Medium', marks:2 },
  { id:5, text:'If A runs faster than B, and B faster than C, who is slowest?', category:'Reasoning', difficulty:'Easy', marks:1 },
  { id:6, text:'A train travels 60km in 1hr. Distance in 2.5hrs?', category:'Aptitude', difficulty:'Medium', marks:2 },
  { id:7, text:'What is a closure in JavaScript?',          category:'Programming',  difficulty:'Hard',   marks:3 },
  { id:8, text:'Explain the concept of Big O notation.',    category:'DSA',          difficulty:'Hard',   marks:3 },
  { id:9, text:'Two pipes fill tank in 3h and 4h. Time together?', category:'Aptitude', difficulty:'Hard', marks:3 },
  { id:10,text:'Find the odd one out: Apple, Mango, Potato, Banana', category:'Reasoning', difficulty:'Easy', marks:1 },
];

const MOCK_STUDENTS = [
  { id:1,  name:'Arjun Sharma',   email:'arjun@example.com',    quizzes:12, avgScore:84, level:'Better',           lastActive:'Dec 20, 2024' },
  { id:2,  name:'Priya Mehta',    email:'priya@example.com',    quizzes:10, avgScore:81, level:'Better',           lastActive:'Dec 19, 2024' },
  { id:3,  name:'Rahul Kumar',    email:'rahul@example.com',    quizzes:9,  avgScore:78, level:'Good',             lastActive:'Dec 18, 2024' },
  { id:4,  name:'Sneha Kulkarni', email:'sneha@example.com',    quizzes:8,  avgScore:75, level:'Good',             lastActive:'Dec 17, 2024' },
  { id:5,  name:'Amit Joshi',     email:'amit@example.com',     quizzes:11, avgScore:72, level:'Good',             lastActive:'Dec 16, 2024' },
  { id:6,  name:'Kavya Reddy',    email:'kavya@example.com',    quizzes:7,  avgScore:65, level:'Good',             lastActive:'Dec 15, 2024' },
  { id:7,  name:'Suresh Patel',   email:'suresh@example.com',   quizzes:6,  avgScore:58, level:'Needs Improvement', lastActive:'Dec 14, 2024' },
  { id:8,  name:'Meera Singh',    email:'meera@example.com',    quizzes:5,  avgScore:52, level:'Needs Improvement', lastActive:'Dec 13, 2024' },
  { id:9,  name:'Dev Agarwal',    email:'dev@example.com',      quizzes:9,  avgScore:79, level:'Good',             lastActive:'Dec 12, 2024' },
  { id:10, name:'Anjali Das',     email:'anjali@example.com',   quizzes:8,  avgScore:83, level:'Better',           lastActive:'Dec 11, 2024' },
];

const MOCK_ROOMS = [
  { code:'DSA42', quiz:'DSA Fundamentals',    students:24, maxStudents:30, category:'DSA',         elapsed:820  },
  { code:'PS404', quiz:'Problem Solving',     students:16, maxStudents:25, category:'DSA',         elapsed:340  },
  { code:'VRB99', quiz:'Verbal Ability',      students:19, maxStudents:20, category:'Communication',elapsed:1540 },
];


/* ═══════════════════════════════════════════════════
   DOM REFERENCES
═══════════════════════════════════════════════════ */
const sidebar         = document.getElementById('sidebar');
const sidebarOverlay  = document.getElementById('sidebarOverlay');
const sidebarClose    = document.getElementById('sidebarClose');
const hamburger       = document.getElementById('hamburger');
const navLinks        = document.querySelectorAll('.snav-link[data-section]');
const allSections     = document.querySelectorAll('.dash-section');
const notifBtn        = document.getElementById('notifBtn');
const notifPanel      = document.getElementById('notifPanel');
const logoutBtn       = document.getElementById('logoutBtn');
const datetimeDisplay = document.getElementById('datetimeDisplay');
const greetingText    = document.getElementById('greetingText');
const adminWelcomeName = document.getElementById('adminWelcomeName');
const sidebarName     = document.getElementById('sidebarName');
const sidebarAvatar   = document.getElementById('sidebarAvatar');
const topbarAvatar    = document.getElementById('topbarAvatar');
const profileBigAvatar = document.getElementById('profileBigAvatar');
const toast           = document.getElementById('toast');

// Quiz section
const quizTableBody   = document.getElementById('quizTableBody');
const quizSearch      = document.getElementById('quizSearch');
const quizCatFilter   = document.getElementById('quizCategoryFilter');
const quizStatFilter  = document.getElementById('quizStatusFilter');

// Question section
const questionTableBody = document.getElementById('questionTableBody');
const qbSearch          = document.getElementById('qbSearch');
const qbCatFilter       = document.getElementById('qbCategoryFilter');
const qbDiffFilter      = document.getElementById('qbDiffFilter');

// Student section
const studentTableBody = document.getElementById('studentTableBody');
const studentSearch    = document.getElementById('studentSearch');
const studentLevelFilter = document.getElementById('studentLevelFilter');

// Room grid
const roomGrid = document.getElementById('roomGrid');

// Modals
const createQuizModal = document.getElementById('createQuizModal');
const closeQuizModal  = document.getElementById('closeQuizModal');
const cancelQuizModal = document.getElementById('cancelQuizModal');
const submitCreateQuiz = document.getElementById('submitCreateQuiz');

const addQuestionModal = document.getElementById('addQuestionModal');
const closeQModal  = document.getElementById('closeQModal');
const cancelQModal = document.getElementById('cancelQModal');
const submitAddQ   = document.getElementById('submitAddQ');

// Global search
const globalSearch = document.getElementById('globalSearch');


/* ═══════════════════════════════════════════════════
   1. SESSION & PERSONALIZATION
═══════════════════════════════════════════════════ */
(function loadAdminData() {
  const name  = sessionStorage.getItem('qh_user_name')  || 'Admin User';
  const initials = name.split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0,2);

  if (adminWelcomeName) adminWelcomeName.textContent = name + ' 👋';
  if (sidebarName)      sidebarName.textContent      = name;
  [sidebarAvatar, topbarAvatar, profileBigAvatar].forEach(el => { if (el) el.textContent = initials; });

  // Pre-fill settings form
  const adminNameInput  = document.getElementById('adminName');
  const adminEmailInput = document.getElementById('adminEmail');
  if (adminNameInput)  adminNameInput.value  = name;
  if (adminEmailInput) adminEmailInput.value = sessionStorage.getItem('qh_user_email') || 'admin@quizhire.com';
})();


/* ═══════════════════════════════════════════════════
   2. GREETING + LIVE CLOCK
═══════════════════════════════════════════════════ */
function updateClock() {
  const now  = new Date();
  const hour = now.getHours();
  if (greetingText) {
    if (hour < 12)      greetingText.textContent = 'Good Morning,';
    else if (hour < 18) greetingText.textContent = 'Good Afternoon,';
    else                greetingText.textContent = 'Good Evening,';
  }
  if (datetimeDisplay) {
    datetimeDisplay.textContent = now.toLocaleString('en-IN', {
      weekday:'short', month:'short', day:'numeric',
      hour:'2-digit', minute:'2-digit', hour12:true
    });
  }
}
updateClock();
setInterval(updateClock, 30000);


/* ═══════════════════════════════════════════════════
   3. SIDEBAR TOGGLE
═══════════════════════════════════════════════════ */
function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('visible');
  hamburger?.setAttribute('aria-expanded','true');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('visible');
  hamburger?.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openSidebar);
sidebarClose?.addEventListener('click', closeSidebar);
sidebarOverlay?.addEventListener('click', closeSidebar);
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSidebar(); closeAllModals(); } });


/* ═══════════════════════════════════════════════════
   4. SECTION NAVIGATION
═══════════════════════════════════════════════════ */
const SECTION_LABELS = {
  overview:  'Dashboard',
  quizzes:   'Manage Quizzes',
  questions: 'Question Bank',
  students:  'Students',
  analytics: 'Analytics',
  liverooms: 'Live Rooms',
  settings:  'Settings'
};

function showSection(id) {
  allSections.forEach(sec => { sec.hidden = sec.id !== `section-${id}`; });
  navLinks.forEach(link => {
    const active = link.dataset.section === id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });

  // Lazy render section data
  if (id === 'quizzes')   renderQuizTable(MOCK_QUIZZES);
  if (id === 'questions') renderQuestionTable(MOCK_QUESTIONS);
  if (id === 'students')  renderStudentTable(MOCK_STUDENTS);
  if (id === 'liverooms') renderRooms();

  document.getElementById('pageScroll')?.scrollTo({ top:0, behavior:'smooth' });
  closeSidebar();
  setTimeout(triggerReveal, 50);
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const sec = link.dataset.section;
    if (sec) showSection(sec);
  });
});

// Delegate "View All" / "data-section" button clicks
document.addEventListener('click', e => {
  const el = e.target.closest('[data-section]');
  if (el && !el.classList.contains('snav-link') && SECTION_LABELS[el.dataset.section]) {
    e.preventDefault();
    showSection(el.dataset.section);
  }
  const action = e.target.closest('[data-action]');
  if (action) {
    if (action.dataset.action === 'create-quiz')   openModal(createQuizModal);
    if (action.dataset.action === 'add-question')  openModal(addQuestionModal);
    if (action.dataset.action === 'create-room')   showToast('Room creation module coming soon!', 'success');
  }
});


/* ═══════════════════════════════════════════════════
   5. SCROLL REVEAL
═══════════════════════════════════════════════════ */
function triggerReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin:'0px 0px -20px 0px' });

  els.forEach((el, i) => {
    el.style.transitionDelay = (i * 70) + 'ms';
    obs.observe(el);
  });
}
triggerReveal();


/* ═══════════════════════════════════════════════════
   6. ANIMATED STAT COUNTERS
═══════════════════════════════════════════════════ */
(function initCounters() {
  const statSection = document.querySelector('.stat-cards');
  if (!statSection) return;
  let fired = false;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fired) {
        fired = true;
        document.querySelectorAll('.counter[data-target]').forEach(el => {
          const target   = parseInt(el.dataset.target, 10);
          const duration = 1600;
          const start    = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor((1 - Math.pow(1-p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          };
          requestAnimationFrame(tick);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  obs.observe(statSection);
})();


/* ═══════════════════════════════════════════════════
   7. NOTIFICATION PANEL
═══════════════════════════════════════════════════ */
notifBtn?.addEventListener('click', e => {
  e.stopPropagation();
  const open = !notifPanel.hidden;
  notifPanel.hidden = open;
  notifBtn.setAttribute('aria-expanded', String(!open));
  if (!open) {
    const dot = notifBtn.querySelector('.notif-dot');
    if (dot) setTimeout(() => dot.style.display = 'none', 500);
  }
});
document.addEventListener('click', e => {
  if (!notifPanel?.hidden && !notifPanel.contains(e.target) && e.target !== notifBtn) {
    notifPanel.hidden = true;
  }
});


/* ═══════════════════════════════════════════════════
   8. QUIZ TABLE
═══════════════════════════════════════════════════ */
function catClass(cat) {
  const map = { DSA:'purple', Programming:'teal', Aptitude:'blue', Reasoning:'pink', Communication:'orange', 'Problem Solving':'green' };
  return map[cat] || 'purple';
}

function renderQuizTable(data) {
  if (!quizTableBody) return;
  quizTableBody.innerHTML = data.length ? data.map((q,i) => `
    <tr>
      <td>${i+1}</td>
      <td class="td-name">${q.title}</td>
      <td><span class="cat-chip ${catClass(q.category)}">${q.category}</span></td>
      <td>${q.questions} Q</td>
      <td>${q.duration} min</td>
      <td><code style="font-family:var(--font-display);font-size:13px;color:#a78bfa">${q.code}</code></td>
      <td>${q.students}</td>
      <td><span class="status-chip ${q.status}">${q.status.charAt(0).toUpperCase()+q.status.slice(1)}</span></td>
      <td>
        <div class="td-actions">
          <button class="tbl-btn tbl-btn-edit"  onclick="showToast('Edit quiz: ${q.title}','success')">Edit</button>
          <button class="tbl-btn tbl-btn-view"  onclick="showToast('Viewing results for ${q.code}','success')">Results</button>
          <button class="tbl-btn tbl-btn-del"   onclick="deleteQuiz(${q.id})">Delete</button>
        </div>
      </td>
    </tr>`).join('') : '<tr><td colspan="9" style="text-align:center;color:rgba(255,255,255,0.3);padding:24px">No quizzes found.</td></tr>';
}

function filterQuizzes() {
  const s   = (quizSearch?.value  || '').toLowerCase();
  const cat = quizCatFilter?.value  || '';
  const st  = quizStatFilter?.value || '';
  renderQuizTable(MOCK_QUIZZES.filter(q =>
    (!s   || q.title.toLowerCase().includes(s) || q.code.toLowerCase().includes(s)) &&
    (!cat || q.category === cat) &&
    (!st  || q.status === st)
  ));
}

quizSearch?.addEventListener('input',   filterQuizzes);
quizCatFilter?.addEventListener('change', filterQuizzes);
quizStatFilter?.addEventListener('change',filterQuizzes);

window.deleteQuiz = function(id) {
  const idx = MOCK_QUIZZES.findIndex(q => q.id === id);
  if (idx > -1) {
    MOCK_QUIZZES.splice(idx, 1);
    filterQuizzes();
    showToast('Quiz deleted.', 'error');
  }
};


/* ═══════════════════════════════════════════════════
   9. QUESTION BANK TABLE
═══════════════════════════════════════════════════ */
function renderQuestionTable(data) {
  if (!questionTableBody) return;
  questionTableBody.innerHTML = data.length ? data.map((q,i) => `
    <tr>
      <td>${i+1}</td>
      <td style="max-width:320px;white-space:normal">${q.text}</td>
      <td><span class="cat-chip ${catClass(q.category)}">${q.category}</span></td>
      <td><span class="diff-chip ${q.difficulty.toLowerCase()}">${q.difficulty}</span></td>
      <td>${q.marks} pt${q.marks>1?'s':''}</td>
      <td>
        <div class="td-actions">
          <button class="tbl-btn tbl-btn-edit" onclick="showToast('Edit question #${q.id}','success')">Edit</button>
          <button class="tbl-btn tbl-btn-del"  onclick="deleteQuestion(${q.id})">Delete</button>
        </div>
      </td>
    </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:rgba(255,255,255,0.3);padding:24px">No questions found.</td></tr>';
}

function filterQuestions() {
  const s    = (qbSearch?.value    || '').toLowerCase();
  const cat  = qbCatFilter?.value  || '';
  const diff = qbDiffFilter?.value || '';
  renderQuestionTable(MOCK_QUESTIONS.filter(q =>
    (!s    || q.text.toLowerCase().includes(s)) &&
    (!cat  || q.category   === cat) &&
    (!diff || q.difficulty === diff)
  ));
}

qbSearch?.addEventListener('input',   filterQuestions);
qbCatFilter?.addEventListener('change', filterQuestions);
qbDiffFilter?.addEventListener('change',filterQuestions);

window.deleteQuestion = function(id) {
  const idx = MOCK_QUESTIONS.findIndex(q => q.id === id);
  if (idx > -1) {
    MOCK_QUESTIONS.splice(idx, 1);
    filterQuestions();
    showToast('Question deleted.', 'error');
  }
};


/* ═══════════════════════════════════════════════════
   10. STUDENT TABLE
═══════════════════════════════════════════════════ */
function levelClass(lv) {
  if (lv === 'Better') return 'better';
  if (lv === 'Good')   return 'good';
  return 'needs';
}

function renderStudentTable(data) {
  if (!studentTableBody) return;
  studentTableBody.innerHTML = data.length ? data.map((s,i) => `
    <tr>
      <td>${i+1}</td>
      <td><p class="td-name">${s.name}</p></td>
      <td class="td-email">${s.email}</td>
      <td>${s.quizzes}</td>
      <td style="font-weight:600;color:#fff">${s.avgScore}/100</td>
      <td><span class="status-chip ${levelClass(s.level)}">${s.level}</span></td>
      <td>${s.lastActive}</td>
      <td>
        <div class="td-actions">
          <button class="tbl-btn tbl-btn-view" onclick="showToast('Viewing profile: ${s.name}','success')">View</button>
          <button class="tbl-btn tbl-btn-del"  onclick="removeStudent(${s.id})">Remove</button>
        </div>
      </td>
    </tr>`).join('') : '<tr><td colspan="8" style="text-align:center;color:rgba(255,255,255,0.3);padding:24px">No students found.</td></tr>';
}

function filterStudents() {
  const s  = (studentSearch?.value      || '').toLowerCase();
  const lv = studentLevelFilter?.value  || '';
  renderStudentTable(MOCK_STUDENTS.filter(st =>
    (!s  || st.name.toLowerCase().includes(s) || st.email.toLowerCase().includes(s)) &&
    (!lv || st.level === lv)
  ));
}

studentSearch?.addEventListener('input',     filterStudents);
studentLevelFilter?.addEventListener('change',filterStudents);

window.removeStudent = function(id) {
  const idx = MOCK_STUDENTS.findIndex(s => s.id === id);
  if (idx > -1) {
    MOCK_STUDENTS.splice(idx, 1);
    filterStudents();
    showToast('Student removed.', 'error');
  }
};


/* ═══════════════════════════════════════════════════
   11. LIVE ROOMS — Render + live timers
═══════════════════════════════════════════════════ */
const roomTimers = {};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2,'0');
  const s = (seconds % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function renderRooms() {
  if (!roomGrid) return;
  roomGrid.innerHTML = '';

  MOCK_ROOMS.forEach(room => {
    const card = document.createElement('div');
    card.className = 'room-card live-room reveal';
    card.id = `room-${room.code}`;

    const pct = Math.round((room.students / room.maxStudents) * 100);

    card.innerHTML = `
      <div class="rc-top">
        <span class="rc-live-dot">Live</span>
        <span class="cat-chip ${catClass(room.category)}" style="font-size:10px">${room.category}</span>
      </div>
      <p class="rc-code">${room.code}</p>
      <p class="rc-quiz-name">${room.quiz}</p>
      <div class="rc-stats">
        <div class="rc-stat">
          <p class="rc-stat-val">${room.students}</p>
          <p class="rc-stat-lbl">Students</p>
        </div>
        <div class="rc-stat">
          <p class="rc-stat-val">${room.maxStudents}</p>
          <p class="rc-stat-lbl">Capacity</p>
        </div>
        <div class="rc-stat">
          <p class="rc-stat-val">${pct}%</p>
          <p class="rc-stat-lbl">Full</p>
        </div>
        <div class="rc-stat">
          <p class="rc-stat-val" id="timer-${room.code}">${formatTime(room.elapsed)}</p>
          <p class="rc-stat-lbl">Elapsed</p>
        </div>
      </div>
      <div class="rc-actions">
        <button class="rc-btn-end"  onclick="endRoom('${room.code}')">⛔ End Room</button>
        <button class="rc-btn-view" onclick="showToast('Monitoring room ${room.code}','success')">👁 Monitor</button>
      </div>`;

    roomGrid.appendChild(card);

    // Start live elapsed timer
    clearInterval(roomTimers[room.code]);
    roomTimers[room.code] = setInterval(() => {
      room.elapsed++;
      const el = document.getElementById(`timer-${room.code}`);
      if (el) el.textContent = formatTime(room.elapsed);
    }, 1000);
  });

  setTimeout(triggerReveal, 80);
}

window.endRoom = function(code) {
  clearInterval(roomTimers[code]);
  const idx = MOCK_ROOMS.findIndex(r => r.code === code);
  if (idx > -1) {
    MOCK_ROOMS.splice(idx, 1);
    renderRooms();
    // Update live badge count
    const chip = document.querySelector('.live-chip');
    if (chip) chip.textContent = MOCK_ROOMS.length;
    showToast(`Room ${code} ended successfully.`, 'success');
  }
};


/* ═══════════════════════════════════════════════════
   12. CREATE QUIZ MODAL
═══════════════════════════════════════════════════ */
function openModal(modal) {
  if (!modal) return;
  modal.hidden = false;
  modal.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  // Focus first input
  setTimeout(() => modal.querySelector('input, select, textarea')?.focus(), 80);
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

function closeAllModals() {
  [createQuizModal, addQuestionModal].forEach(m => closeModal(m));
}

// Create Quiz modal controls
closeQuizModal?.addEventListener('click',  e => { e.stopPropagation(); closeModal(createQuizModal); });
cancelQuizModal?.addEventListener('click', () => closeModal(createQuizModal));
createQuizModal?.addEventListener('click', e => { if (e.target === createQuizModal) closeModal(createQuizModal); });
createQuizModal?.querySelector('.modal-card')?.addEventListener('click', e => e.stopPropagation());

submitCreateQuiz?.addEventListener('click', () => {
  const title    = document.getElementById('quizTitle')?.value.trim();
  const category = document.getElementById('quizCategory')?.value;
  const duration = document.getElementById('quizDuration')?.value;
  const status   = document.querySelector('input[name="quizStatus"]:checked')?.value || 'draft';

  if (!title) { showToast('Please enter a quiz title.', 'error'); return; }

  const newQuiz = {
    id: MOCK_QUIZZES.length + 1,
    title, category,
    questions: 0,
    duration: parseInt(duration),
    code: Math.random().toString(36).substring(2,7).toUpperCase(),
    students: 0,
    status
  };

  MOCK_QUIZZES.unshift(newQuiz);
  closeModal(createQuizModal);
  showToast(`Quiz "${title}" created successfully!`, 'success');

  // Switch to quizzes section and re-render
  showSection('quizzes');
  document.getElementById('quizTitle').value = '';
});

// Topbar create button
document.getElementById('topbarCreateQuiz')?.addEventListener('click', () => openModal(createQuizModal));


/* ═══════════════════════════════════════════════════
   13. ADD QUESTION MODAL
═══════════════════════════════════════════════════ */
closeQModal?.addEventListener('click',  e => { e.stopPropagation(); closeModal(addQuestionModal); });
cancelQModal?.addEventListener('click', () => closeModal(addQuestionModal));
addQuestionModal?.addEventListener('click', e => { if (e.target === addQuestionModal) closeModal(addQuestionModal); });
addQuestionModal?.querySelector('.modal-card')?.addEventListener('click', e => e.stopPropagation());

submitAddQ?.addEventListener('click', () => {
  const text   = document.getElementById('qText')?.value.trim();
  const optA   = document.getElementById('optA')?.value.trim();
  const optB   = document.getElementById('optB')?.value.trim();
  const cat    = document.getElementById('qCat')?.value;
  const diff   = document.getElementById('qDiff')?.value;
  const marks  = parseInt(document.getElementById('qMarks')?.value || '1');

  if (!text || !optA || !optB) {
    showToast('Please fill question text and at least 2 options.', 'error');
    return;
  }

  const correct = document.querySelector('input[name="correct"]:checked')?.value || 'A';

  MOCK_QUESTIONS.unshift({
    id: MOCK_QUESTIONS.length + 1, text, category: cat,
    difficulty: diff, marks, correct
  });

  closeModal(addQuestionModal);
  showToast(`Question added to ${cat} bank!`, 'success');
  showSection('questions');

  ['qText','optA','optB','optC','optD'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
});


/* ═══════════════════════════════════════════════════
   14. TOAST NOTIFICATION
═══════════════════════════════════════════════════ */
let toastTimer = null;

window.showToast = function(message, type = 'success') {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent  = (type === 'success' ? '✅ ' : '❌ ') + message;
  toast.className    = `toast ${type}`;
  toast.hidden       = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
};


/* ═══════════════════════════════════════════════════
   15. SETTINGS HANDLERS
═══════════════════════════════════════════════════ */
document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
  const name = document.getElementById('adminName')?.value.trim();
  if (!name) { showToast('Name cannot be empty.', 'error'); return; }
  sessionStorage.setItem('qh_user_name', name);
  if (adminWelcomeName) adminWelcomeName.textContent = name + ' 👋';
  if (sidebarName)      sidebarName.textContent = name;
  const initials = name.split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0,2);
  [sidebarAvatar, topbarAvatar, profileBigAvatar].forEach(el => { if (el) el.textContent = initials; });
  showToast('Profile saved successfully!', 'success');
});

document.getElementById('savePlatformBtn')?.addEventListener('click', () => {
  showToast('Platform settings saved!', 'success');
});

document.getElementById('changePwdBtn')?.addEventListener('click', () => {
  const cur = document.getElementById('curPwd')?.value;
  const nw  = document.getElementById('newPwd')?.value;
  const cfm = document.getElementById('cfmPwd')?.value;
  if (!cur || !nw) { showToast('Please fill all password fields.', 'error'); return; }
  if (nw !== cfm)  { showToast('Passwords do not match.', 'error'); return; }
  if (nw.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
  showToast('Password updated successfully!', 'success');
  ['curPwd','newPwd','cfmPwd'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
});


/* ═══════════════════════════════════════════════════
   16. GLOBAL SEARCH
═══════════════════════════════════════════════════ */
globalSearch?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = globalSearch.value.trim().toLowerCase();
    if (!q) return;
    // Search across quizzes
    const matchQ = MOCK_QUIZZES.some(quiz => quiz.title.toLowerCase().includes(q));
    const matchS = MOCK_STUDENTS.some(s => s.name.toLowerCase().includes(q));
    if (matchQ) { showSection('quizzes');   quizSearch.value = q;   filterQuizzes(); }
    else if (matchS) { showSection('students'); studentSearch.value = q; filterStudents(); }
    else showToast(`No results for "${q}"`, 'error');
    globalSearch.value = '';
  }
});


/* ═══════════════════════════════════════════════════
   17. LOGOUT
═══════════════════════════════════════════════════ */
logoutBtn?.addEventListener('click', () => {
  sessionStorage.clear();
  window.location.href = 'login.html';
});


/* ─── INIT LOG ────────────────────────────────────── */
console.log('%cQuizHire Admin Dashboard ⚙️', 'font-size:14px;font-weight:bold;color:#a78bfa;');
console.log('%cAll modules initialized', 'color:#34d399;');
