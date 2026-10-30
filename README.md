# Full-Stack User Authentication Application (NestJS + React + MongoDB)

A production-ready, full-stack user authentication system built with **NestJS**, **MongoDB (Mongoose)**, **Passport JWT**, **React (Vite + TypeScript)**, and **Tailwind CSS**.

---

## 1. Architecture & Tech Stack

### Project Directory Structure
```text
.
├── .github/workflows/ci.yml   # GitHub Actions CI pipeline (lint, test, build)
├── docker-compose.yml         # Local MongoDB 7.0 container with healthcheck
├── README.md                  # Setup & architecture documentation
├── AI.md                      # Engineering log of AI usage, prompts, and refinements
├── backend/                   # NestJS REST API
│   ├── .env.example
│   ├── src/
│   │   ├── main.ts            # Helmet, CORS, ValidationPipe, Global Exception Filter, Swagger
│   │   ├── app.module.ts      # ConfigModule & MongooseModule setup
│   │   ├── common/filters/    # AllExceptionsFilter with structured error logging
│   │   ├── users/             # Mongoose User schema & UsersService
│   │   └── auth/              # AuthModule, AuthController, AuthService, JwtStrategy, DTOs, Unit Tests
└── frontend/                  # React (Vite + TypeScript + Tailwind CSS) SPA
    ├── .env.example
    └── src/
        ├── api/client.ts      # Axios instance with Bearer JWT & 401 interceptors
        ├── context/           # AuthContext (session initialization via GET /auth/me)
        ├── components/        # ProtectedRoute guard component
        └── pages/             # SignUpPage, SignInPage, ApplicationPage
```

### Key Features
- **Strict Shared Validation Rules (Frontend + Backend)**:
  - **Email**: Valid email format, normalized (`lowercase` + `trim`), unique index in MongoDB.
  - **Name**: Minimum 3 characters.
  - **Password**: Minimum 8 characters, at least 1 letter, 1 number, and 1 special character (`/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/`).
- **Security Hardening**:
  - Passwords hashed using `bcrypt` (12 salt rounds).
  - Mongoose `toJSON` schema transform and explicit projection prevent `passwordHash` leakage in serialized responses.
  - HTTP security headers applied via `helmet`.
  - Global `ValidationPipe` configured with `whitelist: true` and `forbidNonWhitelisted: true` to strip/reject unexpected payload properties.
- **API Documentation**:
  - Interactive OpenAPI / Swagger UI available at both `/api/docs` and `/api`.

---

## 2. Prerequisites

- **Node.js** `>= 18.x` (Node 20+ recommended)
- **npm** `>= 9.x`
- **Docker & Docker Compose** (or a local/Atlas MongoDB instance)

---

## 3. Quick Start & Setup Instructions

### Step 1: Start MongoDB
From the repository root, start the MongoDB container:
```bash
docker compose up -d
```

### Step 2: Configure & Run the Backend
```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```
- **Backend URL**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/api/docs` (also accessible at `http://localhost:3000/api`)

#### Backend Environment Variables (`backend/.env`)
| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port for the NestJS HTTP server |
| `MONGODB_URI` | `mongodb://localhost:27017/auth_assessment` | MongoDB connection string |
| `JWT_SECRET` | `super-secret-production-jwt-key-change-me` | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | `1d` | JWT token expiration window |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin(s), comma-separated |

### Step 3: Configure & Run the Frontend
Open a second terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
- **Frontend URL**: `http://localhost:5173`

#### Frontend Environment Variables (`frontend/.env`)
| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:3000` | Base URL of the NestJS backend API |

---

## 4. API Endpoints

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | No | Registers a new user (`201 Created`) or returns `409 Conflict` if email exists. Returns `{ accessToken, user }`. |
| `POST` | `/auth/signin` | No | Authenticates user credentials (`200 OK`) or returns `401 Unauthorized`. Returns `{ accessToken, user }`. |
| `GET` | `/auth/me` | Yes (`Bearer JWT`) | Returns the authenticated user's profile (excluding `passwordHash`). |
| `GET` | `/auth/profile` | Yes (`Bearer JWT`) | Alias for `/auth/me` returning the authenticated user's profile. |

---

## 5. Running Tests & Production Builds

### Backend Unit Tests
```bash
cd backend
npm test
```

### Production Builds
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

# Nestjs-Reactjs-Mongoose-Starter
