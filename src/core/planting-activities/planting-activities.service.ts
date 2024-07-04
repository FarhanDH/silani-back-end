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

  async updateById(
    id: string,
    user: AuthJWTPayload,
    updatePlantingActivityRequest: UpdatePlantingActivityRequest,
  ) {
    this.logger.debug(
      `PlantingActivitiesService.updateById(plantingActivityId: ${id}), user: ${JSON.stringify(user)}, updatePlantingActivityRequest: ${JSON.stringify(updatePlantingActivityRequest)}`,
    );
    const existingPlantingActivity = await this.checkById(id, user.user_uuid);
    try {
      const validatedRequest = this.validatePlantingActivityRequest({
        ...existingPlantingActivity,
        ...updatePlantingActivityRequest,
      });
      const [result] = await this.drizzleService.db
        .update(plantingActivities)
        .set({ ...validatedRequest, updatedAt: new Date() })
        .where(eq(plantingActivities.id, id))
        .returning();
      return toPlantingActivityResponse(result);
    } catch (error) {
      this.logger.error(`PlantingActivitiesService.updateById(): ${error}`);
      throw new HttpException(error, 500);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} plantingActivity`;
  }

  /**
   * Validates the provided PlantingActivity object, ensuring that the harvestEstimateDate and harvestedAt properties are valid.
   *
   * @param plantingActivity - The PlantingActivity object to validate.
   * @returns The validated PlantingActivity object.
   * @throws BadRequestException if the harvestEstimateDate or harvestedAt properties are less than the current date.
   */
  validatePlantingActivityRequest(
    plantingActivity: PlantingActivity,
  ): PlantingActivity {
    this.logger.debug(
      `PlantingActivitiesService.validatePlantingActivityRequest(${JSON.stringify(
        plantingActivity,
      )})`,
    );
    if (plantingActivity.harvestEstimateDate || plantingActivity.harvestedAt) {
      plantingActivity.harvestEstimateDate = new Date(
        plantingActivity.harvestEstimateDate,
      );
      plantingActivity.harvestedAt = plantingActivity.harvestedAt
        ? new Date(plantingActivity.harvestedAt)
        : null;

      // check harvestEstimateDate and harvestedAt must be greater than or equal to today
      if (
        plantingActivity.harvestEstimateDate &&
        plantingActivity.harvestEstimateDate < new Date()
      ) {
        this.logger.error(
          'harvestEstimateDate must be greater than or equal to today',
        );
        throw new BadRequestException(
          'harvestEstimateDate must be greater than or equal to today',
        );
      }
      if (
        plantingActivity.harvestedAt &&
        plantingActivity.harvestedAt < new Date()
      ) {
        this.logger.error('harvestedAt must be greater than or equal to today');
        throw new BadRequestException(
          'harvestedAt must be greater than or equal to today',
        );
      }
    }
    return plantingActivity;
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
        `Planting Activity with id ${plantingActivityId} not found`,
      );
    }
    return result[0].planting_activities;
  }

  async isOwner(plantingActivityId: string, userId: string): Promise<boolean> {
    this.logger.debug(
      `PlantingActivitiesService.isOwner(${plantingActivityId}, ${userId})`,
    );
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
