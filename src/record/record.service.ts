import { Injectable } from '@nestjs/common';
import { CreateOrUpdateRecordDto } from './dto/create-or-update-record.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateRecord(
    createOrUpdateRecordDto: CreateOrUpdateRecordDto,
    userId: number,
  ) {
    const { habitId, date, state } = createOrUpdateRecordDto;

    const existingRecord = await this.prisma.record.findFirst({
      where: {
        habitId: habitId,
        date: date,
      },
    });

    if (existingRecord) {
      return this.prisma.record.update({
        where: { id: existingRecord.id },
        data: { state: state },
      });
    } else {
      return this.prisma.record.create({
        data: {
          user: { connect: { id: userId } },
          habit: { connect: { id: habitId } },
          date: date,
          state: state,
        },
      });
    }
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

  remove(id: number) {
    return this.prisma.record.delete({ where: { id: id } });
  }
}
