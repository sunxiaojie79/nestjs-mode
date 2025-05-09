import {
  Controller,
  Get,
  Post,
  Inject,
  LoggerService,
  Param,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Logs } from 'src/logs/logs.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';

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
  @Get('/profile')
  getUserProfile(@Query() query: any): Promise<User> {
    return this.userService.findProfile(query.id);
  }

  @Get('/:id')
  getUser(@Param('id') id: number): any {
    // return this.userService.findById(id);
  }

  @Get()
  getUsers(@Query() query: getUserDto): any {
    console.log('🚀 ~ UserController ~ getUsers ~ query:', query);
    // page, limit, condition(username, roles, gender), sort
    return this.userService.findAll(query);
  }

  @Post()
  addUser(@Body() user: User): any {
    return this.userService.create(user);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() user: User): any {
    return this.userService.update(id, user);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): any {
    // return this.userService.delete(id);
  }

  // todo logs module
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
