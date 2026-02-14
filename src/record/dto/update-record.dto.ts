import { PartialType } from '@nestjs/swagger';
import { CreateOrUpdateRecordDto } from './create-or-update-record.dto';

export class UpdateRecordDto extends PartialType(CreateOrUpdateRecordDto) {}
