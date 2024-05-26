import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreatePestDto } from './dto/create-pest.dto';
import { PestsService } from './pests.service';
import { UpdatePestDto } from './dto/update-pest.dto';

@Controller('pests')
export class PestsController {
  constructor(private readonly pestsService: PestsService) {}

  @Post()
  async create(@Body() createPestDto: CreatePestDto) {
    const data = await this.pestsService.create(createPestDto);
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
}
