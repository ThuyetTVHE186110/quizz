# Backend Module Pattern

When creating a new NestJS domain module, use this structure:

- `controller`
- `service`
- `repository`
  - interface
  - in-memory implementation
- `dto` with `class-validator`
- colocated tests as `*.spec.ts`

Place modules under `apps/api/src/modules/<name>`. Keep business rules in the service layer, not in controllers or gateways. Use the in-memory repository behind the interface first; swap persistence later without changing service behavior.

Reference implementation: `apps/api/src/modules/quiz` once it exists. Do not introduce a new architecture unless the feature truly requires it.
