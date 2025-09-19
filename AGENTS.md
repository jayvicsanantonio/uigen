# Repository Guidelines

## Project Structure & Module Organization
- Core Next.js routes live in `src/app` using the App Router; server-side actions sit under `src/actions`.
- Shared UI resides in `src/components` (e.g., `src/components/chat`), reusable hooks in `src/hooks`, and utilities in `src/lib`.
- Generated preview artifacts live in `src/generated`; Prisma schema, migrations, and local SQLite database sit in `prisma/`.
- Tests are co-located beside features within `__tests__` folders, such as `src/components/editor/__tests__/file-tree.test.tsx`.

## Build, Test & Development Commands
- `npm run setup` installs dependencies, regenerates Prisma client code, and applies pending migrations—rerun after schema edits.
- `npm run dev` starts the Turbopack dev server at `http://localhost:3000` with hot reloading.
- `npm run build` compiles the production bundle; follow with `npm run start` to sanity-check it locally.
- `npm run lint` runs ESLint with the Next.js config; resolve warnings before opening a PR.
- `npm run test` executes the Vitest + Testing Library suite in interactive mode.
- `npm run db:reset` resets the SQLite database, handy when migrations drift during development.

## Coding Style & Naming Conventions
- Use TypeScript with 2-space indentation, trailing commas, and grouped imports that mirror existing modules.
- React components and hooks use PascalCase (`ChatInterface`), while action files follow kebab-case (`get-projects.ts`).
- Tailwind CSS utilities are applied inline; avoid bespoke CSS unless a utility is missing.
- Run `npm run lint` (and your editor’s Prettier integration) prior to committing to keep diffs minimal.

## Testing Guidelines
- Favor Vitest with Testing Library to cover component behavior; name specs `*.test.ts(x)` and mirror source structure under `__tests__`.
- Focus on user-centric scenarios—rendering, interactions, and error states—and add regression cases when fixing bugs.
- Mock browser-only APIs via JSDOM helpers; avoid hitting external services in unit tests.

## Commit & Pull Request Guidelines
- Follow the existing history with imperative, capitalized commit messages (e.g., `Add`, `Fix`, `Update`).
- PR descriptions should outline motivation, summarize key changes, reference issues, and paste `npm run lint`/`npm run test` results.
- Attach UI screenshots or recordings when altering user-facing flows, and call out Prisma migrations explicitly.

## Environment & Data Tips
- Create `.env` locally and set `ANTHROPIC_API_KEY` when you need live component generation; the app falls back to static data otherwise.
- Local data persists in `prisma/dev.db`, which is gitignored—avoid checking in generated databases or logs.
