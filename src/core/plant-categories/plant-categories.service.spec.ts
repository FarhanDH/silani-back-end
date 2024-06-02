import { Test, TestingModule } from '@nestjs/testing';
import { PlantCategoriesService } from './plant-categories.service';

describe('PlantCategoriesService', () => {
  let service: PlantCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantCategoriesService],
    }).compile();

    service = module.get<PlantCategoriesService>(PlantCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
