import { Controller, Get, Query } from '@nestjs/common';
import { ChatGPTAPIService } from './chatgptapi.service.js';

@Controller('chatgptapi')
export class ChatGPTAPIController {
  constructor(private readonly chatgptapi: ChatGPTAPIService) {}

  @Get()
  async sendMessage(@Query() query) {
    const { prompt = '', parentMessageId = '' } = query;

    const { content, response } = await this.chatgptapi.sendMessage({
      prompt,
      options: { parentMessageId },
    });

    return {
      content,
      response,
    };
  }
}
