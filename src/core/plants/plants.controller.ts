import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantRequest, PlantResponse } from '../models/plant.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from '../models/response.model';

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

  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<Response<PlantResponse>> {
    const result = await this.plantsService.getOneById(id);
    return {
      message: 'Plant retrieved successfully',
      data: result,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.plantsService.update(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantsService.remove(id);
  }
}
