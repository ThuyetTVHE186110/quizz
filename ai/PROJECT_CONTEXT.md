# Project Context

Quizizz MVP is an npm workspaces monorepo for a lightweight Quizizz-style product. `apps/web` owns authoring, hosting, joining, playing, leaderboard, and results flows. `apps/api` owns quiz, session, answer, and scoring behavior. `packages/contracts` is the shared contract boundary. `packages/shared` contains the standalone in-memory activity log.

## Target stack

- `apps/web`: React, TypeScript, Vite, React Router, TanStack Query, Zustand
- `apps/api`: NestJS, TypeScript, REST, Socket.IO
- `packages/contracts`: shared HTTP, socket, and domain types
- `packages/shared`: shared activity-log utilities with injected dependencies

## Core domain entities

- `Quiz`
- `Question`
- `QuestionOption`
- `GameSession`
- `Player`
- `PlayerAnswer`
- `LeaderboardEntry`

## Non-negotiable rules

1. The backend is the source of truth for correctness, scoring, and session state.
2. Correct answers, `answerKey`, and `isCorrect` must never reach a player before that player submits.
3. Shared request, response, domain, and socket contracts live in `packages/contracts`.
4. Time is always injected into `packages/shared`; never read the system clock directly there.
5. Future implementation work must identify fewer than ten relevant files before coding.
