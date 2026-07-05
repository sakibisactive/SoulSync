# 🚀 SoulSync Production Deployment Guide (Render & Vercel)

This document contains step-by-step instructions to deploy **SoulSync** to production using **Render** (Node.js Express + Socket.IO backend) and **Vercel** (React 19 + Vite frontend).

---

## 📦 1. Backend Deployment on Render

### Step 1: Create a New Web Service on Render
1. Sign in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ Select **Web Service**.
3. Connect your GitHub repository: `https://github.com/sakibisactive/SoulSync.git`

### Step 2: Configure Build & Runtime Settings
- **Name**: `soulsync-api`
- **Region**: Oregon (US West) or nearest region
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Step 3: Add Environment Variables in Render Dashboard
Under the **Environment** tab, add the following key-value pairs:

| Key | Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Server Port |
| `NODE_ENV` | `production` | Production mode |
| `MONGO_URI` | `mongodb+srv://shahriarsakib1205_db_user:y0mzgXHLYhMVEhCp@cluster0.nyysnze.mongodb.net/partner_match?retryWrites=true&w=majority` | MongoDB Atlas Cloud Connection String |
| `JWT_SECRET` | `super_secret_jwt_key_partner_match_2026` | JWT Token Secret |
| `JWT_REFRESH_SECRET` | `super_secret_refresh_key_partner_match_2026` | JWT Refresh Secret |
| `CLIENT_URL` | `https://soulsyncbd.vercel.app` (Or `*` for unrestricted CORS) | CORS Origin |
| `SMTP_HOST` | `smtp-relay.brevo.com` | Brevo Host |
| `SMTP_PORT` | `587` | Brevo Port |
| `SMTP_USER` | `b0e13d001@smtp-brevo.com` | Brevo User |
| `SMTP_PASS` | `<YOUR_BREVO_SMTP_KEY>` | Brevo SMTP Key |
| `EMAIL_FROM` | `"SoulSync Support" <b0e13d001@smtp-brevo.com>` | Sender Email |

Click **Create Web Service**. Your backend API will be live at `https://soulsync-api.onrender.com`.

---

## ⚡ 2. Frontend Deployment on Vercel

### Step 1: Import Project on Vercel
1. Sign in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository: `https://github.com/sakibisactive/SoulSync.git`

### Step 2: Configure Project Settings
- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Add Rewrite Proxy Rule for Production (Vite / Express)
Create or ensure `client/vercel.json` exists with rewrite rules to proxy `/api` and `/socket.io` requests to your Render URL:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://soulsync-api.onrender.com/api/:path*"
    },
    {
      "source": "/socket.io/:path*",
      "destination": "https://soulsync-api.onrender.com/socket.io/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Click **Deploy**. Your frontend will be live on Vercel at `https://soulsync.vercel.app`!

---

## 🔐 3. Default Master Admin Credentials

- **Admin Login Page**: `http://localhost:5173/login` or `https://soulsync.vercel.app/login`
- **Admin Email**: `admin@findtruluv.com`
- **Admin Password**: `findtruluvwithsakib`
