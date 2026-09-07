import { describe, expect, it } from 'vitest';

import type { Question } from './domain';
import { toPlayerSafeQuestion } from './player-safe';

function createQuestion(type: Question['type']): Question {
  const baseQuestion = {
    id: `question-${type}`,
    quizId: 'quiz-1',
    content: `Content for ${type}`,
    points: 1000,
    timeLimit: 30,
    order: 1,
  };

  switch (type) {
    case 'single-choice':
      return {
        ...baseQuestion,
        type,
        options: [
          { id: 'option-a', content: 'A', isCorrect: true } as never,
          { id: 'option-b', content: 'B', secret: 'hidden' } as never,
        ],
        answerKey: ['option-a'],
      };
    case 'multiple-choice':
      return {
        ...baseQuestion,
        type,
        options: [
          { id: 'option-a', content: 'A', isCorrect: true } as never,
          { id: 'option-b', content: 'B', isCorrect: false } as never,
          { id: 'option-c', content: 'C', token: 'hidden' } as never,
        ],
        answerKey: ['option-a', 'option-b'],
      };
    case 'true-false':
      return {
        ...baseQuestion,
        type,
        options: [
          { id: 'true', content: 'True', isCorrect: true } as never,
          { id: 'false', content: 'False', isCorrect: false } as never,
        ],
        answerKey: ['true'],
      };
    case 'fill-blank':
      return {
        ...baseQuestion,
        type,
        options: [],
        answerKey: 'accepted phrase',
      };
  }
}

describe('toPlayerSafeQuestion', () => {
  it.each([
    'single-choice',
    'multiple-choice',
    'true-false',
    'fill-blank',
  ] satisfies Question['type'][])(
    'removes answerKey for %s questions',
    (questionType) => {
      const safeQuestion = toPlayerSafeQuestion(createQuestion(questionType));

      expect('answerKey' in safeQuestion).toBe(false);
    },
  );

  it('allowlists option fields so correctness hints are stripped', () => {
    const safeQuestion = toPlayerSafeQuestion(createQuestion('multiple-choice'));

    expect(safeQuestion.type).toBe('multiple-choice');

    if (safeQuestion.type === 'fill-blank') {
      throw new Error('Expected choice question');
    }

    expect(safeQuestion.options).toEqual([
      { id: 'option-a', content: 'A' },
      { id: 'option-b', content: 'B' },
      { id: 'option-c', content: 'C' },
    ]);
    expect(
      safeQuestion.options.some(
        (option) => 'isCorrect' in option || 'answerKey' in option || 'token' in option,
      ),
    ).toBe(false);
  });

  it('keeps fill-blank questions answer-key free', () => {
    const safeQuestion = toPlayerSafeQuestion(createQuestion('fill-blank'));

    expect(safeQuestion).toEqual({
      id: 'question-fill-blank',
      quizId: 'quiz-1',
      type: 'fill-blank',
      content: 'Content for fill-blank',
      points: 1000,
      timeLimit: 30,
      order: 1,
      options: [],
    });
  });
});
