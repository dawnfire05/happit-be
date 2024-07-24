import { Controller, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    return result;
  }
}
