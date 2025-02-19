import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOrUpdateRecordDto } from './dto/create-or-update-record.dto';
import { ApiTags } from '@nestjs/swagger';

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

  @Get(':id')
  getRecordOfOneHabit(@Param('id') id: string) {
    return this.recordService.findOne(+id);
  }

  @Delete(':id')
  removeRecord(@Param('id') id: string) {
    return this.recordService.remove(+id);
  }
}
