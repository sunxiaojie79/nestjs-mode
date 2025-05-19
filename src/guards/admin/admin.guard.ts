import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('🚀 ~ AdminGuard ~ canActivate ~ req:', req.user);
    const user = await this.userService.find(req.user.username);
    console.log('🚀 ~ AdminGuard ~ canActivate ~ user:', user);
    if (user.roles.filter((role) => role.id === 2).length > 0) {
      return true;
    }
    return false;
  }
}
