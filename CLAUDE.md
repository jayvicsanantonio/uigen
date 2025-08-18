# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run dev` - Start development server with Turbopack at http://localhost:3000
- `npm run dev:daemon` - Start dev server in background, logs to logs.txt
- `npm run build` - Build production version
- `npm run start` - Start production server

### Database
- `npm run setup` - Full setup: install dependencies, generate Prisma client, run migrations
- `npm run db:reset` - Reset database and re-run migrations
- `npx prisma generate` - Generate Prisma client (output to src/generated/prisma)
- `npx prisma migrate dev` - Run database migrations

### Testing & Quality
- `npm test` - Run tests with Vitest
- `npm run lint` - Run ESLint

### Single Test Execution
- `npm test -- <test-file-pattern>` - Run specific test files
- `npm test -- --run` - Run tests once without watch mode

## Architecture Overview

### Core Concept
UIGen is an AI-powered React component generator that creates components in a virtual file system with live preview. Users describe components via chat, and Claude generates React/TypeScript code that renders in real-time.

### Key Architectural Components

**Virtual File System (`src/lib/file-system.ts`)**
- In-memory file system that mimics real filesystem operations
- Handles file CRUD operations, directory traversal, serialization/deserialization
- Files never touch actual disk during development
- Integrates with AI tools for file manipulation

**Chat Interface with AI Tools**
- Uses Anthropic Claude via Vercel AI SDK
- Two custom tools: `str_replace_editor` and `file_manager`
- Tools allow AI to create, modify, and manage files in virtual filesystem
- Streaming responses with tool call execution

**Live Preview System**
- Components render immediately in preview frame
- Uses Babel standalone for runtime JSX transformation
- Monaco Editor for syntax highlighting and editing
- Hot reload when files change

**Database Schema (Prisma + SQLite)**
- `User`: Authentication (email/password with bcrypt)
- `Project`: Stores chat messages and virtual filesystem state as JSON
- Anonymous users get temporary projects, registered users get persistence

### Context System
**FileSystemContext** (`src/lib/contexts/file-system-context.tsx`)
- Manages virtual filesystem state across components
- Handles tool call integration from AI responses
- Auto-selects App.jsx or first root file when available
- Provides file CRUD operations to UI components

**ChatContext** (`src/lib/contexts/chat-context.tsx`)
- Manages chat state and AI interactions
- Handles message history and streaming responses
- Integrates with project persistence

### Directory Structure Patterns
- `src/actions/` - Server actions for database operations
- `src/components/` - UI components organized by feature (chat/, editor/, preview/, auth/)
- `src/lib/` - Core utilities, contexts, tools, and business logic
- `src/app/` - Next.js App Router pages and API routes
- `prisma/` - Database schema and migrations

### Technology Stack Specifics
- **Next.js 15** with App Router and React 19
- **TypeScript** throughout
- **Tailwind CSS v4** for styling
- **Radix UI** components for accessible UI primitives
- **Vitest + Testing Library** for testing with jsdom environment
- **Monaco Editor** for code editing experience
- **Prisma** with SQLite for data persistence

### AI Integration Details
The system uses a prompt-driven approach where Claude receives:
1. System prompt with component generation instructions
2. Current virtual filesystem state
3. Chat history
4. Access to file manipulation tools

Claude can create entire React applications with multiple files, handle imports/exports, and maintain file relationships within the virtual environment.