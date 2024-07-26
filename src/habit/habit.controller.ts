import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import { habit as habitModel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';

@Controller('habit')
@UseGuards(JwtAuthGuard)
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  async createHabit(
    @Body()
    habitData: {
      name: string;
      description: string;
      status: string;
      repeat_type: number;
      repeat_day: number;
    },
    @GetUser() user: { userId: number },
  ): Promise<habitModel> {
    const { name, description, status, repeat_type, repeat_day } = habitData;
    return this.habitService.createHabit({
      name,
      description,
      status,
      repeat_type,
      repeat_day,
      user: {
        connect: {
          id: user.userId,
        },
      },
    });
  }

  @Get(':userId')
  async getHabits(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<habitModel[]> {
    return this.habitService.getHabits(userId);
  }

  @Get('detail/:id')
  async getHabitById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<habitModel | null> {
    return this.habitService.getHabitById(id);
  }

  @Patch(':id')
  async updateHabit(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    habitData: {
      name?: string;
      description?: string;
      status?: string;
      repeat_type?: number;
      repeat_day?: number;
    },
    @GetUser() user: { userId: number },
  ): Promise<habitModel> {
    const habit = await this.habitService.getHabitById(id);
    if (habit.user_id !== user.userId) {
      throw new UnauthorizedException('You can only update your own habits.');
    }
    return this.habitService.updateHabit(id, habitData);
  }

  @Delete(':id')
  async deleteHabit(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: { userId: number },
  ): Promise<habitModel> {
    const habit = await this.habitService.getHabitById(id);
    if (habit.user_id !== user.userId) {
      throw new UnauthorizedException('You can only delete your own habits.');
    }
    return this.habitService.deleteHabit(id);
  }
}
