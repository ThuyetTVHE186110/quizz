# Quizizz MVP Constitution

## Core Principles

### I. Context-Routed Development

Every task starts with `ai/PROJECT_CONTEXT.md`, `ai/CURRENT_STATE.md`, and `ai/REPO_MAP.md`. The task must identify fewer than ten relevant files before implementation. Repository-wide scans are prohibited unless the task explicitly requires one.

### II. Contracts Before Consumers

Shared HTTP payloads, socket events, and domain types live in `packages/contracts`. The API is the source of truth for answers and scoring. Correct answers and answer keys must never be sent to a player before submission.

### III. Test-First Delivery

Every behavioral requirement is implemented red-green-refactor. Tests reference their requirement or story ID. Each change runs the narrowest relevant test first, then workspace typecheck and lint before completion.

### IV. Modular Simplicity

Code is organized by domain capability. New abstractions require two real consumers; speculative base classes and generic engines are forbidden. Realtime is a transport over tested application services, not a separate source of business logic.

### V. Observable Progress

`ai/CURRENT_STATE.md` and `docs/epic-story.md` are updated when story status changes. The in-memory activity log records important application actions with redacted metadata and injected time.

## Quality Gates

- No secret answer data in player-facing contracts.
- No story is complete without tests, typecheck, and lint.
- No database, network, UI, or system clock dependency in activity-log tests.
- No unrelated module reads or changes during a story.
- Public documentation must explain setup, development, tests, and architecture.

## Governance

This constitution overrides conflicting implementation convenience. Amendments require a documented rationale in the feature plan and corresponding updates to AI context documents.

**Version:** 1.0.0 | **Ratified:** 2026-09-07