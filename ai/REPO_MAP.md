# Repository Map

Use this as a routing table. Several locations below are planned by `specs/001-quiz-mvp/tasks.md` and do not exist yet in the current workspace.

## `apps/api/src/modules/quiz`

- Responsible for quiz CRUD and publish behavior.
- Read when working on quiz creation, updates, publish rules, or quiz DTOs.
- Do NOT read for answer scoring, player join, or socket transport concerns.

## `apps/api/src/modules/question`

- Responsible for question create, update, delete, ordering, and safe persistence rules.
- Read when changing question types, answer-key handling, or question validation.
- Do NOT read for session lifecycle or leaderboard ranking.

## `apps/api/src/modules/session`

- Responsible for game session creation, join codes, join flow, waiting room, and session mode/state.
- Read when changing `realtime` versus `self-paced` behavior or player registration.
- Do NOT read for quiz authoring or answer-scoring formulas.

## `apps/api/src/modules/answer`

- Responsible for answer submission, idempotency, correctness evaluation, and score calculation.
- Read when changing safe question projection, submission rules, or scoring behavior.
- Do NOT read for quiz CRUD or host-side room creation details.

## `apps/api/src/modules/leaderboard`

- Responsible for ranking, leaderboard projections, and final result shaping.
- Read when changing sort order, tie-breakers, or result endpoints.
- Do NOT read for join-code generation or authoring workflows.

## `apps/api/src/gateway`

- Responsible for Socket.IO gateways and event transport only.
- Read when adding or adjusting room, question, leaderboard, or completion events.
- Do NOT read for primary business rules that belong in services.

## `packages/contracts/src`

- Responsible for shared HTTP DTOs, socket payload types, and player-safe contract shapes.
- Read when changing data exchanged between web and API.
- Do NOT read for repository implementation details or UI presentation logic.

## `packages/shared/src`

- Responsible for the standalone activity log and shared pure utilities.
- Read when implementing `REQ-001` through `REQ-007` or other injected-dependency helpers.
- Do NOT read for REST controllers, sockets, or React feature code.

## `apps/web/src/features/quiz-editor`

- Responsible for admin quiz authoring flows and question editing UI.
- Read when changing create quiz, edit quiz, or publish quiz browser behavior.
- Do NOT read for gameplay timers, answer submission, or leaderboard display.

## `apps/web/src/features/game-host`

- Responsible for starting sessions, managing the host room, and advancing realtime play.
- Read when changing host controls, waiting room, or host-side session state.
- Do NOT read for admin quiz authoring or player answer form details.

## `apps/web/src/features/game-player`

- Responsible for join, question play, timer display, and answer submission UI.
- Read when changing player-safe question rendering or submission UX.
- Do NOT read for quiz management or leaderboard-only views.

## `apps/web/src/features/leaderboard`

- Responsible for live leaderboard and final results presentation.
- Read when changing ranking display, polling, socket updates, or result screens.
- Do NOT read for quiz authoring or join-code creation logic.
