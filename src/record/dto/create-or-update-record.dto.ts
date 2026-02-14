import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateRecordDto {
  @ApiProperty({
    description: 'Record date (YYYY-MM-DD)',
    example: '2025-02-15',
  })
  date: string;

  @ApiProperty({ description: 'Habit id' })
  habitId: number;

  @ApiProperty({
    description: 'Completion state',
    enum: ['done', 'notDone', 'skipped'],
  })
  state: 'done' | 'notDone' | 'skipped';
}
