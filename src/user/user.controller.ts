import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { User } from './user.entity';
import { Logs } from 'src/logs/logs.entity';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getUsers(): any {
    const db = this.configService.get(ConfigEnum.DB_TYPE);
    const dbHost = this.configService.get(ConfigEnum.DB_HOST);
    const dbPort = this.configService.get(ConfigEnum.DB_PORT);
    console.log('🚀 ~ UserController ~ getUsers ~ db:', db, dbHost, dbPort);
    // const db = this.configService.get('db');
    // console.log('🚀 ~ UserController ~ getUsers ~ db:', db);
    // return this.userService.getUsers();
    return this.userService.findAll();
  }

  @Post()
  addUser(): any {
    const user = {
      username: 'test',
      password: '123456',
    } as User;
    return this.userService.create(user);
  }

  @Get('/profile')
  getUserProfile(): Promise<User> {
    return this.userService.findProfile(1);
  }

  @Get('/logs')
  getUserLogs(): Promise<Logs[]> {
    return this.userService.findUserLogs(1);
  }

  @Get('logsByGroup')
  async getLogsByGroup(): Promise<any[]> {
    const res = await this.userService.findLogsByGroup(1);
    return res.map((item) => {
      return {
        result: item.result,
        count: item.count,
      };
    });
  }
}
