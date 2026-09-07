import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PublicQuestion,
  QuestionResult,
  QuizResult,
  SubmitQuizDto,
} from './quiz.types';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllQuestions(): Promise<PublicQuestion[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { id: 'asc' },
    });
    // Never expose correctIndex or explanation before submission.
    return questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options) as string[],
    }));
  }

  async submit(dto: SubmitQuizDto): Promise<QuizResult> {
    const answers = dto?.answers ?? [];
    const questionIds = answers.map((a) => a.questionId);
    const questions = await this.prisma.question.findMany({
      where: { id: { in: questionIds } },
    });
    const byId = new Map(questions.map((q) => [q.id, q]));

    const results: QuestionResult[] = answers.map((answer) => {
      const question = byId.get(answer.questionId);
      if (!question) {
        return {
          questionId: answer.questionId,
          correct: false,
          correctIndex: -1,
          selectedIndex: answer.selectedIndex,
          explanation: 'Question not found.',
        };
      }
      return {
        questionId: answer.questionId,
        correct: question.correctIndex === answer.selectedIndex,
        correctIndex: question.correctIndex,
        selectedIndex: answer.selectedIndex,
        explanation: question.explanation,
      };
    });

    const score = results.filter((r) => r.correct).length;

    return { score, total: results.length, results };
  }
}
