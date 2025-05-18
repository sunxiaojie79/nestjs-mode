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
  UseFilters,
  Headers,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Logs } from 'src/logs/logs.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseFilters(new TypeormFilter())
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
  @UseGuards(AuthGuard('jwt'))
  getUserProfile(@Query() query: any, @Req() req): Promise<User> {
    console.log('🚀 ~ UserController ~ getUserProfile ~ query:', query);
    // req.user是通过AuthGuard('jwt')的validate方法返回的
    console.log('🚀 ~ UserController ~ getUserProfile ~ req:', req.user);
    return this.userService.findProfile(query.id);
  }

  @Get('/:id')
  getUser(@Param('id') id: number): any {
    return this.userService.findOne(id);
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
  updateUser(
    @Param('id') id: number,
    @Body() user: User,
    @Headers('Authorization') headers: number,
  ): any {
    console.log('🚀 ~ UserController ~ updateUser ~ headers:', headers);
    if (headers === id) {
      return this.userService.update(id, user);
    } else {
      throw new UnauthorizedException('无权限');
    }
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number): any {
    return this.userService.remove(id);
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
