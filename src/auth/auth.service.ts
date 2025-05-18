import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
// import { getUserDto } from 'src/user/dto/get-user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signin(username: string, password: string) {
    const user = await this.userService.find(username);
    if (user && user.password === password) {
      const payload = { username: user.username, sub: user.id };
      return await this.jwtService.signAsync(payload);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async signup(username: string, password: string) {
    const res = await this.userService.create({
      username,
      password,
    });
    return res;
  }
}
