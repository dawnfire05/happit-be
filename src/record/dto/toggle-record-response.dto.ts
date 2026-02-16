import { ApiProperty } from '@nestjs/swagger';

export class RecordDto {
  @ApiProperty({ example: 1, description: '기록 ID' })
  id: number;

  @ApiProperty({ example: 1, description: '습관 ID' })
  habitId: number;

  @ApiProperty({ example: '2026-02-15', description: '기록 날짜' })
  date: string;

  @ApiProperty({ example: 'done', description: '기록 상태 (done, skip, none)' })
  state: string;

  @ApiProperty({
    example: '2026-02-15T10:30:00.000Z',
    description: '생성 시각',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-15T10:30:00.000Z',
    description: '수정 시각',
  })
  updatedAt: Date;
}

export class ToggleRecordResponseDto {
  @ApiProperty({ type: RecordDto, description: '생성/수정된 기록' })
  record: RecordDto;

  @ApiProperty({ example: 7, description: '업데이트된 현재 연속 일수' })
  updatedStreak: number;

  @ApiProperty({ example: 15, description: '업데이트된 최고 연속 일수' })
  longestStreak: number;

  @ApiProperty({
    example: '2026-02-15T10:30:00.000Z',
    description: '마지막 완료 일시',
    nullable: true,
  })
  lastCompletedAt: Date | null;

  @ApiProperty({
    example: '2026-02-15T10:30:00.000Z',
    description: '응답 타임스탬프',
  })
  timestamp: string;
}
