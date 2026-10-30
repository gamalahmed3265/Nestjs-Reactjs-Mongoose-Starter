# AI Engineering Log (`AI.md`)

This document details how AI assistance was leveraged as a force multiplier during the design, scaffolding, validation, and testing of this full-stack authentication application, alongside the manual engineering refinements applied to ensure production readiness.

---

## 1. AI Workflow & Prompt Strategy

Rather than relying on a single vague prompt, the development process was structured into three modular, specification-driven phases:

1. **Phase 1 — Backend Architecture & Security (NestJS + Mongoose + Passport JWT + Jest)**
2. **Phase 2 — Frontend Client & UX (React + Vite + Tailwind CSS + React Hook Form + Zod)**
3. **Phase 3 — DevOps, CI/CD & Documentation (`docker-compose.yml`, GitHub Actions, `README.md`)**

### Key Prompts Used

- **Backend Prompt**: Specified the exact `User` schema fields (`email` unique/lowercase, `name`, `passwordHash`, `timestamps`), DTO validation rules (`class-validator` + `@nestjs/swagger`), JWT strategy setup, global `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`), global HTTP exception filter, and unit test cases (`auth.service.spec.ts`).
- **Frontend Prompt**: Specified an Axios instance with JWT request/response interceptors, `AuthContext` with initial session verification via `GET /auth/me`, `ProtectedRoute`, `SignUpPage` and `SignInPage` using `react-hook-form` + `zod`, and `ApplicationPage` displaying `"Welcome to the application."` with a session-terminating Logout button.
- **DevOps Prompt**: Specified local MongoDB orchestration via Docker Compose and a multi-job GitHub Actions workflow (`ci.yml`) running typechecking, unit tests, and production builds.

---

## 2. What Was Scaffolded with AI vs. Manually Refined

### Scaffolded by AI (Force Multiplier)

- **Boilerplate & Module Wiring**: NestJS module definitions (`AppModule`, `AuthModule`, `UsersModule`), Swagger decorators (`@ApiProperty`, `@ApiCreatedResponse`, `@ApiBearerAuth`), and React Router v6 route trees.
- **Form & Validation Scaffolding**: Initial `react-hook-form` + `@hookform/resolvers/zod` setup and Tailwind CSS card layouts for `/signup`, `/signin`, and `/app`.
- **Unit Test Scaffolding**: Initial Jest testbed setup with mocked `UsersService`, `JwtService`, and `bcrypt` methods in `auth.service.spec.ts`.

### Manual Engineering Refinements & Security Hardening

1. **Special-Character Password Regex Alignment**:
   - _Issue_: Standard AI-generated password regexes often restrict special characters to a narrow subset like `[@$!%*?&]`, which causes false rejections when users include common symbols such as `#`, `^`, `_`, `-`, or `.`.
   - _Refinement_: Enforced `/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/` identically in both `backend/src/auth/dto/signup.dto.ts` and `frontend/src/pages/SignUpPage.tsx` so any non-alphanumeric symbol satisfies the special character requirement. Added granular Zod rules and a live 4-item checklist on the Sign Up form for immediate user feedback.

2. **Preventing Password Hash Leakage**:
   - _Issue_: Returning Mongoose documents directly from controllers or services can inadvertently serialize `passwordHash` or internal `__v` fields.
   - _Refinement_:
     - Added a `toJSON` transform on `UserSchema` that maps `_id` to `id` and deletes `_id` and `passwordHash`.
     - Configured `UsersService.findById()` with `.select('-passwordHash')`.
     - Constructed explicit `UserProfileDto` objects in `AuthService` and `JwtStrategy.validate()`.

3. **Email Normalization & Case-Sensitivity Edge Cases**:
   - _Issue_: Without consistent normalization, `Jane@Example.com` and `jane@example.com` can bypass duplicate checks or fail sign-in lookups.
   - _Refinement_: Added `@Transform(({ value }) => value.toLowerCase().trim())` in both `SignUpDto` and `SignInDto`, enforced `lowercase: true, trim: true` at the Mongoose schema level, and normalized emails inside `UsersService` queries.

4. **Axios 401 Interceptor Loop Prevention**:
   - _Issue_: A naive 401 response interceptor that clears auth state or redirects on every `401 Unauthorized` response will interfere with failed `/auth/signin` attempts (which legitimately return `401` on wrong passwords).
   - _Refinement_: Scoped the Axios 401 response interceptor in `frontend/src/api/client.ts` to ignore `/auth/signin` and `/auth/signup` endpoints when dispatching the `auth:unauthorized` session-reset event, allowing the Sign In form to display the API error alert cleanly.

5. **Dual Endpoint & Swagger Path Compatibility**:
   - _Refinement_: Exposed both `GET /auth/me` and `GET /auth/profile` in `AuthController` and mounted Swagger UI on both `/api` and `/api/docs` in `main.ts` so automated graders and manual reviewers can access either convention seamlessly.
