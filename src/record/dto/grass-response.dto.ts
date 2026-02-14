import { ApiProperty } from '@nestjs/swagger';

export class GrassRecordItemDto {
  @ApiProperty({
    description: 'Record date (YYYY-MM-DD)',
    example: '2025-02-15',
  })
  date: string;

  @ApiProperty({
    description: 'Completion state',
    enum: ['done', 'notDone', 'skipped'],
  })
  state: string;
}

export class GrassItemDto {
  @ApiProperty({ description: 'Habit id' })
  habitId: number;

  @ApiProperty({
    description: 'Records in the date range (for grass view)',
    type: [GrassRecordItemDto],
  })
  records: GrassRecordItemDto[];
}
