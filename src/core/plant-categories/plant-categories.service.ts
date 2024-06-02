import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import {
  PlantCategory,
  plantCategories,
} from '~/common/drizzle/schema/plant-categories';
import {
  CreatePlantCategoryRequest,
  PlantCategoryResponse,
  UpdatePlantCategoryRequest,
} from '../model/plant-category.model';
import { eq } from 'drizzle-orm';
import { Validation } from '~/common/validation';

@Injectable()
export class PlantCategoriesService {
  constructor(private readonly drizzleService: DrizzleService) {}
  private readonly logger: Logger = new Logger(PlantCategoriesService.name);

  async create(
    requestCreate: CreatePlantCategoryRequest,
  ): Promise<PlantCategoryResponse> {
    this.logger.debug(
      `PlantCategoriesService.create(${JSON.stringify(requestCreate)})`,
    );

    // Check if a plant category with the same name already exists
    const isPlantCategoryExist = await this.findByName(requestCreate.name);
    if (isPlantCategoryExist)
      throw new ConflictException(
        `Plant category ${requestCreate.name} already exists`,
      );

    const plantCategory = await this.drizzleService.db
      .insert(plantCategories)
      .values(requestCreate)
      .returning();

    return this.toPlantCategoriesResponse(plantCategory[0]);
  }

  async getAll(): Promise<PlantCategoryResponse[]> {
    this.logger.debug(`PlantCategoriesService.getAll()`);

    const plantCategories =
      await this.drizzleService.db.query.plantCategories.findMany();

    return plantCategories.map(this.toPlantCategoriesResponse);
  }

  async getById(plantCategoryId: string): Promise<PlantCategoryResponse> {
    this.logger.debug(`PlantCategoriesService.getById(${plantCategoryId})`);

    // is id is correct pattern
    Validation.validateId(plantCategoryId);

    const plantCategory = await this.checkPlantCategoryById(plantCategoryId);

    return this.toPlantCategoriesResponse(plantCategory);
  }

  async updateById(
    plantCategoryId: string,
    requestUpdate: UpdatePlantCategoryRequest,
  ): Promise<PlantCategoryResponse> {
    this.logger.debug(
      `PlantCategoriesService.updateById(${plantCategoryId}, ${JSON.stringify(requestUpdate)})`,
    );

    // is id is correct pattern
    Validation.validateId(plantCategoryId);

    // Check if a plant category with the same name already exists
    const isPlantCategoryExistByName = await this.findByName(
      requestUpdate.name,
    );
    if (isPlantCategoryExistByName)
      throw new ConflictException(
        `Plant category ${requestUpdate.name} already exist`,
      );

    let plantCategory = await this.checkPlantCategoryById(plantCategoryId);
    plantCategory = await this.drizzleService.db
      .update(plantCategories)
      .set({ name: requestUpdate.name, updatedAt: new Date() })
      .where(eq(plantCategories.id, plantCategoryId))
      .returning()
      .then((result) => result[0]);

    return this.toPlantCategoriesResponse(plantCategory);
  }

  async deleteById(id: string): Promise<PlantCategoryResponse> {
    this.logger.debug(`PlantCategoriesService.deleteById(${id})`);
    // is id is correct pattern
    Validation.validateId(id);
    await this.checkPlantCategoryById(id);

    const plantCategory = await this.drizzleService.db
      .delete(plantCategories)
      .where(eq(plantCategories.id, id))
      .returning();

    return this.toPlantCategoriesResponse(plantCategory[0]);
  }

  toPlantCategoriesResponse(
    plantCategory: PlantCategory,
  ): PlantCategoryResponse {
    return {
      id: plantCategory.id,
      name: plantCategory.name,
      createdAt: plantCategory.createdAt,
      updatedAt: plantCategory.updatedAt,
    };
  }

  async checkPlantCategoryById(id: string): Promise<PlantCategory> {
    const plantCategory =
      await this.drizzleService.db.query.plantCategories.findFirst({
        where: (plantCategories, { eq }) => eq(plantCategories.id, id),
      });

    if (!plantCategory) {
      throw new NotFoundException(`Plant category ${id} does not exist`);
    }

    return plantCategory;
  }

  async findByName(name: string): Promise<PlantCategory | null> {
    const result = await this.drizzleService.db.query.plantCategories.findFirst(
      {
        where: (plantCategories, { eq }) => eq(plantCategories.name, name),
      },
    );

    return result || null;
  }
}
