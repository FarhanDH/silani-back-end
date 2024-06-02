import { Module } from '@nestjs/common';
import { PlantCategoriesService } from './plant-categories.service';
import { PlantCategoriesController } from './plant-categories.controller';
import { DrizzleModule } from '~/common/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [PlantCategoriesController],
  providers: [PlantCategoriesService],
})
export class PlantCategoriesModule {}
