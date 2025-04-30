import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import configuration from './configuration';
import * as dotenv from 'dotenv';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
import * as Joi from 'joi';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      // load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_TYPE: Joi.string().valid('mysql').default('mysql'),
        DB_HOST: Joi.string().ip(),
        DB_PORT: Joi.number().default(3306),
        DB_URL: Joi.string().domain(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        DB_SYNC: Joi.boolean().default(false),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [User, Profile, Logs, Roles],
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          logging: process.env.NODE_ENV === 'development',
        }) as TypeOrmModuleOptions,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'example',
    //   database: 'testdb',
    //   entities: [],
    //   synchronize: true,
    //   logging: ['error'],
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
