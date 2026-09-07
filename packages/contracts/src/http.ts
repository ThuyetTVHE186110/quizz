import type {
  ChoiceQuestionType,
  GameSession,
  LeaderboardEntry,
  Player,
  Question,
  QuestionOption,
  Quiz,
  QuizStatus,
  SessionMode,
} from './domain';
import type { PlayerSafeAnswerResult, PlayerSafeQuestion } from './player-safe';

export interface CreateQuizRequest {
  title: string;
  description: string;
  createdBy: string;
}

export interface UpdateQuizRequest {
  title?: string;
  description?: string;
  status?: QuizStatus;
}

export interface CreateChoiceQuestionRequest {
  type: ChoiceQuestionType;
  content: string;
  points: number;
  timeLimit: number;
  order: number;
  options: QuestionOption[];
  answerKey: string[];
}

export interface CreateFillBlankQuestionRequest {
  type: 'fill-blank';
  content: string;
  points: number;
  timeLimit: number;
  order: number;
  options?: [];
  answerKey: string;
}

export type CreateQuestionRequest =
  | CreateChoiceQuestionRequest
  | CreateFillBlankQuestionRequest;

export interface UpdateChoiceQuestionRequest {
  type: ChoiceQuestionType;
  content?: string;
  points?: number;
  timeLimit?: number;
  order?: number;
  options?: QuestionOption[];
  answerKey?: string[];
}

export interface UpdateFillBlankQuestionRequest {
  type: 'fill-blank';
  content?: string;
  points?: number;
  timeLimit?: number;
  order?: number;
  options?: [];
  answerKey?: string;
}

export type UpdateQuestionRequest =
  | UpdateChoiceQuestionRequest
  | UpdateFillBlankQuestionRequest;

export type CreateQuizResponse = Quiz;
export type UpdateQuizResponse = Quiz;
export type CreateQuestionResponse = Question;
export type UpdateQuestionResponse = Question;

export interface StartSessionRequest {
  quizId: string;
  mode: SessionMode;
}

export interface StartSessionResponse {
  sessionId: string;
  joinCode: string;
}

export interface JoinSessionRequest {
  joinCode: string;
  nickname: string;
}

export interface JoinSessionResponse {
  session: GameSession;
  player: Player;
}

export interface SubmitAnswerRequest {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
  responseTimeMs: number;
}

export interface SubmitAnswerResponse {
  answer: PlayerSafeAnswerResult;
}

export interface LeaderboardResponse {
  sessionId: string;
  entries: LeaderboardEntry[];
}

export interface ResultResponse {
  sessionId: string;
  player: Pick<Player, 'id' | 'nickname' | 'score'>;
  answers: PlayerSafeAnswerResult[];
  leaderboard: LeaderboardEntry[];
}

export interface CurrentQuestionResponse {
  sessionId: string;
  questionIndex: number;
  question: PlayerSafeQuestion;
}
