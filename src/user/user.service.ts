import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.user.findMany();
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
