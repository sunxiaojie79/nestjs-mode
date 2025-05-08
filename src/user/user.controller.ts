import { Controller, Get, Post, Inject, LoggerService } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Logs } from 'src/logs/logs.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.warn(UserController.name);
  }

  @Get()
  getUsers(): any {
    this.logger.log('🚀 ~ UserController ~ getUsers ~ db:');
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
