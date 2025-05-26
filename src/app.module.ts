import { Logger, Module, Global } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
// import configuration from './configuration';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';
import * as Joi from 'joi';
import { connectionParams } from '../ormconfig';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { MenusModule } from './menus/menus.module';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Global()
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
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        DB_PORT: Joi.number().default(3306),
        DB_URL: Joi.string().domain(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        DB_SYNC: Joi.boolean().default(false),
        LOG_ON: Joi.boolean(),
        LOG_LEVEL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) =>
    //     ({
    //       type: configService.get(ConfigEnum.DB_TYPE),
    //       host: configService.get(ConfigEnum.DB_HOST),
    //       port: configService.get(ConfigEnum.DB_PORT),
    //       username: configService.get(ConfigEnum.DB_USERNAME),
    //       password: configService.get(ConfigEnum.DB_PASSWORD),
    //       database: configService.get(ConfigEnum.DB_DATABASE),
    //       entities: [User, Profile, Logs, Roles],
    //       synchronize: configService.get(ConfigEnum.DB_SYNC),
    //       // logging: process.env.NODE_ENV === 'development',
    //       logging: false,
    //     }) as TypeOrmModuleOptions,
    // }),
    LogsModule,
    AuthModule,
    RolesModule,
    MenusModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
