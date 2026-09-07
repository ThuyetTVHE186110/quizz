# Architecture

Quizizz MVP is split into a browser app, an API boundary, and shared packages:

```text
apps/web
  React UI + React Query + Zustand + React Router
        |
        | HTTP (CRUD, join, submit, results)
        | Socket.IO (room, question, leaderboard, completion)
        v
apps/api
  NestJS controllers + gateways
        |
        v
  quiz | question | session | answer | leaderboard modules
        |
        v
  repository interfaces
        |
        v
  in-memory repository implementations

packages/contracts <---- shared DTO and socket payload types ----> web + api
packages/shared    <---- activity log with injected time ---------> api
```

## Notes

- `apps/web` should stay thin around contracts, feature hooks, and UI state.
- `apps/api` contains all business rules, including safe question projection and scoring.
- Socket.IO is only a transport layer over the same application services used by REST endpoints.
- For this MVP, persistence is an in-memory repository behind a repository interface per module. This is a documented simplification so tests and local work do not require a live Postgres or Docker dependency.
- The repository boundary is intentionally shaped so Prisma + Postgres can replace the in-memory implementations later without changing service logic.
