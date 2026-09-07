# Test Pattern

- Reference the governing `REQ-###` or `FR-###` identifier in the `describe` block or test name.
- Inject time and ID generators in unit tests; do not read `Date.now()` or random values directly.
- Keep one test file per module or feature, colocated as `*.spec.ts`.
- Use Jest for `apps/api`.
- Use Vitest for `apps/web` and `packages/*`.
- Start with the narrowest failing test, then expand to broader verification only when the behavior is stable.
