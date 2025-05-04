# Music Campaign Admin Dashboard

An admin dashboard application for managing music campaigns. Built with:

- **Frontend**: React + TypeScript + Shadcn/UI
- **Backend**: Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM

---

## 🌍 Live Demo

🔗 [https://music-campaign-dashboard.netlify.app](https://music-campaign-dashboard.netlify.app)

> **Login Credentials:**
> - **Email**: uzair.aziz34@gmail.com  
> - **Password**: 12341234

---

## 🧑‍💻 Branches

- **`main`**: Backend with **Express + TypeScript** (no tRPC)
- **`feature/trpc-integration`**: Backend with **Express + tRPC + TypeScript**

---

## 🚀 Deployment

### 🔧 Backend (Express + TypeScript)

- Deployed on **Render**
- Auto-deploys from the `main` branch
- Contains REST APIs connected to Supabase DB
- Build & start scripts specified in `package.json`

### 🎨 Frontend (React + TypeScript)

- Deployed on **Netlify**
- Connected to root repo and pointed to frontend directory
- Auto-deploys from `main` branch
- Custom build command and publish directory specified in Netlify settings

---

## 📂 Folder Structure

```bash
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   └── ...
├── backend/           # Express + TypeScript backend
│   ├── src/
│   └── ...
├── drizzle/           # Drizzle ORM config & migrations
├── supabase/          # Supabase SQL and seed data
└── README.md
```

---

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Shadcn/UI
- **Backend**: Express, TypeScript (with optional tRPC)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Auth**: Supabase Auth
- **Hosting**: Netlify (frontend), Render (backend)

---

## 📦 Install & Run Locally

```bash
# Clone the repository
git clone https://github.com/Ozair007/music-campaign-dashboard.git
cd music-campaign-dashboard

# Install frontend dependencies
cd frontend
npm install
npm run dev

# Install backend dependencies
cd ../backend
npm install
npm run dev
```

# Start Concurrently
In root directory run:
```bash
npm install
npm run install-all
npm run dev
```