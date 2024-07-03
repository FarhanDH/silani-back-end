import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
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
import { RequestWithUser } from '~/common/utils';

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

  @UseGuards(JwtGuard)
  @Get()
  async getAll(
    @Request() req: RequestWithUser,
  ): Promise<Response<PlantingActivityResponse[]>> {
    const result = await this.plantingActivitiesService.getAll(req.user);
    return {
      message: 'Planting Activities retrieved successfully',
      data: result,
    };
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
