import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreatePlantCategoryRequest,
  PlantCategoryResponse,
  UpdatePlantCategoryRequest,
} from '../models/plant-category.model';
import { Response } from '../models/response.model';
import { PlantCategoriesService } from './plant-categories.service';

@Controller('plant-categories')
export class PlantCategoriesController {
  constructor(
    private readonly plantCategoriesService: PlantCategoriesService,
  ) {}

  @Post()
  async create(
    @Body() requestCreate: CreatePlantCategoryRequest,
  ): Promise<Response<PlantCategoryResponse>> {
    const result = await this.plantCategoriesService.create(requestCreate);
    return {
      message: 'Plant category created successfully',
      data: result,
    };
  }

  @Get()
  async getAll(): Promise<Response<PlantCategoryResponse[]>> {
    const result = await this.plantCategoriesService.getAll();
    return {
      message: 'Plant categories retrieved successfully',
      data: result,
    };
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
  ): Promise<Response<PlantCategoryResponse>> {
    const result = await this.plantCategoriesService.getById(id);
    return {
      message: 'Plant category retrieved successfully',
      data: result,
    };
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateRequest: UpdatePlantCategoryRequest,
  ): Promise<Response<PlantCategoryResponse>> {
    const result = await this.plantCategoriesService.updateById(
      id,
      updateRequest,
    );
    return {
      message: 'Plant category updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  async deleteById(
    @Param('id') id: string,
  ): Promise<Response<PlantCategoryResponse>> {
    const result = await this.plantCategoriesService.deleteById(id);
    return {
      message: 'Plant category deleted successfully',
      data: result,
    };
  }
}
