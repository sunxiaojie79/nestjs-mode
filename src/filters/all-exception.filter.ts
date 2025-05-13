import {
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
  ArgumentsHost,
  Catch,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';
import { QueryFailedError } from 'typeorm';
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const ip = requestIp.getClientIp(request);
    let msg = exception['response'] || 'Internal Server Error';
    if (exception instanceof QueryFailedError) {
      msg = exception.message;
      // if (exception.driverError.errno === 1062) {
      //   msg = ' 唯一索引冲突';
      // }
    }
    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip,
      exception: exception['name'],
      error: msg,
    };

    this.logger.error(JSON.stringify(responseBody));

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
