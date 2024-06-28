import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FieldPestsService } from './field-pests.service';
import {
  CreateFieldPestRequest,
  FieldPestResponse,
  UpdateFieldPestRequest,
} from '../models/field-pest.model';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Response } from '../models/response.model';
import { RequestWithUser } from '~/common/utils';
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
  async findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return await this.fieldPestsService.getOneById(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFieldPestRequest: UpdateFieldPestRequest,
  ) {
    return this.fieldPestsService.update(+id, updateFieldPestRequest);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldPestsService.remove(+id);
  }
}
