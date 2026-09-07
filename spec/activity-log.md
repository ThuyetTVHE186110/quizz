# Spec: Activity Log

**Every team builds this, whatever your app idea is.**

Your app is yours. This one component is not — it is the fixed point that lets
judges in Hoa Lac, Da Nang and Ho Chi Minh compare teams fairly.

Budget roughly **20–25 minutes**. It is deliberately small.

---

## ⚠️ Read this before you start

**This spec is incomplete on purpose.**

Four requirements below are marked `[NEEDS CLARIFICATION]`. They are not
mistakes and they are not trick questions — they are the decisions a real spec
author forgot to make, and they are exactly the kind of gap that turns into a
production bug three months later.

**Do not guess. Do not let Copilot guess for you.**

Open **Plan Mode**, point it at this file, and ask it to find the ambiguities
before you write a line of code. Then decide, as a team, what each one should
be. Write your four decisions at the bottom of this file under *Decisions*.

You are scored on the quality of those decisions and your reasoning — **not on
matching a hidden answer.** There is more than one defensible answer to each.
A judge will ask you to justify one of them.

---

## Purpose

Record what happened in the system, so it can be queried later.

Every application has *actions* — a user logged in, an order shipped, a file
uploaded, a game started. This component records them and answers questions
about them.

## Scope

**In scope**

- An in-memory store of activity entries
- Recording an entry
- Querying entries by actor and by time range
- Redacting sensitive values before storage

**Out of scope** — do not build these, you do not have time

- Any database, file, or network persistence
- Any user interface
- Authentication or authorisation
- Log rotation, retention, or archival

## Data

An **entry** has:

| Field | Type | Notes |
| --- | --- | --- |
| `actor` | string | Who did it. Non-empty. |
| `action` | string | What they did. Non-empty. |
| `timestamp` | instant | When it happened. |
| `metadata` | key/value map | Optional. May contain sensitive values. |

---

## Requirements

### REQ-001 — Record an entry

WHEN a caller records an activity with an actor, an action and metadata,
THE SYSTEM SHALL store an entry and make it available to subsequent queries.

### REQ-002 — Reject invalid entries

IF the actor or the action is empty or absent,
THEN THE SYSTEM SHALL reject the entry and record nothing.

### REQ-003 — Query by actor

WHEN a caller queries by actor,
THE SYSTEM SHALL return all entries for that actor, most recent first.

> `[NEEDS CLARIFICATION]` Two entries can carry the same timestamp — clocks are
> coarse and systems are fast. What order are they returned in, and is that
> order guaranteed to be stable across repeated queries?

### REQ-004 — Redact sensitive metadata

WHEN an entry is recorded with sensitive values in its metadata,
THE SYSTEM SHALL store a redacted placeholder instead of the value.

> `[NEEDS CLARIFICATION]` What makes a value sensitive — the key name, the shape
> of the value, or a list the caller supplies? And is redaction reversible?

### REQ-005 — Query by time range

WHEN a caller queries with a start and an end time,
THE SYSTEM SHALL return every entry that falls within that range.

> `[NEEDS CLARIFICATION]` Is an entry whose timestamp is exactly the start or
> exactly the end inside the range or outside it?

### REQ-006 — Query with no matches

WHEN a query matches no entries,
THE SYSTEM SHALL return a result indicating no activity.

> `[NEEDS CLARIFICATION]` Is "this actor has done nothing" the same outcome as
> "this actor does not exist"? Should a caller be able to tell them apart?

### REQ-007 — Time is supplied, never read

THE SYSTEM SHALL obtain the current time from a source provided by the caller,
and SHALL NOT read the system clock directly.

> Not ambiguous — this one is a requirement. A component that reads the clock
> itself cannot be tested without waiting. Inject it.

---

## Acceptance

You are done when:

- [ ] All four `[NEEDS CLARIFICATION]` items are resolved and written down below
- [ ] Every requirement above has at least one test that references its `REQ-###`
- [ ] Tests were seen failing before the code existed
- [ ] Tests pass
- [ ] No database, file, network call, or UI
- [ ] Time is injected — no test sleeps or waits

---

## Decisions

*Fill this in. One or two sentences each. This is what a judge will ask about.*

| ID | Decision | Why |
| --- | --- | --- |
| REQ-003 | Sort by timestamp descending; entries sharing a timestamp are returned in reverse insertion order (most recently recorded first), and that order is stable across repeated queries. | Clocks are coarse enough that two entries can tie; falling back to insertion order (rather than an unstable sort) keeps "most recent first" meaningful and gives callers a result they can rely on being identical on repeat reads. |
| REQ-004 | A metadata key is sensitive if it case-insensitively matches `password`, `token`, `secret`, `apiKey`, or `authorization` (checked recursively through nested objects). Its value is replaced with the literal string `[REDACTED]`. Redaction is irreversible — the original value is never stored. | Matching on key name is cheap, predictable, and doesn't require the caller to enumerate a list every time. Irreversibility is a deliberate safety choice: a component whose whole job is auditing must never become a place secrets can later be recovered from. |
| REQ-005 | The time range is inclusive at both ends: an entry exactly at `start` or exactly at `end` is inside the range. | Callers most often build ranges from real timestamps they already have (e.g. "everything since this log entry"), and an inclusive boundary means that entry is not silently dropped from its own query. |
| REQ-006 | A query with no matches returns an empty array in both cases. An unknown actor and a known actor with no matching activity are intentionally indistinguishable. | Distinguishing "no activity" from "unknown actor" would require the log to also be a source of truth for identity, which is out of scope — this component only records actions, it doesn't validate who exists. |
