# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository: uigen (Next.js 15, React 19, TypeScript, Tailwind v4, Prisma/SQLite, Vercel AI SDK)

Common commands
- Prerequisites: Node.js 18+, npm. Uses npm (package-lock.json present).
- Setup (installs deps, generates Prisma client to src/generated/prisma, runs migrations):
  ```bash path=null start=null
  npm run setup
  ```
- Development (Turbopack):
  ```bash path=null start=null
  npm run dev
  ```
- Production build/start:
  ```bash path=null start=null
  npm run build
  npm run start
  ```
- Lint:
  ```bash path=null start=null
  npm run lint
  ```
- Test (Vitest, jsdom):
  ```bash path=null start=null
  npm test
  ```
- Run a single test file or pattern, or run once without watch:
  ```bash path=null start=null
  npm test -- src/lib/__tests__/file-system.test.ts
  npm test -- --run
  ```
- Database utilities (Prisma + SQLite):
  ```bash path=null start=null
  npm run db:reset           # Reset DB and re-run migrations
  npx prisma generate        # Regenerate Prisma client (to src/generated/prisma)
  npx prisma migrate dev     # Apply migrations locally
  ```

Important environment notes
- ANTHROPIC_API_KEY is optional. If absent, the app uses a MockLanguageModel that simulates AI-driven file edits via tools (see src/lib/provider.ts). With a valid key, Anthropic Claude is used via @ai-sdk/anthropic.
- JWT_SECRET (optional in development) is used for cookie-based sessions (see src/lib/auth.ts). In production, set a strong value.

High-level architecture
- Next.js App Router
  - Pages and routes live under src/app. Root layout at src/app/layout.tsx, entry at src/app/page.tsx. A dynamic project route exists at src/app/[projectId]/page.tsx. API streaming chat endpoint at src/app/api/chat/route.ts.
  - Middleware at src/middleware.ts protects specific API endpoints (e.g., /api/projects, /api/filesystem) by verifying a JWT session cookie.

- AI-driven code generation flow
  - Chat UI uses the Vercel AI SDK on the client via useChat (src/lib/contexts/chat-context.tsx). Requests POST to /api/chat with current virtual filesystem state and optional projectId.
  - Server handler (src/app/api/chat/route.ts) prepends a system prompt (src/lib/prompts/generation), selects a model (src/lib/provider.ts), and calls streamText with tool definitions:
    - str_replace_editor (src/lib/tools/str-replace.ts): text editor operations on the virtual filesystem (view, create, replace, insert).
    - file_manager (src/lib/tools/file-manager.ts): rename/move and delete for files/directories (recursively creates parents when renaming).
  - Tool calls are executed client-side by FileSystemContext (src/lib/contexts/file-system-context.tsx), which delegates to the in-memory VirtualFileSystem (src/lib/file-system.ts) and updates the editor/preview.
  - On finish, if a projectId is provided and a session exists, the server persists messages and serialized VFS to Prisma (Project.data/messages).

- Virtual filesystem (core to live preview)
  - src/lib/file-system.ts implements an in-memory tree with file CRUD, directory traversal, path normalization, rename/move (with parent creation), and helpers to serialize/deserialize a map of nodes.
  - The FileSystemContext wraps a VirtualFileSystem instance, exposes helpers (create/update/delete/rename/get/list/reset), and handles AI tool call plumbing. It also auto-selects /App.jsx or the first root-level file for preview selection.

- Authentication and session
  - Stateless sessions are JWTs stored in a cookie (src/lib/auth.ts). Server Actions (src/actions/index.ts) implement signUp/signIn/signOut, hashing passwords with bcrypt, and issue cookies. Middleware verifies the token on protected API routes.

- Persistence (Prisma + SQLite)
  - Schema (prisma/schema.prisma) defines User and Project. Project stores chat messages and the serialized VFS JSON. SQLite file at prisma/dev.db. Prisma client is generated into src/generated/prisma and consumed via src/lib/prisma.ts (with globalThis caching in dev).

- UI and client state
  - src/components contains UI (e.g., chat, editor, preview, auth, ui). src/hooks exposes reusable hooks (e.g., use-auth). src/app/main-content.tsx drives the core layout for anonymous users; authenticated users are redirected to their latest project (src/app/page.tsx).

Testing setup
- Vitest with jsdom is configured in vitest.config.mts, with vite-tsconfig-paths and @vitejs/plugin-react. Tests are colocated under __tests__ directories (e.g., src/lib/__tests__/file-system.test.ts).

Key conventions and notes from CLAUDE.md and AGENTS.md
- Commands: Prefer the scripts already provided (dev/build/start/lint/test/setup/db:reset). Single-test execution uses npm test -- <pattern> and optionally -- --run for a single pass.
- Directory conventions: src/app (routes), src/actions (server actions), src/components (feature-organized UI), src/lib (contexts, tools, utilities), src/generated (generated Prisma client), prisma/ (schema and migrations).
- AI tools contract: str_replace_editor and file_manager are the only tool interfaces the model uses to manipulate the VFS; ensure arguments match the schemas in src/lib/tools.
- After editing the Prisma schema, rerun npm run setup (or npx prisma generate && npx prisma migrate dev) to refresh the client and database.

References (paths)
- Next config: next.config.ts
- TypeScript config: tsconfig.json (paths alias @/* -> ./src/*)
- ESLint: .eslintrc.json (extends "next")
- Prisma client: src/generated/prisma
- Prisma schema: prisma/schema.prisma
- API chat route: src/app/api/chat/route.ts
- Provider selection and mock model: src/lib/provider.ts
- Tools: src/lib/tools/str-replace.ts, src/lib/tools/file-manager.ts
- VFS and contexts: src/lib/file-system.ts, src/lib/contexts/file-system-context.tsx, src/lib/contexts/chat-context.tsx
