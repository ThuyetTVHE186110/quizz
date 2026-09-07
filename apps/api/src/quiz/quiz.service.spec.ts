import { PrismaService } from '../prisma/prisma.service';
import { QuizService } from './quiz.service';

describe('QuizService', () => {
  const questionRow = {
    id: 1,
    text: 'Q1',
    options: JSON.stringify(['A', 'B', 'C']),
    correctIndex: 1,
    explanation: 'B is right',
    createdAt: new Date(),
  };

  let service: QuizService;
  let prisma: {
    question: { findMany: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      question: { findMany: jest.fn() },
    };

    service = new QuizService(prisma as unknown as PrismaService);
  });

  it('findAllQuestions never exposes correctIndex or explanation', async () => {
    prisma.question.findMany.mockResolvedValue([questionRow]);

    const questions = await service.findAllQuestions();

    expect(questions).toEqual([{ id: 1, text: 'Q1', options: ['A', 'B', 'C'] }]);
    expect(questions[0]).not.toHaveProperty('correctIndex');
    expect(questions[0]).not.toHaveProperty('explanation');
  });

  it('submit scores a correct answer', async () => {
    prisma.question.findMany.mockResolvedValue([questionRow]);

    const result = await service.submit({
      answers: [{ questionId: 1, selectedIndex: 1 }],
    });

    expect(result.score).toBe(1);
    expect(result.total).toBe(1);
    expect(result.results[0].correct).toBe(true);
    expect(result.results[0].correctIndex).toBe(1);
  });

  it('submit scores an incorrect answer as zero', async () => {
    prisma.question.findMany.mockResolvedValue([questionRow]);

    const result = await service.submit({
      answers: [{ questionId: 1, selectedIndex: 0 }],
    });

    expect(result.score).toBe(0);
    expect(result.results[0].correct).toBe(false);
  });

  it('REQ-QUIZ-008: submit rounds the percentage score to the nearest integer', async () => {
    prisma.question.findMany.mockResolvedValue([questionRow]);

    const result = await service.submit({
      answers: [{ questionId: 1, selectedIndex: 1 }],
    });

    expect(result.percentage).toBe(100);
  });

  it('REQ-QUIZ-008: percentage is 0 when there are no answers, with no division by zero', async () => {
    prisma.question.findMany.mockResolvedValue([]);

    const result = await service.submit({ answers: [] });

    expect(result.percentage).toBe(0);
  });

  it('submit handles an unknown question id gracefully', async () => {
    prisma.question.findMany.mockResolvedValue([]);

    const result = await service.submit({
      answers: [{ questionId: 999, selectedIndex: 0 }],
    });

    expect(result.score).toBe(0);
    expect(result.results[0].correct).toBe(false);
    expect(result.results[0].correctIndex).toBe(-1);
  });
});
