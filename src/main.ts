import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { createLogger, transports, format } from 'winston';
// import { WinstonModule, utilities } from 'nest-winston';
// import 'winston-daily-rotate-file';
// import { HttpExceptionFilter } from './filters/http-exception.filter';
// import { AllExceptionFilter } from './filters/all-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1');
  // const httpAdapter = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new HttpExceptionFilter(logger));
  // app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));
  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
