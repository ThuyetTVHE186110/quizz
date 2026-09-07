export type QuestionType =
  | 'single-choice'
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank';

export type ChoiceQuestionType = Exclude<QuestionType, 'fill-blank'>;

export type QuizStatus = 'draft' | 'published';

export type SessionMode = 'realtime' | 'self-paced';

export type SessionStatus = 'waiting' | 'active' | 'completed';

export interface QuestionOption {
  id: string;
  content: string;
}

export interface BaseQuestion {
  id: string;
  quizId: string;
  type: QuestionType;
  content: string;
  points: number;
  timeLimit: number;
  order: number;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: ChoiceQuestionType;
  options: QuestionOption[];
  answerKey: string[];
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  options: [];
  answerKey: string;
}

export type Question = ChoiceQuestion | FillBlankQuestion;

export interface Quiz {
  id: string;
  title: string;
  description: string;
  status: QuizStatus;
  createdBy: string;
  questions: Question[];
}

export interface GameSession {
  id: string;
  quizId: string;
  joinCode: string;
  mode: SessionMode;
  status: SessionStatus;
  currentQuestionIndex: number;
}

export interface Player {
  id: string;
  sessionId: string;
  nickname: string;
  score: number;
  joinedAt: string;
}

export interface PlayerAnswer {
  id: string;
  playerId: string;
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
  responseTimeMs: number;
  isCorrect: boolean;
  score: number;
}

export interface LeaderboardEntry {
  playerId: string;
  nickname: string;
  score: number;
  rank: number;
}
