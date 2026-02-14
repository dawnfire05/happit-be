import { Injectable } from '@nestjs/common';
import { CreateOrUpdateRecordDto } from './dto/create-or-update-record.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

type PrismaTx = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt: Date | null;
}

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  private static addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T00:00:00.000Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }

  private async computeStreakFromRecords(
    habitId: number,
    tx: PrismaTx,
  ): Promise<StreakResult> {
    const records = await tx.record.findMany({
      where: { habitId },
      select: { date: true, state: true },
      orderBy: { date: 'asc' },
    });

    const doneDates = records
      .filter((r) => r.state === 'done')
      .map((r) => r.date)
      .filter((d, i, arr) => arr.indexOf(d) === i);

    if (doneDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastCompletedAt: null };
    }

    const doneSet = new Set(doneDates);
    const todayStr = new Date().toISOString().slice(0, 10);

    const mostRecent = doneDates[doneDates.length - 1];
    const mostRecentDate = new Date(mostRecent + 'T00:00:00.000Z');
    const todayDate = new Date(todayStr + 'T00:00:00.000Z');
    const diffDays = Math.floor(
      (todayDate.getTime() - mostRecentDate.getTime()) / (24 * 60 * 60 * 1000),
    );

    let currentStreak = 0;
    if (diffDays <= 1) {
      let check = mostRecent;
      while (doneSet.has(check)) {
        currentStreak++;
        check = RecordService.addDays(check, -1);
      }
    }

    let longestStreak = 1;
    let run = 1;
    for (let i = 1; i < doneDates.length; i++) {
      const prev = new Date(doneDates[i - 1] + 'T00:00:00.000Z');
      const curr = new Date(doneDates[i] + 'T00:00:00.000Z');
      const gap = (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
      if (gap === 1) {
        run++;
        longestStreak = Math.max(longestStreak, run);
      } else {
        run = 1;
      }
    }

    const lastCompletedAt = new Date(mostRecent + 'T00:00:00.000Z');

    return {
      currentStreak,
      longestStreak,
      lastCompletedAt,
    };
  }

  async createOrUpdateRecord(
    createOrUpdateRecordDto: CreateOrUpdateRecordDto,
    userId: number,
  ) {
    const { habitId, date, state } = createOrUpdateRecordDto;

    return this.prisma.$transaction(async (tx) => {
      const existingRecord = await tx.record.findFirst({
        where: { habitId, date },
      });

      let record;
      if (existingRecord) {
        record = await tx.record.update({
          where: { id: existingRecord.id },
          data: { state },
        });
      } else {
        record = await tx.record.create({
          data: {
            user: { connect: { id: userId } },
            habit: { connect: { id: habitId } },
            date,
            state,
          },
        });
      }

      const streak = await this.computeStreakFromRecords(habitId, tx);
      await tx.habit.update({
        where: { id: habitId },
        data: {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastCompletedAt: streak.lastCompletedAt,
        },
      });

      return record;
    });
  }

  async findAll(userId: number) {
    const records = await this.prisma.record.findMany({
      where: { userId: userId },
      include: {
        habit: true,
      },
    });

    const groupedRecords = records.reduce((acc, record) => {
      const habitId = record.habitId;

      if (!acc[habitId]) {
        acc[habitId] = {
          habitId: habitId,
          records: [],
        };
      }

      acc[habitId].records.push({
        id: record.id,
        date: record.date,
        state: record.state,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });

      return acc;
    }, {});

    return Object.values(groupedRecords);
  }
  findOne(id: number) {
    return this.prisma.record.findMany({
      select: {
        id: true,
        date: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { habitId: id },
    });
  }

  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.record.findUniqueOrThrow({
        where: { id },
        select: { habitId: true },
      });
      await tx.record.delete({ where: { id } });
      const streak = await this.computeStreakFromRecords(record.habitId, tx);
      await tx.habit.update({
        where: { id: record.habitId },
        data: {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastCompletedAt: streak.lastCompletedAt,
        },
      });
    });
  }

  async getGrass(userId: number, months: number = 5) {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    const habits = await this.prisma.habit.findMany({
      where: { userId },
      select: { id: true },
    });

    const result = await Promise.all(
      habits.map(async (habit) => {
        const records = await this.prisma.record.findMany({
          where: {
            habitId: habit.id,
            date: { gte: startStr, lte: endStr },
          },
          select: { date: true, state: true },
          orderBy: { date: 'asc' },
        });
        return {
          habitId: habit.id,
          records: records.map((r) => ({ date: r.date, state: r.state })),
        };
      }),
    );

    return result;
  }
}
