/**
 * 使用chatgpt这个非官方的库进行上下文衔接对话
 * 与chatgpt.service不同
 */

import { Injectable, Logger } from '@nestjs/common';
import { ChatGPTAPI } from 'chatgpt';
import { setupProxy } from './utils.js';

interface MessageOptions {
  prompt: string;
  options?: {
    model?: string;
    user?: string;
    // 上一个message的id
    parentMessageId?: string;
  };
  completionParams?: {
    model?: string;
    temperature?: number;
    top_p?: number;
  };
}

@Injectable()
export class ChatGPTAPIService {
  api: any;

  private readonly logger = new Logger(ChatGPTAPIService.name);

  async onModuleInit() {
    await this.initAPI();
  }

  async initAPI() {
    const options = {
      fetch: null,
    };
    setupProxy(options);
    this.api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
      debug: true,
      ...options,
    });
  }

  async sendMessage({ prompt = '', options }: MessageOptions) {
    try {
      const res = await this.api.sendMessage(prompt);
      this.logger.log(res);
      const machineResponse = res.text;
      return {
        response: res,
        content: machineResponse,
      };
    } catch (error) {
      this.logger.error('请求出错');
      this.logger.error(error);
      return {
        response: error,
        content: '请求chatgpt错误',
      };
    }
  }
}
