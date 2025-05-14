import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { getUserDto } from 'src/user/dto/get-user.dto';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async signin(username: string, password: string) {
    console.log('signin');
    const user = await this.userService.findAll({
      username,
    } as getUserDto);
    return user;
  }

  signup(username: string, password: string) {
    return {
      username,
      password,
    };
  }
}
