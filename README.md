# QuizHire – Real-Time Quiz & Skill Recommendation Platform
**MCA Final Year Project**

## ✅ Completed Modules

| # | Module | Files | Lines | Status |
|---|--------|-------|-------|--------|
| 01 | Landing Page | index.html · style.css · app.js | 1836 | ✅ Done |
| 02 | Login Page | login.html · login.css · login.js | 1401 | ✅ Done |
| 03 | Signup Page | signup.html · signup.css · signup.js | 1373 | ✅ Done |
| 04 | Student Dashboard | dashboard.html · dashboard.css · dashboard.js | 1988 | ✅ Done |
| 05 | Admin Dashboard | admin-dashboard.html · admin-dashboard.css · admin-dashboard.js | 2437 | ✅ Done |
| 06 | Join Quiz Room | join-room.html | 35 | 🔜 Full module next |
| 07 | Live Quiz Page | quiz.html | — | 🔜 |
| 08 | Leaderboard | leaderboard.html | — | 🔜 |
| 09 | Results & Analytics | results.html | — | 🔜 |

---

## 🚀 How to Run
1. Extract the ZIP into any folder
2. Open `index.html` in Chrome / Firefox / Edge
3. No server or install required — pure frontend

---

## 🔐 Test Credentials

| Role | Email | Password | Redirects To |
|------|-------|----------|-------------|
| Student | student@quizhire.com | student123 | dashboard.html |
| Admin | admin@quizhire.com | admin123 | admin-dashboard.html |

---

## 🔗 Full Navigation Map

```
index.html
  ├── Login        → login.html
  └── Get Started  → signup.html

login.html
  ├── Student login  → dashboard.html
  ├── Admin login    → admin-dashboard.html
  ├── Create account → signup.html
  └── Forgot pwd     → modal (fixed ✅)

signup.html
  ├── Create Account → login.html (after success)
  └── Sign in link   → login.html

dashboard.html (Student)
  ├── Overview   → stats, chart, upcoming quizzes, activity table
  ├── Skills     → 6 category cards with animated bars
  ├── Companies  → Better/Good/Needs tabs + 9 company cards
  ├── Learning   → 6 topic roadmap cards
  ├── History    → 12-row quiz history table
  ├── Join Room  → join-room.html
  └── Logout     → login.html

admin-dashboard.html (Admin)
  ├── Dashboard   → stats (6 cards), recent quizzes, top students, category bars
  ├── Quizzes     → full table + search/filter + Create Quiz modal
  ├── Questions   → question bank + Add Question modal
  ├── Students    → student table + search/filter
  ├── Analytics   → bar chart, donut chart, line chart, weak areas
  ├── Live Rooms  → 3 live room cards with real-time timers
  ├── Settings    → profile, notifications, platform config, security
  └── Logout      → login.html
```

---

## 🗂 Folder Structure

```
QuizHire/
├── index.html
├── login.html
├── signup.html
├── dashboard.html
├── admin-dashboard.html
├── join-room.html           ← placeholder
├── css/
│   ├── style.css            (1065 lines)
│   ├── login.css            (729 lines)
│   ├── signup.css           (543 lines)
│   ├── dashboard.css        (917 lines)
│   └── admin-dashboard.css  (972 lines)
├── js/
│   ├── app.js               (246 lines)
│   ├── login.js             (334 lines)
│   ├── signup.js            (433 lines)
│   ├── dashboard.js         (389 lines)
│   └── admin-dashboard.js   (725 lines)
├── assets/
│   ├── images/
│   └── icons/
└── README.md
```

---

## 🐛 All Bugs Fixed

- ✅ Red error banner hidden on page load (login + signup)
- ✅ Forgot Password modal X closes correctly
- ✅ Clicking outside modal closes it
- ✅ Escape key closes modal
- ✅ "Get Started" links to signup.html (no 404)
- ✅ All navigation links verified working

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#07070f` |
| Surface | `rgba(255,255,255,0.04)` |
| Border | `rgba(255,255,255,0.08)` |
| Purple | `#a78bfa` |
| Blue | `#38bdf8` |
| Gradient | `135deg #a78bfa → #38bdf8` |
| Font Display | Syne 700/800 |
| Font Body | DM Sans 400/500 |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript ES6+ |
| Backend (planned) | Node.js + Express.js |
| Database (planned) | MySQL |
| Real-Time (planned) | Socket.IO |
| Charts (planned) | Chart.js |
| Auth (planned) | JWT |

---

## 📊 Admin Dashboard Features

- **6 animated stat counters** — Students, Active Rooms, Quizzes, Avg Score, Attempts, Completion
- **Quiz Management** — Full CRUD table with search, category & status filters + Create Quiz modal
- **Question Bank** — MCQ library with difficulty filter + Add Question modal with 4-option selector
- **Student Management** — Searchable table with level filter + remove action
- **Analytics** — SVG bar chart, donut chart, line chart, weak areas grid
- **Live Rooms** — Real-time elapsed timers, End Room + Monitor buttons
- **Settings** — Profile editor, 5 notification toggles, platform config, password change
- **Toast notifications** — Success/error feedback for all actions

---

## 🔭 Planned Modules

- Join Quiz Room (real-time Socket.IO)
- Live Quiz Page (timer + MCQ engine)
- Live Leaderboard (real-time ranking)
- Results & Analytics (post-quiz report)

---

*Built as MCA Final Year Project — QuizHire v4.0*
