import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { PlantCategory } from '~/common/drizzle/schema';
import { Plant, plants } from '~/common/drizzle/schema/plants';
import { uniqueKeyFile } from '~/common/utils';
import { Validation } from '~/common/validation';
import {
  CreatePlantRequest,
  PlantResponse,
  UpdatePlantRequest,
} from '../models/plant.model';
import { StorageService } from '../storage/storage.service';
import { PlantCategoriesService } from '../plant-categories/plant-categories.service';

@Injectable()
export class PlantsService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly plantCategoriesService: PlantCategoriesService,
    private readonly storageService: StorageService,
  ) {}
  private readonly logger: Logger = new Logger(PlantsService.name);

  async create(
    createPlantRequest: CreatePlantRequest,
    image: Express.Multer.File,
  ): Promise<PlantResponse> {
    this.logger.debug(
      `PlantsService.create(${JSON.stringify(createPlantRequest)}, with image ${image.originalname})`,
    );

    // is plant category exist
    await this.plantCategoriesService.checkPlantCategoryById(
      createPlantRequest.plantCategoryId,
    );

    // check is plant already exist by name
    const isPlantExistByName = await this.findByName(createPlantRequest.name);
    if (isPlantExistByName) {
      this.logger.warn(`Plant ${createPlantRequest.name} already exists`);
      throw new ConflictException(
        `Plant ${createPlantRequest.name} already exists`,
      );
    }

    const generateUniqueKeyFileName = uniqueKeyFile(
      'plant',
      image.originalname,
    );

    try {
      const imageUploded = await this.storageService.upload(
        generateUniqueKeyFileName,
        image.buffer,
        image.mimetype,
      );

      const [createdPlant] = await this.drizzleService.db
        .insert(plants)
        .values({
          ...createPlantRequest,
          imageUrl: imageUploded.url,
          imageKey: generateUniqueKeyFileName,
        })
        .returning();
      return this.toPlantResponse(createdPlant);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async getAll(): Promise<PlantResponse[]> {
    const plantsRetrieved = await this.drizzleService.db.query.plants.findMany({
      with: {
        plantCategory: true,
      },
      orderBy: [asc(plants.name)],
    });

    return plantsRetrieved.map((plant) =>
      this.toPlantResponse(plant, plant.plantCategory),
    );
  }

  async getOneById(id: string): Promise<PlantResponse> {
    const plant = await this.checkPlantById(id);
    const plantCategory = plant.plantCategory;
    return this.toPlantResponse(plant as Plant, plantCategory);
  }

  async updateById(
    plantId: string,
    updatePlantRequest: UpdatePlantRequest,
    image?: Express.Multer.File,
  ): Promise<PlantResponse> {
    this.logger.debug(
      `PlantsService.update(${JSON.stringify(updatePlantRequest)}, with image ${image?.originalname})`,
    );

    // is plant category exist by id
    if (updatePlantRequest.plantCategoryId) {
      await this.plantCategoriesService.checkPlantCategoryById(
        updatePlantRequest.plantCategoryId,
      );
    }
    // is plant exist by id and name
    const [isPlantExistById, isPlantExistByName] = await Promise.all([
      this.checkPlantById(plantId),
      this.findByName(updatePlantRequest.name),
    ]);

    // throw Exception if plant already exist by name
    if (isPlantExistByName) {
      this.logger.warn(`Plant ${updatePlantRequest.name} already exists`);
      throw new ConflictException(
        `Plant ${updatePlantRequest.name} already exists`,
      );
    }

    // handle update if image is provided
    if (image) {
      const generateUniqueKeyFileName = uniqueKeyFile(
        'plant',
        image.originalname,
      );
      try {
        const imageUploded = await this.storageService.upload(
          generateUniqueKeyFileName,
          image.buffer,
          image.mimetype,
        );

        // update database, get updated plant, delete existing image from storage
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [[updatedPlant], deletedImageFromStorage] = await Promise.all([
          this.drizzleService.db
            .update(plants)
            .set({
              ...updatePlantRequest,
              imageUrl: imageUploded.url,
              imageKey: generateUniqueKeyFileName,
              updatedAt: new Date(),
            })
            .where(eq(plants.id, plantId))
            .returning(),
          this.storageService.delete(isPlantExistById.imageKey),
        ]);

        // response updated plant from database
        const getPlantCategory =
          await this.plantCategoriesService.checkPlantCategoryById(
            updatedPlant.plantCategoryId,
          );
        return this.toPlantResponse(updatedPlant as Plant, getPlantCategory);
      } catch (error) {
        this.logger.error(error);
        throw new HttpException(error, 500);
      }
    }

    // handle update if image is not provided
    try {
      const [updatedPlant] = await this.drizzleService.db
        .update(plants)
        .set({
          ...updatePlantRequest,
          updatedAt: new Date(),
        })
        .where(eq(plants.id, plantId))
        .returning();

      // response updated plant from database
      const getPlantCategory =
        await this.plantCategoriesService.checkPlantCategoryById(
          updatedPlant.plantCategoryId,
        );
      return this.toPlantResponse(updatedPlant as Plant, getPlantCategory);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} plant`;
  }

  toPlantResponse(plant: Plant, plantCategory?: PlantCategory): PlantResponse {
    const result = {
      id: plant.id,
      name: plant.name,
      plantCategoryId: plantCategory ? plantCategory.id : plant.plantCategoryId,
      imageUrl: plant.imageUrl,
      imageKey: plant.imageKey,
      createdAt: plant.createdAt,
      updatedAt: plant.updatedAt,
      plantCategory: plantCategory
        ? {
            id: plantCategory.id,
            name: plantCategory.name,
            createdAt: plantCategory.createdAt,
            updatedAt: plantCategory.updatedAt,
          }
        : undefined,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { plantCategoryId, ...rest } = result;
    return rest as PlantResponse;
  }

  async checkPlantById(id: string): Promise<PlantResponse> {
    // check is id is correct pattern
    Validation.uuid(id);

    const plant = await this.drizzleService.db.query.plants.findFirst({
      where: (plants, { eq }) => eq(plants.id, id),
      with: {
        plantCategory: true,
      },
    });

    if (!plant) {
      this.logger.warn(`Plant ${id} does not exist`);
      throw new NotFoundException(`Plant ${id} does not exist`);
    }

    return plant;
  }

  async findByName(name: string): Promise<Plant | null> {
    const result = await this.drizzleService.db.query.plants.findFirst({
      where: (plants, { eq }) => eq(plants.name, name),
    });

    return result || null;
  }
}
