import { Controller, Get, Query, Sse, MessageEvent } from '@nestjs/common';
import { ChatGPTAPIService } from './chatgptapi.service.js';
import { Observable } from 'rxjs';

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

  @Sse('/stream')
  sendMessageStream(@Query() query): Observable<MessageEvent> {
    const { prompt = '', parentMessageId = '' } = query;

    console.log('----------johnhomLogDebug prompt', prompt);

    const observerable = new Observable<MessageEvent>(async (subscribe) => {
      try {
        await this.chatgptapi.sendMessage({
          prompt,
          options: {
            parentMessageId,
            process: (partialResponse) => {
              const { delta } = partialResponse;
              subscribe.next({ data: { text: delta } });
            },
          },
        });
      } catch (error) {
        console.log('----------johnhomLogDebug error', error);
      } finally {
        subscribe.complete();
      }
    });

    return observerable;
  }
}
