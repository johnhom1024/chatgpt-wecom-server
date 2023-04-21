import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

interface MessageOptions {
  prompt: string;
  options?: {
    model?: string;
    user?: string;
  };
}

@Injectable()
export class ChatGPTService {
  openai: any;

  private readonly logger = new Logger(ChatGPTService.name);

  async onModuleInit() {
    await this.initGPT();
  }

  async initGPT() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY missing');
    }
    this.logger.log('初始化chatGPT');
    // this.api = await getChatGPTAPI();
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async sendMessage({ prompt, options }: MessageOptions) {
    const { model = 'gpt-3.5-turbo' } = options || {};
    try {
      this.logger.log(`用户提问：\n${prompt}`);
      const { status = 200, data = {} } =
        await this.openai.createChatCompletion({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
        });

      if (status === 200) {
        const machineResponse = data.choices[0].message.content;
        this.logger.log(`回答：\n${machineResponse}`);
        return {
          response: data,
          content: machineResponse,
        };
      } else {
        return {
          response: data,
          content: 'status 不为 200',
        };
      }
    } catch (error) {
      let errMessage = '请求openai的接口失败';
      if (error.response) {
        errMessage = error.response.data;
      } else {
        errMessage = error.message;
      }

      this.logger.error(errMessage);
      return {
        response: {},
        content: errMessage,
      };
    }
  }
}
