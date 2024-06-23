import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PlantCategoryResponse } from './plant-category.model';

export class CreatePlantRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  plantCategoryId: string;
}

export class UpdatePlantRequest {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  plantCategoryId: string;
}

export class PlantResponse {
  id: string;
  name: string;
  plantCategoryId?: string;
  imageUrl: string;
  imageKey: string;
  createdAt: Date;
  updatedAt: Date;
  plantCategory?: PlantCategoryResponse;
}
