import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './core/interceptor/transform.interceptor.js';
import { HttpExceptionFilter } from './core/filter/http-exception.filter.js';
import { RequestInterceptor } from './core/interceptor/request.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局注册拦截器
  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new RequestInterceptor());
  await app.listen(3000);
}
bootstrap();
