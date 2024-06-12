import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { DrizzleModule } from '~/common/drizzle/drizzle.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DrizzleModule, StorageModule],
  controllers: [PlantsController],
  providers: [PlantsService],
})
export class PlantsModule {}
