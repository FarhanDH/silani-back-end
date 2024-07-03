import { PartialType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { PlantingActivity } from '~/common/drizzle/schema/planting_activities';

export class CreatePlantingActivityRequest {
  @IsNotEmpty()
  @IsUUID()
  fieldId: string;

  @IsNotEmpty()
  @IsUUID()
  plantId: string;

  @IsDate()
  @IsOptional()
  harvestEstimateDate: Date;

  @IsNumber()
  @IsOptional()
  harvestAmount: number;

  @IsDate()
  @IsOptional()
  harvestedAt: Date;
}

export class UpdatePlantingActivityRequest extends PartialType(
  CreatePlantingActivityRequest,
) {}

export class PlantingActivityResponse {
  id: string;
  fieldId: string;
  plantId: string;
  harvestEstimateDate: Date;
  plantedAt: Date;
  harvestAmount: string | null;
  harvestedAt: Date | null;
}

export const toPlantingActivityResponse = (
  plantingActivity: PlantingActivity,
): PlantingActivityResponse => {
  return {
    id: plantingActivity.id,
    fieldId: plantingActivity.fieldId,
    plantId: plantingActivity.plantId,
    harvestEstimateDate: plantingActivity.harvestEstimateDate,
    plantedAt: plantingActivity.plantedAt,
    harvestAmount: plantingActivity.harvestAmount,
    harvestedAt: plantingActivity.harvestedAt,
  };
};
