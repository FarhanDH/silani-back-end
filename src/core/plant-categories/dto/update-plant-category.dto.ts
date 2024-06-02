import { PartialType } from '@nestjs/mapped-types';
import { CreatePlantCategoryDto } from './create-plant-category.dto';

export class UpdatePlantCategoryDto extends PartialType(CreatePlantCategoryDto) {}
