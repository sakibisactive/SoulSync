# 💖 SoulSync - Partner Matching Web Platform (MERN Stack)

SoulSync is a full-stack, production-quality compatibility-based partner matching web application powered by the **MERN Stack** (MongoDB, Express, React 19, Node.js), **TypeScript**, **Redux Toolkit + RTK Query**, **TailwindCSS**, **Socket.IO**, and a multi-dimensional weighted compatibility engine.

---

## 🚀 Key Features

- 🧠 **5-Dimensional Weighted Matching Engine**:
  - **35% Personality Similarity** (Cosine similarity across 50 Likert-scale questions)
  - **25% Interest Similarity** (Jaccard similarity index)
  - **20% Lifestyle Similarity** (Weighted matching matrix for Smoking, Drinking, Exercise, Diet, Pets)
  - **10% Age Preference Alignment** (Inside preferred range with gradual decay)
  - **10% Location Preference** (Haversine formula distance calculation)
- 🔐 **Authentication & Authorization**: JWT Access/Refresh tokens, bcrypt password hashing, HTTP-only secure cookies, and Role-Based Access Control (`Guest`, `User`, `Admin`).
- 💬 **Real-Time Messaging & Presence**: Socket.IO powered instant chat, typing indicators, online status, read receipts, and push-like notifications.
- 🖼️ **Rich Profile Management**: Multi-photo upload powered by Cloudinary and Multer, customizable preferences, interests, and profile details.
- 🛡️ **Admin Moderation & Analytics Queue**: Dashboard with active users, daily registrations, report queues, user banning, and interest tag management.
- 🎨 **Modern Design System**: Rich dark-mode visual hierarchy, glassmorphism, responsive grid layout, and Framer Motion micro-animations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: TailwindCSS + Custom Glassmorphism
- **Animations**: Framer Motion
- **Form Handling & Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js + Express.js + TypeScript
- **Database**: MongoDB + Mongoose ODM
- **Real-Time Engine**: Socket.IO
- **Security**: JWT, bcryptjs, Helmet, CORS, Express Rate Limit
- **File Storage**: Cloudinary + Multer
- **Email**: Brevo (Nodemailer API integration)

---

## 📁 Repository Structure

```
partner-match/
├── client/          # Vite + React 19 + Redux Toolkit Frontend
├── server/          # Node.js + Express + Socket.IO Backend
├── docs/            # Architecture diagrams, API specifications, and database schemas
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/sakibisactive/Partner-Matching-Web-Platform.git
cd "Partner Matching Web Platform"

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Running Locally

```bash
# Start backend server (Port 5000)
cd server
npm run dev

# In a separate terminal, start frontend client (Port 5173)
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.
