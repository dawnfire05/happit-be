import { Module } from '@nestjs/common';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';

@Module({
  controllers: [HabitController],
  providers: [HabitService],
})
export class HabitModule {}
