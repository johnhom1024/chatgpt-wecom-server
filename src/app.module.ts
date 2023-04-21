import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatgptController } from './chatgpt/chatgpt.controller';
import { ConfigModule } from '@nestjs/config';
import { ChatGPTService } from './chatgpt/chatgpt.service';
import { WecomService } from './wecom/wecom.service';
import { WecomController } from './wecom/wecom.controller';
import { XMLMiddleware } from './xml.middleware';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, ChatgptController, WecomController],
  providers: [AppService, ChatGPTService, WecomService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XMLMiddleware).forRoutes({
      path: 'wecom/*',
      method: RequestMethod.POST,
    });
  }
}
