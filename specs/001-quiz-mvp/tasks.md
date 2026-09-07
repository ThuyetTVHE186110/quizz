# Tasks: Quizizz MVP

- [ ] **T001 Foundation:** Configure npm workspaces, TypeScript, linting, formatting, Docker PostgreSQL, environment examples, and shared scripts.
- [ ] **T002 Framework:** Import hackathon agents, architecture skill, SDD guide, and resolved activity-log specification.
- [ ] **T003 AI Context:** Add project context, architecture, domain, coding rules, repository map, current state, story map, and implementation pattern docs.
- [ ] **T004 Contracts:** Define quiz, question, session, player, answer, leaderboard, result, and socket contracts with tests for player-safe payloads.
- [ ] **T005 Activity Log:** Test `REQ-001` through `REQ-007` red-first and implement the in-memory log in `packages/shared`.
- [ ] **T006 Quiz Domain:** Test and implement Prisma schema plus quiz/question CRUD and publish endpoints.
- [ ] **T007 Session Domain:** Test and implement session creation, six-digit code generation, join, waiting room, and self-paced/realtime modes over HTTP.
- [ ] **T008 Answer Domain:** Test and implement answer validation, idempotency, scoring, persistence, and safe question projection.
- [ ] **T009 Realtime:** Test and implement Socket.IO room, player, question, leaderboard, and completion events as a transport over services.
- [ ] **T010 Results:** Test and implement deterministic leaderboard and final result endpoints.
- [ ] **T011 Web App:** Implement responsive admin editor, home/join, host room, player game, leaderboard, and result routes using shared contracts.
- [ ] **T012 Documentation:** Complete README, architecture diagram, API/run instructions, story statuses, and current state.
- [ ] **T013 Validation:** Run tests, typecheck, lint, build, database smoke checks, and Playwright desktop/mobile journeys.
- [ ] **T014 Publish:** Commit the complete repository, merge the implementation branch to `main`, create public GitHub repo `quizz`, and push.