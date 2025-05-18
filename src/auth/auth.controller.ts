import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signin')
  signin(@Body() body: SigninUserDto) {
    return this.authService.signin(body.username, body.password);
  }

  @Post('/signup')
  signup(@Body() body: SigninUserDto) {
    const { username, password } = body;
    return this.authService.signup(username, password);
  }
}
