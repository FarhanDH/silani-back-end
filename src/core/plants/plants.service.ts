import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreatePlantRequest, PlantResponse } from '../models/plant.model';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { StorageService } from '../storage/storage.service';
import { Plant, plants } from '~/common/drizzle/schema/plants';
import { uniqueKeyFile } from '~/common/utils';
import { Validation } from '~/common/validation';
import { asc } from 'drizzle-orm';

@Injectable()
export class PlantsService {
  constructor(
    private readonly drizzleService: DrizzleService,
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

    // is plant category is valid id
    Validation.uuid(createPlantRequest.plantCategoryId);

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
    return await this.drizzleService.db.query.plants.findMany({
      columns: {
        plantCategoryId: false,
      },
      with: {
        plantCategory: true,
      },
      orderBy: [asc(plants.name)],
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} plant`;
  }

  update(id: string) {
    return `This action updates a #${id} plant`;
  }

  remove(id: string) {
    return `This action removes a #${id} plant`;
  }

  toPlantResponse(plant: Plant): PlantResponse {
    return {
      id: plant.id,
      name: plant.name,
      plantCategoryId: plant.plantCategoryId,
      imageUrl: plant.imageUrl,
      imageKey: plant.imageKey,
      createdAt: plant.createdAt,
      updatedAt: plant.updatedAt,
    };
  }

  async findByName(name: string): Promise<Plant | null> {
    const result = await this.drizzleService.db.query.plants.findFirst({
      where: (plants, { eq }) => eq(plants.name, name),
    });

    return result || null;
  }
}
