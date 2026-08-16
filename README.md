# 🛡️ SENTINEL — Behavioral Fraud Intelligence Platform

> **Tagline:** Detect fraud by understanding behavior — not just what people submit.

Sentinel is a production-grade full-stack behavioral fraud intelligence platform. Rather than relying solely on static identity checks or rigid IF-THEN rules, Sentinel analyzes real-time interaction patterns — typing cadence, field corrections, navigation trajectories, device switching, session timing, and transaction velocity — to provide explainable decision support for human fraud analysts.

---

## 🔑 Core Philosophy & Guarantee

> **"Does this behavior look consistent with legitimate human behavior?"**

- **Human-in-the-Loop:** Sentinel v1 **NEVER autonomously blocks** a customer. It routes suspicious sessions to fraud analysts for decision support.
- **Zero Keystroke Content Capture:** Sentinel never captures passwords, keystroke content, or sensitive field values — only anonymized interaction timing and vector dynamics.
- **Explainable Risk Scoring:** Every score (0–100) displays exact contributing signal weights (+24, +20, +18) rather than black-box opacity.

---

## ⚡ Demo Account Credentials

Use these pre-configured credentials to test all roles in the application:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@sentinel.demo` | `SentinelDemo123!` | Full System, User Mgmt, Scam Pattern CRUD, Audit Logs |
| **ANALYST** | `analyst@sentinel.demo` | `SentinelDemo123!` | Command Center, Session Triage, Case Status Updates |
| **PUBLIC USER** | `user@sentinel.demo` | `SentinelDemo123!` | Scam Database Search, Incident Reporting |

*Note: Use the **Demo Accounts** dropdown in the navigation header to switch roles instantaneously during live demonstrations.*

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS (Custom Command Center Cyber Theme)
- **State & Data Fetching:** TanStack Query (React Query) + React Context
- **Data Visualization:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form + Zod

### Backend
- **Runtime:** Node.js + Express + TypeScript
- **Database ORM:** Prisma ORM
- **Authentication:** HTTP-Only Cookies + JWT + Bcryptjs
- **Security:** Helmet, CORS, Audit Logging Engine
- **Risk Engine:** Deterministic Explainable Risk Model (`DeterministicRiskModel`)

### Database
- **SQLite / PostgreSQL:** Pre-configured with Prisma ORM and seed scripts. Includes `docker-compose.yml` for PostgreSQL deployment.

---

## 🚀 Quick Start Guide

### 1. Installation
Install all client and server dependencies:
```bash
npm run install:all
```
*(Or `npm install` inside `/server` and `/client` directories)*

### 2. Database Migration & Seeding
Initialize database schema and seed realistic demo dataset (15 Scam Patterns, 30 Suspicious Sessions including Session #48291, 100+ Behavioral Signals, 8 Incident Reports, Audit Logs):
```bash
npm run db:migrate
npm run db:seed
```

### 3. Launch Development Server
Start both Client (`http://localhost:5173`) and Express API Server (`http://localhost:5000`):
```bash
npm run dev
```

---

## 🎯 Hackathon Live Demo Flow (3–5 Mins)

1. **Step 1 — Landing Page:** Open `http://localhost:5173`. Highlight hero tagline *"Fraud doesn't always look suspicious. Behavior does."* Watch Session #48291 animate live to **87 / 100 CRITICAL**.
2. **Step 2 — Interactive Flowchart:** Scroll to *"How Sentinel Works"*. Click nodes (*SESSION → SIGNALS → RISK ENGINE*) to reveal technical specs.
3. **Step 3 — Scam Database:** Navigate to `/scams`. Search for `device switching`, filter by `CRITICAL` risk tier, and open the detailed threat intelligence modal.
4. **Step 4 — Submit Incident Report:** Go to `/report`. Submit a suspicious activity form and see instant database confirmation.
5. **Step 5 — Analyst Command Center:** Switch role to **Analyst** via header dropdown or login as `analyst@sentinel.demo`. Open `/dashboard`.
6. **Step 6 — Investigate Session #48291:** Click Session #48291 in the triage table. Inspect contributing signals (+24 Device Switch, +20 Velocity, +18 Fast Completion). Add an analyst note and click **Confirm Fraud**.
7. **Step 7 — Model Health Fallback Simulation:** Navigate to the *Model Health* tab on the dashboard. Toggle **Anomaly Detection OFFLINE**. Observe the graceful fallback message: *"Anomaly detection unavailable. Sentinel is operating using known-pattern detection + deterministic rules."*
8. **Step 8 — Admin Audit Trail:** Switch role to **Admin**. Navigate to `/admin`. Inspect the immutable system audit logs documenting the analyst case update.

---

## 📚 API Reference

See complete API documentation in [`docs/API.md`](./docs/API.md).
