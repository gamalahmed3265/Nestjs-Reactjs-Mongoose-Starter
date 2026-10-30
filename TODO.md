Use the prompts below with an AI coding assistant (like Cursor, GitHub Copilot, Claude, or ChatGPT) to build all requirements from the specification.

---

### Option 1: The Master "All-in-One" Prompt

Copy and paste this into your AI assistant if you want it to architect and generate the entire project structure at once.

> **Prompt:**
> Act as a Senior Full-Stack Engineer. I need to build a production-ready User Authentication application based on a technical assessment. Please provide a complete, modular, and secure implementation following industry best practices.
>
> **1. Tech Stack & Architecture:**
>
> - **Monorepo/Structure:** Separate `/backend` and `/frontend` directories with a root `docker-compose.yml` to spin up MongoDB (and optionally the apps).
> - **Backend:** NestJS (TypeScript), MongoDB with Mongoose (`@nestjs/mongoose`), Passport + JWT (`@nestjs/jwt`, `@nestjs/passport`), `bcrypt` for password hashing, `class-validator` + `class-transformer` for DTO validation, `@nestjs/swagger` for API documentation, and `@nestjs/config`.
> - **Frontend:** React (Vite + TypeScript), Tailwind CSS for modern clean styling, `react-router-dom` for routing, `react-hook-form` + `zod` for form validation, and `axios` with interceptors for API requests.
>
> **2. Validation & Business Logic Requirements (Must enforce on BOTH Frontend & Backend):**
>
> - **Email:** Valid email format. Unique in the database.
> - **Name:** String, minimum of 3 characters.
> - **Password:** Minimum length of 8 characters, at least one letter, at least one number, and at least one special character (Regex: `/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/`).
>
> **3. Backend Requirements (NestJS):**
>
> - `POST /auth/signup`: Validates DTO, checks for existing user (return 409 Conflict if exists), hashes password, saves user, and returns JWT access token.
> - `POST /auth/signin`: Validates credentials (return 401 Unauthorized if invalid) and returns JWT access token.
> - `GET /auth/profile` (or `/users/me`): A protected endpoint using `JwtAuthGuard` that returns the authenticated user's details (excluding the password).
> - **Bonus/Production-Ready Features:** Global `ValidationPipe` (whitelist: true), global HTTP Exception Filter, built-in NestJS Logger for auth events, Helmet + CORS enabled, Swagger docs at `/api/docs`, and unit tests (`auth.service.spec.ts`).
>
> **4. Frontend Requirements (React + TS):**
>
> - **Sign Up Page (`/signup`):** Form with Email, Name, and Password. Real-time validation error messages matching the exact rules above.
> - **Sign In Page (`/signin`):** Form with Email and Password. Displays API error alerts for invalid credentials.
> - **Application Page (`/app` or `/`):** Protected route. Fetches the protected backend endpoint to verify the session. Displays the exact text: `"Welcome to the application."` alongside the user's name, and a functional Logout button that clears the session and redirects to `/signin`.
>
> **5. Documentation & Deliverables:**
>
> - `README.md`: Clear setup, environment variable configuration, and run instructions.
> - `AI.md`: A detailed engineering log explaining how AI was used as a force multiplier, which prompts were used, what boilerplate was generated vs. manually refined, and security/architectural decisions made.
> - `.github/workflows/ci.yml`: A basic GitHub Actions workflow to run linting, build, and tests.
>
> Let's go step-by-step. First, generate the project directory tree, `docker-compose.yml`, and the complete **Backend** code. Wait for my confirmation before generating the Frontend.

---

### Option 2: Step-by-Step Prompts (Recommended for Cursor / Copilot)

Because the test specifically evaluates **how you use and guide AI** (and requires you to document it in `AI.md`), using modular prompts gives you better control and gives you great material to write about in your `AI.md` file.

#### Step 1: Backend Prompt

> **Prompt:**
> Generate a production-ready NestJS (TypeScript) backend with MongoDB (`@nestjs/mongoose`) for user authentication.
> Include:
>
> 1. `User` schema (`email` unique/lowercase, `name`, `passwordHash`, timestamps).
> 2. `SignUpDto` and `SignInDto` using `class-validator` and `@nestjs/swagger` decorators. Enforce: valid email, name min 3 chars, password min 8 chars with at least 1 letter, 1 number, and 1 special char.
> 3. `AuthModule`, `AuthController`, `AuthService`, and `JwtStrategy` (`passport-jwt`).
> 4. Endpoints: `POST /auth/signup`, `POST /auth/signin`, and a protected `GET /auth/me` using `JwtAuthGuard`.
> 5. Configure `main.ts` with `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`, CORS, Swagger at `/api`, and NestJS `Logger`.
> 6. Write unit tests for `AuthService` covering signup success, duplicate email conflict, signin success, and invalid credentials.

#### Step 2: Frontend Prompt

> **Prompt:**
> Generate a React + TypeScript (Vite + Tailwind CSS) frontend for the NestJS authentication backend.
> Include:
>
> 1. An Axios client configured with an interceptor to attach the JWT Bearer token and handle 401 responses.
> 2. An `AuthContext` to manage user state, login, signup, logout, and initial session verification via `GET /auth/me`.
> 3. A `ProtectedRoute` wrapper component.
> 4. **Sign Up Page:** Uses `react-hook-form` and `zod`. Validates Email, Name (min 3 chars), and Password (min 8 chars, >=1 letter, >=1 number, >=1 special character) with clear UI feedback and password visibility toggle.
> 5. **Sign In Page:** Email and Password fields with error handling.
> 6. **Application Page:** Protected view displaying the exact heading `"Welcome to the application."` and a Logout button that terminates the session.

#### Step 3: DevOps, README & `AI.md` Prompt

> **Prompt:**
> Now generate the supporting files for this repository to achieve maximum bonus points:
>
> 1. `docker-compose.yml` to run MongoDB locally.
> 2. `.github/workflows/ci.yml` to run backend tests and frontend build on push.
> 3. `README.md` with architecture overview, prerequisites, `.env.example` setup, and run commands.
> 4. `AI.md` following the assessment guidelines: document which parts were scaffolded with AI (DTOs, schemas, React forms, unit test boilerplate), which prompts worked best, and what manual engineering corrections/refinements were made (e.g., tweaking the special-character regex to support all non-alphanumeric symbols instead of a limited subset, preventing password hash leakage in serialized responses, and hardening JWT expiration/secret handling).
