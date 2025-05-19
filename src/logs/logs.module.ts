import { Module } from '@nestjs/common';
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { LogEnum } from '../enum/config.enum';
import { LogsController } from './logs.controller';

function createDailyRotateTransport(level: string, filename: string) {
  return new transports.DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true,
    format: format.combine(format.timestamp(), format.simple()),
  });
}
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransport = new transports.Console({
          level: 'info',
          format: format.combine(
            format.timestamp(),
            utilities.format.nestLike(),
          ),
        });

        console.log(
          '🚀 ~ configService.get(LogEnum.LOG_LEVEL):',
          configService.get(LogEnum.LOG_LEVEL),
          configService.get(LogEnum.LOG_ON),
        );

        return {
          transports: [
            consoleTransport,
            ...(configService.get(LogEnum.LOG_ON)
              ? [
                  createDailyRotateTransport('info', 'app'),
                  createDailyRotateTransport('warn', 'error'),
                ]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
  controllers: [LogsController],
})
export class LogsModule {}
