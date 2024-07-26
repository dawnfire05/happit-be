import { Test, TestingModule } from '@nestjs/testing';
import { HabitController } from './habit.controller';
import { HabitService } from './habit.service';

describe('HabitController', () => {
  let controller: HabitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitController],
      providers: [HabitService],
    }).compile();

    controller = module.get<HabitController>(HabitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
