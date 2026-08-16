# SENTINEL API DOCUMENTATION

Base Endpoint Prefix: `/api`

Authentication: HTTP-Only Cookie (`token`) or `Authorization: Bearer <token>`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "name": "Dr. Evelyn Vance",
    "email": "evelyn@example.com",
    "password": "SecurePassword123!",
    "role": "ANALYST"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid",
        "name": "Dr. Evelyn Vance",
        "email": "evelyn@example.com",
        "role": "ANALYST"
      },
      "token": "jwt_token_string"
    }
  }
  ```

### `POST /api/auth/login`
Authenticates existing credentials.
- **Request Body**:
  ```json
  {
    "email": "analyst@sentinel.demo",
    "password": "SentinelDemo123!"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "user": { ... },
      "token": "jwt_token_string"
    }
  }
  ```

### `POST /api/auth/logout`
Destroys authenticated cookie session.

### `GET /api/auth/me`
Returns details of the currently authenticated user session.

---

## 2. Scam Patterns Endpoints (`/api/scams`)

### `GET /api/scams`
Retrieves registered scam patterns with optional filters.
- **Query Parameters**:
  - `search`: Full-text search string
  - `riskTier`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
  - `fraudType`: `IDENTITY_THEFT`, `ONBOARDING_FRAUD`, `ACCOUNT_TAKEOVER`, `SOCIAL_ENGINEERING`, `DEVICE_FRAUD`, `TRANSACTION_FRAUD`
  - `status`: `ACTIVE`, `HISTORICAL`, `UNDER_REVIEW`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "title": "Device-Switching Session Hijack",
        "slug": "device-switching-session-hijack",
        "riskTier": "CRITICAL",
        "fraudType": "ACCOUNT_TAKEOVER",
        "behavioralRedFlags": ["Mid-session user-agent jump"],
        "protectionTips": ["Enforce biometric re-auth"]
      }
    ]
  }
  ```

### `POST /api/scams` (Admin Only)
Creates a new scam pattern.

### `PATCH /api/scams/:id` (Admin Only)
Updates an existing scam pattern.

### `DELETE /api/scams/:id` (Admin Only)
Deletes a scam pattern.

---

## 3. Suspicious Activity Reports (`/api/reports`)

### `POST /api/reports` (Public Access)
Submits a public incident report.
- **Request Body**:
  ```json
  {
    "reporterName": "Marcus Brody",
    "reporterEmail": "marcus@example.com",
    "fraudType": "DEVICE_FRAUD",
    "description": "Unauthorized login alert from Frankfurt Linux machine.",
    "evidence": "IP 185.220.101.5"
  }
  ```

### `GET /api/reports` (Analyst & Admin Only)
Retrieves submitted reports.

### `PATCH /api/reports/:id` (Analyst & Admin Only)
Updates report status (`NEW`, `UNDER_REVIEW`, `CONFIRMED`, `DISMISSED`).

---

## 4. Suspicious Sessions (`/api/sessions`)

### `GET /api/sessions` (Analyst & Admin Only)
Paginated list of suspicious sessions with risk scoring.
- **Query Parameters**: `search`, `riskTier`, `status`, `page`, `limit`

### `GET /api/sessions/:id` (Analyst & Admin Only)
Detailed session investigation view with behavioral signals and analyst notes.

### `PATCH /api/sessions/:id/status` (Analyst & Admin Only)
Updates case status (`CONFIRMED_FRAUD`, `CONFIRMED_LEGITIMATE`, `NEEDS_MORE_INFO`, `IN_REVIEW`).
Automatically logs an immutable `AuditLog` entry.

### `POST /api/sessions/:id/notes` (Analyst & Admin Only)
Adds an internal analyst investigation note.

---

## 5. Dashboard & Model Health (`/api/dashboard`)

### `GET /api/dashboard/stats`
Returns high-level KPI metrics (Pre-transaction fraud %, False positive %, Time-to-decision, Onboarding completion %).

### `GET /api/dashboard/trends`
Returns 7-day fraud trends, risk distribution, and signal frequency datasets for Recharts rendering.

### `GET /api/dashboard/model-health`
Returns pipeline status across Known Pattern Model, Anomaly Model, Unified Engine, DB, and API.

### `POST /api/dashboard/model-health/toggle`
Simulates toggling Anomaly Detection model OFFLINE/ONLINE to demonstrate deterministic fallback.
