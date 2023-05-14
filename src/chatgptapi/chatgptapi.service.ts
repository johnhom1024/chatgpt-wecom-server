/**
 * 使用chatgpt这个非官方的库进行上下文衔接对话
 * 与chatgpt.service不同
 */

import { Injectable, Logger } from '@nestjs/common';
import { ChatGPTAPI, ChatMessage } from 'chatgpt';
import { setupProxy } from './utils.js';

interface MessageOptions {
  prompt: string;
  options?: {
    model?: string;
    user?: string;
    // 上一个message的id
    parentMessageId?: string;
    process?: (partialResponse: ChatMessage) => void
  };
  completionParams?: {
    model?: string;
    temperature?: number;
    top_p?: number;
  };
}

@Injectable()
export class ChatGPTAPIService {
  api: ChatGPTAPI;

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
      debug: false,
      ...options,
    });
  }

  async sendMsgToChatgpt() {
    const res = await this.api.sendMessage(prompt, {
      parentMessageId,
      onProgress: (partialResponse) => {
        process?.(partialResponse);
      }
    });
  }

  async sendMessage({ prompt = '', options }: MessageOptions, retry: Number = 0) {
    const { parentMessageId = '', process } = options || {};
    try {
      const res = await this.api.sendMessage(prompt, {
        parentMessageId,
        onProgress: (partialResponse) => {
          process?.(partialResponse);
        },
        timeoutMs: 30*1000
      });
      this.logger.log(res);
      const machineResponse = res.text;
      return {
        response: res,
        content: machineResponse,
        status: 200,
      };
    } catch (error) {

      const data = await this.sendMessage({prompt, options})
      return data;
      
      // this.logger.error('请求出错');
      // this.logger.error(error);
      // return {
      //   response: error,
      //   content: '请求chatgpt错误',
      //   status: 500
      // };
    }
  }
}
