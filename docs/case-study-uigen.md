# UIGen: AI-Powered React Component Generator with Live Preview
**Timeline:** 2025-06-26 – 2025-08-17 • **Stack:** Next.js 15, React 19, TypeScript, Claude AI • **Repo:** uigen

> **Executive summary:** Built a complete AI-powered React component generator from scratch in ~7 weeks. Users describe components via chat, Claude generates TypeScript/React code that renders immediately in a virtual filesystem with live preview. Achieved 100% test pass rate (186/186 tests) with comprehensive test coverage and sub-1s build times using Next.js 15 with Turbopack.

## Context

UIGen addresses the gap between AI code generation and interactive development environments. Rather than generating static code snippets, it provides a complete development experience where users can iterate on React components through natural language conversation while seeing real-time visual feedback. This serves developers who want to rapidly prototype UI components without context-switching between AI tools and their development environment.

## Problem

Existing AI code generation tools produce static code that requires manual setup, lacks immediate visual feedback, and doesn't maintain context across iterations. Developers waste time copying code between tools, setting up preview environments, and losing conversation context when refining components.

## Constraints

- 7-week development timeline from initial commit to full feature set
- Single developer implementation
- No existing codebase or legacy constraints
- Required offline capability (works without API key using static fallbacks)
- Browser compatibility requirements for live code execution
- SQLite database for simplicity and portability

## Options Considered

**1. Server-side rendering approach** - Generate components on server, return HTML
- Trade-offs: Simpler security model but no interactivity, limited preview capabilities
- Rejected: Doesn't provide true development experience

**2. Static file system** - Generate actual files on disk
- Trade-offs: Familiar developer workflow but requires file system permissions, cleanup complexity
- Rejected: Security concerns and deployment complexity

**3. Virtual file system with in-memory execution** - Chosen approach
- Trade-offs: More complex implementation but provides secure, portable solution with immediate feedback
- Selected: Best balance of functionality, security, and user experience

**4. WebContainers vs Babel standalone** - For code execution
- Trade-offs: WebContainers provide full Node.js environment but significantly larger bundle size
- Selected Babel standalone: Lighter weight, sufficient for React component compilation

## Implementation Highlights

• **Virtual File System Architecture** (`src/lib/file-system.ts:1`) - In-memory filesystem with full CRUD operations, serialization for persistence, and real-time synchronization with UI components. Enables secure code execution without disk access.

• **AI Tool Integration** (`src/lib/tools/`:1`) - Custom `str_replace_editor` and `file_manager` tools allowing Claude to manipulate virtual files through structured API calls. Maintains chat context while providing file operation capabilities.

• **Runtime JSX Transformation** (`src/lib/transform/jsx-transformer.ts:1`) - Babel standalone integration for client-side TypeScript/JSX compilation. Handles module resolution, import/export statements, and error boundaries for safe code execution.

• **Streaming AI Responses with Tool Calls** (`src/app/api/chat/route.ts:1`) - Vercel AI SDK integration with Anthropic Claude, supporting streaming responses and tool call execution. Enables real-time file updates during AI code generation.

• **Context-Aware File Management** (`src/lib/contexts/file-system-context.tsx:1`) - React context managing virtual filesystem state, auto-selecting root components (App.jsx preference), and propagating file changes across preview and editor components.

• **Monaco Editor Integration** (`src/components/editor/`:1) - Full-featured code editor with TypeScript language support, syntax highlighting, and file tree navigation. Maintains editor state across file switches and integrates with virtual filesystem.

• **Database Schema Design** (`prisma/schema.prisma:24`) - Simple two-table design storing chat messages and filesystem state as JSON. Supports both anonymous (temporary) and registered user projects with cascade deletion.

## Validation

Testing strategy followed TDD principles with comprehensive coverage:
- **Unit tests**: 186 tests across core modules (file system, transformers, contexts)
- **Integration tests**: React component testing with Testing Library and jsdom
- **Build validation**: Next.js production build with TypeScript strict mode
- **Performance**: Sub-1s test suite execution, 6s production build time
- **Browser compatibility**: Babel standalone ensures Safari/Chrome parity for JSX execution

Test artifacts stored in [docs/artifacts/test-results-2025-09-18.txt](docs/artifacts/test-results-2025-09-18.txt) and [docs/artifacts/build-report-2025-09-18.txt](docs/artifacts/build-report-2025-09-18.txt).

## Impact (Numbers First)

| Metric | Before | After | Delta | Source |
|---|---:|---:|---:|---|
| Test coverage | N/A | 186/186 tests | 100% pass | docs/artifacts/test-results-2025-09-18.txt |
| Build time | N/A | 6.0s | Initial | docs/artifacts/build-report-2025-09-18.txt |
| Test execution | N/A | 982ms | Sub-1s | docs/artifacts/test-results-2025-09-18.txt |
| Bundle size (First Load JS) | N/A | 101kB shared + route-specific | Optimized | docs/artifacts/build-report-2025-09-18.txt |
| Component generation | Manual coding | AI + live preview | Instant iteration | README.md:51 |

## Risks & Follow-ups

**Immediate risks:**
- Virtual filesystem state loss on browser crashes (mitigated by project persistence)
- Claude API rate limits for heavy usage (fallback to static mode available)
- Client-side code execution security (sandboxed via Babel standalone)

**Technical debt:**
- No CI/CD pipeline configured (GitHub Actions recommended)
- Missing E2E tests for full user workflows
- Component export functionality partially implemented

**Next priorities:**
1. GitHub Actions CI/CD setup
2. Playwright E2E test suite
3. Component library integration (import from npm packages)
4. Multi-file project templates

## Collaboration

**Solo development** - Single developer implementation covering full-stack architecture, AI integration, testing strategy, and documentation. No external dependencies or cross-team coordination required.

## Artifacts

- [Source code](src/) - Complete Next.js application with TypeScript
- [Test results](docs/artifacts/test-results-2025-09-18.txt) - Full test suite output
- [Build report](docs/artifacts/build-report-2025-09-18.txt) - Production build metrics
- [Database schema](prisma/schema.prisma) - User and project models
- [API documentation](src/app/api/chat/route.ts) - AI chat endpoint implementation
- [Component architecture](src/components/) - UI component library

## Appendix: Evidence Log

- Commit d7f0176 (2025-06-26): Initial project setup with Next.js 15, Prisma, basic structure
- Commit 67db75a (2025-08-17): Added Claude configuration, comprehensive documentation
- package.json:1: Project metadata, dependencies, scripts
- README.md:1: Feature overview, setup instructions, tech stack
- CLAUDE.md:1: Detailed architecture documentation and development commands
- src/lib/file-system.ts:1: Virtual filesystem implementation with 60 unit tests
- Test results: 9 test files, 186 tests passing, 982ms execution time
- Build results: Successful compilation, 6.0s build time, optimized bundle sizes
