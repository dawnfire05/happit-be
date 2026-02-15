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
  Request,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import { Habit } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateHabitDTO } from './dto/create-habit.dto';
import { UpdateHabitDTO } from './dto/update-habit.dto';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BusinessException } from '../common/business-exception';
import { ErrorCode } from '../common/error-code';

@ApiTags('habit')
@ApiBearerAuth()
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

  @Get('dashboard')
  @ApiResponse({
    status: 200,
    description: 'Dashboard with habits and records (N+1 optimized)',
    type: DashboardResponseDto,
  })
  async getDashboard(
    @Query('months', new DefaultValuePipe(3), ParseIntPipe) months: number,
    @Request() req,
  ): Promise<DashboardResponseDto> {
    return this.habitService.getDashboard(req.user.id, months);
  }

  @Get(':id')
  async getHabitById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Habit | null> {
    const habit = await this.habitService.getHabitById(id);
    if (habit.userId === req.user.id) return habit;
    else throw new BusinessException(ErrorCode.FORBIDDEN_HABIT_ACCESS, 403);
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
    } else throw new BusinessException(ErrorCode.FORBIDDEN_HABIT_UPDATE, 403);
  }

  @Delete(':id')
  async deleteHabit(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Habit> {
    const habit = await this.habitService.getHabitById(id);
    if (habit.userId === req.user.id) {
      return this.habitService.deleteHabit(id);
    } else throw new BusinessException(ErrorCode.FORBIDDEN_HABIT_DELETE, 403);
  }
}
