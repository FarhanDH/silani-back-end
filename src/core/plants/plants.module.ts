import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { DrizzleModule } from '~/common/drizzle/drizzle.module';
import { StorageModule } from '../storage/storage.module';
import { PlantCategoriesModule } from '../plant-categories/plant-categories.module';

@Module({
  imports: [DrizzleModule, PlantCategoriesModule, StorageModule],
  controllers: [PlantsController],
  providers: [PlantsService],
})
export class PlantsModule {}
