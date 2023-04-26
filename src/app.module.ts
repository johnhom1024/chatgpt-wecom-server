import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ChatGPTController } from './chatgpt/chatgpt.controller.js';
import { ConfigModule } from '@nestjs/config';
import { ChatGPTService } from './chatgpt/chatgpt.service.js';
import { WecomService } from './wecom/wecom.service.js';
import { WecomController } from './wecom/wecom.controller.js';
import { XMLMiddleware } from './xml.middleware.js';
import { ChatGPTAPIService } from './chatgptapi/chatgptapi.service.js';
import { ChatGPTAPIController } from './chatgptapi/chatgptapi.controller.js';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    AppController,
    ChatGPTController,
    WecomController,
    ChatGPTAPIController,
  ],
  providers: [AppService, ChatGPTService, WecomService, ChatGPTAPIService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XMLMiddleware).forRoutes({
      path: 'wecom/*',
      method: RequestMethod.POST,
    });
  }
}
