# QuizHire – Real-Time Quiz & Skill Recommendation Platform
**MCA Final Year Project · v7.0**

## ✅ Completed Modules

| # | Module | Files | Lines | Status |
|---|--------|-------|-------|--------|
| 01 | Landing Page | index.html · style.css · app.js | 1,836 | ✅ |
| 02 | Login | login.html · login.css · login.js | 1,401 | ✅ |
| 03 | Signup | signup.html · signup.css · signup.js | 1,373 | ✅ |
| 04 | Student Dashboard | dashboard.html · dashboard.css · dashboard.js | 1,988 | ✅ |
| 05 | Admin Dashboard | admin-dashboard.html · admin-dashboard.css · admin-dashboard.js | 2,437 | ✅ |
| 06 | Join Quiz Room | join-room.html · join-room.css · join-room.js | 1,720 | ✅ |
| 07 | Live Quiz | live-quiz.html · live-quiz.css · live-quiz.js | 1,999 | ✅ |
| 08 | Live Leaderboard | leaderboard.html · leaderboard.css · leaderboard.js | 1,780 | ✅ |
| 09 | Results & Analytics | results.html · results.css · results.js | — | 🔜 Next |

**Total: ~14,534 lines across 25 files**

---

## 🚀 How to Run
Extract ZIP → open `index.html` in Chrome / Firefox / Edge. No server needed.

## 🔐 Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Student | student@quizhire.com | student123 |
| Admin | admin@quizhire.com | admin123 |

## 🎮 Room Codes: DSA42 · APT88 · PS404 · VRB99 · FS123

## 🔗 Navigation Map
```
index.html → login.html / signup.html
login.html → dashboard.html / admin-dashboard.html
dashboard.html → join-room.html
join-room.html → live-quiz.html (on countdown end)
live-quiz.html → leaderboard.html (View Results)
leaderboard.html → live-quiz.html / dashboard.html
```

## 🗂 Folder Structure
```
QuizHire/
├── index.html · login.html · signup.html
├── dashboard.html · admin-dashboard.html
├── join-room.html · live-quiz.html · leaderboard.html
├── css/  (7 stylesheets)
├── js/   (8 scripts)
├── assets/
└── README.md
```

## 🏆 Leaderboard Features
- Animated 3-step podium (Gold/Silver/Bronze) with crown animation
- Full sortable table — Rank, Player, Score, Accuracy, Attempted, XP, Streak
- Real-time score updates every 2–6 seconds (simulated)
- Rank change arrows (▲ / ▼) with row highlight animation
- Filter tabs — Overall / Top 10 / Top 50 / My Position
- User performance card — SVG rank ring, 6-stat grid, level badge
- Statistics panel — Highest, Average, Fastest, Most Accurate, Active
- Score distribution bar chart (10-point buckets, color-coded)
- Rank change popup + toast notifications for all events
- Animated particle canvas background
- Animated header counters (Players, Top Score)
- Refresh button with spinning animation
- Fully responsive — sidebar collapses on mobile

## 🎨 Design System
| Token | Value |
|-------|-------|
| Background | `#07070f` |
| Purple | `#a78bfa` |
| Blue | `#38bdf8` |
| Gradient | `135deg #a78bfa → #38bdf8` |
| Font | Syne 700/800 · DM Sans 400/500 |
