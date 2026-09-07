# React Query Pattern

React Query owns server state:

- quizzes
- sessions
- leaderboard polling
- result fetches

Zustand owns local or session UI state only:

- current client-side question index
- local timer state
- socket connection state
- transient UI flags

Each feature folder should expose one `hooks.ts` file that wraps React Query usage and speaks in `packages/contracts` types. Keep fetch logic and cache keys there; keep components focused on rendering and interaction.
