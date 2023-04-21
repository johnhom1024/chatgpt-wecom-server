/*
 * @Date: 2023-04-21 09:26:11
 * @Author: handsome_anthony
 * @LastEditors: handsome_anthony
 * @Description: 全局的请求打印拦截器
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
let requestSeq = 0;

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const host = context.switchToHttp();
    const request = host.getRequest<Request>();
    const seq = requestSeq++;
    const urlInfo = `${request.method} ${request.url}`;
    this.logger.log(`[${seq}] ==> ${urlInfo}`);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`[${seq}] <== ${urlInfo} ${Date.now() - startTime}ms`);
      }),
    );
  }
}
