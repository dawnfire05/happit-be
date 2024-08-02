import { PartialType } from '@nestjs/mapped-types';
import { CreateHabitDTO } from './create-habit.dto';

export class UpdateHabitDTO extends PartialType(CreateHabitDTO) {}
