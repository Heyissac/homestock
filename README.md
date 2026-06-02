<div align="center">

# 🏠 HomeStock

**A smart household inventory manager built as a Progressive Web App**

Track what you have, get alerted when you're running low, and scan products with your phone's camera — all working offline.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline--first-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [Roadmap](#-roadmap)

</div>

---

## 🎯 What is HomeStock?

HomeStock is a **household inventory management PWA** designed to work seamlessly on any device — including iOS — without requiring App Store distribution. It was built as a full-stack portfolio project to demonstrate real-world engineering decisions across the entire development lifecycle.

The app lets households manage their pantry, supplies, and any physical stock across multiple locations ("spaces"), share access with family members, and scan product barcodes to add items instantly.

> **Portfolio note:** This project prioritizes production-grade architecture over feature quantity — every decision (offline-first, multi-space model, strict TypeScript, Docker setup) was made deliberately and is documented in the codebase.

---

## ✨ Features

| Feature | Status |
|---|---|
| JWT Authentication (register / login) | ✅ Phase 1 |
| Multi-space inventory management | ✅ Phase 1 |
| Product CRUD with categories | ✅ Phase 1 |
| Offline-first with IndexedDB | 🔄 Phase 2 |
| Background sync when back online | 🔄 Phase 2 |
| Barcode / QR scanner via camera | 🔄 Phase 3 |
| Open Food Facts integration | 🔄 Phase 3 |
| Low-stock alerts | 📋 Phase 4 |
| Audit log / movement history | 📋 Phase 4 |
| Collaborative spaces with roles | 📋 Phase 4 |

---

## 🛠 Tech Stack

### Frontend
- **React 18** + **TypeScript** — component-driven UI with strict type safety
- **Vite** — fast build tooling and dev server with HMR
- **Tailwind CSS v4** — utility-first styling
- **Vite PWA Plugin** + **Workbox** — service worker and offline caching strategies
- **@zxing/browser** — barcode and QR code scanning via device camera
- **Zod** — runtime schema validation

### Backend
- **Node.js** + **Express** + **TypeScript** — REST API
- **Prisma ORM v7** — type-safe database access with migrations
- **PostgreSQL 16** — relational database
- **JWT** + **bcrypt** — authentication and password hashing
- **Zod** — request validation and error handling

### Infrastructure
- **Docker** + **Docker Compose** — containerized backend and database
- **IndexedDB** — client-side storage for offline-first architecture

---

## 🏗 Architecture

HomeStock follows a **feature-based folder structure** on both frontend and backend — code is organized by domain (auth, spaces, inventory, scanner), not by file type.

```
homestock/
├── frontend/                   # React PWA
│   └── src/
│       ├── features/           # Domain modules
│       │   ├── auth/
│       │   ├── spaces/
│       │   ├── inventory/
│       │   └── scanner/
│       ├── shared/             # Reusable components & hooks
│       └── lib/
│           ├── db/             # IndexedDB layer
│           ├── sync/           # Offline sync queue
│           └── api/            # HTTP client
│
├── backend/                    # Express REST API
│   └── src/
│       ├── features/           # Mirrors frontend domains
│       │   ├── auth/
│       │   ├── spaces/
│       │   └── inventory/
│       ├── middleware/         # Auth, error handling, validation
│       └── shared/             # Zod schemas, shared types
│
└── docker-compose.yml          # Backend + PostgreSQL containers
```

### Offline-first data flow

```
User action
    │
    ▼
IndexedDB (source of truth on client)
    │
    ├─── online ──▶ sync queue ──▶ REST API ──▶ PostgreSQL
    │
    └─── offline ─▶ queued locally, synced when connection restores
```

### Data model highlights

- **Multi-space:** one user can belong to multiple independent spaces (e.g. Home, Cabin) with role-based access (Owner / Editor / Viewer)
- **Audit trail:** every stock change is recorded as a `Movement` for full history tracking
- **Soft barcode:** barcodes are not unique globally — the same product can exist in different spaces with independent quantities

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/homestock.git
cd homestock
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in your values:

```env
DB_USER=homestock_user
DB_PASSWORD=your_password
DB_NAME=homestock_db
JWT_SECRET=your_super_secret_key
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://homestock_user:your_password@localhost:5432/homestock_db
```

### 3. Start the backend and database

```bash
docker-compose up --build
```

### 4. Run database migrations

In a second terminal:

```bash
cd backend
npx prisma migrate dev
```

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Testing on iPhone:** expose the frontend with `npx vite --host` and access it via your local network IP, or use [ngrok](https://ngrok.com/) for a public tunnel.

---

## 📋 Roadmap

- **Phase 1** — Auth + Spaces + Product CRUD *(in progress)*
- **Phase 2** — Offline-first with IndexedDB + background sync
- **Phase 3** — Barcode scanner + Open Food Facts integration
- **Phase 4** — Low-stock alerts + movement history + collaborative permissions

---

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome. Feel free to open an issue if you spot something worth improving.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>Built with care by a fullstack developer learning in public.</sub>
</div>
