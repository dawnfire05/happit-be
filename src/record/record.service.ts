import { Injectable } from '@nestjs/common';
import { CreateOrUpdateRecordDto } from './dto/create-or-update-record.dto';
// import { UpdateRecordDto } from './dto/update-record.dto';
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

  findAll(userId: number) {
    return this.prisma.record.findMany({
      where: {
        userId: userId,
      },
      include: {
        habit: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.record.findMany({ where: { habitId: id } });
  }

  // update(id: number, updateRecordDto: UpdateRecordDto) {
  //   return `This action updates a #${id} record`;
  // }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
