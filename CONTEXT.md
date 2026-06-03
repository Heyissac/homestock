# HomeStock — Project Context

> Paste this file at the start of a new chat to restore full project context.

---

## What is HomeStock?

A household inventory manager PWA (Progressive Web App) designed to run on iOS from a Windows development environment. Dual purpose: a real functional tool and a fullstack portfolio piece.

**GitHub:** https://github.com/Heyissac/homestock

---

## Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS v4 — configured via `@tailwindcss/vite` plugin (no tailwind.config.js, no CLI init)
- vite-plugin-pwa + Workbox — offline service worker
- @zxing/browser — barcode/QR scanner via camera
- Zod — client-side validation

### Backend
- Node.js + Express + TypeScript
- Prisma ORM v7 + PostgreSQL 16
- JWT + bcrypt — authentication
- Zod — server-side validation

### Infrastructure
- Docker + Docker Compose — backend + database containers
- IndexedDB — offline-first client storage

---

## Project Structure

```
homestock/
├── frontend/
│   └── src/
│       ├── features/
│       │   ├── auth/
│       │   ├── spaces/
│       │   ├── inventory/
│       │   └── scanner/
│       ├── shared/
│       └── lib/
│           ├── db/         (IndexedDB)
│           ├── sync/       (offline sync queue)
│           └── api/        (HTTP client)
├── backend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── spaces/
│   │   │   └── inventory/
│   │   ├── middleware/
│   │   └── shared/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── prisma.config.ts
│   │   └── migrations/
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
├── docker-compose.yml
├── .env                    (git-ignored, must be created manually)
├── .env.example
├── .gitignore
└── README.md
```

---

## Current State

### Done
- [x] Full monorepo scaffolded with feature-based folder structure
- [x] Vite + React 18 + TypeScript frontend initialized
- [x] Tailwind CSS v4 configured via `@tailwindcss/vite` plugin
- [x] Backend with Express + TypeScript configured
- [x] Docker Compose with PostgreSQL 16 and containerized backend
- [x] Prisma v7 fully configured with `prisma.config.ts`
- [x] Full schema defined: `User`, `Space`, `SpaceMember`, `Category`, `Product`, `Movement`, `Role`, `MovementType`
- [x] Initial database migration applied (`20260602014105_init`)
- [x] GitHub repository live with professional README, badges, topics, MIT license

### Next — Phase 1: Auth Feature
- [ ] `npx prisma generate` — generate Prisma client (required before writing any DB code)
- [ ] `backend/src/shared/types/auth.schemas.ts` — Zod schemas for register and login
- [ ] `backend/src/features/auth/auth.service.ts` — business logic: create user, verify password, sign JWT
- [ ] `backend/src/features/auth/auth.controller.ts` — handle request, call service, return response
- [ ] `backend/src/features/auth/auth.routes.ts` — POST /api/auth/register and POST /api/auth/login
- [ ] `backend/src/middleware/auth.middleware.ts` — verify JWT on protected routes
- [ ] Connect routes in `src/index.ts`
- [ ] Frontend login/register forms connected to the API

---

## MVP Phases

| Phase | Focus | Status |
|---|---|---|
| 1 | Auth + Spaces + Product CRUD | 🔄 In progress |
| 2 | Offline-first + IndexedDB + background sync | 📋 Pending |
| 3 | Barcode scanner + Open Food Facts | 📋 Pending |
| 4 | Low-stock alerts + movement history + roles | 📋 Pending |

---

## Environment Variables

### `homestock/.env` (root — for Docker Compose)
```env
DB_USER=homestock_user
DB_PASSWORD=homestock_pass
DB_NAME=homestock_db
JWT_SECRET=cambia_esto_por_un_secreto_seguro
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://homestock_user:homestock_pass@localhost:5432/homestock_db
```

### `homestock/backend/.env` (for Prisma CLI commands from Windows)
Same values as above.

---

## How to Start a Work Session

```bash
# 1. Open Docker Desktop and wait for it to start

# 2. From homestock/ root — start backend + database
docker-compose up

# 3. In a second terminal — start frontend
cd frontend
npm run dev

# 4. Open http://localhost:5173 in browser
# 5. Backend health check: http://localhost:3000/health
```

## How to End a Work Session

```bash
# Stop containers (data is preserved in postgres_data volume)
docker-compose down

# NEVER use docker-compose down -v — this deletes the database volume
```

---

## Critical Version-Specific Gotchas (already solved)

- **Tailwind CSS v4:** No `init` command. Config is done via `@tailwindcss/vite` plugin. `src/index.css` only needs `@import "tailwindcss"`.
- **Prisma v7:** `url` property removed from `schema.prisma` — lives in `prisma.config.ts` under `datasource.url`. No `migrate` block in config. No `earlyAccess` property.
- **Docker:** `.env` must live in the project root (`homestock/`), not just in `backend/`.
- **Docker healthcheck:** `pg_isready` requires both `-U` and `-d` flags to work correctly.
- **Windows/Git:** Line ending warnings resolved with `git config core.autocrlf true`.

---

## Key Architecture Decisions

- **Offline-first:** IndexedDB is the client source of truth. Data syncs to PostgreSQL when connection is restored.
- **Feature-based structure:** Code organized by domain (auth, spaces, inventory, scanner) on both frontend and backend — mirrors each other intentionally.
- **Multi-space model:** One user can belong to multiple independent spaces with role-based access (Owner/Editor/Viewer).
- **Audit trail:** Every stock change is recorded as a `Movement` — history tracking from day one.
- **Business logic in services:** Controllers only handle HTTP — all logic lives in service files.

---

## Developer Context

- Junior fullstack developer
- Windows development environment with Docker
- Testing on iPhone via local network or ngrok tunnel
- No Apple ecosystem — distributing as PWA only
- Prefers clear explanations of *why*, not just *what*
