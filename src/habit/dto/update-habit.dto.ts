import { PartialType } from '@nestjs/swagger';
import { CreateHabitDTO } from './create-habit.dto';

export class UpdateHabitDTO extends PartialType(CreateHabitDTO) {}
