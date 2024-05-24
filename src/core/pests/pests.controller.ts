import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePestDto } from './dto/create-pest.dto';
import { PestsService } from './pests.service';

@Controller('pests')
export class PestsController {
  constructor(private readonly pestsService: PestsService) {}

  @Post()
  async create(@Body() createPestDto: CreatePestDto) {
    return await this.pestsService.create(createPestDto);
  }

  @Get()
  async getAll() {
    return await this.pestsService.getAll();
  }
}
