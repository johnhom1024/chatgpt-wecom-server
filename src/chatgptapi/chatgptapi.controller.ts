import { Controller, Get, Query } from '@nestjs/common';
import { ChatGPTAPIService } from './chatgptapi.service.js';

@Controller('chatgptapi')
export class ChatgptapiController {
  constructor(private readonly chatgptapi: ChatGPTAPIService) {}

  @Get()
  async sendMessage(@Query() query) {
    const { prompt = '' } = query;

    const { content, response } = await this.chatgptapi.sendMessage({ prompt });

    return {
      content,
      response,
    };
  }
}
