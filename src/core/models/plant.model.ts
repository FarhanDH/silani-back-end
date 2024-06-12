import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlantRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  plantCategoryId: string;
}

export class PlantResponse {
  id: string;
  name: string;
  plantCategoryId: string;
  imageUrl: string;
  imageKey: string;
  createdAt: Date;
  updatedAt: Date;
}
