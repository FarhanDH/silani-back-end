import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from '~/common/utils';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FieldOwnerGuard } from '../fields/guard/field-owner.guard';
import {
  CreatePlantingActivityRequest,
  PlantingActivityResponse,
  UpdatePlantingActivityRequest,
} from '../models/planting-activities.model';
import { Response } from '../models/response.model';
import { PlantingActivityOwnerGuard } from './guard/planting-activitiy-owner.guard';
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

  @UseGuards(JwtGuard, PlantingActivityOwnerGuard)
  @Get(':id')
  async getOneById(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => {
          throw new NotAcceptableException('Params must be a valid UUID');
        },
      }),
    )
    id: string,
    @Request() req: RequestWithUser,
  ): Promise<Response<PlantingActivityResponse>> {
    const result = await this.plantingActivitiesService.getOneById(
      id,
      req.user,
    );
    return {
      message: 'Planting Activity retrieved successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard, PlantingActivityOwnerGuard)
  @Put(':id')
  async updateById(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => {
          throw new NotAcceptableException('Params must be a valid UUID');
        },
      }),
    )
    id: string,
    @Request() req: RequestWithUser,
    @Body() updatePlantingActivityRequest: UpdatePlantingActivityRequest,
  ): Promise<Response<PlantingActivityResponse>> {
    const result = await this.plantingActivitiesService.updateById(
      id,
      req.user,
      updatePlantingActivityRequest,
    );
    return {
      message: 'Planting Activity updated successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard, PlantingActivityOwnerGuard)
  @Delete(':id')
  async deleteById(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => {
          throw new NotAcceptableException('Params must be a valid UUID');
        },
      }),
    )
    id: string,
    @Request() req: RequestWithUser,
  ): Promise<Response<PlantingActivityResponse>> {
    const result = await this.plantingActivitiesService.deleteById(
      id,
      req.user,
    );
    return {
      message: 'Planting Activity deleted successfully',
      data: result,
    };
  }
}
