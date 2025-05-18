import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('auth')
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
  signup(@Body() body: SigninUserDto) {
    const { username, password } = body;
    return this.authService.signup(username, password);
  }
}
