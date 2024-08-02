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

  @Post()
  @ApiBody({
    type: CreateHabitDTO,
  })
  @ApiResponse({ status: 201, description: 'successful' })
  async createHabit(
    @Body() data: CreateHabitDTO,
    @Request() req,
  ): Promise<Habit> {
    return this.habitService.createHabit(req.user.id, data);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'successful' })
  async getHabits(@Request() req): Promise<Habit[]> {
    return this.habitService.getHabits(req.user.id);
  }

  @Get(':id')
  async getHabitById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Habit | null> {
    const habit = await this.habitService.getHabitById(id);
    if (habit.userId === req.user.id) return habit;
    else
      throw new UnauthorizedException(
        'you can only access habit created by yourself',
      );
  }

  @Patch(':id')
  async updateHabit(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateHabitDTO,
    @Request() req,
  ): Promise<Habit> {
    const habit = await this.habitService.getHabitById(id);
    if (habit.userId === req.user.id) {
      return this.habitService.updateHabit(id, data);
    } else
      throw new UnauthorizedException('You can only update your own habits.');
  }

  @Delete(':id')
  async deleteHabit(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Habit> {
    const habit = await this.habitService.getHabitById(id);
    if (habit.userId === req.user.id) {
      return this.habitService.deleteHabit(id);
    } else
      throw new UnauthorizedException('You can only delete your own habits.');
  }
}
