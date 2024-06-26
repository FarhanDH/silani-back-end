import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '~/common/utils';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateFieldRequest, FieldResponse } from '../models/field.model';
import { Response } from '../models/response.model';
import { FieldsService } from './fields.service';
import { FieldOwnerGuard } from './guard/field-owner.guard';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createFieldRequest: CreateFieldRequest,
    @Request() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|svg|tiff|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 1000000 })
        .build({ fileIsRequired: false }),
    )
    image?: Express.Multer.File,
  ): Promise<Response<FieldResponse>> {
    const result = await this.fieldsService.create(
      createFieldRequest,
      req.user,
      image,
    );
    return {
      message: 'Field created successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAll(
    @Request() req: RequestWithUser,
  ): Promise<Response<FieldResponse[]>> {
    const result = await this.fieldsService.getAll(req.user);
    return {
      message: 'Fields retrieved successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard, FieldOwnerGuard)
  @Get(':id')
  async getOneById(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<Response<FieldResponse>> {
    const result = await this.fieldsService.getOneById(id, req.user);
    return {
      message: 'Field retrieved successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard, FieldOwnerGuard)
  @Delete(':fieldId')
  async deleteById(
    @Param('fieldId') fieldId: string,
    @Request() req: RequestWithUser,
  ): Promise<Response<FieldResponse>> {
    const result = await this.fieldsService.deleteById(fieldId, req.user);
    return {
      message: 'Field deleted successfully',
      data: result,
    };
  }
}
