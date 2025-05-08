import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './src/user/user.entity';
import { Profile } from './src/user/profile.entity';
import { Logs } from './src/logs/logs.entity';
import { Roles } from './src/roles/roles.entity';

export default {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'example',
  database: 'testdb',
  entities: [User, Profile, Logs, Roles],
  synchronize: true,
  // logging: process.env.NODE_ENV === 'development',
  logging: false,
} as TypeOrmModuleOptions;
