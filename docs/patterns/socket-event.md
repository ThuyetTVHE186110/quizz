# Socket Event Pattern

Use `domain:action` naming for Socket.IO events, for example:

- `session:join`
- `question:started`
- `answer:submitted`
- `leaderboard:update`
- `session:completed`

Payload shapes should be defined in `packages/contracts` socket types, not duplicated inside gateways or components.

Gateway methods stay thin: validate transport input, delegate to application services, then emit the contract-shaped result. Do not place core scoring or session rules in the gateway.
