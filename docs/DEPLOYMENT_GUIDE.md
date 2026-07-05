# SoulSync Deployment & Setup Guide

This guide details step-by-step instructions for deploying the **Partner Matching Web Platform** to **Render** (Backend Server & Socket.IO), **Vercel** (Frontend Client), and **MongoDB Atlas** (Cloud Database).

---

## ☁️ 1. MongoDB Atlas Database Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User and obtain your connection URI.
3. Replace `<password>` in your connection string:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/partner_match?retryWrites=true&w=majority
   ```

---

## 🖥️ 2. Render Deployment (Backend Server)

1. Sign in to [Render](https://render.com) and create a **Web Service**.
2. Connect your GitHub repository: `https://github.com/sakibisactive/Partner-Matching-Web-Platform.git`
3. Configure settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables on Render:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *Your MongoDB Atlas Connection String*
   - `JWT_SECRET`: *Random secret string*
   - `JWT_REFRESH_SECRET`: *Random secret string*
   - `CLIENT_URL`: `https://your-vercel-app.vercel.app`
   - `SMTP_USER`: *Your Brevo SMTP email*
   - `SMTP_PASS`: *Your Brevo SMTP key*

---

## ⚡ 3. Vercel Deployment (Frontend Client)

1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository: `https://github.com/sakibisactive/Partner-Matching-Web-Platform.git`
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy the application.

---

## ✉️ 4. Brevo Email Integration (OTP Verification)

1. Register at [Brevo (Sendinblue)](https://www.brevo.com).
2. Go to **Transactional Emails & SMTP** to retrieve your API Key / SMTP credentials:
   - Host: `smtp-relay.brevo.com`
   - Port: `587`
   - User: `your_email@domain.com`
   - Pass: `your_smtp_key`
