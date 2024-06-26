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
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateFieldRequest, FieldResponse } from '../models/field.model';
import { Response } from '../models/response.model';
import { FieldsService } from './fields.service';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createFieldRequest: CreateFieldRequest,
    @Request() req: any,
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
  async getAll(@Request() req: any): Promise<Response<FieldResponse[]>> {
    const result = await this.fieldsService.getAll(req.user);
    return {
      message: 'Fields retrieved successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getOneById(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<Response<FieldResponse>> {
    const result = await this.fieldsService.getOneById(id, req.user);
    return {
      message: 'Field retrieved successfully',
      data: result,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldsService.remove(+id);
  }
}
