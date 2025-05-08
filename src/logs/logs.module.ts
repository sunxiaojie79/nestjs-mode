import { Module } from '@nestjs/common';
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { LogEnum } from '../enum/config.enum';
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

        const dailyTransport = new transports.DailyRotateFile({
          level: configService.get(LogEnum.LOG_LEVEL),
          dirname: 'logs',
          filename: 'app-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          maxSize: '20m',
          maxFiles: '14d',
          zippedArchive: true,
          format: format.combine(format.timestamp(), format.simple()),
        });
        console.log(
          '🚀 ~ configService.get(LogEnum.LOG_LEVEL):',
          configService.get(LogEnum.LOG_LEVEL),
          configService.get(LogEnum.LOG_ON),
        );

        const dailyInfoTransport = new transports.DailyRotateFile({
          level: configService.get(LogEnum.LOG_LEVEL),
          dirname: 'logs',
          filename: 'info-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          maxSize: '20m',
          maxFiles: '14d',
          zippedArchive: true,
          format: format.combine(format.timestamp(), format.simple()),
        });
        return {
          transports: [
            consoleTransport,
            ...(configService.get(LogEnum.LOG_ON)
              ? [dailyTransport, dailyInfoTransport]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
})
export class LogsModule {}
