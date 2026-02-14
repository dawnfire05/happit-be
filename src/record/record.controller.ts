import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOrUpdateRecordDto } from './dto/create-or-update-record.dto';
import { GrassItemDto } from './dto/grass-response.dto';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('record')
@Controller('record')
@UseGuards(JwtAuthGuard)
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  createRecord(@Body() createRecordDto: CreateOrUpdateRecordDto, @Req() req) {
    return this.recordService.createOrUpdateRecord(
      createRecordDto,
      req.user.id,
    );
  }

  @Get()
  getRecordOfAllHabit(@Req() req) {
    return this.recordService.findAll(req.user.id);
  }

  @Get('grass')
  @ApiOkResponse({
    description: '습관별 최근 N개월 기록 (잔디)',
    type: GrassItemDto,
    isArray: true,
  })
  getGrass(
    @Req() req,
    @Query('months', new DefaultValuePipe(5), ParseIntPipe) months: number,
  ) {
    return this.recordService.getGrass(req.user.id, months);
  }

  @Get(':id')
  getRecordOfOneHabit(@Param('id') id: string) {
    return this.recordService.findOne(+id);
  }

  @Delete(':id')
  removeRecord(@Param('id') id: string) {
    return this.recordService.remove(+id);
  }
}
