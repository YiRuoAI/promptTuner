import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NESTJS_RAW_RESPONSE } from '../constants';

@Injectable()
export class WrapResponseInterceptor
  implements NestInterceptor<any, { data: any }>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<{ data: any }> {
    // 通过 Reflector 检查处理程序（控制器中的路由方法）是否标记为原始响应
    const isRawResponse = this.reflector.get(
      NESTJS_RAW_RESPONSE,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest<Request>();
    console.log(request.url, JSON.stringify(request.body));

    // 如果处理程序被标记为原始响应，不会对响应进行处理
    if (isRawResponse) {
      return next.handle().pipe(
        map((data) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          if (statusCode === 201) {
            response.status(200);
          }
          return data;
        }),
      );
    }

    // 保持原有的包装逻辑
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        if (statusCode === 201) {
          response.status(200);
        }
        return { code: 0, data };
      }),
    );
  }
}
