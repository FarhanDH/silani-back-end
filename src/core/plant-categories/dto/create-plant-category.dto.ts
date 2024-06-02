import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlantCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
