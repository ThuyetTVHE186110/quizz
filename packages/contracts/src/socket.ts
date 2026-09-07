import type { LeaderboardEntry } from './domain';
import type { ResultResponse } from './http';
import type { PlayerSafeAnswerResult, PlayerSafeQuestion } from './player-safe';

export const SOCKET_EVENTS = {
  SESSION_JOIN: 'session:join',
  QUESTION_STARTED: 'question:started',
  ANSWER_SUBMITTED: 'answer:submitted',
  LEADERBOARD_UPDATE: 'leaderboard:update',
  SESSION_COMPLETED: 'session:completed',
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

export interface SessionJoinPayload {
  joinCode: string;
  nickname: string;
}

export interface QuestionStartedPayload {
  sessionId: string;
  questionIndex: number;
  question: PlayerSafeQuestion;
  startedAt: string;
}

export interface AnswerSubmittedPayload {
  sessionId: string;
  playerId: string;
  questionId: string;
  result: PlayerSafeAnswerResult;
}

export interface LeaderboardUpdatePayload {
  sessionId: string;
  leaderboard: LeaderboardEntry[];
}

export interface SessionCompletedPayload {
  sessionId: string;
  leaderboard: LeaderboardEntry[];
  results: ResultResponse;
}

export interface SocketEventPayloadMap {
  [SOCKET_EVENTS.SESSION_JOIN]: SessionJoinPayload;
  [SOCKET_EVENTS.QUESTION_STARTED]: QuestionStartedPayload;
  [SOCKET_EVENTS.ANSWER_SUBMITTED]: AnswerSubmittedPayload;
  [SOCKET_EVENTS.LEADERBOARD_UPDATE]: LeaderboardUpdatePayload;
  [SOCKET_EVENTS.SESSION_COMPLETED]: SessionCompletedPayload;
}
