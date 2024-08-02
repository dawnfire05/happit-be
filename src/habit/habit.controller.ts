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
  Request,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import { Habit } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateHabitDTO } from './dto/create-habit.dto';
import { UpdateHabitDTO } from './dto/update-habit.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('habit')
@Controller('habit')
@UseGuards(JwtAuthGuard)
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @ApiBody({
    type: CreateHabitDTO,
  })
  @ApiResponse({ status: 201, description: 'successful' })
  @Post()
  async createHabit(
    @Body() data: CreateHabitDTO,
    @Request() req,
  ): Promise<Habit> {
    return this.habitService.createHabit(req.user.id, data);
  }

  @ApiResponse({ status: 200, description: 'successful' })
  @Get(':userId')
  async getHabits(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Habit[]> {
    return this.habitService.getHabits(userId);
  }

  @Get('detail/:id')
  async getHabitById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Habit | null> {
    return this.habitService.getHabitById(id);
  }

  @Patch(':id')
  async updateHabit(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHabitDto: UpdateHabitDTO,
    @Request() req,
  ): Promise<Habit> {
    const habit = await this.habitService.getHabitById(id);
    if (habit.userId !== req.user.id) {
      throw new UnauthorizedException('You can only update your own habits.');
    }
    return this.habitService.updateHabit(id, updateHabitDto);
  }

  @Delete(':id')
  async deleteHabit(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Habit> {
    const habit = await this.habitService.getHabitById(id);
    if (habit.userId !== req.user.id) {
      throw new UnauthorizedException('You can only delete your own habits.');
    }
    return this.habitService.deleteHabit(id);
  }
}
