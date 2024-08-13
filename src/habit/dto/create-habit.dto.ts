import { ApiProperty } from '@nestjs/swagger';

export class CreateHabitDTO {
  @ApiProperty({ description: 'The name of the habit' })
  name: string;

  @ApiProperty({
    description: 'The type of the habit',
    default: 'none',
    required: false,
  })
  type?: string = 'none';

  @ApiProperty({ description: 'The description of the habit', required: false })
  description?: string;

  @ApiProperty({
    description: 'The archive status of the habit',
    default: false,
    required: false,
  })
  archiveStatus?: boolean;

  @ApiProperty({
    description: 'The repeat type of the habit',
    enum: ['daily', 'weekly'],
  })
  repeatType: 'daily' | 'weekly';

  @ApiProperty({
    description: 'The repeat days of the habit',
    enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    isArray: true,
    required: false,
  })
  repeatDay?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];

  noticeTime: Date[];

  themeColor: number; //enum : 0, 1, 2, 3, 4
}
