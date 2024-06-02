import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlantCategoriesService } from './plant-categories.service';
import { CreatePlantCategoryDto } from './dto/create-plant-category.dto';
import { UpdatePlantCategoryDto } from './dto/update-plant-category.dto';

@Controller('plant-categories')
export class PlantCategoriesController {
  constructor(
    private readonly plantCategoriesService: PlantCategoriesService,
  ) {}

  @Post()
  async create(@Body() createPlantCategoryDto: CreatePlantCategoryDto) {
    return await this.plantCategoriesService.create(createPlantCategoryDto);
  }

  @Get()
  findAll() {
    return this.plantCategoriesService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantCategoriesService.getById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlantCategoryDto: UpdatePlantCategoryDto,
  ) {
    return this.plantCategoriesService.updateById(+id, updatePlantCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantCategoriesService.deleteById(+id);
  }
}
