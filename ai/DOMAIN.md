# Domain Model

## Quiz

- `id`
- `title`
- `description`
- `status` such as draft or published
- ordered collection of `Question`

## Question

Supported types:

- `single-choice`
- `multiple-choice`
- `true/false`
- `fill-blank`

Fields:

- `id`
- `quizId`
- `type`
- `content`
- `points`
- `timeLimit`
- `order`
- `options`
- `answerKey`

`answerKey` is server-only before submission. Player-facing DTOs must exclude it.

## QuestionOption

- `id`
- `questionId`
- `text`
- `order`

Do not expose any option-level correctness marker to players before submission.

## GameSession

- `id`
- `quizId`
- `joinCode`
- `mode`: `realtime | self-paced`
- `status`
- `currentQuestionIndex`

## Player

- `id`
- `sessionId`
- `nickname`
- `score`
- `joinedAt`

Nicknames are unique within a session.

## PlayerAnswer

- `id`
- `playerId`
- `questionId`
- `selectedOptions`
- `textAnswer`
- `responseTimeMs`
- `isCorrect`
- `score`

One player can submit at most one answer per question.

## LeaderboardEntry

- `playerId`
- `nickname`
- `score`
- rank position derived from sorting

## Scoring

- Incorrect answer: `0`
- Correct answer: `round(500 + 500 * remainingRatio)`
- `remainingRatio` is clamped to `[0,1]`

## Leaderboard ordering

1. score descending
2. join time ascending
3. player ID ascending
