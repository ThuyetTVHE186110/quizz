# Agent Evidence Log

Evidence that the six hackathon techniques were actually used while building
the SDD quiz app in this worktree, not just described. Chat history has the
full detail; this file is the durable record.

---

## 1 · @tdd-red — REQ-QUIZ-008 (quiz result percentage)

**Objective:** Add a `percentage` field to `QuizResult` so the UI shows a
rounded score percentage from one source of truth (the API), not a
client-side recomputation.

**Test added** (`apps/api/src/quiz/quiz.service.spec.ts`):

```ts
it('REQ-QUIZ-008: submit rounds the percentage score to the nearest integer', async () => {
  prisma.question.findMany.mockResolvedValue([questionRow]);
  const result = await service.submit({ answers: [{ questionId: 1, selectedIndex: 1 }] });
  expect(result.percentage).toBe(100);
});

it('REQ-QUIZ-008: percentage is 0 when there are no answers, with no division by zero', async () => {
  prisma.question.findMany.mockResolvedValue([]);
  const result = await service.submit({ answers: [] });
  expect(result.percentage).toBe(0);
});
```

**Run before implementation** (`npx jest src/quiz`):

```
√ findAllQuestions never exposes correctIndex or explanation
√ submit scores a correct answer
√ submit scores an incorrect answer as zero
× REQ-QUIZ-008: submit rounds the percentage score to the nearest integer
× REQ-QUIZ-008: percentage is 0 when there are no answers, with no division by zero
√ submit handles an unknown question id gracefully

Expected: 100   Received: undefined
Expected: 0     Received: undefined
Tests: 2 failed, 4 passed, 6 total
```

Both new tests fail for the right reason (field does not exist yet), the four
pre-existing tests stay green. No implementation was written at this step —
only the `percentage: number` field was added to the `QuizResult` type, which
is the smallest shape needed for the test file to type-check and run.

## 2 · @tdd-green — implement the minimum

**Change** (`apps/api/src/quiz/quiz.service.ts`):

```ts
const score = results.filter((r) => r.correct).length;
const percentage = results.length > 0 ? Math.round((score / results.length) * 100) : 0;
return { score, total: results.length, percentage, results };
```

No test was modified. `apps/web/src/App.tsx` was updated to read
`result.percentage` from the API instead of recomputing it client-side, so
there is one source of truth for the score.

**Run after implementation:**

```
√ findAllQuestions never exposes correctIndex or explanation
√ submit scores a correct answer
√ submit scores an incorrect answer as zero
√ REQ-QUIZ-008: submit rounds the percentage score to the nearest integer
√ REQ-QUIZ-008: percentage is 0 when there are no answers, with no division by zero
√ submit handles an unknown question id gracefully
Tests: 6 passed, 6 total
```

## 3 · @caveman

> Thêm field `percentage`. Test trước, code sau. 6/6 test api pass. Không rò
> đáp án. Không guard thừa.

(Terse mode, per `caveman.agent.md`: one sentence per thought, no preamble.)

## 4 · @review

**Model disclosure:** this review was carried out by the same model that wrote
the code in this session (no model switch was available). Per
`review.agent.md` this makes the review weaker than a genuine second-model
pass — it is reported anyway because a disclosed weak review beats a silent
skip.

**Scope reviewed:** `packages/shared/src/activity-log.ts` against
`spec/activity-log.md`, and the quiz feature (`apps/api/src/quiz/**`,
`apps/web/src/App.tsx`) against the ad-hoc requirements it implements.

| # | Severity | Location | Finding |
| --- | --- | --- | --- |
| 1 | Untested | `apps/api/test/app.e2e-spec.ts` | The e2e suite still only exercises the NestJS boilerplate `GET /` route. There is no e2e test hitting `/quiz/questions` or `/quiz/submit` through an actual HTTP request — only the unit-level `QuizService` is tested. |
| 2 | Untested | `packages/shared/src/activity-log.ts` (`redact`) | Sensitive keys nested inside **arrays** (e.g. `metadata: { events: [{ password: 'x' }] }`) are not redacted — `isPlainObject` returns `false` for arrays, so the recursion never descends into array elements. No test covers this shape. |
| 3 | Untested | `packages/shared/src/activity-log.ts` (`record`) | `actor: '   '` (whitespace-only) passes the `!entry.actor` check and would be stored as a valid actor. REQ-002 says "empty or absent"; whether whitespace counts as empty is not decided anywhere. |
| 4 | Untested | `apps/web/src/App.tsx` | The frontend has zero test coverage (no component/interaction test exists for the quiz flow, only manual curl/browser verification was done). |
| 5 | Minor | `apps/api/src/quiz/quiz.service.ts` | `findMany({ where: { id: { in: questionIds } } })` is called even when `questionIds` is empty (empty submit). Harmless with Prisma/SQLite here, but worth a guard if this code is ever reused against a backend where an empty `IN ()` is invalid. |

**Not flagged as issues:** REQ-003/004/005/006 decisions in
`spec/activity-log.md` were checked line-by-line against the implementation —
tie-break order, redaction irreversibility, inclusive range bounds, and
empty-result semantics all match what is written under *Decisions*. No drift
found there.

## 5 · @documenter

See root `README.md` — written from the actual source tree, tests, and specs
in this repository, not from memory of what was intended.
