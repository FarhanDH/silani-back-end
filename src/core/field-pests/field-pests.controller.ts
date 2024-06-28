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
import { FieldOwnerGuard } from '../fields/guard/field-owner.guard';
import { Response } from '../models/response.model';
import { RequestWithUser } from '~/common/utils';

@Controller('field-pests')
export class FieldPestsController {
  constructor(private readonly fieldPestsService: FieldPestsService) {}

  @UseGuards(JwtGuard, FieldOwnerGuard)
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
      message: 'FieldPest created successfully',
      data: result,
    };
  }

  @Get()
  findAll() {
    return this.fieldPestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldPestsService.findOne(+id);
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
