import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { WecomService } from './wecom.service.js';
import { ChatGPTService } from '../chatgpt/chatgpt.service.js';

@Controller('wecom')
export class WecomController {
  constructor(
    private readonly weCom: WecomService,
    private readonly chatGPT: ChatGPTService,
  ) {}

  private readonly logger = new Logger(WecomController.name);

  @Get('getMessage')
  async testGetMessage(@Query() query) {
    const message = this.weCom.testGetMessage(query);

    return message;
  }

  @Get('getToken')
  async testGetToken() {
    const access_token = await this.weCom.getWecomAccessToken();

    return access_token;
  }

  @Post('getMessage')
  @HttpCode(200)
  async getMessage(@Body('xml') xmlData, @Query() query) {
    const data = await this.weCom.getMessage(query, xmlData);

    const { message = '', touser = '' } = data;
    this.replyUser({ message, touser });
    // 这里怎么返回都行，只要 http 的状态码返回 200 就行了
    return data;
  }

  async replyUser({ message = '', touser }) {
    // 根据拿到用户发送的消息，转发给 chatgpt
    const { content = '' } = await this.chatGPT.sendMessage({
      prompt: message,
    });

    // 使用企业微信向对应用户发送消息
    await this.weCom.sendMessage({ touser, content });
  }
}
