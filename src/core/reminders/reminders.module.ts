import { Module } from '@nestjs/common';
import { DrizzleModule } from '~/common/drizzle/drizzle.module';
import { PlantingActivitiesModule } from '../planting-activities/planting-activities.module';
import { UsersModule } from '../users/users.module';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';

@Module({
  imports: [DrizzleModule, UsersModule, PlantingActivitiesModule],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
