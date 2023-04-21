import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';
import { RequestInterceptor } from './core/interceptor/request.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局注册拦截器
  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new RequestInterceptor());
  await app.listen(3000);
}
bootstrap();
