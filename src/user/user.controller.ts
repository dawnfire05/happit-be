import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, user as userModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly Userervice: UserService) {}

  @Post()
  async createUser(
    @Body() userData: Prisma.userCreateInput,
  ): Promise<userModel> {
    return this.Userervice.createUser(userData);
  }

  @Get()
  async getUsers(): Promise<userModel[]> {
    return this.Userervice.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<userModel> {
    return this.Userervice.getUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Prisma.userUpdateInput,
  ): Promise<userModel> {
    return this.Userervice.updateUser(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<userModel> {
    return this.Userervice.deleteUser(id);
  }
}
