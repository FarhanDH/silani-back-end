import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PlantCategoryResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreatePlantCategoryRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdatePlantCategoryRequest {
  @IsString()
  @IsOptional()
  name: string;
}
