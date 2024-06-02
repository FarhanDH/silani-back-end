import { Injectable, Logger } from '@nestjs/common';
import { CreatePlantCategoryDto } from './dto/create-plant-category.dto';
import { UpdatePlantCategoryDto } from './dto/update-plant-category.dto';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { plantCategories } from '~/common/drizzle/schema/plant-categories';

@Injectable()
export class PlantCategoriesService {
  constructor(private readonly drizzleService: DrizzleService) {}
  private readonly logger: Logger = new Logger(PlantCategoriesService.name);

  async create(createPlantCategoryDto: CreatePlantCategoryDto) {
    this.logger.debug(
      `PlantCategoriesService.create(${JSON.stringify(createPlantCategoryDto)})`,
    );
    return await this.drizzleService.db
      .insert(plantCategories)
      .values(createPlantCategoryDto)
      .returning();
  }

  getAll() {
    return `This action returns all plantCategories`;
  }

  getById(id: number) {
    return `This action returns a #${id} plantCategory`;
  }

  updateById(id: number, updatePlantCategoryDto: UpdatePlantCategoryDto) {
    return `This action updates a #${id} plantCategory`;
  }

  deleteById(id: number) {
    return `This action removes a #${id} plantCategory`;
  }
}
