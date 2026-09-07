# Coding Rules

- No speculative base classes or generic engines. New abstractions require two real consumers.
- One API module equals one domain capability under `apps/api/src/modules/<name>`.
- Each API module should own controller, service, repository, dto, and colocated tests.
- Realtime Socket.IO code is transport over already-tested application services, never a second home for business logic.
- Validate every API input and reject unknown fields.
- Map validation errors to HTTP 400, missing resources to 404, and conflicts to 409.
- Build player-facing DTOs from allowlisted fields only. Never spread a full entity containing `isCorrect` or `answerKey`.
- Write tests before implementation, and reference the governing `REQ-###` or `FR-###` identifier in the test name.
