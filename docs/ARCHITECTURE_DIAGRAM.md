# SoulSync Architecture & Sequence Diagrams

---

## 1. System Context Architecture

```mermaid
graph TD
    Client[React 19 + Vite Frontend] -->|HTTP REST APIs| Server[Express.js Node Backend]
    Client -->|WebSockets| SocketServer[Socket.IO Server]
    Server -->|Mongoose ODM| Mongo[(MongoDB Atlas)]
    Server -->|Vector Alg Engine| Engine[Cosine + Jaccard + Haversine Engine]
    Server -->|Emails & Verification| Brevo[Brevo SMTP / Nodemailer]
    Server -->|Photo Storage| Cloudinary[Cloudinary CDN]
```

---

## 2. Authentication Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Client
    participant API as Auth Controller
    participant DB as MongoDB User
    participant Email as Email Service

    User->>Client: Enter Email & Password
    Client->>API: POST /api/auth/register
    API->>DB: Check if email exists & Create User
    API->>Email: Send Account Verification OTP / Token
    API-->>Client: Return JWT AccessToken & User Context
    Client->>User: Redirect to Profile & Questionnaire Page
```

---

## 3. 5D Compatibility Matching Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Client
    participant Engine as Match Engine
    participant DB as MongoDB Profiles & Matches

    User->>Client: Request Matches
    Client->>Engine: GET /api/matches
    Engine->>DB: Fetch My Profile & Candidate Profiles
    Engine->>Engine: 1. Cosine Similarity (35% Personality)
    Engine->>Engine: 2. Jaccard Index (25% Interests)
    Engine->>Engine: 3. Lifestyle Weight Matrix (20%)
    Engine->>Engine: 4. Age Range Penalty (10%)
    Engine->>Engine: 5. Haversine Distance (10%)
    Engine->>DB: Cache Top Ranked Matches in Match Collection
    Engine-->>Client: Return Top 20 Candidates with Sub-score Breakdown
    Client->>User: Display Match Cards & Score Modal
```

---

## 4. Socket.IO Real-Time Chat Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor UserA
    participant ClientA as User A Client
    participant Socket as Socket.IO Server
    participant DB as MongoDB Messages
    participant ClientB as User B Client
    actor UserB

    UserA->>ClientA: Type and send message
    ClientA->>Socket: emit('send_message', {chatId, message})
    Socket->>DB: Create Message & Update Chat lastMessage
    Socket->>ClientB: emit('receive_message', newMessage)
    ClientB->>UserB: Display Live Message & Sound Alert
```
