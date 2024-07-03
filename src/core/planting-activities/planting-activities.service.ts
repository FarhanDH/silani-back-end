import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  CreatePlantingActivityRequest,
  PlantingActivityResponse,
  UpdatePlantingActivityRequest,
  toPlantingActivityResponse,
} from '../models/planting-activities.model';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { plantingActivities } from '~/common/drizzle/schema';

@Injectable()
export class PlantingActivitiesService {
  constructor(private readonly drizzleService: DrizzleService) {}
  private readonly logger: Logger = new Logger(PlantingActivitiesService.name);

  async create(
    createPlantingActivityRequest: CreatePlantingActivityRequest,
  ): Promise<PlantingActivityResponse> {
    this.logger.debug(
      `PlantingActivitiesService.create(${JSON.stringify(createPlantingActivityRequest)})`,
    );

    // check is harvestEstimateDate and harvestedAt exists and if so, convert to Date object
    if (
      createPlantingActivityRequest.harvestEstimateDate ||
      createPlantingActivityRequest.harvestedAt
    ) {
      // check harvestEstimateDate and harvestedAt must be greater than or equal to today
      if (createPlantingActivityRequest.harvestEstimateDate < new Date()) {
        throw new BadRequestException(
          'harvestEstimateDate must be greater than or equal to today',
        );
      }
      if (createPlantingActivityRequest.harvestedAt < new Date()) {
        throw new BadRequestException(
          'harvestedAt must be greater than or equal to today',
        );
      }

      createPlantingActivityRequest.harvestEstimateDate = new Date(
        createPlantingActivityRequest.harvestEstimateDate,
      );
      createPlantingActivityRequest.harvestedAt = new Date(
        createPlantingActivityRequest.harvestedAt,
      );
    }

    try {
      const [plantingActivity] = await this.drizzleService.db
        .insert(plantingActivities)
        .values({
          ...createPlantingActivityRequest,
        })
        .returning();

      return toPlantingActivityResponse(plantingActivity);
    } catch (error) {
      this.logger.error(`PlantingActivitiesService.create(): ${error}`);
      throw new HttpException(error, 500);
    }
  }

  findAll() {
    return `This action returns all plantingActivities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plantingActivity`;
  }

  update(
    id: number,
    updatePlantingActivityRequest: UpdatePlantingActivityRequest,
  ) {
    return `This action updates a #${id} plantingActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} plantingActivity`;
  }
}
