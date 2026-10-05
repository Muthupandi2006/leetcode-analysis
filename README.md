# CodeLens — LeetCode Coding Analysis & Mentorship Platform

> **Understand Your Coding. Improve Your Future.**

A personalized coding performance and mentorship analytics platform that analyzes LeetCode profiles. The core principle: **"You choose what you want to know. We analyze only that."**

## ✨ Features

### For Students
- 📊 **Problems You Solved** — See problems solved with difficulty and dates
- ⏱️ **Time Taken** — Built-in timer to track solving time accurately
- 📈 **Problem Difficulty** — Easy / Medium / Hard distribution breakdown
- 🧠 **How You Solve** — Behavioral insights from solving patterns
- 🤖 **Possible AI Help** — Estimate AI assistance likelihood from signals
- 🔍 **Code Similarity** — Compare code against reference solutions
- 💪 **Strong Areas** — Identify your strongest topics
- 📚 **Areas to Improve** — Find topics that need more practice
- 🎯 **Career Suggestions** — Discover career fields matching your coding strengths

### For Mentors
- Add and track multiple students
- Quick / Progress / Detailed / Custom review types
- Choose exactly which analyses to run per student

### Key Design Principles
- **Selective analysis** — Choose 1, 2, 5, or all 9 analyses
- **No dashboard overload** — See only what you asked for
- **Honest data** — Clearly distinguishes measured vs. estimated vs. unavailable data
- **Simple English** — No jargon in the UI

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | SQLite via Prisma 6 ORM |
| Charts | Recharts (available) |
| Validation | Zod |
| Icons | Lucide React |

### Project Structure

```
├── app/
│   ├── page.tsx                          # Homepage
│   ├── layout.tsx                        # Root layout (dark theme)
│   ├── globals.css                       # Global styles
│   ├── analyze/
│   │   ├── page.tsx                      # URL input (Page 1)
│   │   └── [username]/page.tsx           # Loading → Profile → Results (Pages 2-4)
│   ├── timer/page.tsx                    # Problem solving timer
│   ├── mentor/page.tsx                   # Mentor dashboard
│   └── api/
│       ├── leetcode/profile/route.ts     # LeetCode GraphQL proxy
│       └── sessions/route.ts            # Timer session CRUD
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                    # Navigation bar
│   │   └── Footer.tsx                   # Footer
│   ├── profile/
│   │   └── ProfileCard.tsx              # Profile display
│   └── analysis/
│       ├── AnalysisSelector.tsx          # 9 selectable analysis cards
│       ├── DateRangePicker.tsx           # Date range with presets
│       ├── ProblemsSolvedCard.tsx        # Problems list + pagination
│       ├── DifficultyCard.tsx            # Easy/Medium/Hard bars
│       ├── TimeTakenCard.tsx             # Timer stats or CTA
│       ├── BehaviorCard.tsx              # Behavioral insights
│       ├── AIHelpCard.tsx                # AI assistance estimation
│       ├── SimilarityCard.tsx            # Code similarity
│       ├── StrongAreasCard.tsx           # Strong topics
│       ├── ImprovementCard.tsx           # Areas to improve
│       └── CareerCard.tsx               # Career recommendations
├── lib/
│   ├── leetcode/
│   │   ├── client.ts                    # GraphQL client (rate-limited, cached)
│   │   └── queries.ts                   # GraphQL query strings
│   ├── analytics/
│   │   ├── problemAnalyzer.ts           # Problems analysis
│   │   ├── difficultyAnalyzer.ts        # Difficulty distribution
│   │   ├── timeAnalyzer.ts              # Timer data analysis
│   │   ├── behaviorAnalyzer.ts          # Behavioral insights
│   │   ├── aiAssistanceAnalyzer.ts      # AI help estimation
│   │   ├── similarityAnalyzer.ts        # Code similarity engine
│   │   ├── strengthAnalyzer.ts          # Topic strengths
│   │   ├── improvementAnalyzer.ts       # Improvement areas
│   │   └── careerRecommendationEngine.ts # Career matching
│   ├── demo/demoData.ts                 # Demo dataset
│   └── database/db.ts                   # Prisma singleton
├── types/
│   ├── leetcode.ts                      # LeetCode API types
│   └── analysis.ts                      # Analysis result types
├── utils/
│   ├── validation.ts                    # Zod schemas
│   ├── formatting.ts                    # Date/number helpers
│   └── errors.ts                        # Error classification
└── prisma/schema.prisma                 # Database schema
```

### Analytics Module Architecture

Each analysis module is independent — only called when the user selects that option:

