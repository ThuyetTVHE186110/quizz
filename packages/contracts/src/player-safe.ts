import type {
  ChoiceQuestion,
  FillBlankQuestion,
  LeaderboardEntry,
  PlayerAnswer,
  Question,
  QuestionOption,
} from './domain';

export type PlayerSafeQuestionOption = QuestionOption;

export type PlayerSafeChoiceQuestion = Omit<ChoiceQuestion, 'answerKey' | 'options'> & {
  options: PlayerSafeQuestionOption[];
};

export type PlayerSafeFillBlankQuestion = Omit<FillBlankQuestion, 'answerKey'>;

export type PlayerSafeQuestion = PlayerSafeChoiceQuestion | PlayerSafeFillBlankQuestion;

export interface PlayerSafeAnswerResult {
  questionId: string;
  isCorrect: boolean;
  score: number;
}

export type PlayerSafeLeaderboardEntry = LeaderboardEntry;

export function toPlayerSafeQuestion(question: Question): PlayerSafeQuestion {
  // Compile-time omission is not enough on its own; this explicit allowlist prevents
  // runtime leaks if a wider object with extra fields is accidentally passed here.
  if (question.type === 'fill-blank') {
    return {
      id: question.id,
      quizId: question.quizId,
      type: question.type,
      content: question.content,
      points: question.points,
      timeLimit: question.timeLimit,
      order: question.order,
      options: [],
    };
  }

  return {
    id: question.id,
    quizId: question.quizId,
    type: question.type,
    content: question.content,
    points: question.points,
    timeLimit: question.timeLimit,
    order: question.order,
    options: question.options.map((option) => ({
      id: option.id,
      content: option.content,
    })),
  };
}

export function toPlayerSafeAnswerResult(answer: PlayerAnswer): PlayerSafeAnswerResult {
  return {
    questionId: answer.questionId,
    isCorrect: answer.isCorrect,
    score: answer.score,
  };
}

export function toPlayerSafeLeaderboardEntry(
  entry: LeaderboardEntry,
): PlayerSafeLeaderboardEntry {
  return {
    playerId: entry.playerId,
    nickname: entry.nickname,
    score: entry.score,
    rank: entry.rank,
  };
}
