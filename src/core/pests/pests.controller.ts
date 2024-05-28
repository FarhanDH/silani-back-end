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
import { CreatePestDto } from './dto/create-pest.dto';
import { PestsService } from './pests.service';
import { UpdatePestDto } from './dto/update-pest.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pests')
export class PestsController {
  constructor(private readonly pestsService: PestsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPestDto: CreatePestDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|svg|tiff|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 1000000 })
        .build({ fileIsRequired: true }),
    )
    image: Express.Multer.File,
  ) {
    const data = await this.pestsService.create(createPestDto, image);
    return {
      data,
    };
  }

  @Get()
  async getAll() {
    const data = await this.pestsService.getAll();
    return {
      data,
    };
  }

  @Put(':pestId')
  async update(
    @Param('pestId') pestId: string,
    @Body() updatePestDto: UpdatePestDto,
  ) {
    const data = await this.pestsService.update(pestId, updatePestDto);
    return {
      data,
    };
  }

  @Delete(':pestId')
  async delete(@Param('pestId') pestId: string) {
    const data = await this.pestsService.delete(pestId);
    return {
      data,
    };
  }
}
