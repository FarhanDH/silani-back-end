import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreatePlantRequest,
  PlantResponse,
  UpdatePlantRequest,
} from '../models/plant.model';
import { Response } from '../models/response.model';
import { PlantsService } from './plants.service';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPlantRequest: CreatePlantRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|svg|tiff|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 1000000 })
        .build({ fileIsRequired: true }),
    )
    image: Express.Multer.File,
  ): Promise<Response<PlantResponse>> {
    const result = await this.plantsService.create(createPlantRequest, image);
    return {
      message: 'Plant created successfully',
      data: result,
    };
  }

  @Get()
  async getAll(): Promise<Response<PlantResponse[]>> {
    const result = await this.plantsService.getAll();
    return {
      message: 'Plants retrieved successfully',
      data: result,
    };
  }

  @Get(':plantId')
  async getOneById(
    @Param('plantId') plantId: string,
  ): Promise<Response<PlantResponse>> {
    const result = await this.plantsService.getOneById(plantId);
    return {
      message: 'Plant retrieved successfully',
      data: result,
    };
  }

  @Put(':plantId')
  @UseInterceptors(FileInterceptor('image'))
  async updateById(
    @Param('plantId') plantId: string,
    @Body() updatePlantRequest: UpdatePlantRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jfif|jpg|jpeg|png|svg|tiff|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 1000000 })
        .build({ fileIsRequired: false }),
    )
    image?: Express.Multer.File,
  ): Promise<Response<PlantResponse>> {
    const result = await this.plantsService.updateById(
      plantId,
      updatePlantRequest,
      image,
    );
    return {
      message: 'Plant updated successfully',
      data: result,
    };
  }

  @Delete(':plantId')
  async deleteById(
    @Param('plantId') plantId: string,
  ): Promise<Response<PlantResponse>> {
    const result = await this.plantsService.deletById(plantId);
    return {
      message: 'Plant deleted successfully',
      data: result,
    };
  }
}
