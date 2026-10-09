# UStudent — Student Academic Portal Demo

A responsive student-facing frontend prototype inspired by the supplied UStudent dashboard reference. The project uses React, Vite, TypeScript, Tailwind CSS, React Router, Recharts, Lucide React, React Hook Form, Zod, date-fns, and Sonner.

## Features

- Dashboard with academic summary cards, subject attendance analytics, attendance distribution, semester SGPA trend, upcoming events, and message previews.
- Attendance summary, subject-level detail routes, date-wise session history, filters, CSV export, and threshold indicators.
- Semester results for four completed demo semesters and one in-progress semester; published results include SGPA/CGPA examples, a configurable illustrative grading model, CSV export, and print action.
- Interactive academic calendar with month/week/agenda views, category filters, event detail dialogs, and browser-local event creation.
- Editable profile, sample payment history and printable demo receipt and sample receipt download, inbox/sent messages, mark-as-read state, local compose flow, Explore resources, account preferences, and Coming Soon routes.
- Protected routes and browser-only demo authentication; global search; user dropdown; sample notifications; responsive mobile sidebar.
- Centralized fictional demo data and domain services designed to be replaceable by API-backed implementations.

## Setup

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`). On Windows PowerShell, copy the environment template with `Copy-Item .env.example .env` if needed.

## Demo login

- Student ID: `STU-2026-1042`
- Password: `Student@123`

Use **Use demo account** on the login page to populate the sample credentials. The authentication is only a local demo flag and is not suitable for production.

## Build and type checking

```bash
npm run typecheck
npm run build
npm run preview
```

## Architecture

- `src/app/App.tsx` — central route configuration.
- `src/components/layout/` — shared sidebar, topbar and application shell.
- `src/components/ui/` — reusable buttons, cards, badges, modals, stat cards and empty states.
- `src/pages/` — main portal pages.
- `src/data/demo/` — fictional student, subject, attendance, results, calendar, message, payment and notification datasets.
- `src/services/index.ts` — domain service abstraction and demo adapter. Some demo-created changes are stored in local storage.
- `src/services/apiClient.ts` — centralized typed JSON REST client with normalized errors and AbortSignal support.
- `src/config/appConfig.ts` — common attendance threshold, grading reference, demo credentials and API configuration.
- `src/features/auth/` — simulated auth context and protected route.

## Backend integration plan

1. Set `VITE_API_BASE_URL` in `.env` to the backend's API base URL.
2. Replace domain functions in `src/services/index.ts` with API-backed implementations that retain their existing return contracts.
3. Add API DTOs and server-side authentication/session handling; do not use the current demo login for production.
4. Set `VITE_DATA_MODE=api` as your own provider-selection flag when you implement the API adapter. The current project deliberately stays in demo mode unless the services are changed.

`apiClient.ts` is a reusable foundation, but the current service methods do not make live API requests. No database or real university system is connected.

## Demo data rules

Every student identity, subject, attendance record, mark, transaction, message and calendar notice is fictional or illustrative. Holiday entries are not confirmed institutional closures. The illustrative grading bands are documented in `src/config/appConfig.ts` and result code. The sample current semester stays `In Progress`; grades are pending rather than invented.

## Notes

- User profile edits, newly created calendar events, message read state, compose items, preferences, and simulated login state are browser-local.
- No real payment gateway, email delivery, official records, or production authentication is included.
- `npm run build` performs TypeScript checks and creates a production bundle.
