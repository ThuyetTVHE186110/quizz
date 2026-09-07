# Quizizz — SDD Quiz App

A small web app for quizzing yourself on Spec-Driven Development (SDD): load a
set of questions, answer them one at a time, submit, and see a scored
breakdown with per-question explanations.

## Running it

Prerequisites: Node.js 22+ and npm.

```bash
# from the repo root
npm install

# set up the database (SQLite, via Prisma)
cd apps/api
copy .env.example .env   # on Windows; DATABASE_URL="file:./dev.db"
npx prisma migrate dev
npx prisma db seed

# start the API (from apps/api)
npm run build
node dist/main.js
# API listens on http://localhost:3000

# in a second terminal, start the web app (from apps/web)
npm run dev
# Web app on http://localhost:5173
```

## Running the tests

```bash
# from the repo root
npm run test --workspaces --if-present
```

A healthy run reports all suites green:

- `apps/api` — Jest, 8 tests (quiz scoring, safe question payloads, NestJS boilerplate)
- `packages/shared` — Vitest, 13 tests (`ActivityLog`, one per `REQ-###` in `spec/activity-log.md`)
- `packages/contracts` — Vitest, 6 tests (player-safe payload contracts)

`apps/web` has no automated tests yet — see `docs/agent-evidence.md` for that
gap and others found in review.

## How it's built

- **`apps/api`** — NestJS + Prisma (SQLite). `QuizModule` exposes
  `GET /quiz/questions` (questions without answer keys) and
  `POST /quiz/submit` (scores answers, returns per-question explanations and a
  rounded `percentage`). `prisma/seed.ts` seeds ten SDD questions.
- **`apps/web`** — React + Vite. `App.tsx` is a single-page, one-question-at-a-time
  quiz flow with a progress bar and a results screen.
- **`packages/shared`** — `ActivityLog`, the mandatory in-memory audit
  component described in `spec/activity-log.md`. Framework-agnostic, no
  database or UI.
- **`packages/contracts`** — Shared TypeScript types and "player-safe payload"
  tests, reused across API and web.
- **`.github/agents`, `.github/skills`, `SPEC-DRIVEN-DEVELOPMENT.md`,
  `HACKATHON-GUIDE.md`** — the reusable hackathon framework (five custom
  agents, the architecture-slide skill, and the take-home method guide),
  imported unchanged.

## Decisions

The activity log spec (`spec/activity-log.md`) left four points deliberately
open. What was decided, and why, in full under *Decisions* in that file:

- **REQ-003 (tie ordering):** entries sort by timestamp descending; ties
  break by reverse insertion order, deterministically, across repeated
  queries.
- **REQ-004 (what's sensitive):** metadata keys matching `password`, `token`,
  `secret`, `apiKey`, or `authorization` (case-insensitive, checked
  recursively through nested objects) are replaced with `[REDACTED]`,
  irreversibly.
- **REQ-005 (range bounds):** time ranges are inclusive at both `start` and
  `end`.
- **REQ-006 (empty result):** an unknown actor and a known actor with no
  activity return the same empty array — the log does not distinguish them.

## Known gaps

- No e2e test exercises `/quiz/questions` or `/quiz/submit` over real HTTP —
  only the unit-level service is tested.
- `ActivityLog` redaction does not descend into arrays (e.g. sensitive keys
  nested inside `metadata.events[]` are not redacted).
- No automated test coverage for the web app.

Full detail on how these were found: `docs/agent-evidence.md`.
