export class CreateOrUpdateRecordDto {
  date: string;
  habitId: number;
  state: 'done' | 'notDone' | 'skipped';
}
