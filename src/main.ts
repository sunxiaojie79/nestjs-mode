import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger, transports, format } from 'winston';
import { utilities } from 'nest-winston';
import { WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';
async function bootstrap() {
  const instance = createLogger({
    transports: [
      new transports.Console({
        level: 'info',
        format: format.combine(format.timestamp(), utilities.format.nestLike()),
      }),
      new transports.DailyRotateFile({
        dirname: 'logs',
        filename: 'app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'warn',
        maxSize: '20m',
      }),
    ],
  });
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
