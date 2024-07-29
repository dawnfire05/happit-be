import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req) {
    const user = req.user;
    const { access_token, refresh_token } = await this.authService.login(user);
    return { access_token, refresh_token };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  async logout(@Body('refresh_token') refreshToken: string) {
    await this.userService.invalidateRefreshToken(refreshToken);
    return { message: 'Logged out' };
  }
}
