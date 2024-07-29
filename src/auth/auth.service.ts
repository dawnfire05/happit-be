import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateKakaoUser(profile: any) {
    const { kakaoId, username, email, accessToken, refreshToken } = profile;
    let user = await this.prisma.user.findUnique({ where: { kakaoId } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          kakaoId,
          username,
          email,
          kakaoAccessToken: accessToken,
          kakaoRefreshToken: refreshToken,
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          email,
          username,
          kakaoAccessToken: accessToken,
          kakaoRefreshToken: refreshToken,
        },
      });
    }

    return user;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByUserName(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });
    await this.userService.setRefreshToken(user.id, refreshToken);
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      }),
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      const user = await this.userService.getUserIfRefreshTokenMatches(
        payload.sub,
        refreshToken,
      );

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { username: user.username, sub: user.id };
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      await this.userService.setRefreshToken(user.id, newRefreshToken);
      await this.userService.invalidateRefreshToken(refreshToken);

      return {
        access_token: this.jwtService.sign(newPayload, {
          expiresIn: '60m',
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        }),
        refresh_token: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
