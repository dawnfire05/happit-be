import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Habit } from '@prisma/client';
import { UpdateHabitDTO } from './dto/update-habit.dto';
import { CreateHabitDTO } from './dto/create-habit.dto';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  async createHabit(userId: number, data: CreateHabitDTO): Promise<Habit> {
    const noticeTimeRaw = data.noticeTime ?? [];
    const noticeTime = noticeTimeRaw.map((t) =>
      t instanceof Date ? t : new Date(t as string),
    );

    const repeatDay = (data.repeatDay ?? []).map((d) =>
      typeof d === 'string' ? d.toLowerCase() as 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' : d,
    );

    return this.prisma.habit.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        name: data.name,
        type: data.type ?? 'none',
        description: data.description,
        archiveStatus: data.archiveStatus ?? false,
        repeatType: data.repeatType,
        repeatDay,
        noticeTime,
        themeColor:
          typeof data.themeColor === 'string'
            ? data.themeColor
            : String(data.themeColor ?? '#66D271'),
      },
    });
  }

  async getHabits(userId: number): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'asc' },
    });
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
