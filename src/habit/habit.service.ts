import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { habit, Prisma } from '@prisma/client';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  async createHabit(data: Prisma.habitCreateInput): Promise<habit> {
    return this.prisma.habit.create({
      data,
    });
  }

  async getHabits(userId: number): Promise<habit[]> {
    return this.prisma.habit.findMany({ where: { user_id: userId } });
  }

  async getHabitById(id: number): Promise<habit | null> {
    return this.prisma.habit.findUnique({ where: { id } });
  }

  async updateHabit(id: number, data: Prisma.habitUpdateInput): Promise<habit> {
    return this.prisma.habit.update({
      where: { id },
      data,
    });
  }

  async deleteHabit(id: number): Promise<habit> {
    return this.prisma.habit.delete({ where: { id } });
  }
}
