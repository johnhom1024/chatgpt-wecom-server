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
    let responseMessage = '';

    responseMessage = this.handleMessage({ message, touser });

    if (!responseMessage) {
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
      responseMessage = content;
    }

    await this.weCom.sendMessage({ touser, content: responseMessage });
  }

  /**
   * @description: 根据用户发送的消息进行相应的处理
   * @param {*} param1
   * @return {*}
   */
  handleMessage({ message = '', touser = '' }) {
    let responseMessage = '';
    switch (message) {
      case '#系统指令':
        responseMessage = `目前存在以下的系统指令：
#清除上下文
`;
        break;
      case '#清除上下文':
        this.UserIdToParentMessageIdMap[touser] = '';
        responseMessage = '已清除上下文';
        break;
      default:
        break;
    }

    return responseMessage;
  }
}
