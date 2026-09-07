import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuizService } from './quiz.service';
import type { SubmitQuizDto } from './quiz.types';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('questions')
  getQuestions() {
    return this.quizService.findAllQuestions();
  }

  @Post('submit')
  submit(@Body() dto: SubmitQuizDto) {
    return this.quizService.submit(dto);
  }
}