```
User selects → AnalysisSelector → Only selected modules run:

ProblemAnalyzer        → Problems count, list, dates
DifficultyAnalyzer     → Easy/Medium/Hard distribution
TimeAnalyzer           → Timer sessions analysis
BehaviorAnalyzer       → Solving pattern insights
AIAssistanceAnalyzer   → AI help likelihood estimation
SimilarityAnalyzer     → Code comparison engine
StrengthAnalyzer       → Topic strength scoring
ImprovementAnalyzer    → Improvement area detection
CareerRecommendation   → Career field matching
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone and install
cd leetcode-project
npm install

# Set up database
cp .env.example .env
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEMO_MODE="false"
```

### Building for Production

```bash
npm run build
npm start
```

---

## 🎮 Demo Mode

Click **"Try Demo"** on the homepage or navigate to `/analyze/demo` to see the full platform with sample data.

Demo mode:
- Uses a simulated profile with 247 solved problems
- Includes 15 topic areas with realistic distributions
- Contains 8 timer sessions with solving times
- All analytics modules work with the demo data
- Clearly labeled with a "Demo Mode" banner

---

## 📡 Data Sources

### What comes from LeetCode (public, no auth needed)

| Data | Available | Source |
|------|-----------|--------|
| Username, avatar, ranking | ✅ | `matchedUser` GraphQL query |
| Total solved (Easy/Med/Hard) | ✅ | `submitStats.acSubmissionNum` |
| Recent 20 submissions | ✅ | `recentSubmissionList` query |
| Activity calendar | ✅ | `submissionCalendar` (heatmap) |
| Topic/tag problem counts | ✅ | `tagProblemCounts` |
| Contest history | ✅ | `userContestRanking` query |

### What our application collects

| Data | How |
|------|-----|
| Exact solving time | Built-in timer (Start/Pause/Resume/Finish) |
| Code submissions | Submit through our platform |
| Paste/edit events | Future: editor monitoring |

### What is estimated/computed

| Analysis | Method |
|----------|--------|
| AI Help likelihood | Pattern analysis from timing + submission signals |
| Code similarity | Token-based comparison against reference solutions |
| Career suggestions | Topic strength → career field mapping |
| Behavioral insights | Activity pattern analysis from calendar data |

> **Important**: The app never fabricates data. When data is insufficient, it shows a clear message explaining what's needed.

---

## 📊 API Documentation

### `GET /api/leetcode/profile?username=<username>`

Fetches and normalizes a LeetCode user's public profile data.

**Response (success)**:
```json
{
  "success": true,
  "profile": {
    "username": "...",
    "totalSolved": 247,
    "easySolved": 98,
    "mediumSolved": 112,
    "hardSolved": 37,
    "recentSubmissions": [...],
    "tagProblemCounts": [...],
    "submissionCalendar": {...}
  }
}
```

**Response (error)**:
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "We couldn't find a LeetCode user with that username."
  }
}
```

### `GET/POST/PATCH /api/sessions`

Timer session management (in-memory storage).

---

## 🔒 Privacy & Ethics

- Only accesses publicly available LeetCode data
- No passwords or private credentials collected
- No bypass of rate limits, auth walls, or anti-bot systems
- AI assistance analysis is clearly labeled as an **estimate, not proof**
- Code similarity uses careful wording ("Possible Match", not "Copied")
- Career suggestions are **recommendations**, not predictions
- Demo data is clearly separated from real data

---

## ⚠️ Known Limitations

1. **LeetCode API is unofficial** — Uses undocumented GraphQL endpoint; may break if LeetCode changes their API
2. **Recent submissions limited to 20** — LeetCode only exposes the last 20 submissions without authentication
3. **No historical solving times** — Only our built-in timer provides accurate timing data
4. **Code similarity requires app-submitted code** — Cannot access code from LeetCode directly without auth
5. **AI detection is estimation only** — Based on patterns, not definitive proof
6. **Rate limited** — Max 3 requests per 10 seconds to LeetCode API
7. **SQLite for development** — Switch to PostgreSQL for production by changing Prisma datasource

---

## 🗄️ Database Schema

9 models covering users, profiles, problems, sessions, submissions, and analysis results:

- **User** — Basic user info with role (student/mentor)
- **LeetCodeProfile** — Synced profile data
- **Problem** — Problem metadata (title, difficulty, tags)
- **UserProblem** — User's solved problems with attempts
- **ProblemSession** — Timer sessions (start, end, pauses)
- **CodeSubmission** — User-submitted code
- **SimilarityResult** — Code comparison results
- **AIAnalysis** — AI assistance analysis records
- **CareerAnalysis** — Career recommendation snapshots

---

## 🛠️ Development

```bash
# Type check
npx tsc --noEmit

# Lint
npx next lint

# Build
npx next build

# Prisma studio (database browser)
npx prisma studio
```

---

## 📝 License

MIT

---

Built with ❤️ for the coding community.
