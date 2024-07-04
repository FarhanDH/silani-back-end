import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import {
  fields,
  plantingActivities,
  PlantingActivity,
} from '~/common/drizzle/schema';
import { AuthJWTPayload } from '../models/auth.model';
import {
  CreatePlantingActivityRequest,
  PlantingActivityResponse,
  UpdatePlantingActivityRequest,
  toPlantingActivityResponse,
} from '../models/planting-activities.model';

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
      createPlantingActivityRequest.harvestEstimateDate = new Date(
        createPlantingActivityRequest.harvestEstimateDate,
      );
      createPlantingActivityRequest.harvestedAt = new Date(
        createPlantingActivityRequest.harvestedAt,
      );

      // check harvestEstimateDate and harvestedAt must be greater than or equal to today
      if (createPlantingActivityRequest.harvestEstimateDate < new Date()) {
        this.logger.error(
          'harvestEstimateDate must be greater than or equal to today',
        );
        throw new BadRequestException(
          'harvestEstimateDate must be greater than or equal to today',
        );
      }
      if (createPlantingActivityRequest.harvestedAt < new Date()) {
        this.logger.error(
          'harvestEstimateDate must be greater than or equal to today',
        );
        throw new BadRequestException(
          'harvestedAt must be greater than or equal to today',
        );
      }
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

  async getAll(user: AuthJWTPayload): Promise<PlantingActivityResponse[]> {
    this.logger.debug(
      `FieldPestsService.getAll(), user: ${JSON.stringify(user)}`,
    );

    try {
      const result = await this.drizzleService.db
        .select()
        .from(plantingActivities)
        .leftJoin(fields, eq(plantingActivities.fieldId, fields.id))
        .where(eq(fields.userId, user.user_uuid));

      return result.map((el) =>
        toPlantingActivityResponse(el.planting_activities),
      );
    } catch (error) {
      this.logger.error(`PlantingActivitiesService.getAll(): ${error}`);
      throw new HttpException(error, 500);
    }
  }

  async getOneById(
    id: string,
    user: AuthJWTPayload,
  ): Promise<PlantingActivityResponse> {
    this.logger.debug(
      `PlantingActivitiesService.getOneById(${id}), user: ${JSON.stringify(user)}`,
    );

    try {
      const result = await this.checkById(id, user.user_uuid);
      return toPlantingActivityResponse(result);
    } catch (error) {
      this.logger.error(`PlantingActivitiesService.getOneById(): ${error}`);
      throw new HttpException(error, 500);
    }
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

  async checkById(
    plantingActivityId: string,
    userId: string,
  ): Promise<PlantingActivity> {
    const result = await this.drizzleService.db
      .select()
      .from(plantingActivities)
      .leftJoin(fields, eq(plantingActivities.fieldId, fields.id))
      .where(
        and(
          eq(fields.userId, userId),
          eq(plantingActivities.id, plantingActivityId),
        ),
      );

    if (result.length == 0) {
      this.logger.error(
        `PlantingActivitiesService.checkById(${plantingActivityId}), user: ${userId}`,
      );
      throw new NotFoundException(
        `FieldPest with id ${plantingActivityId} not found`,
      );
    }
    return result[0].planting_activities;
  }

  async isOwner(plantingActivityId: string, userId: string): Promise<boolean> {
    const result = await this.drizzleService.db
      .select()
      .from(plantingActivities)
      .leftJoin(fields, eq(plantingActivities.fieldId, fields.id))
      .where(
        and(
          eq(fields.userId, userId),
          eq(plantingActivities.id, plantingActivityId),
        ),
      );

    return (
      result.map((el) => toPlantingActivityResponse(el.planting_activities))
        .length > 0
    );
  }
}
