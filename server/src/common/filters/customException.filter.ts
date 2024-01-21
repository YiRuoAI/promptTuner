import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { CustomError } from './type';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();

      // 放在最前面，要记录起来
      console.error(exception);
      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        response.status(status).json(exception.getResponse());
        return;
      } else if (exception instanceof CustomError) {
        response.status(HttpStatus.OK).json({
          code: exception.code,
          msg: exception.msg,
          data: exception.data,
        });
        return;
      }
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: '内部服务器错误',
      });
    } catch (err) {
      console.error(err);
    }
  }
}
