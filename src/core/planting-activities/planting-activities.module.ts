import { Module } from '@nestjs/common';
import { PlantingActivitiesService } from './planting-activities.service';
import { PlantingActivitiesController } from './planting-activities.controller';
import { UsersModule } from '../users/users.module';
import { DrizzleModule } from '~/common/drizzle/drizzle.module';
import { FieldsModule } from '../fields/fields.module';

@Module({
  imports: [DrizzleModule, FieldsModule, UsersModule],
  controllers: [PlantingActivitiesController],
  providers: [PlantingActivitiesService],
})
export class PlantingActivitiesModule {}
