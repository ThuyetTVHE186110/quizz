export interface PublicQuestion {
  id: number;
  text: string;
  options: string[];
}

export interface AnswerSubmission {
  questionId: number;
  selectedIndex: number;
}

export interface SubmitQuizDto {
  answers: AnswerSubmission[];
}

export interface QuestionResult {
  questionId: number;
  correct: boolean;
  correctIndex: number;
  selectedIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  results: QuestionResult[];
}
