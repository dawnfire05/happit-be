import { Injectable } from '@nestjs/common';
import { Prisma, user as User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async setRefreshToken(userId: number, refreshToken: string) {
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
      },
    });
  }

  async getUserIfRefreshTokenMatches(userId: number, refreshToken: string) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        refreshTokens: {
          some: {
            token: refreshToken,
          },
        },
      },
    });
  }

  async invalidateRefreshToken(refreshToken: string) {
    await this.prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
  }

  //post
  async createUser(data: Prisma.userCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
    return this.prisma.user.create({
      data,
    });
  }

  //get
  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  //get
  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByUserName(name: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { username: name },
    });
  }

  //put
  async updateUser(id: number, data: Prisma.userUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  //delete
  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
