import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Habit } from '@prisma/client';
import { UpdateHabitDTO } from './dto/update-habit.dto';
import { CreateHabitDTO } from './dto/create-habit.dto';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  async createHabit(userId: number, data: CreateHabitDTO): Promise<Habit> {
    const noticeTimeRaw = data.noticeTime ?? [];
    const noticeTime = noticeTimeRaw.map((t) =>
      t instanceof Date ? t : new Date(t as string),
    );

    const repeatDay = (data.repeatDay ?? []).map((d) =>
      typeof d === 'string'
        ? (d.toLowerCase() as
            | 'mon'
            | 'tue'
            | 'wed'
            | 'thu'
            | 'fri'
            | 'sat'
            | 'sun')
        : d,
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

  /**
   * 대시보드 API: 습관 목록 + 최근 N개월 기록을 단일 쿼리로 조회
   * N+1 문제 해결을 위해 Prisma의 include를 사용
   */
  async getDashboard(
    userId: number,
    months: number = 3,
  ): Promise<DashboardResponseDto> {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    // 단일 쿼리로 습관 + 기록 조회 (N+1 방지)
    const habits = await this.prisma.habit.findMany({
      where: { userId },
      include: {
        records: {
          where: {
            date: { gte: startStr, lte: endStr },
          },
          select: { date: true, state: true },
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      data: habits.map((habit) => ({
        habit: {
          id: habit.id,
          name: habit.name,
          description: habit.description,
          themeColor: habit.themeColor,
          currentStreak: habit.currentStreak,
          longestStreak: habit.longestStreak,
          repeatType: habit.repeatType,
          repeatDay: habit.repeatDay,
          archiveStatus: habit.archiveStatus,
          lastCompletedAt: habit.lastCompletedAt,
        },
        records: habit.records.map((r) => ({
          date: r.date,
          state: r.state,
        })),
      })),
      syncedAt: new Date().toISOString(),
    };
  }
}
