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
import { ChatGPTAPIService } from '../chatgptapi/chatgptapi.service.js';

// 用户Id与上一条消息的对应

@Controller('wecom')
export class WecomController {
  private UserIdToParentMessageIdMap: Record<string, string> = {};
  constructor(
    private readonly weCom: WecomService,
    private readonly chatGPT: ChatGPTService,
    private readonly chatGPTAPI: ChatGPTAPIService,
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

  @Get('getMessageV2')
  async testGetMessageV2(@Query() query) {
    const message = this.weCom.testGetMessage(query);

    return message;
  }

  @Post('getMessageV2')
  @HttpCode(200)
  async getMessageV2(@Body('xml') xmlData, @Query() query) {
    const data = await this.weCom.getMessage(query, xmlData);
    const { message = '', touser = '' } = data;

    this.replyUserV2({ message, touser });
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

  /**
   * @description: 使用chatgpt 的另一个api进行回复，支持上下文回复
   */
  async replyUserV2({ message = '', touser }) {
    this.logger.log(
      `存储的用户id以及message：`,
    );

    this.logger.log(this.UserIdToParentMessageIdMap);
    
    const parentMessageId = this.UserIdToParentMessageIdMap[touser] || '';

    // 根据拿到用户发送的消息，转发给 chatgpt
    const { content = '', response } = await this.chatGPTAPI.sendMessage({
      prompt: message,
      options: {
        parentMessageId,
      },
    });

    // 当前的messageId
    const { id } = response;
    // 覆盖之前的messageId
    this.UserIdToParentMessageIdMap[touser] = id;

    await this.weCom.sendMessage({ touser, content });
  }
}
