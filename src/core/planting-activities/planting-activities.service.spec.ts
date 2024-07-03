import { Test, TestingModule } from '@nestjs/testing';
import { PlantingActivitiesService } from './planting-activities.service';

describe('PlantingActivitiesService', () => {
  let service: PlantingActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantingActivitiesService],
    }).compile();

    service = module.get<PlantingActivitiesService>(PlantingActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
