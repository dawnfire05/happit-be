import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Habit } from '@prisma/client';
import { UpdateHabitDTO } from './dto/update-habit.dto';
import { CreateHabitDTO } from './dto/create-habit.dto';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  async createHabit(userId: number, data: CreateHabitDTO): Promise<Habit> {
    return this.prisma.habit.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        name: data.name,
        type: data.type,
        description: data.description,
        archiveStatus: data.archiveStatus,
        repeatType: data.repeatType,
        repeatDay: data.repeatDay,
      },
    });
  }

  async getHabits(userId: number): Promise<Habit[]> {
    return this.prisma.habit.findMany({ where: { userId: userId } });
  }

  async getHabitById(id: number): Promise<Habit | null> {
    return this.prisma.habit.findUnique({ where: { id } });
  }

  async updateHabit(id: number, data: UpdateHabitDTO): Promise<Habit> {
    return this.prisma.habit.update({
      where: { id },
      data,
    });
  }

  async deleteHabit(id: number): Promise<Habit> {
    return this.prisma.habit.delete({ where: { id } });
  }
}
