import { Test, TestingModule } from '@nestjs/testing';
import { PlantingActivitiesController } from './planting-activities.controller';
import { PlantingActivitiesService } from './planting-activities.service';

describe('PlantingActivitiesController', () => {
  let controller: PlantingActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantingActivitiesController],
      providers: [PlantingActivitiesService],
    }).compile();

    controller = module.get<PlantingActivitiesController>(PlantingActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
