# Implementation Plan: Quizizz MVP

## Technical Context

- npm workspaces monorepo using TypeScript.
- React, Vite, React Router, TanStack Query, Zustand, Tailwind CSS.
- NestJS, Prisma, PostgreSQL, Socket.IO.
- Vitest for shared/web tests and Jest for API tests.

## Architecture

`apps/web` owns browser workflows organized by feature. `apps/api` owns domain modules and all correctness/scoring decisions. `packages/contracts` defines shared request, response, domain, and socket payloads. `packages/shared` contains the standalone activity log. PostgreSQL persists quiz and game data; application services remain independently testable through repositories.

## Delivery Phases

1. Foundation, contracts, activity log, quiz and question CRUD.
2. Session lifecycle and player join over HTTP.
3. Answer validation/scoring, then Socket.IO transport.
4. Leaderboard, results, complete web flows, documentation.

## Security And Errors

- Map validation failures to HTTP 400, missing resources to 404, conflicts to 409.
- Build player question DTOs from allowlisted fields only.
- Validate all API inputs globally and reject unknown fields.
- Store only irreversible redaction placeholders in the activity log.

## Verification

Each phase begins with failing behavior tests. Run package-targeted tests during development, then `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run build` at the workspace root. Run a Playwright desktop/mobile smoke journey against the final app.

## Constitution Check

The design uses shared contracts, domain-focused modules, test-first delivery, no speculative abstractions, and explicit AI context routing. No constitution exception is required.