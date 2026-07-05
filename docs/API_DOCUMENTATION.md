# SoulSync - REST API Documentation

Base URL: `http://localhost:5000/api` (Local) | `https://your-app.onrender.com/api` (Production)

---

## 🔐 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account & create default profile |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT access/refresh tokens |
| `POST` | `/api/auth/verify-email` | Public | Verify user account email with token |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/api/auth/reset-password` | Public | Reset password using valid token |
| `GET` | `/api/auth/me` | Protected | Fetch current user & profile details |

---

## 👤 2. Profile Management (`/api/profile`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `PUT` | `/api/profile/me` | Protected | Update basic details, location, and lifestyle choices |
| `PUT` | `/api/profile/personality` | Protected | Submit/update answers to 50 Likert-scale questions |
| `PUT` | `/api/profile/interests` | Protected | Update selected interest tags |
| `PUT` | `/api/profile/preferences` | Protected | Update target age, gender, max distance, and goals |
| `POST` | `/api/profile/photos` | Protected | Upload or add profile picture URL |
| `GET` | `/api/profile/user/:userId` | Protected | View public profile of a user |

---

## 🧠 3. Matching Engine (`/api/matches`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/matches` | Protected | Compute and return Top 20 ranked compatibility matches |
| `POST` | `/api/matches/compute` | Protected | Trigger recalculation of compatibility vectors |
| `GET` | `/api/matches/:targetUserId` | Protected | Fetch detailed 5D sub-score breakdown for a candidate |

---

## 💖 4. Social & Likes (`/api/likes`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/likes` | Protected | Like a user's profile (triggers mutual match check) |
| `POST` | `/api/likes/save` | Protected | Save profile to bookmarks |
| `GET` | `/api/likes` | Protected | Fetch all likes given and received |
| `DELETE` | `/api/likes/:id` | Protected | Remove like / saved bookmark |

---

## 💬 5. Real-Time Chat & Messages (`/api/messages`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages/chats` | Protected | Fetch user's active conversations |
| `GET` | `/api/messages/:chatId` | Protected | Fetch full message history for a chat room |
| `POST` | `/api/messages` | Protected | Send direct text message (triggers Socket event) |

---

## 🔍 6. Discover & Search (`/api/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/discover` | Protected | Search profiles with age, gender, location, sorting & pagination |

---

## 🛡️ 7. Admin Control Center (`/api/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Admin | Get list of all registered users |
| `PATCH` | `/api/admin/ban/:id` | Admin | Toggle ban/active status for a user |
| `PATCH` | `/api/admin/verify/:id` | Admin | Grant verified checkmark badge |
| `DELETE` | `/api/admin/user/:id` | Admin | Permanently delete user and profile |
| `GET` | `/api/admin/reports` | Admin | View safety report moderation queue |
| `PATCH` | `/api/admin/reports/:reportId` | Admin | Update report status to resolved |
| `POST` | `/api/admin/interests` | Admin | Create system interest tag |
| `DELETE` | `/api/admin/interests/:id` | Admin | Delete system interest tag |
| `GET` | `/api/admin/analytics` | Admin | Fetch system analytics (users, matches, reports) |
