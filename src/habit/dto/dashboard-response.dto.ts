import { ApiProperty } from '@nestjs/swagger';

export class RecordDto {
  @ApiProperty({ example: '2026-02-15', description: '기록 날짜 (YYYY-MM-DD)' })
  date: string;

  @ApiProperty({ example: 'done', description: '기록 상태 (done, skip, none)' })
  state: string;
}

export class HabitItemDto {
  @ApiProperty({ example: 1, description: '습관 ID' })
  id: number;

  @ApiProperty({ example: '운동하기', description: '습관 이름' })
  name: string;

  @ApiProperty({
    example: '매일 30분 운동',
    description: '습관 설명',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: '#66D271', description: '테마 색상' })
  themeColor: string;

  @ApiProperty({ example: 7, description: '현재 연속 일수' })
  currentStreak: number;

  @ApiProperty({ example: 15, description: '최고 연속 일수' })
  longestStreak: number;

  @ApiProperty({ example: 'daily', description: '반복 타입' })
  repeatType: string;

  @ApiProperty({
    example: ['mon', 'wed', 'fri'],
    description: '반복 요일',
    isArray: true,
  })
  repeatDay: string[];

  @ApiProperty({
    example: false,
    description: '아카이브 상태',
  })
  archiveStatus: boolean;

  @ApiProperty({
    example: '2026-02-15T10:30:00.000Z',
    description: '마지막 완료 일시',
    nullable: true,
  })
  lastCompletedAt: Date | null;
}

export class HabitWithRecordsDto {
  @ApiProperty({ type: HabitItemDto, description: '습관 정보' })
  habit: HabitItemDto;

  @ApiProperty({
    type: [RecordDto],
    description: '기록 목록 (최근 N개월)',
  })
  records: RecordDto[];
}

export class DashboardResponseDto {
  @ApiProperty({
    type: [HabitWithRecordsDto],
    description: '습관 목록과 각 습관의 기록',
  })
  data: HabitWithRecordsDto[];

  @ApiProperty({
    example: '2026-02-15T10:30:00.000Z',
    description: '데이터 동기화 시각',
  })
  syncedAt: string;
}
