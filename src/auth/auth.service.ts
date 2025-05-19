import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signin(username: string, password: string) {
    const user = await this.userService.find(username);
    if (!user) {
      throw new ForbiddenException('用户不存在，请先注册');
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或密码错误');
    }
    const payload = { username: user.username, sub: user.id };
    return await this.jwtService.signAsync(payload);
  }

  async signup(username: string, password: string) {
    const user = await this.userService.find(username);
    if (user) {
      throw new ForbiddenException('用户已存在');
    }
    const res = await this.userService.create({
      username,
      password,
    });
    return res;
  }
}
