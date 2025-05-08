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

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip,
      exception: exception['name'],
      error: exception['response'] || 'Internal Server Error',
    };

    this.logger.error(JSON.stringify(responseBody));

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
