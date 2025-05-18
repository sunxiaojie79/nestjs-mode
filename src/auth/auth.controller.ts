import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signin')
  signin(@Body() body: SigninUserDto) {
    return this.authService.signin(body.username, body.password);
  }

  @Post('/signup')
  signup(@Body() body: SigninUserDto) {
    const { username, password } = body;
    // if (!username || !password) {
    //   throw new HttpException('Username and password are required', 400);
    // }
    // if (typeof username !== 'string' || typeof password !== 'string') {
    //   throw new HttpException('Username and password must be strings', 400);
    // }
    // if (username.length < 6 || password.length < 6) {
    //   throw new HttpException(
    //     'Username and password must be at least 6 characters long',
    //     400,
    //   );
    // }
    return this.authService.signup(username, password);
  }
}
