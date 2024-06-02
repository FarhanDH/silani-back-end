import { Test, TestingModule } from '@nestjs/testing';
import { PlantCategoriesController } from './plant-categories.controller';
import { PlantCategoriesService } from './plant-categories.service';

describe('PlantCategoriesController', () => {
  let controller: PlantCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantCategoriesController],
      providers: [PlantCategoriesService],
    }).compile();

    controller = module.get<PlantCategoriesController>(PlantCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
