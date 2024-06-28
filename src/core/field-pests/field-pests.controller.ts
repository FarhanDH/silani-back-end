import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from '~/common/utils';
import { JwtGuard } from '../auth/guard/jwt.guard';
import {
  CreateFieldPestRequest,
  FieldPestResponse,
  UpdateFieldPestRequest,
} from '../models/field-pest.model';
import { Response } from '../models/response.model';
import { FieldPestsService } from './field-pests.service';
import { FieldPestOwnerGuard } from './guard/field-pest-owner.guard';

@Controller('field-pests')
export class FieldPestsController {
  constructor(private readonly fieldPestsService: FieldPestsService) {}

  @UseGuards(JwtGuard, FieldPestOwnerGuard)
  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body() createFieldPestRequest: CreateFieldPestRequest,
  ): Promise<Response<FieldPestResponse>> {
    const result = await this.fieldPestsService.create(
      createFieldPestRequest,
      req.user,
    );
    return {
      message: 'Field Pest created successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAll(
    @Request() req: RequestWithUser,
  ): Promise<Response<FieldPestResponse[]>> {
    const result = await this.fieldPestsService.getAll(req.user);
    return {
      message: 'Field Pests retrieved successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard, FieldPestOwnerGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<Response<FieldPestResponse>> {
    const result = await this.fieldPestsService.getOneById(id, req.user);
    return {
      message: 'Field Pest retrieved successfully',
      data: result,
    };
  }
  @UseGuards(JwtGuard, FieldPestOwnerGuard)
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() updateFieldPestRequest: UpdateFieldPestRequest,
  ): Promise<Response<FieldPestResponse>> {
    const result = await this.fieldPestsService.updateById(
      id,
      req.user,
      updateFieldPestRequest,
    );
    return {
      message: 'Field Pest updated successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard, FieldPestOwnerGuard)
  @Delete(':id')
  async deleteById(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<Response<FieldPestResponse>> {
    const result = await this.fieldPestsService.deletById(id, req.user);
    return {
      message: 'Field Pest deleted successfully',
      data: result,
    };
  }
}
