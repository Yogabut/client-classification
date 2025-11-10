

## 🧾 **`ClientsDesk CRM`**

A modern **Client Relationship Management (CRM)** web app built with **React + TypeScript**, designed to help teams manage clients, leads, tasks, and sales pipelines efficiently.  
Built by **Yoga Asta**

---

## 🌐 Overview

ClientsDesk CRM gives businesses the tools they need to organize client data, track interactions, schedule reminders, and analyze sales insights — all in one sleek dashboard.

This system is fully modular, easy to maintain, and scalable for agencies, startups, and sales teams.

---

## 🚀 Features

### 🔐 Authentication
- Secure Register & Login
- JWT-based auth
- Role-based access (Admin, Sales, Marketing)

### 👤 Profile
- Edit user info (name, email, phone)
- Upload profile picture
- Change password
- Activity log (recent logins & actions)

### 📊 Dashboard
- Overview of client pipeline
- Filter & search clients
- Analytics chart (lead conversion, revenue, etc.)
- Quick notes & interaction logs
- Reminder system for follow-ups

### 🧾 Clients Management
- CRUD clients (add, edit, delete)
- Classify by **country, status, and lead stage**
- Track client interaction history

### 🧠 Tasks & Reminders
- Assign reminders to specific clients
- Integration-ready (Google Calendar / Email)

### ⚙️ Admin Panel
- Manage users and roles
- View activity logs

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TypeScript + Vite |
| **UI Library** | TailwindCSS + Shadcn/UI + Lucide Icons |
| **State Management** | Context API / React Query *(optional)* |
| **Routing** | React Router DOM |
| **Backend (optional)** | Express.js + MySQL (or Supabase) |
| **Auth** | JWT-based Authentication |
| **Deployment** | Vercel / Railway / Netlify |
| **Version Control** | Git + GitHub |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/clientsdesk-crm.git
cd clientsdesk-crm
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ClientsDesk
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

The app will run on [http://localhost:5173](http://localhost:5173)

---

## 🧱 Folder Structure

```
src/
├── assets/              # Images, icons, etc.
├── components/          # Reusable UI components
├── contexts/            # AuthContext, ThemeContext, etc.
├── pages/               # Dashboard, Clients, Profile, etc.
├── routes/              # Route configurations
├── lib/                 # Helper functions, utils
├── styles/              # Tailwind + global styles
└── main.tsx             # Entry point
```

---

## 🧠 Developer Notes

* Sidebar can collapse / expand dynamically.
* “ClientsDesk” text uses gradient color from `#FDCFFA → #D78FEE`.
* Built with modularity in mind for future integrations (AI assistant, data analytics, etc.).
* Design follows modern CRM layout principles (Notion + Hubspot inspired).

---

## 🪴 SEO Optimization

* Custom meta tags in `/index.html`
* Open Graph image → `/public/og-image.png`
* `favicon.ico` ready in `/public`

---

## 📦 Deployment

### 🚀 Vercel

```bash
npm run build
vercel deploy
```

### 🚀 Netlify

```bash
npm run build
netlify deploy
```

### 🚀 Railway (Fullstack)

* Deploy backend API on Railway
* Connect frontend to backend URL (`VITE_API_URL`)

---

## 💡 Future Improvements

* AI lead scoring system
* Email integration (auto follow-up)
* Dashboard analytics with Recharts
* Role-based permissions UI
* Mobile-friendly version

---

## 👨‍💻 Author

**Yoga Asta**
💌 Email: [yoga.asta.pra@gmail.com](mailto:yogaasta@example.com)
🌍 Bali, Indonesia

> “Turning ideas into scalable digital systems — one project at a time.”

---
