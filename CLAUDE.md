# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Animal Shelter Manager — based on the open-source [Animal Shelter Manager](https://sheltermanager.com/site/en_home.html) project. Full-stack app with React + Vite frontend and Python stdlib backend using SQLite.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, React Router, TanStack Query, shadcn/ui (Radix UI), Tailwind CSS, Recharts
- **Backend**: Python 3 stdlib (no framework), SQLite, http.server with threading
- **Build**: Bun/npm, Vitest for tests, ESLint

## Development Commands

```bash
npm run dev        # Start Vite dev server (port 8080, proxies /api to backend)
npm run backend    # Start Python backend (port 8000)
npm run build      # Production build
npm run lint       # ESLint check
npm test           # Run Vitest tests (single run)
npm run test:watch # Watch mode for tests
```

## Architecture

### Backend (`src/backend/server.py`)
- ThreadingHTTPServer with BaseHTTPRequestHandler
- SQLite at `data/shelter.db` (auto-created on first run with seed data)
- RESTful endpoints: `/api/animals`, `/api/medical-records`, `/api/financial`, `/api/reports`, `/api/dashboard`
- Supports CORS, JSON body parsing

### Frontend (`src/`)
- `src/lib/api.ts` — typed API client (`shelterApi` object) wrapping fetch calls
- `src/hooks/use-shelter-api.ts` — TanStack Query hooks for data fetching
- `src/pages/` — route page components (Dashboard, Animals, AnimalDetails, AddAnimal, Medical, Financial, Reports, Settings)
- `src/components/AppLayout.tsx` — main layout with sidebar nav
- `src/types/shelter.ts` — shared TypeScript types

### API Proxy
Vite dev server proxies `/api/*` → `http://127.0.0.1:8000`. Both must run simultaneously for full-stack development.

### Route Structure
```
/                   → Dashboard
/animals            → Animal list
/animals/add        → Add new animal form
/animals/:id        → Animal detail
/animals/:id/edit   → Edit animal form
/medical            → Medical records
/financial          → Financial data
/reports            → Reports list
/settings           → Settings page
```

## Important Notes

- Backend auto-initializes DB with seed data on first run (6 animals, medical records, financial entries, activities)
- The `src/asm3/`, `src/web062/`, `src/web070/` directories contain unrelated archived iterations
