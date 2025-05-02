# Music Campaign Admin Dashboard

A modern full-stack admin dashboard for managing music campaigns, built with:

-  React + Vite + TypeScript (frontend)
-  Node.js + tRPC + Drizzle ORM + Supabase (backend)
-  TailwindCSS + shadcn/ui (UI)
-  Supabase Storage (image upload)
-  Deployed via Vercel

---

## Features

-  Admin login via Supabase Auth (email/password)
-  Create, update, delete, and list campaigns
-  Upload campaign banners with image preview + fallback
-  Basic stats (campaign count, active campaigns)
-  Responsive, modern UI with shadcn/ui
-  SPA routing with React Router

---

## Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Frontend    | React, Vite, TypeScript       |
| UI          | Tailwind CSS, shadcn/ui       |
| Backend     | Node.js, tRPC, Express        |
| Database    | Supabase (PostgreSQL)         |
| ORM         | Drizzle ORM                   |
| Auth        | Supabase Auth                 |
| File Upload | Supabase Storage              |
| Deployment  | Vercel                        |

---

## Project Structure

├── frontend/ # React + Vite
│ ├── src/
│ └── dist/
├── backend/ # Node + tRPC API
│ ├── src/
│ └── supabase/ # Drizzle schema & types
├── vercel.json # Routing config for Vercel

---

## Getting Started (Local Setup)

### 1. Clone the Repo

```bash
git clone https://github.com/Ozair007/music-campaign-dashboard.git
cd music-campaign-dashboard
```

### 2. Install Dependencies

- Frontend
cd frontend
npm install

- Backend
cd ../backend
npm install

# Supabase Setup

  Go to https://supabase.io and create a project.

  Enable Email Auth under Authentication.

  Create a table called campaigns with these columns:

| Column      | Type      | Notes                            |
| ----------- | --------- | -------------------------------- |
| id          | uuid      | PK, default: `gen_random_uuid()` |
| title       | text      | Required                         |
| brand       | text      | Required                         |
| start\_date | date      | Required                         |
| end\_date   | date      | Required                         |
| budget      | numeric   | Required                         |
| image\_url  | text      | Optional                         |
| description | text      | Optional                         |
| created\_at | timestamp | Default: `now()`                 |
| updated\_at | timestamp | Default: `now()`                 |

Create a public storage bucket named campaigns.

Enable Row Level Security (RLS) on the table.

Create policies:
    INSERT → true
    SELECT → true
    UPDATE → true

# Environment Variables

- frontend/.env

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

- backend/.env

DATABASE_URL=your-supabase-postgres-connection-url

Ensure special characters in the URL (e.g., @, /, :) are URL-encoded!

# Local Dev Scripts
- Frontend

```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
```
- Backend

```bash
cd backend
npm run dev        # Start Express + tRPC backend
```

# Deployment (Vercel)

This project includes a vercel.json to deploy both frontend + backend.
Vercel Config Summary
  Frontend: frontend/ → Vite static build
  Backend: backend/src/server.ts → tRPC + Express API
  Routes:
      /trpc/* → backend API
      / and all SPA paths → frontend/dist/index.html
Steps
    Connect this repo to Vercel
    Add the following environment variables:
        Frontend:
            VITE_SUPABASE_URL
            VITE_SUPABASE_ANON_KEY
        Backend:
            DATABASE_URL
    Deploy!
