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

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createRecord(@Body() createRecordDto: CreateOrUpdateRecordDto, @Req() req) {
    return this.recordService.createOrUpdateRecord(
      createRecordDto,
      req.user.id,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.recordService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
  //   return this.recordService.update(+id, updateRecordDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordService.remove(+id);
  }
}
