import { Controller, Get, Query } from '@nestjs/common';
import { ChatGPTService } from './chatgpt.service.js';

@Controller('chatgpt')
export class ChatGPTController {
  constructor(private readonly chatGPTService: ChatGPTService) {}

  @Get()
  async sendMessage(@Query() query) {
    const { prompt = '' } = query;
    const { content, response } = await this.chatGPTService.sendMessage({
      prompt,
    });

    return {
      content,
      response,
    };
  }
}
