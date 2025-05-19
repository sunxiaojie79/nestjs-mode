import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
// import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signin')
  async signin(@Body() body: SigninUserDto) {
    const { username, password } = body;
    const token = await this.authService.signin(username, password);
    return {
      access_token: token,
    };
  }

  @Post('/signup')
  // @UseInterceptors(SerializeInterceptor)
  signup(@Body() body: SigninUserDto) {
    const { username, password } = body;
    return this.authService.signup(username, password);
  }
}
