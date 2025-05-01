import { Controller, Post, Body, UseGuards, Req, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('AI')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('query')
  async query(@Body() body: { fileId: string; question: string }, @Req() req) {
    const { fileId, question } = body;
    const userId = req.user.sub; 
    const response = await this.aiService.queryFile(fileId, question, userId);
    return { response };
  }

  @Get('history')
  async getHistory(@Query('fileId') fileId: string, @Req() req) {
    const userId = req.user.sub; 
    const history = await this.aiService.getHistory(fileId, userId);
    return { history };
  }
}