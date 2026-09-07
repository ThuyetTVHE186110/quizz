# Feature Specification: Quizizz MVP

**Feature Branch:** `integrate-hackathon-framework`  
**Created:** 2026-09-07  
**Status:** Approved

## User Scenarios

### US1 - Author A Quiz (P1)

An admin creates a quiz, adds ordered questions and options, edits or removes them, and publishes the quiz.

**Acceptance scenarios**

1. Given a draft quiz, when the admin adds single-choice, multiple-choice, true/false, or fill-blank questions, then the saved quiz preserves each question's type, points, time limit, order, options, and answer key.
2. Given an existing question, when the admin edits or deletes it, then subsequent quiz reads reflect the change.
3. Given a valid draft, when the admin publishes it, then it becomes available to start a session.

### US2 - Join And Play A Session (P1)

A host starts a realtime or self-paced session from a published quiz. A player enters the six-digit room code and nickname, receives safe question content, and submits answers.

**Acceptance scenarios**

1. Given a published quiz, when a host starts a session, then the system returns a unique six-digit join code.
2. Given an active code and unique nickname, when a player joins, then the player appears in the waiting room.
3. Given a started question, when player data is emitted or fetched, then no correct answer or `isCorrect` option field is present.
4. Given a valid answer, when it is submitted, then it is validated, scored, persisted once, and reflected in the leaderboard.

### US3 - View Leaderboard And Results (P2)

Players and hosts see a score-ranked leaderboard during play and final per-player results after completion.

**Acceptance scenarios**

1. Given scored answers, when the leaderboard is requested, then players are ordered by score descending with deterministic ties.
2. Given a completed session, when results are requested, then totals and answer outcomes are returned without exposing other players' private answers.

### US4 - Audit Activity (P2)

The system records important actions in a queryable, in-memory activity log.

**Acceptance scenarios**

1. Each requirement in `spec/activity-log.md` has a test referencing its `REQ-###` ID.
2. Sensitive metadata is replaced irreversibly with `[REDACTED]` before storage.

## Functional Requirements

- **FR-001:** The system shall provide quiz CRUD and publish operations.
- **FR-002:** The system shall provide question create, update, and delete operations for four supported question types.
- **FR-003:** The system shall create realtime and self-paced game sessions with unique join codes.
- **FR-004:** The system shall allow players to join active sessions using a nickname unique within that session.
- **FR-005:** The system shall deliver questions without answer keys before submission.
- **FR-006:** The system shall accept at most one answer per player and question.
- **FR-007:** The system shall award zero for incorrect answers and, for correct answers, `round(500 + 500 * remainingRatio)` where the ratio is clamped to `[0,1]`.
- **FR-008:** The system shall rank players by score descending, then join time ascending, then player ID ascending.
- **FR-009:** The system shall expose final session and player results.
- **FR-010:** The web app shall support authoring, joining, hosting, playing, leaderboard, and results workflows on mobile and desktop.
- **FR-011:** The activity log shall satisfy `REQ-001` through `REQ-007` in `spec/activity-log.md`.
- **FR-012:** The repository shall route AI tasks through concise context documents and reference patterns.

## Activity Log Decisions

- **REQ-003:** Sort timestamp descending; ties sort reverse insertion order. Ordering is stable across repeated queries.
- **REQ-004:** Keys matching `password`, `token`, `secret`, `apiKey`, or `authorization` case-insensitively are sensitive. Redaction is irreversible and stored as `[REDACTED]`.
- **REQ-005:** Time ranges include both start and end instants.
- **REQ-006:** A no-match query returns an empty array. Unknown actors and known actors with no activity are intentionally indistinguishable.

## Success Criteria

- **SC-001:** All workspace tests, typechecks, and lint checks pass.
- **SC-002:** A user can create and publish a four-question quiz, start a room, join, answer, and view final results.
- **SC-003:** Player-facing question payload tests prove answer keys are absent.
- **SC-004:** An AI task can identify fewer than ten files from the context router without a full repository scan.

## Out Of Scope

Authentication, payments, teams, media uploads, exact Quizizz scoring parity, production deployment, horizontal Socket.IO scaling, and reconnect recovery.