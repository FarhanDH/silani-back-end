import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FieldOwnerGuard } from '../fields/guard/field-owner.guard';
import {
  CreatePlantingActivityRequest,
  PlantingActivityResponse,
  UpdatePlantingActivityRequest,
} from '../models/planting-activities.model';
import { Response } from '../models/response.model';
import { PlantingActivitiesService } from './planting-activities.service';

@Controller('planting-activities')
export class PlantingActivitiesController {
  constructor(
    private readonly plantingActivitiesService: PlantingActivitiesService,
  ) {}

  @UseGuards(JwtGuard, FieldOwnerGuard)
  @Post()
  async create(
    @Body() createPlantingActivityRequest: CreatePlantingActivityRequest,
  ): Promise<Response<PlantingActivityResponse>> {
    const result = await this.plantingActivitiesService.create(
      createPlantingActivityRequest,
    );
    return {
      message: 'Planting Activity created successfully',
      data: result,
    };
  }

  @Get()
  findAll() {
    return this.plantingActivitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantingActivitiesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlantingActivityRequest: UpdatePlantingActivityRequest,
  ) {
    return this.plantingActivitiesService.update(
      +id,
      updatePlantingActivityRequest,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantingActivitiesService.remove(+id);
  }
}
